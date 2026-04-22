import prisma from "../utils/prisma";

export interface AuditLogRecord {
    id: string;
    userId: string;
    entityType: string;
    entityId: string;
    action: string;
    createdAt: Date;
}

export class AuditLogRepository {
    public async create(data: { userId: string; entityType: string; entityId: string; action: string }): Promise<AuditLogRecord> {
        const raw = await prisma.auditLog.create({
            data: {
                userId: data.userId,
                entityType: data.entityType,
                entityId: data.entityId,
                action: data.action
            }
        });

        return this.mapToRecord(raw);
    }

    public async findByUser(userId: string): Promise<AuditLogRecord[]> {
        const raws = await prisma.auditLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return raws.map(raw => this.mapToRecord(raw));
    }

    public async findByEntity(entityType: string, entityId: string): Promise<AuditLogRecord[]> {
        const raws = await prisma.auditLog.findMany({
            where: { entityType, entityId },
            orderBy: { createdAt: 'desc' }
        });

        return raws.map(raw => this.mapToRecord(raw));
    }

    private mapToRecord(raw: any): AuditLogRecord {
        return {
            id: raw.id,
            userId: raw.userId,
            entityType: raw.entityType,
            entityId: raw.entityId,
            action: raw.action,
            createdAt: raw.createdAt
        };
    }
}
