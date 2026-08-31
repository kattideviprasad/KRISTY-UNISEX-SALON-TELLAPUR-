import crypto from 'crypto';

const COOKIE_NAME = 'kristy_admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set');
  return secret;
}

// ─── Password verification ────────────────────────────────────────────────────

export function verifyPassword(inputPassword: string): boolean {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const storedUsername = process.env.ADMIN_USERNAME;
  if (!storedHash || !storedUsername) return false;

  try {
    const inputHash = crypto
      .scryptSync(inputPassword, 'kristy-salon-admin', 64)
      .toString('hex');
    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(inputHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch {
    return false;
  }
}

export function verifyUsername(inputUsername: string): boolean {
  const stored = process.env.ADMIN_USERNAME ?? '';
  if (!stored || !inputUsername) return false;
  // Constant-time string comparison
  try {
    const a = Buffer.from(inputUsername.padEnd(64).slice(0, 64));
    const b = Buffer.from(stored.padEnd(64).slice(0, 64));
    return crypto.timingSafeEqual(a, b) && inputUsername.length === stored.length;
  } catch {
    return false;
  }
}

// ─── Session token (signed cookie) ───────────────────────────────────────────

function sign(payload: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = `admin:${exp}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}.${sig}`).toString('base64url');
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const lastDot = decoded.lastIndexOf('.');
    if (lastDot === -1) return false;

    const payload = decoded.slice(0, lastDot);
    const sig = decoded.slice(lastDot + 1);

    // Verify signature
    const expectedSig = sign(payload);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return false;
    }

    // Check expiry
    const [, expStr] = payload.split(':');
    const exp = parseInt(expStr, 10);
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, SESSION_DURATION_MS };
