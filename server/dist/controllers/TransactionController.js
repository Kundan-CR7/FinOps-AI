"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async upload(req, res) {
        try {
            //Extract and Validate raw input from the manual entry form
            const { amount, type, transactionDate, description } = req.body;
            if (!amount || !type || !transactionDate || !description) {
                res.status(400).json({ error: "Missing required fields" });
                return;
            }
            //Pass to Service Layer, auto-generating ID and using user ID from Auth.
            const transaction = await this.transactionService.processNewTransaction({
                userId: req.user.id,
                amount: Number(amount),
                type,
                transactionDate,
                narration: description
            });
            //Return a DTO
            res.status(201).json({
                message: "Transaction processed successfully",
                data: {
                    id: transaction.getId(),
                    status: transaction.getStatus()
                }
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const transactions = await this.transactionService.getAllUserTransactions(userId);
            const data = transactions.map(txn => ({
                id: txn.getId(),
                amount: txn.getAmount(),
                type: txn.getType(),
                status: txn.getStatus(),
                date: txn.getTransactionDate().toISOString(),
                description: txn.getNarration() || "Manual Transaction"
            }));
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async getUserStatements(req, res) {
        try {
            const userId = req.user.id;
            const statements = await this.transactionService.getUserStatements(userId);
            res.status(200).json(statements);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.TransactionController = TransactionController;
