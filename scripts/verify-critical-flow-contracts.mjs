#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function lineOf(source, needle) {
  const index = source.indexOf(needle);
  if (index < 0) return null;
  return source.slice(0, index).split('\n').length;
}

function fail(message) {
  throw new Error(message);
}

function pass(results, label, detail) {
  results.push({ label, detail });
}

function expect(source, needle, label, results) {
  if (!source.includes(needle)) fail(`${label}: missing ${JSON.stringify(needle)}`);
  pass(results, label, `line ${lineOf(source, needle)}`);
}

function blockFrom(source, marker, nextMarkers = []) {
  const start = source.indexOf(marker);
  if (start < 0) fail(`missing block marker ${JSON.stringify(marker)}`);
  let end = source.length;
  for (const nextMarker of nextMarkers) {
    const next = source.indexOf(nextMarker, start + marker.length);
    if (next >= 0 && next < end) end = next;
  }
  return source.slice(start, end);
}

function expectInBlock(source, marker, nextMarkers, required, label, results) {
  const block = blockFrom(source, marker, nextMarkers);
  for (const needle of required) {
    if (!block.includes(needle)) fail(`${label}: block ${JSON.stringify(marker)} missing ${JSON.stringify(needle)}`);
  }
  pass(results, label, `line ${lineOf(source, marker)}`);
}

function verifyAuth(results) {
  const auth = read('src/auth.js');

  expectInBlock(auth, 'export async function requireAuthUser', ['export async function requireSuperAdmin'], [
    'getBearerToken(request)',
    'verifyToken(token, env.JWT_SECRET)',
    'getUserById(payload.userId, env)',
    "return json({ error: 'נדרש טוקן התחברות' }, 401)",
    "return json({ error: 'טוקן לא תקין או שפג תוקפו' }, 401)",
    "return json({ error: 'המשתמש לא נמצא' }, 401)"
  ], 'session validation rejects missing/invalid/deleted users', results);

  expectInBlock(auth, 'export async function requireSuperAdmin', ['export async function requireTenantContext'], [
    'requireAuthUser(request, env)',
    "!== 'super_admin'",
    "return json({ error: 'גישה זו מותרת לסופר אדמין בלבד' }, 403)"
  ], 'Super Admin auth requires authenticated super_admin role', results);

  expectInBlock(auth, 'export async function requireTenantContext', ['export async function getTenantModuleState'], [
    'requireAuthUser(request, env)',
    'shouldForcePasswordChange(user)',
    'must_change_password: true',
    "tm.status = 'active'",
    "item.tenant_status === 'active'",
    "return json({ error: 'אין למשתמש שיוך פעיל לעסק' }, 403)",
    "return json({ error: 'נדרשת בחירת עסק פעיל לפני המשך' }, 409)"
  ], 'tenant context blocks forced-password, inactive/no/multiple tenants', results);

  expectInBlock(auth, "if (path === '/api/auth/login')", ["if (path === '/api/auth/change-password'"], [
    "method !== 'POST'",
    'await request.json()',
    'if (!email || !password)',
    "SELECT * FROM users WHERE email = ?",
    'loginWithUser(user, password, env)',
    "return json({ error: 'אימייל או סיסמה שגויים' }, 401)"
  ], 'auth/login validates method/body and verifies credentials', results);

  expectInBlock(auth, "if (path === '/api/auth/change-password'", ["if (path === '/api/auth/verify'"], [
    'requireAuthUser(request, env)',
    "normalizePasswordInput(body && body.new_password, 'סיסמה חדשה')",
    'if (!mustChangePassword)',
    'verifyPassword(currentPassword, user && user.password_hash)',
    'must_change_password = 0'
  ], 'must_change_password flow can clear required password change safely', results);

  expectInBlock(auth, "if (path === '/api/auth/tenant-context'", ["if (path === '/api/auth/modules'"], [
    'requireTenantContext(request, env)'
  ], 'tenant-context endpoint uses tenant context guard', results);

  expectInBlock(auth, "if (path === '/api/auth/modules'", ["if (path === '/api/auth/tenant-setup-profile'"], [
    'requireTenantContext(request, env)',
    'getEffectiveTenantModules(ctx.tenant.id, env)'
  ], 'auth/modules endpoint uses tenant context guard', results);
}

