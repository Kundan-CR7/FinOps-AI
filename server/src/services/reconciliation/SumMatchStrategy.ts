import { IMatchingStrategy } from "./IMatchingStrategy";
import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";

export class SumMatchStrategy implements IMatchingStrategy {
    public findMatches(invoice: Invoice, transactions: Transaction[]): Transaction[] | null {
        const isStatusValid = invoice.getStatus() === "VERIFIED" || invoice.getStatus() === "EXTRACTED";
        if (!isStatusValid) return null;

        // Only look at pending credits (ignoring debits which are outflows)
        const pendingCredits = transactions.filter(t => t.getStatus() === "PENDING" && t.getType() === "CREDIT");
        
        if (pendingCredits.length === 0) return null;

        const targetAmount = invoice.getTotalAmount();
        
        // Find a subset that perfectly sums to the target amount
        const result = this.findSubsetSum(pendingCredits, targetAmount);
        
        return result.length > 0 ? result : null;
    }

    private findSubsetSum(transactions: Transaction[], target: number, index: number = 0, currentSubset: Transaction[] = []): Transaction[] {
        // Base case: check if current subset sums to exactly the target
        const currentSum = currentSubset.reduce((acc, curr) => acc + curr.getAmount(), 0);
        
        // Allow a tiny margin of error for floating point precision
        if (Math.abs(currentSum - target) < 0.01) {
            return currentSubset;
        }

        // Optimization: if we've exceeded the target, no need to keep adding (assuming all positive amounts)
        if (currentSum > target) {
            return [];
        }

        // Exhausted array
        if (index >= transactions.length) {
            return [];
        }

        // Recursive Case 1: Include the current transaction
        const includeResult = this.findSubsetSum(transactions, target, index + 1, [...currentSubset, transactions[index]]);
        if (includeResult.length > 0) return includeResult;

        // Recursive Case 2: Exclude the current transaction
        const excludeResult = this.findSubsetSum(transactions, target, index + 1, currentSubset);
        if (excludeResult.length > 0) return excludeResult;

        return [];
    }
}
