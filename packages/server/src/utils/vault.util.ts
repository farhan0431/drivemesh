import crypto from 'crypto';
import { config } from '../config';

const VAULT_KEY = crypto.createHash('sha256').update(config.masterKey).digest();

export interface EncryptedPayload {
  cipherText: string;
  iv: string;
  authTag: string;
}

export function encryptSecret(plaintext: string): EncryptedPayload {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', VAULT_KEY, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();

  return {
    cipherText: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decryptSecret(payload: EncryptedPayload): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    VAULT_KEY,
    Buffer.from(payload.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));
  
  let decrypted = decipher.update(payload.cipherText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

export function hashSecret(plaintext: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(plaintext, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifySecret(plaintext: string, storedHash: string): boolean {
  const [salt, key] = storedHash.split(':');
  if (!salt || !key) return false;
  
  const derivedKey = crypto.scryptSync(plaintext, salt, 64);
  return crypto.timingSafeEqual(derivedKey, Buffer.from(key, 'hex'));
}
