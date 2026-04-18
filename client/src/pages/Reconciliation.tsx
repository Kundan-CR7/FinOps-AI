import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshCcw, CheckCircle2, AlertTriangle, FileText, TextSelect } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { finopsApi } from '../services/finopsApi';

export const Reconciliation = () => {
  const queryClient = useQueryClient();
  const [reconState, setReconState] = useState<'idle' | 'running' | 'success' | 'anomaly'>('idle');

  // Selected Entities State
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedNarration, setSelectedNarration] = useState<string>('');

  // Fetching live DB entities
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: finopsApi.getInvoices,
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: finopsApi.getTransactions,
  });

  // Extract unique un-reconciled credit narrations
  const uniqueNarrations = Array.from(
    new Set(
      transactions
        ?.filter(t => t.status !== 'RECONCILED' && t.type === 'CREDIT' && t.description)
        .map(t => t.description || '')
    )
  ).filter(n => n.trim() !== '');

  // Safe Lookups for UI displays
  const selectedInvoice = invoices?.find(i => i.id === selectedInvoiceId);
  const expectedAmount = selectedInvoice ? parseFloat(selectedInvoice.totalAmount.toString()) : 0;
  
  const narrationTransactions = transactions?.filter(t => t.description === selectedNarration && t.status !== 'RECONCILED' && t.type === 'CREDIT') || [];
  const narrationBucketAmount = narrationTransactions.reduce((acc, t) => acc + parseFloat(t.amount.toString()), 0);

  const handleRunReconciliation = async () => {
    if (!selectedInvoiceId || !selectedNarration) return;

    setReconState('running');
    try {
      const res = await finopsApi.runReconciliation(selectedInvoiceId, selectedNarration);

      // Sync Backend State seamlessly to Tanstack tables globally
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      setTimeout(() => {
        if (res.result === 'MATCH_FOUND') {
          setReconState('success');
        } else {
          setReconState('anomaly');
        }
      }, 800);
    } catch {
      setReconState('anomaly');
    }
  };

  const resetEngine = () => {
    setSelectedInvoiceId('');
    setSelectedNarration('');
    setReconState('idle');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <RefreshCcw className="w-6 h-6 text-indigo-600" />
          Combinatorial Reconciliation Engine
        </h1>
        <p className="text-slate-500 text-sm mt-1">Target an Invoice and map it to a specific transaction Narration group.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Invoice Target Container */}
         <Card className="p-6 bg-slate-50/50 border-dashed border-2 flex flex-col min-h-32">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <FileText className="w-4 h-4" /> Target Invoice
           </h3>
           <div className="mt-auto">
             {isLoadingInvoices ? (
               <div className="text-sm text-slate-400 p-2">Loading invoices...</div>
             ) : invoices && invoices.length > 0 ? (
               <>
                 <select
                   className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={selectedInvoiceId}
                   onChange={(e) => setSelectedInvoiceId(e.target.value)}
                   disabled={reconState !== 'idle'}
                 >
                   <option value="">-- Select an Invoice --</option>
                   {invoices.filter(i => i.status !== 'RECONCILED' && i.status !== 'PAID').map((inv) => (
                     <option key={inv.id} value={inv.id || ''}>
                       {inv.vendorGstin} — ₹{parseFloat(inv.totalAmount.toString()).toLocaleString()}
                     </option>
                   ))}
                 </select>
                 {selectedInvoice && (
                   <p className="text-xs text-slate-500 mt-2 font-mono break-all">
                     Status: {selectedInvoice.status} | Date: {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                   </p>
                 )}
               </>
             ) : (
               <div className="bg-white p-4 rounded-lg flex justify-between items-center text-slate-400 border border-slate-100">
                 <span className="text-sm">No invoices found. Upload one first.</span>
               </div>
             )}
           </div>
         </Card>

         {/* Narration String Group Container */}
         <Card className="p-6 bg-slate-50/50 border-dashed border-2 flex flex-col min-h-32">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
             <TextSelect className="w-4 h-4" /> Target Narration Subgroup
           </h3>
           <div className="mt-auto">
             {isLoadingTransactions ? (
               <div className="text-sm text-slate-400 p-2">Mining transaction tags...</div>
             ) : uniqueNarrations.length > 0 ? (
               <>
                 <select
                   className="w-full bg-white border border-slate-200 rounded-lg p-3 text-slate-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   value={selectedNarration}
                   onChange={(e) => setSelectedNarration(e.target.value)}
                   disabled={reconState !== 'idle'}
                 >
                   <option value="">-- Select a Narration Link --</option>
                   {uniqueNarrations.map((narration) => (
                     <option key={narration} value={narration}>
                       "{narration}"
                     </option>
                   ))}
                 </select>
                 {selectedNarration && (
                   <p className="text-xs text-slate-500 mt-2 font-mono break-all">
                     Tag maps to {narrationTransactions.length} pending credits mathematically available.
                   </p>
                 )}
               </>
             ) : (
               <div className="bg-white p-4 rounded-lg flex justify-between items-center text-slate-400 border border-slate-100">
                 <span className="text-sm">No uniquely tagged transactions found.</span>
               </div>
             )}
           </div>
         </Card>
      </div>

      <Card className="border-t-4 border-t-indigo-500 shadow-md">
        <div className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px]">

          <AnimatePresence mode="wait">
            {reconState === 'idle' && (
              <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-center flex flex-col items-center">
                <Button
                    onClick={handleRunReconciliation}
                    size="lg"
                    disabled={!selectedInvoiceId || !selectedNarration}
                    className="h-14 px-8 text-lg rounded-xl shadow-lg shadow-indigo-600/20 disabled:shadow-none disabled:bg-slate-200"
                >
                  <RefreshCcw className="w-5 h-5 mr-3" />
                  Run Tagged Match
                </Button>
                <p className="text-sm text-slate-400 mt-4 max-w-md">
                  Select an invoice and a Narration tag above. The AI sweeps through all un-reconciled transactions sharing this textual reference and tests combination targets.
                </p>
              </motion.div>
            )}

            {reconState === 'running' && (
              <motion.div key="running" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} exit={{opacity:0}} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center relative mb-6 border border-indigo-100">
                  <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
                  <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-2xl animate-ping shrink-0" />
                </div>
                <h3 className="text-xl font-semibold text-indigo-900 mb-1">Testing array combinations...</h3>
                <p className="text-indigo-600/80 text-sm">Targeting combinatorial subsets matching the narration filter.</p>
              </motion.div>
            )}

            {reconState === 'success' && (
               <motion.div key="success" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-8 relative overflow-hidden text-left shadow-sm">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-100 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none"></div>
                 <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-16 h-16 bg-emerald-100/80 rounded-full flex items-center justify-center border border-emerald-200 shrink-0 shadow-sm shadow-emerald-200/50">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="flex-1 w-full">
                      <h4 className="text-emerald-900 font-bold text-2xl mb-2 flex items-center gap-3">
                        SUBSET MATCH FOUND
                        <span className="text-emerald-800 font-medium text-xs bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 shadow-sm whitespace-nowrap">Auto-Reconciled</span>
                      </h4>
                      <p className="text-emerald-800/80 text-sm md:text-base mb-6 max-w-md">Payments tagged precisely with "{selectedNarration}" mathematically balance your target liability. Invoice marked as PAID and transactions as MATCHED.</p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white/60 p-4 rounded-lg border border-emerald-100 text-sm w-max">
                        <div>
                            <span className="block text-xs uppercase text-slate-500 font-medium mb-0.5">Invoice Target Match</span>
                            <span className="font-semibold text-slate-800 text-lg">₹{expectedAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-8">
                        <Button variant="outline" className="bg-white border-emerald-200 hover:bg-emerald-50 text-emerald-700" onClick={resetEngine}>
                          Review Next Pair
                        </Button>
                      </div>
                    </div>
                 </div>
               </motion.div>
            )}

            {reconState === 'anomaly' && (
               <motion.div key="anomaly" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="w-full bg-rose-50 border border-rose-200 rounded-xl p-8 relative overflow-hidden text-left shadow-sm">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-rose-100 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none"></div>
                 <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center border border-rose-200 shrink-0 shadow-sm shadow-rose-200/50">
                      <AlertTriangle className="w-8 h-8 text-rose-600 fill-rose-100" />
                    </div>
                    <div className="flex-1 w-full">
                      <h4 className="text-rose-900 font-bold text-2xl mb-2">TARGET UNFULFILLED</h4>
                      <p className="text-rose-800/80 text-sm md:text-base mb-6 max-w-md">No permutation of the transactions mapped to "{selectedNarration}" aggregates to exactly ₹{expectedAmount.toLocaleString()}.</p>

                      <div className="bg-white/80 p-5 rounded-lg border border-rose-200 flex flex-col sm:flex-row gap-6 sm:items-center justify-between shadow-sm">
                        <div>
                           <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Required Exact Match</p>
                           <p className="font-semibold text-slate-800 text-xl">₹{expectedAmount.toLocaleString()}</p>
                        </div>
                        <div className="hidden sm:block text-rose-400 font-bold px-4">VS</div>
                        <div>
                           <p className="text-rose-500/80 text-xs font-semibold uppercase tracking-wider mb-1">Available Tagged Float</p>
                           <p className="font-semibold text-rose-600 text-xl">₹{narrationBucketAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-3">
                        <Button variant="outline" className="bg-white border-rose-200 hover:bg-rose-50 text-rose-700" onClick={resetEngine}>
                          Unpair Selection
                        </Button>
                      </div>
                    </div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

        </div>
      </Card>
    </div>
  );
};
