function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
}

function getBearerToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

export async function getUserById(userId, env) {
  if (!userId) return null;
  return env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
}

export async function requireAuthUser(request, env) {
  const token = getBearerToken(request);
  if (!token) {
    return json({ error: 'נדרש טוקן התחברות' }, 401);
  }

  let payload;
  try {
    payload = await verifyToken(token, env.JWT_SECRET);
  } catch {
    return json({ error: 'טוקן לא תקין או שפג תוקפו' }, 401);
  }

  const user = await getUserById(payload.userId, env);
  if (!user) {
    return json({ error: 'המשתמש לא נמצא' }, 401);
  }

  return user;
}

export async function requireSuperAdmin(request, env) {
  const user = await requireAuthUser(request, env);
  if (user instanceof Response) return user;

  if (String(user.role || '').trim().toLowerCase() !== 'super_admin') {
    return json({ error: 'גישה זו מותרת לסופר אדמין בלבד' }, 403);
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role
    }
  };
}

export async function requireTenantContext(request, env) {
  const user = await requireAuthUser(request, env);
  if (user instanceof Response) {
    return user;
  }

  const memberships = await env.DB.prepare(
    `SELECT
       tm.id,
       tm.tenant_id,
       tm.role,
       tm.status,
       t.slug AS tenant_slug,
       t.status AS tenant_status
     FROM tenant_memberships tm
     JOIN tenants t ON t.id = tm.tenant_id
     WHERE tm.user_id = ?
       AND tm.status = 'active'
     ORDER BY tm.id ASC`
  ).bind(user.id).all();

  const activeMemberships = (memberships.results || []).filter(function(item) {
    return item.tenant_status === 'active';
  });

  if (activeMemberships.length === 0) {
    return json({ error: 'אין למשתמש שיוך פעיל לעסק' }, 403);
  }

  if (activeMemberships.length > 1) {
    return json({ error: 'נדרשת בחירת עסק פעיל לפני המשך' }, 409);
  }

  const membership = activeMemberships[0];
  return {
    user: {
      id: user.id,
      email: user.email
    },
    tenant: {
      id: membership.tenant_id,
      slug: membership.tenant_slug,
      status: membership.tenant_status
    },
    membership: {
      id: membership.id,
      role: membership.role,
      status: membership.status
    }
  };
}

export async function handleAuth(request, env, path) {
  const method = request.method;

  if (path === '/api/auth/login') {
    if (method !== 'POST') {
      return json({ error: 'Method Not Allowed' }, 405, { Allow: 'POST' });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'בקשה לא תקינה' }, 400);
    }

    const email = (body.email || '').trim();
    const password = body.password;

    if (!email || !password) {
      return json({ error: 'אימייל וסיסמה חובה' }, 400);
    }

    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email.toLowerCase()).first();

    if (!user) {
      const user2 = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ?'
      ).bind(email).first();
      if (!user2) return json({ error: 'אימייל או סיסמה שגויים' }, 401);
      if (user2.password_hash !== password) return json({ error: 'אימייל או סיסמה שגויים' }, 401);
      const token = await createToken(user2.id, user2.email, env.JWT_SECRET);
      return {
        success: true,
        token,
        user: { id: user2.id, name: user2.name, email: user2.email, role: user2.role }
      };
    }

    if (user.password_hash !== password) {
      return json({ error: 'אימייל או סיסמה שגויים' }, 401);
    }

    const token = await createToken(user.id, user.email, env.JWT_SECRET);
    return {
      success: true, token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    };
  }

  if (path === '/api/auth/verify' && method === 'POST') {
    const { token } = await request.json();
    const payload = await verifyToken(token, env.JWT_SECRET);
    return { valid: true, user: payload };
  }

  if (path === '/api/auth/tenant-context' && method === 'GET') {
    const ctx = await requireTenantContext(request, env);
    if (ctx instanceof Response) return ctx;
    return {
      user: ctx.user,
      tenant: ctx.tenant,
      membership: ctx.membership
    };
  }

  return json({ error: 'Auth route not found' }, 404);
}

async function createToken(userId, email, secret) {
  const payload = { userId, email, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 };
  const data = btoa(JSON.stringify(payload));
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret || 'default-secret'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${data}.${sigB64}`;
}

async function verifyToken(token, secret) {
  const [data, sig] = token.split('.');
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret || 'default-secret'),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );
  const sigBytes = Uint8Array.from(atob(sig), c => c.charCodeAt(0));
  const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
  if (!valid) throw new Error('Token invalid');
  const payload = JSON.parse(atob(data));
  if (payload.exp < Date.now()) throw new Error('Token expired');
  return payload;
}