function verifyAdmin(results) {
  const admin = read('src/admin.js');

  expectInBlock(admin, 'const AUDIT_ACTIONS = new Set([', [']);'], [
    "'tenant_create'",
    "'tenant_update'",
    "'tenant_activate'",
    "'tenant_suspend'",
    "'tenant_modules_update'",
    "'tenant_owner_password_reset'"
  ], 'admin audit action allowlist covers critical Super Admin writes', results);

  expectInBlock(admin, 'async function logAdminAudit', ['export async function handleAdmin'], [
    'INSERT INTO admin_audit_logs',
    'actor_user_id',
    'details_json',
    'CURRENT_TIMESTAMP'
  ], 'admin audit log persists actor/action/target/details', results);

  expectInBlock(admin, 'export async function handleAdmin', ["if (path === '/api/admin/tenants' && method === 'GET')"], [
    'requireSuperAdmin(request, env)',
    'if (superAdminCtx instanceof Response) return superAdminCtx'
  ], 'all Super Admin routes are behind requireSuperAdmin at handler entry', results);

  expectInBlock(admin, "if (path === '/api/admin/tenants' && method === 'POST')", ['const tenantMatch = path.match'], [
    'normalizeTenantName(body.name)',
    'normalizeContactEmail(body.contact_email)',
    'normalizeInitialPassword(body.initial_password)',
    'normalizeModulesPayload(body.modules)',
    'generateUniqueTenantSlug(name, env)',
    'getActiveMembershipCountForUser(ownerUser.id, env)',
    'INSERT INTO tenants',
    "VALUES (?, ?, 'active'",
    'hashPassword(initialPassword)',
    "must_change_password",
    "VALUES (?, ?, ?, 'user', 1",
    "SET password_hash = ?, must_change_password = 1",
    'INSERT INTO tenant_memberships',
    "VALUES (?, ?, 'owner', 'active'",
    'INSERT INTO tenant_modules',
    "logAdminAudit(env, superAdminCtx.user, 'tenant_create'"
  ], 'tenant onboarding creates tenant/owner/modules and audit trail', results);

  expectInBlock(admin, 'const tenantActivateMatch = path.match', ['const tenantSuspendMatch = path.match'], [
    "SET status = 'active'",
    "logAdminAudit(env, superAdminCtx.user, 'tenant_activate'"
  ], 'tenant activation updates status and writes audit log', results);

  expectInBlock(admin, 'const tenantSuspendMatch = path.match', ['const tenantModulesMatch = path.match'], [
    "SET status = 'suspended'",
    "logAdminAudit(env, superAdminCtx.user, 'tenant_suspend'"
  ], 'tenant suspension updates status and writes audit log', results);

  expectInBlock(admin, 'const tenantModulesMatch = path.match', ['const tenantOwnerResetMatch = path.match'], [
    'normalizeModulesPayload(body.modules)',
    'INSERT INTO tenant_modules',
    'ON CONFLICT(tenant_id, module_key)',
    "logAdminAudit(env, superAdminCtx.user, 'tenant_modules_update'"
  ], 'tenant module toggles validate full payload, upsert, and audit', results);

  expectInBlock(admin, 'const tenantOwnerResetMatch = path.match', ['return { error:'], [
    'normalizeInitialPassword(body && body.password)',
    'getPrimaryOwner(tenantId, env)',
    'hashPassword(newPassword)',
    'must_change_password = 1',
    "logAdminAudit(env, superAdminCtx.user, 'tenant_owner_password_reset'"
  ], 'tenant owner password reset hashes password, forces change, and audits', results);
}

