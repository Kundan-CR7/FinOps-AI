export interface InvoiceItem {
  description: string;
  amount: number;
  gstRate: number;
  hsnCode?: string;
}

export interface Invoice {
  id?: string;
  vendorGstin: string;
  totalAmount: number;
  invoiceDate: string;
  items: InvoiceItem[];
  status?: 'PENDING' | 'EXTRACTED' | 'PROCESSED' | 'FLAGGED' | 'VERIFIED' | 'RECONCILED' | 'PAID';
}

export interface BankTransaction {
  id: string;
  statementId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  status?: 'PENDING' | 'RECONCILED' | 'FLAGGED' | 'MATCHED';
  description?: string;
}

export interface BankStatement {
  id: string;
  accountNumber: string;
  periodStart: string;
  periodEnd: string;
}

export interface ExtractionResponse {
  message: string;
  data: Invoice;
}

export interface ReconciliationResponse {
  message: string;
  result: 'MATCH_FOUND' | 'ANOMALY_DETECTED';
  finalInvoiceStatus: string;
}
