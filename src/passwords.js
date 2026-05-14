const PBKDF2_PREFIX = 'pbkdf2';
const PBKDF2_ITERATIONS = 100000;
const SALT_BYTES = 16;
const HASH_BYTES = 32;

function toBase64(bytes) {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), function(ch) {
    return ch.charCodeAt(0);
  });
}

function constantTimeEqual(a, b) {
  if (!(a instanceof Uint8Array) || !(b instanceof Uint8Array)) return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function derivePbkdf2Bits(password, saltBytes, iterations) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(String(password || '')),
    'PBKDF2',
    false,
    ['deriveBits']
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: saltBytes,
      iterations
    },
    keyMaterial,
    HASH_BYTES * 8
  );

  return new Uint8Array(bits);
}

export function isPasswordHashFormat(value) {
  return String(value || '').startsWith(PBKDF2_PREFIX + '$');
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await derivePbkdf2Bits(password, salt, PBKDF2_ITERATIONS);
  return [PBKDF2_PREFIX, String(PBKDF2_ITERATIONS), toBase64(salt), toBase64(derived)].join('$');
}

export async function verifyPassword(password, storedHash) {
  const normalizedStored = String(storedHash || '');

  if (!isPasswordHashFormat(normalizedStored)) {
    return {
      ok: normalizedStored === String(password || ''),
      needsUpgrade: true,
      scheme: 'legacy-plaintext'
    };
  }

  const parts = normalizedStored.split('$');
  if (parts.length !== 4 || parts[0] !== PBKDF2_PREFIX) {
    return { ok: false, needsUpgrade: false, scheme: 'invalid' };
  }

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations <= 0) {
    return { ok: false, needsUpgrade: false, scheme: 'invalid' };
  }

  try {
    const salt = fromBase64(parts[2]);
    const expected = fromBase64(parts[3]);
    const actual = await derivePbkdf2Bits(password, salt, iterations);
    return {
      ok: constantTimeEqual(actual, expected),
      needsUpgrade: false,
      scheme: PBKDF2_PREFIX
    };
  } catch {
    return { ok: false, needsUpgrade: false, scheme: 'invalid' };
  }
}
