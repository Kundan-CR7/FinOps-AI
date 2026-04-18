"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const crypto_1 = require("crypto");
const Transaction_1 = require("../domain/Transaction");
const prisma_1 = __importDefault(require("../utils/prisma"));
class TransactionService {
    //Dependency Injection
    transactionRepo;
    constructor(transactionRepo) {
        this.transactionRepo = transactionRepo;
    }
    async resolveManualStatementId(userId) {
        let stmt = await prisma_1.default.bankStatement.findFirst({
            where: { userId, accountNumber: 'MANUAL_ENTRY' }
        });
        if (!stmt) {
            stmt = await prisma_1.default.bankStatement.create({
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
    async processNewTransaction(payload) {
        const statementId = await this.resolveManualStatementId(payload.userId);
        const transaction = new Transaction_1.Transaction(payload.id || (0, crypto_1.randomUUID)(), statementId, payload.amount, payload.type, new Date(payload.transactionDate), payload.narration);
        const isFraud = false; //Mocking an external call
        if (isFraud) {
            transaction.flagAnomaly("Failed external fraud check");
        }
        await this.transactionRepo.save(transaction);
        return transaction;
    }
    async getUserStatements(userId) {
        return await prisma_1.default.bankStatement.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getAllUserTransactions(userId) {
        // Technically, a user can have many statements. We pull all statement IDs for this user, then pull their transactions.
        const statements = await prisma_1.default.bankStatement.findMany({ where: { userId }, select: { id: true } });
        const statementIds = statements.map(s => s.id);
        if (statementIds.length === 0)
            return [];
        const rawDbRecords = await prisma_1.default.bankTransaction.findMany({
            where: { statementId: { in: statementIds } },
            orderBy: { transactionDate: 'desc' }
        });
        // We map them directly using the domain mapper pattern replicated from Repo.
        return rawDbRecords.map(raw => new Transaction_1.Transaction(raw.id, raw.statementId, Number(raw.amount), raw.type, raw.transactionDate, raw.narration || ""));
    }
}
exports.TransactionService = TransactionService;
