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

    // List all Tenants with their Owners and customer count
    static async listTenants(req: Request, res: Response) {
        try {
            const tenants = await prisma.tenant.findMany({
                include: {
                    users: {
                        select: { id: true, name: true, email: true, role: true }
                    },
                    customerProfiles: {
                        select: { id: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const mapped = tenants.map(t => ({
                id: t.id,
                name: t.name,
                slug: t.slug,
                document: t.document,
                createdAt: t.createdAt,
                users: t.users,
                customerCount: t.customerProfiles.length
            }));

            return res.json({ success: true, tenants: mapped });
        } catch(e: any) {
            return res.status(500).json({ error: e.message });
        }
    }

    // Get KPIs for a specific Tenant
    static async getTenantMetrics(req: Request, res: Response) {
        try {
            const { tenantId } = req.params;

            const customerCount = await prisma.customerProfile.count({ where: { tenantId } });
            
            const earnTransactions = await prisma.transaction.aggregate({
                where: { tenantId, type: 'EARN' },
                _count: { id: true },
                _sum: { amountPurchase: true, amountPoints: true }
            });

            const redeemTransactions = await prisma.transaction.aggregate({
                where: { tenantId, type: 'REDEEM' },
                _sum: { amountPoints: true }
            });

            const userCount = await prisma.user.count({ where: { tenantId } });

            const revenue = earnTransactions._sum.amountPurchase || 0;
            const salesCount = earnTransactions._count.id || 0;
            const avgTicket = salesCount > 0 ? revenue / salesCount : 0;
            const cashbackIssued = earnTransactions._sum.amountPoints || 0;
            const cashbackRedeemed = redeemTransactions._sum.amountPoints || 0;

            return res.json({
                success: true,
                metrics: {
                    customerCount,
                    userCount,
                    revenue,
                    salesCount,
                    avgTicket,
                    cashbackIssued,
                    cashbackRedeemed
                }
            });
        } catch(e: any) {
            return res.status(500).json({ error: e.message });
        }
    }
}
