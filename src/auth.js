function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders }
  });
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
