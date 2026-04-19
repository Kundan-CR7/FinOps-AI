import "dotenv/config"
import express from "express"
import cors from "cors"
import transactionRoutes from "./routes/transactionRoutes"
import invoiceRoutes from "./routes/invoiceRoutes"
import reconciliationRoutes from "./routes/reconciliationRoutes"
import authRoutes from "./routes/authRoutes"


const app = express()

// Skip JSON body parsing for multipart requests so multer can read the stream
app.use((req, res, next) => {
    if (req.headers['content-type']?.startsWith('multipart/form-data')) {
        return next()
    }
    express.json()(req, res, next)
})

app.use(cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}))

app.use("/api/transactions", transactionRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/reconcile", reconciliationRoutes)
app.use("/api/auth", authRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`FinOps-AI Backend running on port ${PORT}`)
})