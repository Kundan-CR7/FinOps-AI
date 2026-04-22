import prisma from "../utils/prisma";

export interface TaxRuleRecord {
    id: string;
    hsnCode: string;
    gstRate: number;
    ruleDescription: string;
    effectiveFrom: Date;
    effectiveTo: Date | null;
    isActive: boolean;
}

export class TaxRuleRepository {
    public async findByHsnCode(hsnCode: string): Promise<TaxRuleRecord | null> {
        const raw = await prisma.taxRule.findFirst({
            where: {
                hsnCode,
                isActive: true,
                effectiveFrom: { lte: new Date() },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gte: new Date() } }
                ]
            },
            orderBy: { effectiveFrom: 'desc' }
        });

        if (!raw) return null;

        return {
            id: raw.id,
            hsnCode: raw.hsnCode,
            gstRate: Number(raw.gstRate),
            ruleDescription: raw.ruleDescription,
            effectiveFrom: raw.effectiveFrom,
            effectiveTo: raw.effectiveTo,
            isActive: raw.isActive
        };
    }

    public async findAll(): Promise<TaxRuleRecord[]> {
        const raws = await prisma.taxRule.findMany({
            where: { isActive: true },
            orderBy: { hsnCode: 'asc' }
        });

        return raws.map(raw => ({
            id: raw.id,
            hsnCode: raw.hsnCode,
            gstRate: Number(raw.gstRate),
            ruleDescription: raw.ruleDescription,
            effectiveFrom: raw.effectiveFrom,
            effectiveTo: raw.effectiveTo,
            isActive: raw.isActive
        }));
    }

    public async create(data: { hsnCode: string; gstRate: number; ruleDescription: string; effectiveFrom: string }): Promise<TaxRuleRecord> {
        const raw = await prisma.taxRule.create({
            data: {
                hsnCode: data.hsnCode,
                gstRate: data.gstRate,
                ruleDescription: data.ruleDescription,
                effectiveFrom: new Date(data.effectiveFrom),
                isActive: true
            }
        });

        return {
            id: raw.id,
            hsnCode: raw.hsnCode,
            gstRate: Number(raw.gstRate),
            ruleDescription: raw.ruleDescription,
            effectiveFrom: raw.effectiveFrom,
            effectiveTo: raw.effectiveTo,
            isActive: raw.isActive
        };
    }
}
