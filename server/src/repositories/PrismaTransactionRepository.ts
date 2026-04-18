import prisma from "../utils/prisma";
import { ITransactionRepository } from "./ITransactionRepository";
import { Transaction } from "../domain/Transaction";

export class PrismaTransactionRepository implements ITransactionRepository {

    public async save(transaction: Transaction): Promise<void> {
        await prisma.bankTransaction.upsert({
            where: { id: transaction.getId() },
            update: {
                status: transaction.getStatus()
            },
            create: {
                id: transaction.getId(),
                statementId: transaction.getStatementId(),
                amount: transaction.getAmount(),
                type: transaction.getType(),
                status: transaction.getStatus(),
                transactionDate: transaction.getTransactionDate(),
                narration: transaction.getNarration()
            }
        })
    }

    public async findById(id: string): Promise<Transaction | null> {
        const rawDbRecord = await prisma.bankTransaction.findUnique({
            where: { id }
        })

        if (!rawDbRecord) return null

        return this.mapToDomain(rawDbRecord)
    }

    public async findByStatementId(statementId: string): Promise<Transaction[]> {
        const rawDbRecord = await prisma.bankTransaction.findMany({
            where: { statementId: statementId }
        })

        return rawDbRecord.map(record => this.mapToDomain(record))
    }

    public async findByNarration(userId: string, narration: string): Promise<Transaction[]> {
        const rawDbRecord = await prisma.bankTransaction.findMany({
            where: { 
                narration: narration,
                statement: {
                    userId: userId
                }
            }
        })

        return rawDbRecord.map(record => this.mapToDomain(record))
    }

    private mapToDomain(raw: any): Transaction {
        const transaction = new Transaction(
            raw.id,
            raw.statementId,
            Number(raw.amount),
            raw.type,
            raw.transactionDate,
            raw.narration
        )

        if (raw.status === "RECONCILED" || raw.status === "MATCHED") {
            transaction.markAsReconciled()
        } else if (raw.status === "FLAGGED") {
            transaction.flagAnomaly("Restored from DB")
        }

        return transaction
    }

}