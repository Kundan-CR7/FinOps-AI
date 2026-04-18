"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaTransactionRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const Transaction_1 = require("../domain/Transaction");
class PrismaTransactionRepository {
    async save(transaction) {
        await prisma_1.default.bankTransaction.upsert({
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
        });
    }
    async findById(id) {
        const rawDbRecord = await prisma_1.default.bankTransaction.findUnique({
            where: { id }
        });
        if (!rawDbRecord)
            return null;
        return this.mapToDomain(rawDbRecord);
    }
    async findByStatementId(statementId) {
        const rawDbRecord = await prisma_1.default.bankTransaction.findMany({
            where: { statementId: statementId }
        });
        return rawDbRecord.map(record => this.mapToDomain(record));
    }
    async findByNarration(userId, narration) {
        const rawDbRecord = await prisma_1.default.bankTransaction.findMany({
            where: {
                narration: narration,
                statement: {
                    userId: userId
                }
            }
        });
        return rawDbRecord.map(record => this.mapToDomain(record));
    }
    mapToDomain(raw) {
        const transaction = new Transaction_1.Transaction(raw.id, raw.statementId, Number(raw.amount), raw.type, raw.transactionDate, raw.narration);
        if (raw.status === "RECONCILED" || raw.status === "MATCHED") {
            transaction.markAsReconciled();
        }
        else if (raw.status === "FLAGGED") {
            transaction.flagAnomaly("Restored from DB");
        }
        return transaction;
    }
}
exports.PrismaTransactionRepository = PrismaTransactionRepository;
