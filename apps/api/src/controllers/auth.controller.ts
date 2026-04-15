import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'elobonus-secret-key-super-safe';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const user = await prisma.user.findUnique({
                where: { email },
                include: { tenant: true }
            });

            if (!user) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }

            const token = jwt.sign(
                { id: user.id, tenantId: user.tenantId, role: user.role },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.json({
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    tenant: user.tenant ? { id: user.tenant.id, slug: user.tenant.slug, name: user.tenant.name } : null
                },
                token
            });
        } catch (e: any) {
            return res.status(500).json({ error: e.message });
        }
    }
}
