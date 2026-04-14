import { Invoice } from "../../domain/Invoice";
import { Transaction } from "../../domain/Transaction";

export interface IMatchingStrategy{
    isMatch(invoice: Invoice, transaction: Transaction):boolean
}