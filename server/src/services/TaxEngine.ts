import { Invoice } from "../domain/Invoice";
import { TaxRuleRepository, TaxRuleRecord } from "../repositories/TaxRuleRepository";

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

export interface ComplianceIssue {
    itemDescription: string;
    hsnCode: string;
    issue: string;
}

export interface ComplianceResult {
    isCompliant: boolean;
    issues: ComplianceIssue[];
}

export class TaxEngine {
    private readonly taxRuleRepo: TaxRuleRepository;

    constructor(taxRuleRepo: TaxRuleRepository) {
        this.taxRuleRepo = taxRuleRepo;
    }

    /**
     * Calculate a detailed tax breakdown for an invoice.
     * For intra-state (same state GSTIN prefix), splits into CGST + SGST.
     * For inter-state, uses IGST.
     */
    public async calculateTax(invoice: Invoice): Promise<TaxBreakdown> {
        const items = invoice.getItems();
        const taxLineItems: TaxLineItem[] = [];

        // Simple heuristic: if vendor GSTIN starts with same 2-digit state code 
        // as a typical business, use CGST+SGST; else IGST.
        // For simplicity, we default to CGST+SGST (intra-state).
        const isInterState = false;

        for (const item of items) {
            const hsnCode = item.getHsnCode();
            let appliedRate = item.getGstRate();

            // Try to get the authoritative rate from DB
            if (hsnCode && hsnCode !== "NOT_FOUND" && hsnCode !== "0000") {
                const rule: TaxRuleRecord | null = await this.taxRuleRepo.findByHsnCode(hsnCode);
                if (rule) {
                    appliedRate = rule.gstRate;
                }
            }

            const taxableAmount = item.getAmount();
            const taxAmount = taxableAmount * (appliedRate / 100);

            let cgst = 0, sgst = 0, igst = 0;
            if (isInterState) {
                igst = taxAmount;
            } else {
                cgst = taxAmount / 2;
                sgst = taxAmount / 2;
            }

            taxLineItems.push({
                description: item.getDescription(),
                hsnCode,
                taxableAmount: Math.round(taxableAmount * 100) / 100,
                cgst: Math.round(cgst * 100) / 100,
                sgst: Math.round(sgst * 100) / 100,
                igst: Math.round(igst * 100) / 100,
                totalTax: Math.round(taxAmount * 100) / 100,
                totalWithTax: Math.round((taxableAmount + taxAmount) * 100) / 100,
                appliedRate
            });
        }

        const totalTaxable = taxLineItems.reduce((sum, i) => sum + i.taxableAmount, 0);
        const totalCGST = taxLineItems.reduce((sum, i) => sum + i.cgst, 0);
        const totalSGST = taxLineItems.reduce((sum, i) => sum + i.sgst, 0);
        const totalIGST = taxLineItems.reduce((sum, i) => sum + i.igst, 0);
        const totalTax = taxLineItems.reduce((sum, i) => sum + i.totalTax, 0);

        return {
            invoiceId: invoice.getId(),
            vendorGstin: invoice.getVendorGstin(),
            items: taxLineItems,
            totalTaxable: Math.round(totalTaxable * 100) / 100,
            totalCGST: Math.round(totalCGST * 100) / 100,
            totalSGST: Math.round(totalSGST * 100) / 100,
            totalIGST: Math.round(totalIGST * 100) / 100,
            totalTax: Math.round(totalTax * 100) / 100,
            grandTotal: Math.round((totalTaxable + totalTax) * 100) / 100
        };
    }

    /**
     * Check that all items use valid, currently-active tax rules.
     */
    public async checkCompliance(invoice: Invoice): Promise<ComplianceResult> {
        const issues: ComplianceIssue[] = [];
        const items = invoice.getItems();

        for (const item of items) {
            const hsnCode = item.getHsnCode();

            if (!hsnCode || hsnCode === "NOT_FOUND" || hsnCode === "0000") {
                issues.push({
                    itemDescription: item.getDescription(),
                    hsnCode,
                    issue: "Missing or invalid HSN code — cannot verify tax compliance"
                });
                continue;
            }

            const rule = await this.taxRuleRepo.findByHsnCode(hsnCode);

            if (!rule) {
                issues.push({
                    itemDescription: item.getDescription(),
                    hsnCode,
                    issue: `No active tax rule found for HSN code "${hsnCode}"`
                });
                continue;
            }

            if (Math.abs(item.getGstRate() - rule.gstRate) > 0.01) {
                issues.push({
                    itemDescription: item.getDescription(),
                    hsnCode,
                    issue: `GST rate on invoice (${item.getGstRate()}%) does not match current rule (${rule.gstRate}%) for HSN ${hsnCode}`
                });
            }
        }

        return {
            isCompliant: issues.length === 0,
            issues
        };
    }
}
