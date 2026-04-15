import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../types/express';

export class UserController {
    static async listUsers(req: AuthenticatedRequest, res: Response) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) return res.status(403).json({ error: 'Acesso sem vinculo de Tenant.' });

            const users = await prisma.user.findMany({
                where: { tenantId },
                select: { id: true, name: true, email: true, role: true, createdAt: true }
            });

            return res.json(users);
        } catch (e: any) {
            return res.status(500).json({ error: e.message });
        }
    }

    static async createUser(req: AuthenticatedRequest, res: Response) {
        try {
            const tenantId = req.user?.tenantId;
            if (!tenantId) return res.status(403).json({ error: 'Acesso sem vinculo de Tenant.' });

            const { name, email, password, role } = req.body;

            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'E-mail já está em uso.' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = await prisma.user.create({
                data: {
                    tenantId,
                    name,
                    email,
                    passwordHash,
                    role: role || 'OPERATOR' 
                },
                select: { id: true, name: true, email: true, role: true }
            });

            return res.json(newUser);
        } catch (e: any) {
            return res.status(500).json({ error: e.message });
        }
    }
}
