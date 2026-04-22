import { Request, Response } from "express";
import { TaxEngine } from "../services/TaxEngine";
import { TaxRuleRepository } from "../repositories/TaxRuleRepository";
import { IInvoiceRepository } from "../repositories/IInvoiceRepository";

export class TaxController {
    private taxEngine: TaxEngine;
    private taxRuleRepo: TaxRuleRepository;
    private invoiceRepo: IInvoiceRepository;

    constructor(taxEngine: TaxEngine, taxRuleRepo: TaxRuleRepository, invoiceRepo: IInvoiceRepository) {
        this.taxEngine = taxEngine;
        this.taxRuleRepo = taxRuleRepo;
        this.invoiceRepo = invoiceRepo;
    }

    /**
     * GET /api/tax/calculate/:invoiceId
     * Returns a full CGST/SGST/IGST breakdown for the given invoice.
     */
    public async calculateTax(req: Request, res: Response): Promise<void> {
        try {
            const invoiceId = req.params.invoiceId as string;
            const invoice = await this.invoiceRepo.findById(invoiceId);

            if (!invoice) {
                res.status(404).json({ error: "Invoice not found" });
                return;
            }

            const breakdown = await this.taxEngine.calculateTax(invoice);
            res.status(200).json(breakdown);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * GET /api/tax/compliance/:invoiceId
     * Check if the invoice meets current tax rules.
     */
    public async checkCompliance(req: Request, res: Response): Promise<void> {
        try {
            const invoiceId = req.params.invoiceId as string;
            const invoice = await this.invoiceRepo.findById(invoiceId);

            if (!invoice) {
                res.status(404).json({ error: "Invoice not found" });
                return;
            }

            const result = await this.taxEngine.checkCompliance(invoice);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * GET /api/tax/rules
     * List all active tax rules (for Admin).
     */
    public async getRules(req: Request, res: Response): Promise<void> {
        try {
            const rules = await this.taxRuleRepo.findAll();
            res.status(200).json(rules);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * POST /api/tax/rules
     * Create a new tax rule (Admin only).
     */
    public async createRule(req: Request, res: Response): Promise<void> {
        try {
            const { hsnCode, gstRate, ruleDescription, effectiveFrom } = req.body;

            if (!hsnCode || gstRate === undefined || !ruleDescription || !effectiveFrom) {
                res.status(400).json({ error: "Missing required fields: hsnCode, gstRate, ruleDescription, effectiveFrom" });
                return;
            }

            const rule = await this.taxRuleRepo.create({
                hsnCode,
                gstRate: Number(gstRate),
                ruleDescription,
                effectiveFrom
            });

            res.status(201).json({ message: "Tax rule created", data: rule });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
