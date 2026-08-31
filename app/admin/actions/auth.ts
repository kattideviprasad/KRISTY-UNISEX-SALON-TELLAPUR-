'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  verifyUsername,
  verifyPassword,
  createSessionToken,
  COOKIE_NAME,
  SESSION_DURATION_MS,
} from '@/lib/admin-session';
import {
  getClientIp,
  isAuthLockedOut,
  recordFailedAuthAttempt,
  resetAuthFailures,
} from '@/lib/rate-limit';

export async function signIn(username: string, password: string) {
  let shouldRedirect = false;

  try {
    // Input validation
    if (
      !username ||
      !password ||
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      username.length > 100 ||
      password.length > 128
    ) {
      return { error: 'Invalid username or password.' };
    }

    const clientIp = await getClientIp();
    const lockoutKey = `auth:${clientIp}`;

    const usernameOk = verifyUsername(username.trim());
    const passwordOk = verifyPassword(password);

    if (usernameOk && passwordOk) {
      // Successful login -> clear failure counts and lockout immediately
      resetAuthFailures(lockoutKey);

      const token = createSessionToken();
      const cookieStore = await cookies();

      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: SESSION_DURATION_MS / 1000,
        path: '/',
      });

      shouldRedirect = true;
    } else {
      // Check if already locked out
      const lockoutStatus = isAuthLockedOut(lockoutKey);
      if (lockoutStatus.isLockedOut) {
        const minutesLeft = Math.ceil(lockoutStatus.resetSeconds / 60);
        return {
          error: `Too many failed login attempts. Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} before trying again.`,
        };
      }

      const failureResult = recordFailedAuthAttempt(
        lockoutKey,
        5, // max 5 failed attempts
        15 * 60 * 1000, // 15-minute window
        15 * 60 * 1000 // 15-minute lockout
      );

      if (failureResult.isLockedOut) {
        return {
          error: 'Too many failed login attempts. Account locked for 15 minutes.',
        };
      }

      return {
        error: `Invalid credentials. (${failureResult.remainingAttempts} attempt${failureResult.remainingAttempts === 1 ? '' : 's'} remaining before lockout)`,
      };
    }
  } catch (err: unknown) {
    console.error('Sign in server action error:', err);
    return { error: 'Invalid credentials or service temporarily unavailable. Please try again.' };
  }

  if (shouldRedirect) {
    redirect('/admin');
  }
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete({ name: COOKIE_NAME, path: '/' });
  redirect('/admin/login');
}
