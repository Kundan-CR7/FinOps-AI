import { Request,Response } from "express";
import { TransactionService } from "../services/TransactionService";
import { error } from "node:console";
import { stat } from "node:fs";

export class TransactionController{
    private transactionService :TransactionService

    constructor(transactionService: TransactionService){
        this.transactionService = transactionService
    }

    public async upload(req: Request, res: Response): Promise<void>{
        try{
            //Extract and Validate raw input
            const { id,statementId, amount, type} = req.body
            if(!id || !statementId || !amount || !type){
                res.status(400).json({ error: "Missing required fields"})
                return
            }

            //Pass to Service Layer
            const transaction = await this.transactionService.processNewTransaction({id,statementId,amount,type})

            //Return a DTO
            res.status(201).json({
                message : "Transaction process successfully",
                data: {
                    id: transaction.getId(),
                    status : transaction.getStatus()
                }
            })
        }
    }
}