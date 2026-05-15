#!/usr/bin/env node
/*
 * Safe CRM critical API smoke verification.
 *
 * Required for live mode:
 *   CRM_BASE_URL=https://...
 *   CRM_SUPER_ADMIN_EMAIL=...
 *   CRM_SUPER_ADMIN_PASSWORD=...
 *   CRM_SMOKE_ALLOW_MUTATION=1
 *
 * Dry run:
 *   node scripts/smoke-critical-api.mjs --dry-run
 */

const MODULE_KEYS = ['leads', 'contacts', 'employees', 'products', 'shopping', 'reports'];
const DEFAULT_TIMEOUT_MS = 15000;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const runId = process.env.CRM_SMOKE_RUN_ID || new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
const baseUrl = normalizeBaseUrl(process.env.CRM_BASE_URL);
const superAdminEmail = process.env.CRM_SUPER_ADMIN_EMAIL || '';
const superAdminPassword = process.env.CRM_SUPER_ADMIN_PASSWORD || '';
const allowMutation = process.env.CRM_SMOKE_ALLOW_MUTATION === '1';
const timeoutMs = Number(process.env.CRM_SMOKE_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);

const testTenant = {
  name: `__smoke_api_${runId}`,
  contact_name: `Smoke Owner ${runId}`,
  contact_phone: '0500000000',
  contact_email: `crm-smoke-owner+${runId}@example.invalid`,
  initial_password: `Smoke${runId}!a`,
  changed_password: `Smoke${runId}!b`,
  reset_password: `Smoke${runId}!c`
};

const testEmployee = {
  name: `Smoke Employee ${runId}`,
  email: `crm-smoke-employee+${runId}@example.invalid`,
  password: `Smoke${runId}!e`
};

const state = {
  adminToken: null,
  ownerToken: null,
  employeeToken: null,
  tenantId: null,
  employeeMembershipId: null,
  shoppingModuleDisabled: false,
  cleanup: []
};

function normalizeBaseUrl(value) {
  return String(value || '').trim().replace(/\/+$/, '');
}

function allModules(enabled = true) {
  return MODULE_KEYS.map((moduleKey) => ({ module_key: moduleKey, is_enabled: enabled }));
}

function modulesWith(overrides) {
  return MODULE_KEYS.map((moduleKey) => ({
    module_key: moduleKey,
    is_enabled: Object.prototype.hasOwnProperty.call(overrides, moduleKey) ? overrides[moduleKey] : true
  }));
}

function redact(value) {
  if (!value) return value;
  const text = String(value);
  if (text.length <= 8) return '***';
  return `${text.slice(0, 4)}…${text.slice(-4)}`;
}

function requiredConfig() {
  return [
    ['CRM_BASE_URL', baseUrl],
    ['CRM_SUPER_ADMIN_EMAIL', superAdminEmail],
    ['CRM_SUPER_ADMIN_PASSWORD', superAdminPassword],
    ['CRM_SMOKE_ALLOW_MUTATION=1', allowMutation ? '1' : '']
  ];
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function hasAction(detail, action) {
  const logs = detail && Array.isArray(detail.audit_logs) ? detail.audit_logs : [];
  return logs.some((item) => item && item.action === action);
}

async function requestJson(method, path, { token, body, expectedStatus, label } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: body !== undefined ? JSON.stringify(body) : undefined
    });

    const text = await response.text();
    let json = null;
    if (text) {
      try {
        json = JSON.parse(text);
      } catch {
        json = { raw: text };
      }
    }

    if (expectedStatus !== undefined && response.status !== expectedStatus) {
      throw new Error(`${label || `${method} ${path}`}: expected HTTP ${expectedStatus}, got ${response.status}: ${text.slice(0, 500)}`);
    }

    return { status: response.status, ok: response.ok, json, text };
  } finally {
    clearTimeout(timer);
  }
}

async function step(results, label, fn) {
  const started = Date.now();
  await fn();
  const ms = Date.now() - started;
  results.push({ label, ms });
  console.log(`✓ ${label} (${ms}ms)`);
}

