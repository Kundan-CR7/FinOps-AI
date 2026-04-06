# Use Case Diagram

```mermaid
graph LR
    %% Actors represented as hexagons or special shapes
    User[("Business Owner")]
    Admin[("System Admin")]
    Govt[("Govt Portal")]

    %% Ingestion Module
    subgraph Ingestion [Ingestion Module]
        UC1(Upload Invoices)
        UC2(Sync Bank Statement)
        UC3(OCR Extraction)
        UC4(Validate Data)
    end

    %% Core Logic
    subgraph Core [Core Processing]
        UC5(Reconcile Transactions)
        UC6(Calculate Tax)
        UC7(Detect Anomalies)
    end

    %% Reporting
    subgraph Reports [Reporting]
        UC8(Generate GSTR-1)
        UC9(File Return)
    end

    %% Relationships
    User --> UC1
    User --> UC2
    UC1 --> UC3
    UC3 --> UC4
    UC4 --> UC5
    UC5 --> UC6
    UC6 --> UC7
    
    %% The "Impact" Logic (Your 86k Story)
    UC7 -- "If Error Found" --> Alert{Alert User}
    Alert --> User
    
    %% Filing
    User --> UC9
    UC9 --> Govt
    Admin --> UC6