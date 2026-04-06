# Sequence Diagram: Autonomous Invoice Processing

```mermaid
sequenceDiagram
    autonumber
    
    actor U as Business Owner
    participant API as API Gateway
    participant Q as Job Queue (RabbitMQ)
    participant Worker as AI Worker (Python)
    participant DB as Database (PostgreSQL)
    participant Alert as Notification Service

    Note over U, API: Step 1: Ingestion
    U->>API: POST /upload-invoice (PDF)
    activate API
    API->>Q: Add Job: "process_inv_101"
    API-->>U: Return 202 "Processing Started"
    deactivate API

    Note over Q, Worker: Step 2: Async Processing
    Q->>Worker: Consume Job
    activate Worker
    Worker->>Worker: Run OCR Extraction
    
    Worker->>DB: Fetch Tax Rules (Vector Search)
    activate DB
    DB-->>Worker: Returns {GST: 18%, TDS: 10%}
    deactivate DB

    Note over Worker, DB: Step 3: Logic Check
    alt Data Matches Rules
        Worker->>DB: Save Transaction (Status: Verified)
    else Mismatch Detected (e.g. 86k Loss)
        Worker->>DB: Save Transaction (Status: Flagged)
        Worker->>Alert: Trigger High Priority Alert
        Alert-->>U: SMS: "Discrepancy found in Inv #101"
    end
    deactivate Worker