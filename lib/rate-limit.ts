import { headers } from 'next/headers';

type RateLimitRecord = {
  timestamps: number[];
  lockoutUntil?: number;
};

// In-memory store for tracking request timestamps per key
const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 10 minutes to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      const isLocked = record.lockoutUntil && record.lockoutUntil > now;
      const hasRecentTimestamps = record.timestamps.some((t) => now - t < 3600000);
      if (!isLocked && !hasRecentTimestamps) {
        rateLimitStore.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

/**
 * Get client IP address from standard request headers.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  const realIp = headerList.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetSeconds: number;
  isLockedOut?: boolean;
};

/**
 * Check and record a rate limit attempt with a sliding window.
 * 
 * @param key Unique key (e.g. `booking:${ip}` or `login:${ip}`)
 * @param maxRequests Maximum allowed requests within the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Check if key is currently locked out
  if (record.lockoutUntil && record.lockoutUntil > now) {
    const resetSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds,
      isLockedOut: true,
    };
  }

  // Filter timestamps within the sliding window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((t) => t > windowStart);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetSeconds = Math.ceil((oldestTimestamp + windowMs - now) / 1000);
    return {
      success: false,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
      isLockedOut: false,
    };
  }

  // Record this attempt
  record.timestamps.push(now);
  return {
    success: true,
    remaining: maxRequests - record.timestamps.length,
    resetSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Record a failed attempt for authentication lockout (e.g., 5 failed attempts = lockout for 15 min).
 */
export function recordFailedAuthAttempt(
  key: string,
  maxFails: number,
  windowMs: number,
  lockoutDurationMs: number
): { isLockedOut: boolean; remainingAttempts: number; lockoutSeconds: number } {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Filter failures within window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((t) => t > windowStart);
  record.timestamps.push(now);

  if (record.timestamps.length >= maxFails) {
    record.lockoutUntil = now + lockoutDurationMs;
    return {
      isLockedOut: true,
      remainingAttempts: 0,
      lockoutSeconds: Math.ceil(lockoutDurationMs / 1000),
    };
  }

  return {
    isLockedOut: false,
    remainingAttempts: maxFails - record.timestamps.length,
    lockoutSeconds: 0,
  };
}

/**
 * Check if an auth key is currently locked out without adding a new attempt.
 */
export function isAuthLockedOut(key: string): { isLockedOut: boolean; resetSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  if (record?.lockoutUntil && record.lockoutUntil > now) {
    return {
      isLockedOut: true,
      resetSeconds: Math.ceil((record.lockoutUntil - now) / 1000),
    };
  }
  return { isLockedOut: false, resetSeconds: 0 };
}

/**
 * Clear failed attempts upon successful login.
 */
export function resetAuthFailures(key: string): void {
  rateLimitStore.delete(key);
}
