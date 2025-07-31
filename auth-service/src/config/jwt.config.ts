export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'microfinance-secret-key',
  expiresIn: '24h' as const,
};