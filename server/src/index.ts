import "dotenv/config"
import express from "express"
import transactionRoutes from "./routes/transactionRoutes"
import invoiceRoutes from "./routes/invoiceRoutes"
import reconciliationRoutes from "./routes/reconciliationRoutes"

console.log("DB URL:", process.env.DATABASE_URL)
const app = express()
app.use(express.json())

app.use("/api/transactions", transactionRoutes)
app.use("/api/invoices", invoiceRoutes)
app.use("/api/reconcile", reconciliationRoutes)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`FinOps-AI Backend running on port ${PORT}`)
})