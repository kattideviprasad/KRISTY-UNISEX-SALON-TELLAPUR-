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

export async function signIn(username: string, password: string) {
  const usernameOk = verifyUsername(username);
  const passwordOk = verifyPassword(password);

  // Both checks run regardless to prevent timing-based user enumeration
  if (!usernameOk || !passwordOk) {
    return { error: 'Invalid username or password.' };
  }

  const token = createSessionToken();
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION_MS / 1000,
    path: '/admin',
  });

  return { success: true };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect('/admin/login');
}
