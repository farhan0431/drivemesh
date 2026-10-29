import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { pool } from '../database/connection';
import { config } from '../config';
const hash = (value: string) => crypto.createHash('sha256').update(value).digest('hex');
export const randomToken = () => crypto.randomBytes(32).toString('base64url');
export const sessionCookieName = config.env === 'production' ? '__Host-dm_session' : 'dm_session';
export const oauthCookieName = (name: string) => config.env === 'production' ? `__Host-${name}` : name;
export const cookieOptions = { httpOnly: true, secure: config.env === 'production', sameSite: 'lax' as const, path: '/' };
export function cookie(req: Request, name: string): string {
  const item = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith(`${name}=`));
  return item ? item.slice(name.length + 1) : '';
}
export async function createSession(res: Response, accountId: string): Promise<void> {
  const token = randomToken();
  await pool.query("INSERT INTO account_sessions (token_hash, account_id, expires_at) VALUES ($1, $2, NOW() + interval '7 days')", [hash(token), accountId]);
  res.cookie(sessionCookieName, token, { ...cookieOptions, maxAge: 7 * 86400000 });
}
export async function sessionUserId(req: Request): Promise<string | null> {
  const token = cookie(req, sessionCookieName);
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const result = await pool.query('SELECT account_id FROM account_sessions WHERE token_hash=$1 AND expires_at > NOW()', [hash(token)]);
  return result.rows[0]?.account_id || null;
}
export async function requireSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { const id = await sessionUserId(req); if (!id) { res.status(401).json({ success: false, error: 'Silakan masuk terlebih dahulu' }); return; } res.locals.userId = id; next(); } catch (error) { next(error); }
}
export async function clearSession(req: Request, res: Response): Promise<void> {
  const token = cookie(req, sessionCookieName);
  if (token) await pool.query('DELETE FROM account_sessions WHERE token_hash=$1', [hash(token)]);
  res.clearCookie(sessionCookieName, cookieOptions);
}
