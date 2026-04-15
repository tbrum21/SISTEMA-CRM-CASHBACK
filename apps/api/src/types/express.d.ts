import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        tenantId: string | null;
        role: string;
    };
}
