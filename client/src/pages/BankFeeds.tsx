import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { finopsApi } from '../services/finopsApi';

export const BankFeeds = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: finopsApi.getTransactions,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Bank Feeds</h1>
          <p className="text-slate-500 text-sm mt-1">Live statement ingestion and manual reconciliation overrides.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-medium text-slate-600 border border-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live Sync: Active
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 border-indigo-600 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> Add Manual Entry
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={4} className="py-8 text-center text-slate-400">Loading feeds...</td></tr>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{new Date(txn.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{txn.description}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">{txn.id.substring(0,8)}...</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 flex w-max items-center justify-center rounded text-[10px] uppercase font-bold tracking-wider border ${
                        txn.type === 'CREDIT' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${
                      txn.type === 'CREDIT' ? 'text-emerald-600' : 'text-slate-700'
                    }`}>
                      {txn.type === 'CREDIT' ? '+ ' : '- '}₹{txn.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={4} className="py-12 text-center text-slate-400">
                     No transactions synced yet. Click the "Add Manual Entry" button.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {isModalOpen && <ManualEntryModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
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
      type: 'DEBIT',
      transactionDate: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ManualEntryForm) => {
    setIsSubmitting(true);
    try {
      await finopsApi.addTransaction(data);
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      onClose();
    } catch (e) {
       // Catch boundary handled by toast network interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100"
      >
        <div className="flex flex-col h-full max-h-[90vh]">
          <div className="p-6 pb-2">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Add Manual Transaction</h2>
            <p className="text-sm text-slate-500 mb-6 font-medium">Inject a custom bank entry envelope directly mapped to your active tracking configuration.</p>
          </div>
          
          <div className="overflow-y-auto px-6 pb-6">
            <form id="manualEntryForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Description / Narration</label>
                <input
                  {...register('description')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  placeholder="AWS Cloud bill, NEFT Inward, etc..."
                />
                {errors.description && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('amount')}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                    placeholder="0.00"
                  />
                  {errors.amount && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.amount.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Type</label>
                  <select
                    {...register('type')}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white transition-colors"
                  >
                    <option value="CREDIT">Credit (+ In)</option>
                    <option value="DEBIT">Debit (- Out)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Transaction Date</label>
                <input
                  type="date"
                  {...register('transactionDate')}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 sm:text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
                {errors.transactionDate && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.transactionDate.message}</p>}
              </div>
            </form>
          </div>
          
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end items-center mt-auto rounded-b-2xl">
             <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
             <Button type="submit" form="manualEntryForm" isLoading={isSubmitting}>
               Add Transaction
             </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
