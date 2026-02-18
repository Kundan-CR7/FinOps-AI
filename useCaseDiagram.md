# Use Case Diagram

```mermaid
usecaseDiagram
    actor "Business Owner" as Owner
    actor "System Admin" as Admin
    actor "Govt Portal (GSTN)" as Govt

    package "Ingestion Module" {
        usecase "Upload Invoices" as UC1
        usecase "Sync Bank Statement" as UC2
        usecase "OCR Data Extraction" as UC3
        usecase "Validate Data Quality" as UC4
    }

    package "Core Processing Engine" {
        usecase "Reconcile Transactions" as UC5
        usecase "Identify Tax Codes" as UC6
        usecase "Calculate Tax Liability" as UC7
        usecase "Detect Anomalies" as UC8
        usecase "Flag Suspicious Vendor" as UC9
    }

    package "Reporting & Filing" {
        usecase "Generate GSTR-1 Report" as UC10
        usecase "Generate GSTR-3B Report" as UC11
        usecase "Approve & File Return" as UC12
        usecase "View Audit Logs" as UC13
    }

    package "Admin Panel" {
        usecase "Update Tax Rules" as UC14
        usecase "Manage User Access" as UC15
    }

    %% Relationships - Ingestion
    Owner --> UC1
    Owner --> UC2
    UC1 ..> UC3 : <<include>>
    UC3 ..> UC4 : <<include>>
    UC4 --> UC5 : "Triggers"

    %% Relationships - Core Logic
    UC5 ..> UC6 : <<include>>
    UC6 ..> UC7 : <<include>>
    
    %% Exception Handling (The "Smart" Part)
    UC7 <.. UC8 : <<extend>>
    UC8 <.. UC9 : <<extend>>

    %% Reporting
    Owner --> UC12
    UC12 ..> UC10 : <<include>>
    UC12 ..> UC11 : <<include>>
    UC12 --> Govt : "API Submission"

    %% Admin Tasks
    Admin --> UC14
    Admin --> UC15
    UC14 --> UC7 : "Updates Logic"
    Admin --> UC13