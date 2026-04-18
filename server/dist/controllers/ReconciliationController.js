"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliationController = void 0;
class ReconciliationController {
    engine;
    invoiceRepo;
    transactionRepo;
    constructor(engine, invoiceRepo, transactionRepo) {
        this.engine = engine;
        this.invoiceRepo = invoiceRepo;
        this.transactionRepo = transactionRepo;
    }
    async runReconciliation(req, res) {
        try {
            // 1. Fetch the Data
            const { invoiceId, narration } = req.body;
            const userId = req.user.id;
            const invoice = await this.invoiceRepo.findById(invoiceId);
            const transactions = await this.transactionRepo.findByNarration(userId, narration);
            if (!invoice) {
                res.status(404).json({ error: "Entities not found" });
                return;
            }
            // 2. Run the AI Logic using the narration bucket array.
            const isMatched = await this.engine.reconcile(invoice, transactions);
            // 3. Save the updated state of the Invoice 
            await this.invoiceRepo.save(invoice);
            // 4. Return the result 
            res.status(200).json({
                message: "Reconciliation complete",
                result: isMatched ? "MATCH_FOUND" : "ANOMALY_DETECTED",
                finalInvoiceStatus: invoice.getStatus()
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
exports.ReconciliationController = ReconciliationController;
