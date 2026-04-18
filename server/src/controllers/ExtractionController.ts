import { Request,Response } from "express";
import { DocumentExtractionService } from "../services/DocumentExtractionService";

export class ExtractionController{
    private extractionService: DocumentExtractionService

    constructor(extractionService: DocumentExtractionService){
        this.extractionService = extractionService
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

            res.status(200).json({
                message: "Extraction successful",
                data: extractedJson
            })
        }catch(error: any){
            res.status(500).json({error: error.message})
        }
    }
}