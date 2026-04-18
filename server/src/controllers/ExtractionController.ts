import { Request,Response } from "express";
import { DocumentExtractionService } from "../services/DocumentExtractionService";
import { InvoiceService } from "../services/InvoiceService";
import { randomUUID } from "crypto";

export class ExtractionController{
    private extractionService: DocumentExtractionService
    private invoiceService: InvoiceService

    constructor(
        extractionService: DocumentExtractionService,
        invoiceService: InvoiceService
    ){
        this.extractionService = extractionService
        this.invoiceService = invoiceService
    }

    public async extract(req: Request, res:Response): Promise<void>{
        try{
            if(!req.file){
                res.status(400).json({error: "No document uploaded"})
                return
            }

            const extractedJson = await this.extractionService.extractInvoiceData(
                req.file.buffer,
                req.file.mimetype
            )
            
            // Map extracted AI data to our expected domain payload format
            const payload = {
                id: randomUUID(),
                userId: req.user.id,
                vendorGstin: extractedJson.vendorGstin || "UNKNOWN",
                totalAmount: extractedJson.totalAmount || 0,
                invoiceDate: extractedJson.invoiceDate || new Date().toISOString(),
                items: (extractedJson.items || []).map((i: any) => ({
                    id: randomUUID(),
                    description: i.description || "Unknown item",
                    hsnCode: i.hsnCode || "0000",
                    amount: i.amount || 0,
                    gstRate: i.gstRate || 0
                }))
            }
            
            // Persist securely to DB
            const savedInvoice = await this.invoiceService.processNewInvoice(payload);

            res.status(200).json({
                message: "Extraction and Save successful",
                data: {
                    id: savedInvoice.getId(),
                    vendorGstin: savedInvoice.getVendorGstin(),
                    totalAmount: savedInvoice.getTotalAmount(),
                    status: savedInvoice.getStatus(),
                    invoiceDate: savedInvoice.getInvoiceDate()
                }
            })
        }catch(error: any){
            res.status(500).json({error: String(error.message || error)})
        }
    }
}