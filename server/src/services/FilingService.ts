import { randomUUID } from "crypto";
import { GSTR1Report } from "./ReportService";
import { AuditLogRepository } from "../repositories/AuditLogRepository";

export interface FilingResult {
    success: boolean;
    acknowledgmentNumber: string;
    filedAt: string;
    reportId: string;
    message: string;
}

export class FilingService {
    private readonly auditLogRepo: AuditLogRepository;

    constructor(auditLogRepo: AuditLogRepository) {
        this.auditLogRepo = auditLogRepo;
    }

    /**
     * Mock filing to the Government GST Portal.
     * Validates the report structure and returns a simulated acknowledgment.
     */
    public async fileReturn(userId: string, report: GSTR1Report): Promise<FilingResult> {
        // Validate the report has required data
        if (!report.b2b || report.b2b.length === 0) {
            return {
                success: false,
                acknowledgmentNumber: "",
                filedAt: new Date().toISOString(),
                reportId: report.id,
                message: "Filing rejected: Report contains no B2B transactions."
            };
        }

        if (report.totalTaxLiability.totalTax <= 0) {
            return {
                success: false,
                acknowledgmentNumber: "",
                filedAt: new Date().toISOString(),
                reportId: report.id,
                message: "Filing rejected: Total tax liability must be positive."
            };
        }

        // Simulate government portal processing
        const acknowledgmentNumber = `ACK-${new Date().getFullYear()}${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${randomUUID().substring(0, 8).toUpperCase()}`;

        // Log the filing action in the audit trail
        await this.auditLogRepo.create({
            userId,
            entityType: "GSTR1_REPORT",
            entityId: report.id,
            action: `FILED — Ack#: ${acknowledgmentNumber}, Period: ${report.periodStart} to ${report.periodEnd}, Tax: ₹${report.totalTaxLiability.totalTax}`
        });

        return {
            success: true,
            acknowledgmentNumber,
            filedAt: new Date().toISOString(),
            reportId: report.id,
            message: `GSTR-1 return filed successfully. Acknowledgment: ${acknowledgmentNumber}`
        };
    }
}
