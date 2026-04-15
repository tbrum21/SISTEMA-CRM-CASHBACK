import { Request, Response } from 'express';
import { prisma } from '@repo/database';
import bcrypt from 'bcryptjs';

export class SaasController {
    
    // Create new Tenant + inaugural OWNER user
    static async createTenant(req: Request, res: Response) {
        try {
            const { companyName, companySlug, ownerName, ownerEmail, ownerPassword } = req.body;

            // Check if slug is taken
            const existingTenant = await prisma.tenant.findUnique({ where: { slug: companySlug } });
            if (existingTenant) {
                return res.status(400).json({ error: 'Este slug (URL) de sistema já está em uso.' });
            }

            // Check if email is taken
            const existingUser = await prisma.user.findUnique({ where: { email: ownerEmail } });
            if (existingUser) {
                return res.status(400).json({ error: 'O E-mail do proprietário já está registrado em uso.' });
            }

            const passwordHash = await bcrypt.hash(ownerPassword, 10);

            // Create Tenant and Owner in a transaction
            const result = await prisma.$transaction(async (tx) => {
                const tenant = await tx.tenant.create({
                    data: {
                        name: companyName,
                        slug: companySlug,
                    }
                });

                const user = await tx.user.create({
                    data: {
                        tenantId: tenant.id,
                        name: ownerName,
                        email: ownerEmail,
                        passwordHash,
                        role: 'OWNER'
                    }
                });

                return { tenant, user: { id: user.id, email: user.email } };
            });

            return res.json({ success: true, ...result });

        } catch(e: any) {
            return res.status(500).json({ error: e.message });
        }
    }
}
