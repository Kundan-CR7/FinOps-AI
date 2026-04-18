import { useMemo,useState } from "react";
import toast, {Toaster} from "react-hot-toast";
import { FinopsService } from "./api/finopsClient";
import { v4 as uuidv4 } from 'uuid';
const newId = uuidv4();

function App(){
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  
  const [userId, setUserId] = useState("")
  const [statementId, setStatementId] = useState("")

  const [invoiceId, setInvoiceId] = useState(`inv-${crypto.randomUUID()}`)
  
}