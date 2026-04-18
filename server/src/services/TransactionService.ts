import { randomUUID } from "crypto";
import { Transaction } from "../domain/Transaction";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import prisma from "../utils/prisma";

export class TransactionService{
    //Dependency Injection
    private readonly transactionRepo : ITransactionRepository

    constructor(transactionRepo: ITransactionRepository){
        this.transactionRepo = transactionRepo
    }

    private async resolveManualStatementId(userId: string): Promise<string> {
        let stmt = await prisma.bankStatement.findFirst({
            where: { userId, accountNumber: 'MANUAL_ENTRY' }
        });

        if (!stmt) {
            stmt = await prisma.bankStatement.create({
                data: {
                    userId,
                    accountNumber: 'MANUAL_ENTRY',
                    periodStart: new Date(),
                    periodEnd: new Date()
                }
            });
        }
        return stmt.id;
    }

    public async processNewTransaction(payload: {id?: string, userId: string, amount: number, type: 'CREDIT' | 'DEBIT', transactionDate: string, narration: string}): Promise<Transaction>{
        const statementId = await this.resolveManualStatementId(payload.userId);
        
        const transaction = new Transaction(
            payload.id || randomUUID(),
            statementId,
            payload.amount, 
            payload.type,
            new Date(payload.transactionDate),
            payload.narration
        )
        
        const isFraud = false  //Mocking an external call
        if(isFraud){
            transaction.flagAnomaly("Failed external fraud check")
        }

        await this.transactionRepo.save(transaction)

        return transaction
    }

    public async getUserStatements(userId: string) {
        return await prisma.bankStatement.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    public async getAllUserTransactions(userId: string): Promise<Transaction[]> {
        // Technically, a user can have many statements. We pull all statement IDs for this user, then pull their transactions.
        const statements = await prisma.bankStatement.findMany({ where: { userId }, select: { id: true } });
        const statementIds = statements.map(s => s.id);

        if (statementIds.length === 0) return [];
        
        const rawDbRecords = await prisma.bankTransaction.findMany({
            where: { statementId: { in: statementIds } },
            orderBy: { transactionDate: 'desc' }
        });

        // We map them directly using the domain mapper pattern replicated from Repo.
        return rawDbRecords.map(raw => new Transaction(raw.id, raw.statementId, Number(raw.amount), raw.type as 'CREDIT'|'DEBIT', raw.transactionDate, raw.narration || ""));
    }
}