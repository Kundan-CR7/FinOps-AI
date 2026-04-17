import express from "express"
import transactionRoutes from "./routes/transactionRoutes"
import invoiceRoutes from "./routes/invoiceRoutes"

const app = express()
app.use(express.json())

app.use("/api/transactions",transactionRoutes)
app.use("/api/invoices",invoiceRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT,() => {
    console.log(`FinOps-AI Backend running on port ${PORT}`)
})