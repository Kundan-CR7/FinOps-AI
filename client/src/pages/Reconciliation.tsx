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
        <h1 className="text-3xl font-semibold text-text-primary tracking-tight flex items-center gap-2">
          <RefreshCcw className="w-5 h-5 text-text-secondary" />
          Reconciliation Engine
        </h1>
        <p className="text-text-secondary text-sm mt-1">Map a target invoice against a narration tag group to auto-reconcile subsets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         <Card className="p-8">
           <h3 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2 border-b border-white/[0.04] pb-4">
             <FileText className="w-4 h-4 text-text-secondary" /> Target Invoice
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
                   <div className="mt-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] text-sm flex justify-between items-center">
                     <span className="text-text-secondary">Status</span>
                     <span className={selectedInvoice.status === 'FLAGGED' ? 'text-rose-400 font-medium' : 'text-text-primary font-medium'}>{selectedInvoice.status}</span>
                   </div>
                 )}
               </>
             ) : (
               <div className="text-sm text-zinc-500">No invoices available.</div>
             )}
           </div>
         </Card>

         <Card className="p-8">
           <h3 className="text-sm font-medium text-text-secondary mb-4 flex items-center gap-2 border-b border-white/[0.04] pb-4">
             <TextSelect className="w-4 h-4 text-text-secondary" /> Remittance Tag
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
                   <div className="mt-4 bg-white/[0.02] p-4 rounded-xl border border-white/[0.04] text-sm flex justify-between items-center">
                     <span className="text-text-secondary">Available Credits</span>
                      <span className="text-text-primary font-medium">{narrationTransactions.length} pending</span>
                   </div>
                 )}
               </>
             ) : (
               <div className="text-sm text-zinc-500">No active strings found.</div>
             )}
           </div>
         </Card>
      </div>

      <Card className="min-h-[280px] flex items-center justify-center p-8 bg-card border-t border-t-white/[0.04]">
        {reconState === 'idle' && (
          <div className="text-center max-w-sm w-full py-8">
            <Button
                onClick={handleRunReconciliation}
                className="w-full h-14 text-base mb-6 tracking-tight font-medium"
                disabled={!selectedInvoiceId || !selectedNarration}
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Execute Combinations
            </Button>
            <p className="text-xs text-text-secondary font-medium">
              Maps un-reconciled target float against the invoice amount target.
            </p>
          </div>
        )}

        {reconState === 'running' && (
          <div className="text-center">
            <RefreshCcw className="w-10 h-10 text-text-primary animate-spin mx-auto mb-5" />
            <h3 className="text-lg font-semibold text-text-primary tracking-tight">Reconciling Database...</h3>
            <p className="text-sm text-text-secondary mt-2">Testing float distributions.</p>
          </div>
        )}

        {reconState === 'success' && (
            <div className="w-full border border-white/[0.04] rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-14 h-14 rounded-xl border border-white/[0.04] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <h4 className="text-text-primary font-semibold tracking-tight text-xl mb-2 flex flex-col md:flex-row items-center gap-3">
                  Match Successful
                  <span className="text-[10px] uppercase font-semibold tracking-widest border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400">Verified</span>
                </h4>
                <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto md:mx-0">
                  Total floats successfully balance against invoice target <span className="font-medium text-text-primary">₹{expectedAmount.toLocaleString('en-IN')}</span>
                </p>
                <Button onClick={resetEngine} variant="outline">
                  Acknowledge
                </Button>
              </div>
            </div>
        )}

        {reconState === 'anomaly' && (
            <div className="w-full border border-white/[0.04] rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-14 h-14 rounded-xl border border-white/[0.04] flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-400" />
              </div>
              <div className="flex-1 w-full text-center md:text-left">
                <h4 className="text-text-primary font-semibold tracking-tight text-xl mb-2 flex flex-col md:flex-row items-center gap-3">
                  Match Failed
                  <span className="text-[10px] uppercase font-semibold tracking-widest border border-rose-500/20 px-2.5 py-1 rounded-full text-rose-400">Anomaly</span>
                </h4>
                <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto md:mx-0 leading-relaxed">
                  Invoice value <span className="text-text-primary font-medium">₹{expectedAmount.toLocaleString('en-IN')}</span> could not be satisfied. Available tagged sum: <span className="text-text-primary font-medium">₹{narrationBucketAmount.toLocaleString('en-IN')}</span>.
                </p>
                <Button onClick={resetEngine} variant="outline">
                  Clear & Return
                </Button>
              </div>
            </div>
        )}
      </Card>
    </div>
  );
};
