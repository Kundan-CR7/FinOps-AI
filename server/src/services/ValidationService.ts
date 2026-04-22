import { Invoice } from "../domain/Invoice";
import { TaxRuleRepository, TaxRuleRecord } from "../repositories/TaxRuleRepository";

export interface ValidationError {
    itemDescription: string;
    hsnCode: string;
    field: string;
    expected: string | number;
    actual: string | number;
    message: string;
}

export interface ValidationWarning {
    itemDescription: string;
    hsnCode: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}

export class ValidationService {
    private readonly taxRuleRepo: TaxRuleRepository;

    constructor(taxRuleRepo: TaxRuleRepository) {
        this.taxRuleRepo = taxRuleRepo;
    }

    public async validateInvoice(invoice: Invoice): Promise<ValidationResult> {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        const items = invoice.getItems();

        for (const item of items) {
            const hsnCode = item.getHsnCode();

            // Skip items without valid HSN codes
            if (!hsnCode || hsnCode === "NOT_FOUND" || hsnCode === "0000") {
                warnings.push({
                    itemDescription: item.getDescription(),
                    hsnCode,
                    message: `HSN code missing or invalid. Tax validation skipped for this item.`
                });
                continue;
            }

            // Look up the applicable tax rule for this HSN code
            const taxRule: TaxRuleRecord | null = await this.taxRuleRepo.findByHsnCode(hsnCode);

            if (!taxRule) {
                warnings.push({
                    itemDescription: item.getDescription(),
                    hsnCode,
                    message: `No tax rule found for HSN code "${hsnCode}". Cannot validate GST rate.`
                });
                continue;
            }

            // Compare the invoice item's GST rate with the tax rule's rate
            const itemGstRate = item.getGstRate();
            const ruleGstRate = taxRule.gstRate;

            if (Math.abs(itemGstRate - ruleGstRate) > 0.01) {
                errors.push({
                    itemDescription: item.getDescription(),
                    hsnCode,
                    field: "gstRate",
                    expected: ruleGstRate,
                    actual: itemGstRate,
                    message: `GST rate mismatch: invoice has ${itemGstRate}% but rule "${taxRule.ruleDescription}" requires ${ruleGstRate}% for HSN ${hsnCode}`
                });
            }
        }

        // If there are validation errors, flag the invoice
        if (errors.length > 0) {
            invoice.flagAsAnomaly();
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }
}
