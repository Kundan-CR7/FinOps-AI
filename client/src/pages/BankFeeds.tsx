import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { finopsApi } from '../services/finopsApi';

export const BankFeeds = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: finopsApi.getTransactions,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Bank Feeds</h1>
          <p className="text-zinc-400 text-sm mt-1">Live statement ingestion and manual reconciliation overrides.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-xs font-medium text-zinc-300 border border-white/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0099ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0099ff]"></span>
            </span>
            Live Sync
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 shrink-0 border-white/10" variant="outline">
            <Plus className="w-4 h-4" /> Add Entry
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center text-zinc-500">Loading feeds...</td></tr>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-zinc-400 whitespace-nowrap text-xs">
                      {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-zinc-200">{txn.description}</p>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{txn.id.substring(0,10)}...</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border flex-shrink-0 whitespace-nowrap w-max ${
                        txn.type === 'CREDIT' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-white/5 text-zinc-300 border-white/10'
                      }`}>
                        {txn.type === 'CREDIT' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`status-badge border ${
                        txn.status === 'MATCHED' || txn.status === 'RECONCILED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : txn.status === 'FLAGGED'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-white/5 text-zinc-400 border-white/10'
                      }`}>
                        {txn.status || 'PENDING'}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-medium tabular-nums ${
                      txn.type === 'CREDIT' ? 'text-emerald-400' : 'text-white'
                    }`}>
                      {txn.type === 'CREDIT' ? '+ ' : '- '}₹{parseFloat(txn.amount.toString()).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-500">
                    <Plus className="w-8 h-8 mx-auto mb-3 text-zinc-600" />
                    <p className="text-sm">No transactions synced yet.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && <ManualEntryModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

const manualEntrySchema = z.object({
  description: z.string().min(2, "Description is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Amount must be positive"),
  transactionDate: z.string().min(1, "Date is required"),
  type: z.enum(['CREDIT', 'DEBIT']),
});

type ManualEntryForm = z.infer<typeof manualEntrySchema>;

const ManualEntryModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ManualEntryForm>({
    resolver: zodResolver(manualEntrySchema),
    defaultValues: {
      type: 'CREDIT',
      transactionDate: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ManualEntryForm) => {
    setIsSubmitting(true);
    try {
      await finopsApi.addTransaction(data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      onClose();
    } catch { } 
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#0f1115] rounded-3xl shadow-2xl w-full max-w-lg border border-white/10 flex flex-col max-h-[90vh]">
        <div className="px-8 py-6 border-b border-white/5">
          <h2 className="text-xl font-bold tracking-tight text-white">Add Transaction</h2>
          <p className="text-sm text-zinc-400 mt-1">Inject a bank entry.</p>
        </div>
        
        <div className="overflow-y-auto px-8 py-6">
          <form id="manualEntryForm" onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
              <input
                {...register('description')}
                className="input-dark"
                placeholder="AWS Cloud bill, NEFT Inward..."
              />
              {errors.description && <p className="text-xs text-rose-400 mt-2 ml-4">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  className="input-dark"
                  placeholder="0.00"
                />
                {errors.amount && <p className="text-xs text-rose-400 mt-2 ml-4">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Type</label>
                <select {...register('type')} className="select-dark">
                  <option value="CREDIT">Credit (+ In)</option>
                  <option value="DEBIT">Debit (- Out)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Transaction Date</label>
              <input
                type="date"
                {...register('transactionDate')}
                className="input-dark"
              />
              {errors.transactionDate && <p className="text-xs text-rose-400 mt-2 ml-4">{errors.transactionDate.message}</p>}
            </div>
          </form>
        </div>
        
        <div className="px-8 py-5 border-t border-white/5 flex gap-3 flex-row-reverse bg-white/[0.02]">
           <Button type="submit" form="manualEntryForm" isLoading={isSubmitting}>
             Add Transaction
           </Button>
           <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};
