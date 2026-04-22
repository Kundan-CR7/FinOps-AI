import { Request, Response } from "express";
import { ReconciliationEngine } from "../services/reconciliation/ReconciliationEngine";
import { IInvoiceRepository } from "../repositories/IInvoiceRepository";
import { ITransactionRepository } from "../repositories/ITransactionRepository";

export class ReconciliationController {
    private engine: ReconciliationEngine
    private invoiceRepo: IInvoiceRepository
    private transactionRepo: ITransactionRepository

    constructor(engine: ReconciliationEngine, invoiceRepo: IInvoiceRepository, transactionRepo: ITransactionRepository) {
        this.engine = engine
        this.invoiceRepo = invoiceRepo
        this.transactionRepo = transactionRepo
    }

    public async runReconciliation(req: Request, res: Response): Promise<void> {
        try {
            // 1. Fetch the Data
            const { invoiceId, narration } = req.body
            const userId = (req as any).user.id
            const invoice = await this.invoiceRepo.findById(invoiceId)
            const transactions = await this.transactionRepo.findByNarration(userId, narration)

            if (!invoice) {
                res.status(404).json({ error: "Entities not found" })
                return
            }

            // 2. Run the AI Logic using the narration bucket array.
            const isMatched = await this.engine.reconcile(invoice, transactions, userId)

            // 3. Save the updated state of the Invoice 
            await this.invoiceRepo.save(invoice)

            // 4. Return the result 
            res.status(200).json({
                message: "Reconciliation complete",
                result: isMatched ? "MATCH_FOUND" : "ANOMALY_DETECTED",
                finalInvoiceStatus: invoice.getStatus()
            })

        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }
}