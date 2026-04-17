import { Request, Response } from "express";
import { InvoiceService } from "../services/InvoiceService";

export class InvoiceController {
    private invoiceService: InvoiceService

    constructor(invoiceService: InvoiceService) {
        this.invoiceService = invoiceService
    }

    public async upload(req: Request, res: Response): Promise<void> {
        try {
            const invoice = await this.invoiceService.processNewInvoice(req.body)
            res.status(201).json({
                message: "Invoice processed successfully",
                data: {
                    id: invoice.getId(),
                    status: invoice.getStatus(),
                    isFlagged: invoice.getStatus() === "FLAGGED"
                }
            })
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            })
        }
    }
}