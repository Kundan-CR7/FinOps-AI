import prisma from "../utils/prisma";
import { Invoice } from "../domain/Invoice";
import { InvoiceItem } from "../domain/InvoiceItem";
import { DocumentStatus } from "../domain/FinancialDocument";
import { TaxEngine, TaxBreakdown } from "./TaxEngine";

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
    status: "GENERATED" | "FILED";
}

export class ReportService {
    private readonly taxEngine: TaxEngine;

    constructor(taxEngine: TaxEngine) {
        this.taxEngine = taxEngine;
    }

    public async generateGSTR1(userId: string, periodStart: string, periodEnd: string): Promise<GSTR1Report> {
        // Fetch all reconciled/paid/verified invoices in the period
        const invoiceRecords = await prisma.invoice.findMany({
            where: {
                userId,
                status: { in: ["PAID", "RECONCILED", "VERIFIED"] },
                invoiceDate: {
                    gte: new Date(periodStart),
                    lte: new Date(periodEnd)
                }
            },
            include: { items: true },
            orderBy: { invoiceDate: 'asc' }
        });

        const b2bEntries: B2BEntry[] = [];
        const hsnMap = new Map<string, HSNSummary>();
        let totalTaxable = 0, totalCGST = 0, totalSGST = 0, totalIGST = 0, totalTax = 0;

        for (const raw of invoiceRecords) {
            // Reconstruct domain model
            const invoice = new Invoice(
                raw.id, raw.userId, raw.vendorGstin,
                Number(raw.totalAmount), raw.invoiceDate,
                raw.status as DocumentStatus
            );
            for (const item of raw.items) {
                invoice.addItem(new InvoiceItem(
                    item.id, item.description, item.hsnCode,
                    Number(item.amount), Number(item.gstRate)
                ));
            }

            // Calculate tax for this invoice
            const taxBreakdown: TaxBreakdown = await this.taxEngine.calculateTax(invoice);

            // Build B2B entry
            b2bEntries.push({
                vendorGstin: invoice.getVendorGstin(),
                invoiceId: invoice.getId(),
                invoiceDate: invoice.getInvoiceDate().toISOString(),
                totalTaxable: taxBreakdown.totalTaxable,
                cgst: taxBreakdown.totalCGST,
                sgst: taxBreakdown.totalSGST,
                igst: taxBreakdown.totalIGST,
                totalInvoiceValue: taxBreakdown.grandTotal
            });

            // Accumulate HSN summary
            for (const taxItem of taxBreakdown.items) {
                const key = taxItem.hsnCode || "UNKNOWN";
                const existing = hsnMap.get(key);
                if (existing) {
                    existing.totalTaxable += taxItem.taxableAmount;
                    existing.totalTax += taxItem.totalTax;
                    existing.quantity += 1;
                } else {
                    hsnMap.set(key, {
                        hsnCode: taxItem.hsnCode,
                        description: taxItem.description,
                        totalTaxable: taxItem.taxableAmount,
                        totalTax: taxItem.totalTax,
                        quantity: 1
                    });
                }
            }

            totalTaxable += taxBreakdown.totalTaxable;
            totalCGST += taxBreakdown.totalCGST;
            totalSGST += taxBreakdown.totalSGST;
            totalIGST += taxBreakdown.totalIGST;
            totalTax += taxBreakdown.totalTax;
        }

        return {
            id: `GSTR1-${userId.substring(0, 8)}-${Date.now()}`,
            userId,
            periodStart,
            periodEnd,
            generatedAt: new Date().toISOString(),
            b2b: b2bEntries,
            hsnSummary: Array.from(hsnMap.values()).map(h => ({
                ...h,
                totalTaxable: Math.round(h.totalTaxable * 100) / 100,
                totalTax: Math.round(h.totalTax * 100) / 100
            })),
            totalTaxLiability: {
                totalTaxable: Math.round(totalTaxable * 100) / 100,
                totalCGST: Math.round(totalCGST * 100) / 100,
                totalSGST: Math.round(totalSGST * 100) / 100,
                totalIGST: Math.round(totalIGST * 100) / 100,
                totalTax: Math.round(totalTax * 100) / 100
            },
            invoiceCount: invoiceRecords.length,
            status: "GENERATED"
        };
    }
}
