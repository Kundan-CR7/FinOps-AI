"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentExtractionService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
if (!apiKey) {
    throw new Error("API KEY is missing");
}
class DocumentExtractionService {
    async extractInvoiceData(fileBuffer, mimeType) {
        console.log("Text extraction initiated!");
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });
        const imageParts = [{
                inlineData: {
                    data: fileBuffer.toString("base64"),
                    mimeType: mimeType
                }
            }];
        const prompt = `
            You are an expert financial data extraction AI.
            Analyze the attached invoice image/document. 
            Extract the data and return it in this EXACT JSON format:
            {
              "vendorGstin": "string (extract the 15 character GSTIN, or return 'NOT_FOUND')",
              "totalAmount": number (the final grand total of the invoice),
              "invoiceDate": "ISO 8601 date string (e.g., 2023-10-15T00:00:00Z)",
              "items": [
                {
                  "description": "string",
                  "hsnCode": "string (if not found, return 'NOT_FOUND')",
                  "amount": number (price before tax),
                  "gstRate": number (the tax percentage, e.g., 18)
                }
              ]
            }
            Do not include any markdown, just the raw JSON object.
        `;
        try {
            const result = await model.generateContent([prompt, ...imageParts]);
            const responseText = result.response.text();
            const extractedData = JSON.parse(responseText);
            console.log(extractedData);
            return extractedData;
        }
        catch (error) {
            console.log("AI Extraction Failed:", error);
            throw new Error("Failed to extract data from document.");
        }
    }
}
exports.DocumentExtractionService = DocumentExtractionService;