async function login(email, password, label) {
  const response = await requestJson('POST', '/api/auth/login', {
    body: { email, password },
    expectedStatus: 200,
    label
  });
  assert(response.json && response.json.success === true, `${label}: missing success=true`);
  assert(response.json.token, `${label}: missing token`);
  return response.json;
}

async function cleanup() {
  if (!state.adminToken) return;

  if (state.tenantId && state.shoppingModuleDisabled) {
    try {
      await requestJson('PUT', `/api/admin/tenants/${state.tenantId}/modules`, {
        token: state.adminToken,
        body: { modules: allModules(true) },
        expectedStatus: 200,
        label: 'cleanup re-enable modules'
      });
      state.shoppingModuleDisabled = false;
      console.log('cleanup: re-enabled all modules on smoke tenant');
    } catch (error) {
      console.error(`cleanup warning: failed to re-enable modules: ${error.message}`);
    }
  }

  if (state.ownerToken && state.employeeMembershipId) {
    try {
      await requestJson('POST', `/api/tenant-members/${state.employeeMembershipId}/deactivate`, {
        token: state.ownerToken,
        expectedStatus: 200,
        label: 'cleanup deactivate smoke employee'
      });
      console.log('cleanup: deactivated smoke employee membership');
    } catch (error) {
      console.error(`cleanup warning: failed to deactivate smoke employee: ${error.message}`);
    }
  }

  if (state.tenantId) {
    try {
      await requestJson('POST', `/api/admin/tenants/${state.tenantId}/suspend`, {
        token: state.adminToken,
        expectedStatus: 200,
        label: 'cleanup suspend smoke tenant'
      });
      console.log('cleanup: suspended smoke tenant');
    } catch (error) {
      console.error(`cleanup warning: failed to suspend smoke tenant: ${error.message}`);
    }
  }
}

