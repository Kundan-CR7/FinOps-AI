import { stat } from "node:fs"

export type DocumentStatus = "PENDING" | "VERIFIED" | "FLAGGED" | "RECONCILED"

export abstract class FinancialDocument {
    protected readonly id: string
    protected status: DocumentStatus
    protected readonly createdAt: Date

    constructor(id: string, status: DocumentStatus = "PENDING", createdAt?: Date) {
        this.id = id
        this.status = status
        this.createdAt = createdAt || new Date()
    }

    public getId(): string { return this.id; }
    public getStatus(): DocumentStatus { return this.status; }
    public getCreatedAt(): Date { return this.createdAt; }

    public flagAsAnomaly(): void {
        this.status = "FLAGGED"
    }

    public abstract process(): void
}