function verifyShopping(results) {
  const shopping = read('src/shopping.js');
  const branchMarkers = [
    "if (path === '/api/shopping-lists' && method === 'GET')",
    "if (path === '/api/shopping-lists' && method === 'POST')",
    'if (listMatch && method === \'GET\')',
    'if (listMatch && method === \'PUT\')',
    'if (listMatch && method === \'DELETE\')',
    'if (itemsMatch && method === \'POST\')',
    'if (itemMatch && method === \'PUT\')',
    'if (itemMatch && method === \'DELETE\')',
    'if (purchaseMatch && method === \'POST\')',
    'if (purchaseSyncProductsMatch && method === \'POST\')',
    'if (purchaseDetailsMatch && method === \'GET\')',
    'if (purchaseDetailsMatch && method === \'PUT\')',
    'if (purchaseDetailsMatch && method === \'DELETE\')'
  ];

  const writeBranches = new Set([
    "if (path === '/api/shopping-lists' && method === 'POST')",
    'if (listMatch && method === \'PUT\')',
    'if (listMatch && method === \'DELETE\')',
    'if (itemsMatch && method === \'POST\')',
    'if (itemMatch && method === \'PUT\')',
    'if (itemMatch && method === \'DELETE\')',
    'if (purchaseMatch && method === \'POST\')',
    'if (purchaseSyncProductsMatch && method === \'POST\')',
    'if (purchaseDetailsMatch && method === \'PUT\')',
    'if (purchaseDetailsMatch && method === \'DELETE\')'
  ]);

  for (let index = 0; index < branchMarkers.length; index++) {
    const marker = branchMarkers[index];
    const nextMarkers = branchMarkers.slice(index + 1).concat(['return { error: \'Shopping route not found\' }']);
    const required = [
      'requireTenantContext(request, env)',
      "assertTenantModuleEnabled(tenantCtx, env, 'shopping')"
    ];
    if (writeBranches.has(marker)) required.push('assertTenantRole(tenantCtx,');
    expectInBlock(shopping, marker, nextMarkers, required, `shopping permission contract: ${marker}`, results);
  }

  expectInBlock(shopping, 'const purchaseSyncProductsMatch = path.match', ['const purchaseDetailsMatch = path.match'], [
    "assertTenantRole(tenantCtx, ['owner', 'admin'])",
    'getShoppingPurchaseByIdForTenant(purchaseId, tenantId, env)',
    'getShoppingPurchaseItemsForTenant(purchaseId, tenantId, env)'
  ], 'shopping product sync is owner/admin-only and tenant-scoped', results);
}

