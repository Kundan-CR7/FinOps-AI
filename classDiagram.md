# Class Diagram

```mermaid
classDiagram
    %% =========================
    %% Abstract Base Entity
    %% =========================
    class FinancialDocument {
        +UUID id
        +Date uploadDate
        +String status
        +process()
    }

    %% =========================
    %% Core Domain Entities
    %% =========================
    class Invoice {
        +String vendorGSTIN
        +Double totalAmount
        +validate()
    }

    class BankStatement {
        +String accountNumber
    }

    class InvoiceItem {
        +String description
        +Double amount
        +String hsnCode
        +Double gstRate
    }

    class Transaction {
        +UUID id
        +Double amount
        +Date date
        +String type
    }

    class Rule {
        +String ruleName
        +Double gstRate
        +apply()
    }

    class Alert {
        +String severity
        +String message
        +Date createdAt
        +notify()
    }

    %% =========================
    %% Service / Engine Classes
    %% =========================
    class TaxEngine {
        -List~Rule~ taxRules
        +calculateTax(Invoice inv)
        +checkCompliance(Invoice inv)
        +detectAnomaly(Invoice inv)
    }

    class ReconciliationEngine {
        +match(Invoice inv, BankStatement stmt)
    }

    class NotificationService {
        +sendAlert(Alert alert)
    }

    class AuditLog {
        +logEvent(String event)
    }

    %% =========================
    %% Inheritance
    %% =========================
    FinancialDocument <|-- Invoice
    FinancialDocument <|-- BankStatement

    %% =========================
    %% Composition
    %% =========================
    Invoice "1" *-- "*" InvoiceItem : Contains
    BankStatement "1" *-- "*" Transaction : Contains

    %% =========================
    %% Service Dependencies
    %% =========================
    TaxEngine ..> Invoice : Validates
    TaxEngine ..> Rule : Uses
    TaxEngine --> Alert : Creates
    TaxEngine --> AuditLog : Logs

    ReconciliationEngine ..> Invoice : Matches
    ReconciliationEngine ..> BankStatement : Matches

    NotificationService --> Alert : Sends