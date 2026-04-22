import { Request, Response } from "express";
import { AlertRepository } from "../repositories/AlertRepository";

export class AlertController {
    private alertRepo: AlertRepository;

    constructor(alertRepo: AlertRepository) {
        this.alertRepo = alertRepo;
    }

    /**
     * GET /api/alerts
     * Returns all alerts for the authenticated user plus unresolved count.
     */
    public async getAlerts(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user.id;
            const [alerts, unresolvedCount] = await Promise.all([
                this.alertRepo.findByUser(userId),
                this.alertRepo.countUnresolved(userId)
            ]);

            res.status(200).json({
                alerts,
                unresolvedCount
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    /**
     * PATCH /api/alerts/:id/resolve
     * Mark an alert as resolved.
     */
    public async resolveAlert(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const alert = await this.alertRepo.resolve(id);

            res.status(200).json({
                message: "Alert resolved",
                data: alert
            });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}