async function runLive() {
  const results = [];

  await step(results, 'session validation rejects missing tenant auth token', async () => {
    const response = await requestJson('GET', '/api/auth/tenant-context', {
      expectedStatus: 401,
      label: 'tenant context without token'
    });
    assert(response.json && response.json.error, 'tenant context without token: missing error body');
  });

  await step(results, 'session validation rejects invalid token', async () => {
    const response = await requestJson('GET', '/api/auth/tenant-context', {
      token: 'invalid-smoke-token',
      expectedStatus: 401,
      label: 'tenant context invalid token'
    });
    assert(response.json && response.json.error, 'tenant context invalid token: missing error body');
  });

  await step(results, 'Super Admin login succeeds', async () => {
    const loginResult = await login(superAdminEmail, superAdminPassword, 'super admin login');
    assert(loginResult.user && loginResult.user.role === 'super_admin', 'super admin login: expected role super_admin');
    state.adminToken = loginResult.token;
    console.log(`  admin token: ${redact(state.adminToken)}`);
  });

  await step(results, 'Super Admin route rejects missing token', async () => {
    await requestJson('GET', '/api/admin/tenants', {
      expectedStatus: 401,
      label: 'admin tenants without token'
    });
  });

  await step(results, 'tenant onboarding creates isolated smoke tenant', async () => {
    const response = await requestJson('POST', '/api/admin/tenants', {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'create smoke tenant',
      body: {
        name: testTenant.name,
        contact_name: testTenant.contact_name,
        contact_phone: testTenant.contact_phone,
        contact_email: testTenant.contact_email,
        initial_password: testTenant.initial_password,
        modules: allModules(true)
      }
    });
    assert(response.json && response.json.success === true, 'create smoke tenant: missing success=true');
    assert(response.json.tenant && response.json.tenant.id, 'create smoke tenant: missing tenant id');
    assert(response.json.owner && response.json.owner.email === testTenant.contact_email, 'create smoke tenant: wrong owner email');
    state.tenantId = response.json.tenant.id;
    console.log(`  tenant id: ${state.tenantId}`);
  });

  await step(results, 'admin audit records tenant_create', async () => {
    const detail = await requestJson('GET', `/api/admin/tenants/${state.tenantId}`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'tenant detail after create'
    });
    assert(hasAction(detail.json, 'tenant_create'), 'tenant detail: missing tenant_create audit log');
  });

  await step(results, 'owner initial login is forced to change password', async () => {
    const loginResult = await login(testTenant.contact_email, testTenant.initial_password, 'owner initial login');
    assert(loginResult.must_change_password === true, 'owner initial login: expected must_change_password=true');
    state.ownerToken = loginResult.token;
  });

  await step(results, 'must_change_password blocks tenant context until changed', async () => {
    const response = await requestJson('GET', '/api/auth/tenant-context', {
      token: state.ownerToken,
      expectedStatus: 403,
      label: 'tenant context while must_change_password'
    });
    assert(response.json && response.json.must_change_password === true, 'tenant context while must_change_password: missing flag');
  });

  await step(results, 'change-password clears must_change_password', async () => {
    const response = await requestJson('POST', '/api/auth/change-password', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'owner change password',
      body: { new_password: testTenant.changed_password }
    });
    assert(response.json && response.json.success === true, 'owner change password: missing success=true');
    assert(response.json.must_change_password === false, 'owner change password: must_change_password not false');
    const loginResult = await login(testTenant.contact_email, testTenant.changed_password, 'owner changed-password login');
    assert(loginResult.must_change_password === false, 'owner changed-password login: expected must_change_password=false');
    state.ownerToken = loginResult.token;
  });

  await step(results, 'tenant context and modules work for active owner', async () => {
    const context = await requestJson('GET', '/api/auth/tenant-context', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'owner tenant context'
    });
    assert(context.json && context.json.tenant && Number(context.json.tenant.id) === Number(state.tenantId), 'owner tenant context: wrong tenant');
    const modules = await requestJson('GET', '/api/auth/modules', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'owner modules'
    });
    assert(modules.json && Array.isArray(modules.json.modules), 'owner modules: missing modules array');
  });

  await step(results, 'Super Admin route rejects tenant owner token', async () => {
    await requestJson('GET', '/api/admin/tenants', {
      token: state.ownerToken,
      expectedStatus: 403,
      label: 'admin tenants with owner token'
    });
  });

  await step(results, 'owner can create isolated employee fixture', async () => {
    const response = await requestJson('POST', '/api/tenant-members', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'create smoke employee',
      body: {
        name: testEmployee.name,
        email: testEmployee.email,
        password: testEmployee.password,
        role: 'employee'
      }
    });
    assert(response.json && response.json.success === true, 'create smoke employee: missing success=true');
    assert(response.json.member && response.json.member.membership_id, 'create smoke employee: missing membership id');
    state.employeeMembershipId = response.json.member.membership_id;
    const loginResult = await login(testEmployee.email, testEmployee.password, 'employee login');
    state.employeeToken = loginResult.token;
  });

  await step(results, 'role enforcement blocks employee member management', async () => {
    await requestJson('GET', '/api/tenant-members', {
      token: state.employeeToken,
      expectedStatus: 403,
      label: 'employee tenant-members access'
    });
  });

  await step(results, 'shopping permission enforcement blocks employee write', async () => {
    await requestJson('POST', '/api/shopping-lists', {
      token: state.employeeToken,
      expectedStatus: 403,
      label: 'employee shopping list create',
      body: { name: `Smoke Store ${runId}` }
    });
  });

  await step(results, 'shopping read works while module enabled', async () => {
    const response = await requestJson('GET', '/api/shopping-lists', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'owner shopping lists'
    });
    assert(response.json && Array.isArray(response.json.lists), 'owner shopping lists: missing lists array');
  });

  await step(results, 'tenant module toggle disables shopping access', async () => {
    await requestJson('PUT', `/api/admin/tenants/${state.tenantId}/modules`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'disable shopping module',
      body: { modules: modulesWith({ shopping: false }) }
    });
    state.shoppingModuleDisabled = true;
    const response = await requestJson('GET', '/api/shopping-lists', {
      token: state.ownerToken,
      expectedStatus: 403,
      label: 'owner shopping lists while disabled'
    });
    assert(response.json && response.json.error === 'Module disabled', 'shopping disabled: expected Module disabled error');
  });

  await step(results, 'tenant module toggle re-enables shopping access', async () => {
    await requestJson('PUT', `/api/admin/tenants/${state.tenantId}/modules`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 're-enable shopping module',
      body: { modules: allModules(true) }
    });
    state.shoppingModuleDisabled = false;
    await requestJson('GET', '/api/shopping-lists', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'owner shopping lists after re-enable'
    });
  });

  await step(results, 'tenant suspension blocks tenant context', async () => {
    await requestJson('POST', `/api/admin/tenants/${state.tenantId}/suspend`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'suspend smoke tenant'
    });
    const response = await requestJson('GET', '/api/auth/tenant-context', {
      token: state.ownerToken,
      expectedStatus: 403,
      label: 'owner context after tenant suspension'
    });
    assert(response.json && response.json.error, 'owner context after tenant suspension: missing error body');
  });

  await step(results, 'tenant activation restores tenant context', async () => {
    await requestJson('POST', `/api/admin/tenants/${state.tenantId}/activate`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'activate smoke tenant'
    });
    await requestJson('GET', '/api/auth/tenant-context', {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'owner context after activation'
    });
  });

  await step(results, 'cleanup deactivates smoke employee before owner reset', async () => {
    await requestJson('POST', `/api/tenant-members/${state.employeeMembershipId}/deactivate`, {
      token: state.ownerToken,
      expectedStatus: 200,
      label: 'deactivate smoke employee'
    });
    state.employeeMembershipId = null;
  });

  await step(results, 'tenant owner password reset forces must_change_password', async () => {
    const response = await requestJson('POST', `/api/admin/tenants/${state.tenantId}/owner/reset-password`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'reset smoke owner password',
      body: { password: testTenant.reset_password }
    });
    assert(response.json && response.json.success === true, 'reset owner password: missing success=true');
    assert(response.json.owner && response.json.owner.must_change_password === true, 'reset owner password: owner not forced to change password');
    await requestJson('POST', '/api/auth/login', {
      expectedStatus: 401,
      label: 'old owner password rejected after reset',
      body: { email: testTenant.contact_email, password: testTenant.changed_password }
    });
    const loginResult = await login(testTenant.contact_email, testTenant.reset_password, 'owner reset-password login');
    assert(loginResult.must_change_password === true, 'owner reset-password login: expected must_change_password=true');
  });

  await step(results, 'admin audit records critical Super Admin mutations', async () => {
    const detail = await requestJson('GET', `/api/admin/tenants/${state.tenantId}`, {
      token: state.adminToken,
      expectedStatus: 200,
      label: 'tenant detail after mutations'
    });
    for (const action of ['tenant_create', 'tenant_modules_update', 'tenant_suspend', 'tenant_activate', 'tenant_owner_password_reset']) {
      assert(hasAction(detail.json, action), `tenant detail: missing ${action} audit log`);
    }
  });

  return results;
}

