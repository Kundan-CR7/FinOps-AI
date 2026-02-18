graph TB
    subgraph AI Tax Compliance System

        %% Ingestion Module
        UC1["Upload Invoices"]
        UC2["Sync Bank Statement"]
        UC3["OCR Data Extraction"]
        UC4["Validate Data Quality"]

        %% Core Processing Engine
        UC5["Reconcile Transactions"]
        UC6["Identify Tax Codes"]
        UC7["Calculate Tax Liability"]
        UC8["Detect Anomalies"]
        UC9["Flag Suspicious Vendor"]

        %% Reporting & Filing
        UC10["Generate GSTR-1 Report"]
        UC11["Generate GSTR-3B Report"]
        UC12["Approve & File Return"]
        UC13["View Audit Logs"]

        %% Admin Panel
        UC14["Update Tax Rules"]
        UC15["Manage User Access"]
    end

    Owner((Business Owner))
    Admin((System Admin))
    Govt((Govt Portal - GSTN))

    %% Owner Actions
    Owner --> UC1
    Owner --> UC2
    Owner --> UC12

    %% Ingestion Flow
    UC1 -.->|includes| UC3
    UC3 -.->|includes| UC4
    UC4 -->|triggers| UC5

    %% Core Logic Flow
    UC5 -.->|includes| UC6
    UC6 -.->|includes| UC7

    %% Smart Exception Flow
    UC7 -.->|extended by| UC8
    UC8 -.->|extended by| UC9

    %% Reporting Flow
    UC12 -.->|includes| UC10
    UC12 -.->|includes| UC11
    UC12 -->|API Submission| Govt

    %% Admin Actions
    Admin --> UC14
    Admin --> UC15
    Admin --> UC13
    UC14 -->|updates logic| UC7
