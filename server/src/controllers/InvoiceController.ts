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
            });
        }
    }
    
    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id;
            const invoices = await this.invoiceService.getUserInvoices(userId);
            
            // Map domain models to raw objects for JSON
            const data = invoices.map(inv => ({
                id: inv.getId(),
                vendorGstin: inv.getVendorGstin(),
                totalAmount: inv.getTotalAmount(),
                invoiceDate: inv.getInvoiceDate(),
                status: inv.getStatus(),
                items: inv.getItems().map(item => ({
                    id: item.getId(),
                    description: item.getDescription(),
                    amount: item.getAmount(),
                    gstRate: item.getGstRate()
                }))
            }));
            
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}