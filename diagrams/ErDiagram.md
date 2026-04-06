# Entity Relationship Diagram

```mermaid
erDiagram
    %% =========================
    %% User & Access Control
    %% =========================
    USERS ||--o{ INVOICES : uploads
    USERS ||--o{ BANK_STATEMENTS : uploads
    USERS ||--o{ ALERTS : receives
    USERS ||--o{ AUDIT_LOGS : performs

    USERS {
        uuid id PK
        string email
        string password_hash
        string role
        timestamp created_at
        timestamp updated_at
        boolean is_active
    }

    %% =========================
    %% Core Financial Documents
    %% =========================
    INVOICES ||--|{ INVOICE_ITEMS : contains
    INVOICES ||--o{ ALERTS : triggers
    INVOICES ||--o{ RECONCILIATIONS : reconciled_in
    INVOICES ||--o{ AUDIT_LOGS : logs

    INVOICES {
        uuid id PK
        uuid user_id FK
        string vendor_gstin
        decimal total_amount
        string status
        date invoice_date
        timestamp created_at
        timestamp updated_at
    }

    INVOICE_ITEMS }|--|| TAX_RULES : validated_against

    INVOICE_ITEMS {
        uuid id PK
        uuid invoice_id FK
        string description
        string hsn_code
        decimal amount
        decimal gst_rate
    }

    %% =========================
    %% Bank & Reconciliation
    %% =========================
    BANK_STATEMENTS ||--|{ BANK_TRANSACTIONS : contains
    BANK_TRANSACTIONS ||--o{ RECONCILIATIONS : matched_with

    BANK_STATEMENTS {
        uuid id PK
        uuid user_id FK
        string account_number
        date period_start
        date period_end
        timestamp created_at
    }

    BANK_TRANSACTIONS {
        uuid id PK
        uuid statement_id FK
        date transaction_date
        decimal amount
        string type
        string narration
    }

    RECONCILIATIONS {
        uuid id PK
        uuid invoice_id FK
        uuid transaction_id FK
        string status
        timestamp matched_at
    }

    %% =========================
    %% Tax Rules (Versioned)
    %% =========================
    TAX_RULES {
        uuid id PK
        string hsn_code
        decimal gst_rate
        string rule_description
        date effective_from
        date effective_to
        boolean is_active
    }

    %% =========================
    %% Alerts & Monitoring
    %% =========================
    ALERTS {
        uuid id PK
        uuid user_id FK
        uuid invoice_id FK
        string severity
        string message
        boolean is_resolved
        timestamp created_at
    }

    %% =========================
    %% Audit Trail (Generic)
    %% =========================
    AUDIT_LOGS {
        uuid id PK
        uuid user_id FK
        string entity_type
        uuid entity_id
        string action
        timestamp created_at
    }