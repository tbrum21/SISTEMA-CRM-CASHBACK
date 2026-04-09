import { Request, Response } from 'express';
import { prisma } from '@repo/database';

export class SettingsController {

  // ═══════════════════════════════════════════
  // TENANT CONFIG
  // ═══════════════════════════════════════════

  static async getTenantSettings(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const tenant = await prisma.tenant.findUnique({
        where: { slug: tenantSlug },
        include: { products: true, rewardRules: true }
      });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado.' });
      return res.json(tenant);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async updateTenantSettings(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const { remarketingTemplate, birthdayTemplate, cashbackTtlDays } = req.body;
      const tenant = await prisma.tenant.update({
        where: { slug: tenantSlug },
        data: {
          ...(remarketingTemplate !== undefined && { remarketingTemplate }),
          ...(birthdayTemplate !== undefined && { birthdayTemplate }),
          ...(cashbackTtlDays !== undefined && { cashbackTtlDays: Number(cashbackTtlDays) }),
        }
      });
      return res.json(tenant);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ═══════════════════════════════════════════
  // PRODUCTS CRUD
  // ═══════════════════════════════════════════

  static async createProduct(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado.' });

      const { name, description, imageUrl, costInPoints } = req.body;
      const product = await prisma.product.create({
        data: { tenantId: tenant.id, name, description, imageUrl, costInPoints: Number(costInPoints) }
      });
      return res.status(201).json(product);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, imageUrl, costInPoints, isActive } = req.body;
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(costInPoints !== undefined && { costInPoints: Number(costInPoints) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        }
      });
      return res.json(product);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.product.delete({ where: { id } });
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ═══════════════════════════════════════════
  // REWARD RULES CRUD
  // ═══════════════════════════════════════════

  static async createRule(req: Request, res: Response) {
    try {
      const { tenantSlug } = req.params;
      const tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } });
      if (!tenant) return res.status(404).json({ error: 'Tenant não encontrado.' });

      const { name, description, type, value, dayOfWeek, minPurchase } = req.body;
      const rule = await prisma.rewardRule.create({
        data: {
          tenantId: tenant.id, name, description, type,
          value: Number(value),
          ...(dayOfWeek !== undefined && { dayOfWeek: Number(dayOfWeek) }),
          ...(minPurchase !== undefined && { minPurchase: Number(minPurchase) }),
        }
      });
      return res.status(201).json(rule);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async updateRule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, type, value, dayOfWeek, minPurchase, isActive } = req.body;
      const rule = await prisma.rewardRule.update({
        where: { id },
        data: {
          ...(name !== undefined && { name }),
          ...(description !== undefined && { description }),
          ...(type !== undefined && { type }),
          ...(value !== undefined && { value: Number(value) }),
          ...(dayOfWeek !== undefined && { dayOfWeek: Number(dayOfWeek) }),
          ...(minPurchase !== undefined && { minPurchase: Number(minPurchase) }),
          ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        }
      });
      return res.json(rule);
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  static async deleteRule(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.rewardRule.delete({ where: { id } });
      return res.json({ success: true });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }
}
