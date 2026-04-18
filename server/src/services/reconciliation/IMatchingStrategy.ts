import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";

export interface IMatchingStrategy {
    findMatches(invoice: Invoice, transactions: Transaction[]): Transaction[] | null;
}