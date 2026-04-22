import { Request, Response } from "express";
import { ReportService } from "../services/ReportService";
import { FilingService } from "../services/FilingService";

export class ReportController {
    private reportService: ReportService;
    private filingService: FilingService;

    constructor(reportService: ReportService, filingService: FilingService) {
        this.reportService = reportService;
        this.filingService = filingService;
    }

    /**
     * POST /api/reports/gstr1
     * Generate a GSTR-1 report for a given period.
     * Body: { periodStart: string, periodEnd: string }
     */
    public async generateGSTR1(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id;
            const { periodStart, periodEnd } = req.body;

            if (!periodStart || !periodEnd) {
                res.status(400).json({ error: "Missing required fields: periodStart, periodEnd" });
                return;
            }

            const report = await this.reportService.generateGSTR1(userId, periodStart, periodEnd);

            res.status(200).json({
                message: "GSTR-1 report generated successfully",
                data: report
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * POST /api/reports/file
     * File the generated GSTR-1 report to the (mock) Government portal.
     * Body: { report: GSTR1Report }
     */
    public async fileReturn(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id;
            const { report } = req.body;

            if (!report) {
                res.status(400).json({ error: "Missing required field: report" });
                return;
            }

            const result = await this.filingService.fileReturn(userId, report);

            res.status(result.success ? 200 : 400).json({
                message: result.message,
                data: result
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
