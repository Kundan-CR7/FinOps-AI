import { apiClient } from './apiClient';
import type { Invoice, BankTransaction, BankStatement, ExtractionResponse, ReconciliationResponse, AlertsResponse, TaxBreakdown, TaxRule, GSTR1Report, FilingResult } from '../types';

export const finopsApi = {
  // Auth Integration
  register: async (payload: any) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
  },

  login: async (payload: any) => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
  },

  // Real Backend Integration
  extractInvoice: async (file: File): Promise<ExtractionResponse> => {
    const formData = new FormData();
    formData.append('document', file);

    // Override Content-Type so the browser sets the multipart boundary naturally
    const { data } = await apiClient.post<ExtractionResponse>('/invoices/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Note: we can't let apiClient default JSON header override this, 
      // but Axios automatically drops Content-Type to compute boundary when given FormData.
    });
    return data;
  },

  runReconciliation: async (invoiceId: string, narration: string): Promise<ReconciliationResponse> => {
    const { data } = await apiClient.post<ReconciliationResponse>('/reconcile/run', {
      invoiceId,
      narration,
    });
    return data;
  },

  // GET endpoints
  getInvoices: async (): Promise<Invoice[]> => {
    const { data } = await apiClient.get('/invoices');
    return data;
  },

  getTransactions: async (): Promise<BankTransaction[]> => {
    const { data } = await apiClient.get('/transactions');
    return data;
  },

  getStatements: async (): Promise<BankStatement[]> => {
    const { data } = await apiClient.get('/transactions/statements');
    return data;
  },

  addTransaction: async (payload: { amount: string | number, type: 'CREDIT' | 'DEBIT', transactionDate: string, description: string }) => {
    const { data } = await apiClient.post('/transactions/upload', payload);
    return data;
  },

  // Alerts (UC7)
  getAlerts: async (): Promise<AlertsResponse> => {
    const { data } = await apiClient.get('/alerts');
    return data;
  },

  resolveAlert: async (alertId: string) => {
    const { data } = await apiClient.patch(`/alerts/${alertId}/resolve`);
    return data;
  },

  // Tax Engine (UC6)
  getTaxBreakdown: async (invoiceId: string): Promise<TaxBreakdown> => {
    const { data } = await apiClient.get(`/tax/calculate/${invoiceId}`);
    return data;
  },

  getTaxRules: async (): Promise<TaxRule[]> => {
    const { data } = await apiClient.get('/tax/rules');
    return data;
  },

  createTaxRule: async (payload: { hsnCode: string; gstRate: number; ruleDescription: string; effectiveFrom: string }) => {
    const { data } = await apiClient.post('/tax/rules', payload);
    return data;
  },

  // Reports (UC8 + UC9)
  generateGSTR1: async (periodStart: string, periodEnd: string): Promise<{ message: string; data: GSTR1Report }> => {
    const { data } = await apiClient.post('/reports/gstr1', { periodStart, periodEnd });
    return data;
  },

  fileReturn: async (report: GSTR1Report): Promise<{ message: string; data: FilingResult }> => {
    const { data } = await apiClient.post('/reports/file', { report });
    return data;
  }
};

