import axios from "axios";
import type { InvoicePayload, TransactionPayload, ReconciliationResponse } from "../types";

const API = axios.create({
    baseURL: 'http://localhost:3000/api',
})

const uploadInvoice = async(payload: InvoicePayload) => {
    const response = await API.post("/invoices/upload",payload)
    return response.data
}

const uploadTransaction = async(payload: TransactionPayload) => {
    const response = await API.post("/transactions/upload",payload)
    return response.data
}

const runReconciliation = async(invoiceId: string, statementId: string): Promise<ReconciliationResponse> =>{
    const response = await API.post("/reconcile/run",{
        invoiceId,
        statementId
    })
    return response.data
}

export const FinopsService = {
    uploadInvoice,
    uploadTransaction,
    runReconciliation
}
