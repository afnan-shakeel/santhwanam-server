import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '@/config/env';

export interface AccessTokenPayload {
  sub?: string; // subject / user id
  userId?: string;
  authUserId?: string;
  id?: string;
  email?: string;
  roles?: string[];
  [key: string]: any;
}

export function signAccessToken(payload: AccessTokenPayload, expiresIn?: string): string {
  // Use explicit expiresIn value if provided, otherwise fallback to env config.
  const signOpts: jwt.SignOptions = { expiresIn: (expiresIn ?? JWT_EXPIRES_IN) as any };
  // Sign and return token
  return jwt.sign(payload as any, JWT_SECRET as jwt.Secret, signOpts);
}

export function verifyAccessToken(token: string): { valid: true; payload: AccessTokenPayload } | { valid: false; error: any } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AccessTokenPayload;
    return { valid: true, payload: decoded };
  } catch (err) {
    return { valid: false, error: err };
  }
}
