import prisma from "../utils/prisma";

export interface AlertRecord {
    id: string;
    userId: string;
    invoiceId: string | null;
    severity: string;
    message: string;
    isResolved: boolean;
    createdAt: Date;
}

export class AlertRepository {
    public async create(data: { userId: string; invoiceId?: string; severity: string; message: string }): Promise<AlertRecord> {
        const raw = await prisma.alert.create({
            data: {
                userId: data.userId,
                invoiceId: data.invoiceId || null,
                severity: data.severity,
                message: data.message,
                isResolved: false
            }
        });

        return this.mapToRecord(raw);
    }

    public async findByUser(userId: string): Promise<AlertRecord[]> {
        const raws = await prisma.alert.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return raws.map(raw => this.mapToRecord(raw));
    }

    public async countUnresolved(userId: string): Promise<number> {
        return await prisma.alert.count({
            where: { userId, isResolved: false }
        });
    }

    public async resolve(alertId: string): Promise<AlertRecord> {
        const raw = await prisma.alert.update({
            where: { id: alertId },
            data: { isResolved: true }
        });

        return this.mapToRecord(raw);
    }

    private mapToRecord(raw: any): AlertRecord {
        return {
            id: raw.id,
            userId: raw.userId,
            invoiceId: raw.invoiceId,
            severity: raw.severity,
            message: raw.message,
            isResolved: raw.isResolved,
            createdAt: raw.createdAt
        };
    }
}
