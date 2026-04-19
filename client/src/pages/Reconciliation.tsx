import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RefreshCcw, CheckCircle2, AlertTriangle, FileText, TextSelect } from 'lucide-react';
import { finopsApi } from '../services/finopsApi';

export const Reconciliation = () => {
  const queryClient = useQueryClient();
  const [reconState, setReconState] = useState<'idle' | 'running' | 'success' | 'anomaly'>('idle');

  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedNarration, setSelectedNarration] = useState<string>('');

  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: finopsApi.getInvoices,
  });

  const { data: transactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: finopsApi.getTransactions,
  });

  const uniqueNarrations = Array.from(
    new Set(
      transactions
        ?.filter(t => t.status !== 'RECONCILED' && t.type === 'CREDIT' && t.description)
        .map(t => t.description || '')
    )
  ).filter(n => n.trim() !== '');

  const selectedInvoice = invoices?.find(i => i.id === selectedInvoiceId);
  const expectedAmount = selectedInvoice ? parseFloat(selectedInvoice.totalAmount.toString()) : 0;
  
  const narrationTransactions = transactions?.filter(t => t.description === selectedNarration && t.status !== 'RECONCILED' && t.type === 'CREDIT') || [];
  const narrationBucketAmount = narrationTransactions.reduce((acc, t) => acc + parseFloat(t.amount.toString()), 0);

  const handleRunReconciliation = async () => {
    if (!selectedInvoiceId || !selectedNarration) return;
    setReconState('running');
    try {
      const res = await finopsApi.runReconciliation(selectedInvoiceId, selectedNarration);
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });

      setTimeout(() => {
        if (res.result === 'MATCH_FOUND') {
          setReconState('success');
        } else {
          setReconState('anomaly');
        }
      }, 500);
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight flex items-center gap-2">
          <RefreshCcw className="w-5 h-5 text-[#0099ff]" />
          Reconciliation Engine
        </h1>
        <p className="text-zinc-400 text-sm mt-1">Map a target invoice against a narration tag group to auto-reconcile subsets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         <Card className="p-8">
           <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
             <FileText className="w-4 h-4 text-zinc-500" /> Target Invoice
           </h3>
           <div className="mt-4">
             {isLoadingInvoices ? (
               <div className="text-sm text-zinc-500">Loading invoices...</div>
             ) : invoices && invoices.length > 0 ? (
               <>
                 <select
                   className="select-dark py-3 rounded-xl"
                   value={selectedInvoiceId}
                   onChange={(e) => setSelectedInvoiceId(e.target.value)}
                   disabled={reconState !== 'idle'}
                 >
                   <option value="">-- Select an Invoice --</option>
                   {invoices.filter(i => i.status !== 'RECONCILED' && i.status !== 'PAID').map((inv) => (
                     <option key={inv.id} value={inv.id || ''}>
                       {inv.vendorGstin} — ₹{parseFloat(inv.totalAmount.toString()).toLocaleString('en-IN')}
                     </option>
                   ))}
                 </select>
                 {selectedInvoice && (
                   <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/5 text-sm flex justify-between items-center">
                     <span className="text-zinc-400">Status</span>
                     <span className={selectedInvoice.status === 'FLAGGED' ? 'text-rose-400 font-medium' : 'text-white font-medium'}>{selectedInvoice.status}</span>
                   </div>
                 )}
               </>
             ) : (
               <div className="text-sm text-zinc-500">No invoices available.</div>
             )}
           </div>
         </Card>

         <Card className="p-8">
           <h3 className="text-sm font-medium text-zinc-300 mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
             <TextSelect className="w-4 h-4 text-zinc-500" /> Remittance Tag
           </h3>
           <div className="mt-4">
             {isLoadingTransactions ? (
               <div className="text-sm text-zinc-500">Mining tags...</div>
             ) : uniqueNarrations.length > 0 ? (
               <>
                 <select
                   className="select-dark py-3 rounded-xl"
                   value={selectedNarration}
                   onChange={(e) => setSelectedNarration(e.target.value)}
                   disabled={reconState !== 'idle'}
                 >
                   <option value="">-- Select Narration Filter --</option>
                   {uniqueNarrations.map((narration) => (
                     <option key={narration} value={narration}>{narration}</option>
                   ))}
                 </select>
                 {selectedNarration && (
                   <div className="mt-4 bg-white/5 p-4 rounded-xl border border-white/5 text-sm flex justify-between items-center">
                     <span className="text-zinc-400">Available Credits</span>
                     <span className="text-[#0099ff] font-medium">{narrationTransactions.length} pending</span>
                   </div>
                 )}
               </>
             ) : (
               <div className="text-sm text-zinc-500">No active strings found.</div>
             )}
           </div>
         </Card>
      </div>

      <Card className="min-h-[280px] flex items-center justify-center p-8 bg-[#0a0d14] border-t-2 border-t-[#0099ff]/50">
        {reconState === 'idle' && (
          <div className="text-center max-w-sm w-full py-8">
            <Button
                onClick={handleRunReconciliation}
                className="w-full h-14 text-base mb-6 tracking-tight font-medium"
                disabled={!selectedInvoiceId || !selectedNarration}
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Execute Combinations
            </Button>
            <p className="text-xs text-zinc-500 font-medium">
              Maps un-reconciled target float against the invoice amount target.
            </p>
          </div>
        )}

        {reconState === 'running' && (
          <div className="text-center">
            <RefreshCcw className="w-10 h-10 text-[#0099ff] animate-spin mx-auto mb-5" />
            <h3 className="text-lg font-semibold text-white tracking-tight">Reconciling Database...</h3>
            <p className="text-sm text-zinc-400 mt-2">Testing float distributions.</p>
          </div>
        )}

        {reconState === 'success' && (
            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-[inset_0_0_50px_rgba(16,185,129,0.05)]">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <h4 className="text-emerald-400 font-bold tracking-tight text-2xl mb-2 flex flex-col md:flex-row items-center gap-3">
                  Match Successful
                  <span className="text-[11px] uppercase font-bold tracking-wider bg-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400">Verified</span>
                </h4>
                <p className="text-zinc-300 text-sm mb-6 max-w-md mx-auto md:mx-0">
                  Total floats successfully balance against invoice target <span className="font-semibold text-white">₹{expectedAmount.toLocaleString('en-IN')}</span>
                </p>
                <Button onClick={resetEngine} variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  Acknowledge
                </Button>
              </div>
            </div>
        )}

        {reconState === 'anomaly' && (
            <div className="w-full bg-rose-500/10 border border-rose-500/20 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center shadow-[inset_0_0_50px_rgba(244,63,94,0.05)]">
              <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-8 h-8 text-rose-500" />
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <h4 className="text-rose-400 font-bold tracking-tight text-2xl mb-2 flex flex-col md:flex-row items-center gap-3">
                  Match Failed
                  <span className="text-[11px] uppercase font-bold tracking-wider bg-rose-500/20 px-2.5 py-1 rounded-full text-rose-400">Anomaly</span>
                </h4>
                <p className="text-zinc-300 text-sm mb-6 max-w-md mx-auto md:mx-0 leading-relaxed">
                  Invoice value <span className="text-white font-medium">₹{expectedAmount.toLocaleString('en-IN')}</span> could not be satisfied. Available tagged sum: <span className="text-white font-medium">₹{narrationBucketAmount.toLocaleString('en-IN')}</span>.
                </p>
                <Button onClick={resetEngine} variant="outline" className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10">
                  Clear & Return
                </Button>
              </div>
            </div>
        )}
      </Card>
    </div>
  );
};
