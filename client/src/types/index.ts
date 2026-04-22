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

// Alert System (UC7)
export interface Alert {
  id: string;
  userId: string;
  invoiceId: string | null;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  message: string;
  isResolved: boolean;
  createdAt: string;
}

export interface AlertsResponse {
  alerts: Alert[];
  unresolvedCount: number;
}

// Tax Engine (UC6)
export interface TaxLineItem {
  description: string;
  hsnCode: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalWithTax: number;
  appliedRate: number;
}

export interface TaxBreakdown {
  invoiceId: string;
  vendorGstin: string;
  items: TaxLineItem[];
  totalTaxable: number;
  totalCGST: number;
  totalSGST: number;
  totalIGST: number;
  totalTax: number;
  grandTotal: number;
}

export interface TaxRule {
  id: string;
  hsnCode: string;
  gstRate: number;
  ruleDescription: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  isActive: boolean;
}

// GSTR-1 Report (UC8 + UC9)
export interface B2BEntry {
  vendorGstin: string;
  invoiceId: string;
  invoiceDate: string;
  totalTaxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalInvoiceValue: number;
}

export interface HSNSummary {
  hsnCode: string;
  description: string;
  totalTaxable: number;
  totalTax: number;
  quantity: number;
}

export interface GSTR1Report {
  id: string;
  userId: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  b2b: B2BEntry[];
  hsnSummary: HSNSummary[];
  totalTaxLiability: {
    totalTaxable: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    totalTax: number;
  };
  invoiceCount: number;
  status: 'GENERATED' | 'FILED';
}

export interface FilingResult {
  success: boolean;
  acknowledgmentNumber: string;
  filedAt: string;
  reportId: string;
  message: string;
}

