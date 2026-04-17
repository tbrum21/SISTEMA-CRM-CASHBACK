/**
 * URL base da API — usa a variável de ambiente em produção,
 * com fallback para localhost em desenvolvimento.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
