import { AlertRepository } from "../repositories/AlertRepository";

export class NotificationService {
    private readonly alertRepo: AlertRepository;

    constructor(alertRepo: AlertRepository) {
        this.alertRepo = alertRepo;
    }

    /**
     * Creates an alert record in the database and logs it.
     * This is the Observer in the Observer Pattern — called whenever
     * an anomaly is detected across the system (reconciliation, validation, tax check).
     */
    public async sendAlert(
        userId: string,
        severity: "HIGH" | "MEDIUM" | "LOW",
        message: string,
        invoiceId?: string
    ): Promise<void> {
        await this.alertRepo.create({
            userId,
            invoiceId,
            severity,
            message
        });

        console.log(`[ALERT] ${severity} | User: ${userId} | ${message}`);

        // Future extension: email/SMS/webhook notifications can be added here
    }
}
