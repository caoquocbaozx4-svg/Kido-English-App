import type { User } from 'firebase/auth';

export const ADMIN_EMAIL = 'caoquocbaozx4@gmail.com';

/** Owner allowlist plus optional server claim. Never trusts an unverified email. */
export async function isTrustedAdmin(user: User | null): Promise<boolean> {
  if (!user || !user.emailVerified || !user.email) return false;
  if (user.email.trim().toLowerCase() === ADMIN_EMAIL) return true;
  return (await user.getIdTokenResult(true).catch(() => null))?.claims.admin === true;
}
