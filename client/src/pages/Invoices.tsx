import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { finopsApi } from '../services/finopsApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadCloud, CheckCircle2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Invoices = () => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: finopsApi.getInvoices,
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Invoices</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and extract data from vendor bills.</p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
          <UploadCloud className="w-4 h-4" /> AI Upload Invoice
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Vendor GSTIN</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Loading invoices...</td></tr>
              ) : invoices && invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                        inv.status === 'EXTRACTED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 
                        inv.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-700">{inv.id?.substring(0,8)}...</td>
                    <td className="px-6 py-4 text-slate-600">{inv.vendorGstin}</td>
                    <td className="px-6 py-4 text-slate-600">{new Date(inv.invoiceDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right font-medium text-slate-900">₹{inv.totalAmount.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No invoices found. Try uploading one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AnimatePresence>
        {isUploadModalOpen && (
          <UploadModal onClose={() => setUploadModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// Extracted Sub-component for clarity
const UploadModal = ({ onClose }: { onClose: () => void }) => {
  const queryClient = useQueryClient();
  const [uploadState, setUploadState] = useState<'empty' | 'analyzing' | 'success'>('empty');
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleFileDrop = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadState('analyzing');
    try {
      const result = await finopsApi.extractInvoice(file);
      setExtractedData(result.data);
      setUploadState('success');
      
      // Invalidate query to trigger background refresh of the Invoices table
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (error) {
      setUploadState('empty');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col"
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Upload & Extract</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 relative min-h-[300px] flex flex-col justify-center">
          {uploadState === 'empty' && (
             <div className="relative border-2 border-dashed border-slate-300 rounded-xl hover:bg-slate-50 hover:border-indigo-400 transition-all group overflow-hidden">
                <input type="file" onChange={handleFileDrop} accept="image/*,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center justify-center py-12 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                    <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-500" />
                  </div>
                  <p className="font-medium text-slate-700">Drag & Drop Invoice</p>
                  <p className="text-sm text-slate-500 mt-1">PDF or Image up to 5MB</p>
                </div>
             </div>
          )}

          {uploadState === 'analyzing' && (
             <div className="flex flex-col items-center justify-center gap-6 py-8">
               <div className="relative">
                 <motion.div
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute inset-0 bg-indigo-200 rounded-full blur-xl"
                 />
                 <div className="relative bg-white rounded-full p-4 shadow-lg border border-indigo-100 z-10">
                   <RefreshCcw className="w-8 h-8 text-indigo-600 animate-spin" />
                 </div>
               </div>
               <div className="text-center">
                 <p className="font-medium text-indigo-900">AI Analyzing Document...</p>
                 <p className="text-sm text-indigo-500/80 mt-1">Extracting vendor & line items securely</p>
               </div>
             </div>
          )}

          {uploadState === 'success' && extractedData && (
             <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-emerald-50 text-emerald-800 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-emerald-200/60 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Extraction Successful</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Vendor GSTIN</p>
                        <p className="font-mono text-slate-800 font-medium mt-1">{extractedData.vendorGstin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Amount</p>
                        <p className="text-slate-800 font-semibold mt-1">₹{extractedData.totalAmount}</p>
                      </div>
                   </div>
                </div>
                <Button onClick={onClose} className="w-full">Done</Button>
             </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
