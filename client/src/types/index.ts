export interface InvoiceItemPayload{
    id: string
    description: string
    hsnCode: string
    amount: number
    gstRate: number
}

export interface InvoicePayload{
    id: string
    userId: string
    vendorGstin: string
    totalAmout: number
    invoiceDate: string
    items: InvoiceItemPayload[]
}

export interface TransactionPayload{
    id: string
    statementId: string
    amount: number
    type: "CREDIT" | "DEBIT"
}

export interface ReconciliationResponse{
    message: string
    result: "MATCH_FOUND" | "ANOMALY_DETECTION"
    finalInvoiceStatus: string
}