function printDryRun() {
  console.log('CRM critical API smoke verification dry-run');
  console.log(`Run id: ${runId}`);
  console.log('Required live config:');
  for (const [key, value] of requiredConfig()) {
    const display = key.includes('PASSWORD') ? redact(value) : value || '(missing)';
    console.log(`- ${key}: ${display}`);
  }
  console.log('Planned isolated entities:');
  console.log(`- temporary tenant name: ${testTenant.name}`);
  console.log(`- temporary owner email: ${testTenant.contact_email}`);
  console.log(`- temporary employee email: ${testEmployee.email}`);
  console.log('Cleanup behavior: deactivate temporary employee if created, re-enable modules if changed, suspend temporary tenant. Tenant/user hard delete is intentionally not attempted because no safe public delete API exists.');
}

async function main() {
  if (dryRun) {
    printDryRun();
    return;
  }

  const missing = requiredConfig().filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) {
    printDryRun();
    throw new Error(`Missing required live smoke config: ${missing.join(', ')}`);
  }

  console.log('CRM critical API smoke verification live run');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Run id: ${runId}`);
  console.log(`Super Admin email: ${superAdminEmail}`);
  console.log(`Temporary tenant: ${testTenant.name}`);

  const results = [];
  try {
    results.push(...await runLive());
  } finally {
    await cleanup();
  }

  console.log(`Critical API smoke verification: PASS (${results.length} checks)`);
}

main().catch((error) => {
  console.error('Critical API smoke verification: FAIL');
  console.error(error && error.message ? error.message : error);
  process.exit(1);
});
