"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const reconciliationRoutes_1 = __importDefault(require("./routes/reconciliationRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
// Skip JSON body parsing for multipart requests so multer can read the stream
app.use((req, res, next) => {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        return next();
    }
    express_1.default.json()(req, res, next);
});
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
app.use("/api/transactions", transactionRoutes_1.default);
app.use("/api/invoices", invoiceRoutes_1.default);
app.use("/api/reconcile", reconciliationRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.get("/", (req, res) => {
    res.send("Hello Welcome to FinOps-AI");
});
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`FinOps-AI Backend running on port ${PORT}`);
    });
}
exports.default = app;