function verifyStrategicContacts(results) {
  const strategic = read('src/strategic-contacts.js');
  const auth = read('src/auth.js');
  const admin = read('src/admin.js');
  const worker = read('worker.js');
  const ui = read('src/ui.js');

  expect(auth, "'strategic_contacts'", 'auth module allowlist includes strategic_contacts', results);
  expect(admin, "'strategic_contacts'", 'admin module allowlist includes strategic_contacts', results);
  expect(worker, "handleStrategicContacts", 'worker routes strategic contacts handler', results);
  expect(ui, 'nav-strategic-contacts', 'UI includes strategic contacts navigation', results);
  expect(ui, 'page-strategic-contacts', 'UI includes strategic contacts page', results);
  expect(ui, 'הוסף לקשרים אסטרטגיים', 'UI includes customer-to-strategic action', results);
  expect(ui, 'לקוח זה כבר מקושר לקשר אסטרטגי', 'UI warns before creating duplicate linked strategic contact', results);
  expect(ui, 'פעילויות אחרונות', 'UI includes strategic contact activities timeline', results);
  expect(ui, '/activities', 'UI calls strategic contact activities API', results);

  expectInBlock(strategic, 'export async function handleStrategicContacts', ['return json({ error: \'Strategic contacts route not found\' }, 404);'], [
    'requireTenantContext(request, env)',
    "assertTenantModuleEnabled(tenantCtx, env, 'strategic_contacts')",
    "path === '/api/strategic-contacts' && method === 'GET'",
    "path === '/api/strategic-contacts' && method === 'POST'",
    "assertTenantRole(tenantCtx, ['owner', 'admin', 'manager'])",
    "path.match(/^\\/api\\/strategic-contacts\\/(\\d+)\\/activities$/)",
    "path.match(/^\\/api\\/strategic-contacts\\/(\\d+)$/)"
  ], 'strategic contacts routes require tenant context, module guard, and write RBAC', results);

  expectInBlock(strategic, 'async function getStrategicContactForTenant', ['async function listStrategicContacts'], [
    'WHERE id = ? AND tenant_id = ?'
  ], 'strategic contacts id lookup is tenant-scoped', results);

  expectInBlock(strategic, 'async function listStrategicContacts', ['async function createStrategicContact'], [
    'WHERE tenant_id = ?',
    'category = ?',
    'status = ?',
    'priority = ?',
    'linked_contact_id = ?',
    'active = 1'
  ], 'strategic contacts list is tenant-scoped and filterable including linked contact', results);

  expectInBlock(strategic, 'async function validateLinkedContactId', ['function mapStrategicContact'], [
    'getContactForTenant(env, tenantId, linkedContactId)',
    "throw new Error('הלקוח המקושר לא נמצא')"
  ], 'strategic contacts validate linked_contact_id against same tenant contact', results);

  expectInBlock(strategic, 'async function listStrategicContactActivities', ['async function createStrategicContactActivity'], [
    'getStrategicContactForTenant(env, tenantId, strategicContactId)',
    'FROM strategic_contact_activities',
    'WHERE tenant_id = ?',
    'AND strategic_contact_id = ?'
  ], 'strategic contact activities list is tenant-scoped and parent-scoped', results);

  expectInBlock(strategic, 'async function createStrategicContactActivity', ['async function createStrategicContact'], [
    'getStrategicContactForTenant(env, tenantId, strategicContactId)',
    'INSERT INTO strategic_contact_activities',
    'tenantCtx.user.id',
    'WHERE id = ?',
    'AND tenant_id = ?',
    'AND strategic_contact_id = ?'
  ], 'strategic contact activities create validates parent and records actor', results);

  expectInBlock(strategic, 'async function updateStrategicContact', ['export async function handleStrategicContacts'], [
    'getStrategicContactForTenant(env, tenantId, id)',
    'validateLinkedContactId(env, tenantId, payload.linked_contact_id)',
    'linked_contact_id = ?',
    'WHERE id = ? AND tenant_id = ?'
  ], 'strategic contacts update is tenant-scoped and validates linked contact', results);
}

function verifyRoleEnforcement(results) {
  const auth = read('src/auth.js');
  const roleFiles = ['src/contacts.js', 'src/employees.js', 'src/leads.js', 'src/members.js', 'src/products.js', 'src/shopping.js', 'src/strategic-contacts.js'];

  expectInBlock(auth, 'const TENANT_ROLE_HIERARCHY = {', ['};'], [
    'employee: 1',
    'manager: 2',
    'admin: 3',
    'owner: 4'
  ], 'tenant role hierarchy keeps expected escalation order', results);

  expectInBlock(auth, 'export async function assertTenantRole', ['async function getEffectiveTenantModules'], [
    'normalizeTenantRole',
    'currentRank < minimumAllowedRank',
    "return json({ error: 'Permission denied' }, 403)"
  ], 'tenant role enforcement denies roles below minimum allowed rank', results);

  for (const file of roleFiles) {
    const source = read(file);
    if (!source.includes('assertTenantRole')) fail(`${file}: missing assertTenantRole import/use`);
    pass(results, `${file} uses tenant role enforcement`, `line ${lineOf(source, 'assertTenantRole')}`);
  }
}

function main() {
  const results = [];
  verifyAuth(results);
  verifyAdmin(results);
  verifyShopping(results);
  verifyStrategicContacts(results);
  verifyRoleEnforcement(results);

  console.log(`Critical flow contract verification: PASS (${results.length} checks)`);
  for (const result of results) {
    console.log(`✓ ${result.label} (${result.detail})`);
  }
}

try {
  main();
} catch (error) {
  console.error('Critical flow contract verification: FAIL');
  console.error(error && error.message ? error.message : error);
  process.exit(1);
}
