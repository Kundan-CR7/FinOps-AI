import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { finopsApi } from '../services/finopsApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadCloud, CheckCircle2, RefreshCcw, ChevronDown, ChevronUp } from 'lucide-react';

const statusConfig: Record<string, { bg: string; text: string; border: string }> = {
  EXTRACTED: { bg: 'bg-[#0099ff]/10', text: 'text-[#0099ff]', border: 'border-[#0099ff]/20' },
  PENDING: { bg: 'bg-white/5', text: 'text-zinc-400', border: 'border-white/10' },
  VERIFIED: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  FLAGGED: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  PAID: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  RECONCILED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
};

export const Invoices = () => {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: finopsApi.getInvoices,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Invoices</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and extract data from vendor bills.</p>
        </div>
        <Button onClick={() => setUploadModalOpen(true)} className="gap-2 shrink-0 border-white/10" variant="outline">
          <UploadCloud className="w-4 h-4" /> AI Upload Invoice
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Vendor GSTIN</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {isLoading ? (
                <tr><td colSpan={6} className="py-8 text-center text-zinc-500">Loading invoices...</td></tr>
              ) : invoices && invoices.length > 0 ? (
                invoices.map((inv) => {
                  const sc = statusConfig[inv.status || 'PENDING'] || statusConfig.PENDING;
                  const isExpanded = expandedRow === inv.id;
                  return (
                    <React.Fragment key={inv.id}>
                      <tr
                        className={`hover:bg-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-white/5' : ''}`}
                        onClick={() => setExpandedRow(isExpanded ? null : (inv.id || null))}
                      >
                        <td className="px-6 py-4">
                          <span className={`status-badge ${sc.bg} ${sc.text} ${sc.border}`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-zinc-500 text-xs">{inv.id?.substring(0,12)}...</td>
                        <td className="px-6 py-4 text-zinc-200 font-medium">{inv.vendorGstin}</td>
                        <td className="px-6 py-4 text-zinc-400">{new Date(inv.invoiceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="px-6 py-4 text-right font-medium text-white tabular-nums">₹{parseFloat(inv.totalAmount.toString()).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-zinc-600">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </td>
                      </tr>
                      {isExpanded && inv.items && (
                        <tr className="bg-black/20">
                          <td colSpan={6} className="px-6 py-5 border-t border-white/5">
                            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-3">Line Items</p>
                            <div className="grid gap-2">
                              {inv.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                  <div>
                                    <p className="text-sm font-medium text-zinc-200">{item.description}</p>
                                    <p className="text-xs text-zinc-500 mt-0.5">GST: {item.gstRate}%{item.hsnCode ? ` • HSN: ${item.hsnCode}` : ''}</p>
                                  </div>
                                  <span className="text-sm font-medium text-white tabular-nums">₹{parseFloat(item.amount.toString()).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-zinc-500">
                      <UploadCloud className="w-8 h-8 text-zinc-600 mb-3" />
                      <p className="text-sm">No invoices found. Upload one to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
};

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
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch {
      setUploadState('empty');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="bg-[#0f1115] rounded-3xl shadow-2xl border border-white/10 w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="font-medium text-white">Upload & Extract</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors text-lg">&times;</button>
        </div>
        
        <div className="p-8 relative min-h-[300px] flex flex-col justify-center">
          {uploadState === 'empty' && (
             <div className="relative border border-dashed border-white/20 rounded-2xl hover:border-[#0099ff]/50 hover:bg-white/5 transition-colors group">
                <input type="file" onChange={handleFileDrop} accept="image/*,application/pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="flex flex-col items-center justify-center py-14 pointer-events-none">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#0099ff] transition-colors shadow-lg">
                    <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <p className="font-medium text-white">Select Invoice File</p>
                  <p className="text-sm text-zinc-500 mt-1">PDF or Image up to 5MB</p>
                </div>
             </div>
          )}

          {uploadState === 'analyzing' && (
             <div className="flex flex-col items-center justify-center gap-6 py-10">
               <RefreshCcw className="w-8 h-8 text-[#0099ff] animate-spin" />
               <div className="text-center">
                 <p className="font-medium text-white">Processing Document...</p>
                 <p className="text-sm text-zinc-500 mt-1">Extracting structured data parameters</p>
               </div>
             </div>
          )}

          {uploadState === 'success' && extractedData && (
             <div className="space-y-5">
                <div className="bg-emerald-500/10 text-emerald-400 px-4 py-3.5 rounded-2xl text-sm flex items-center gap-2 border border-emerald-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Extraction Successful</span>
                </div>
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Vendor GSTIN</p>
                        <p className="font-mono text-white font-medium mt-1.5">{extractedData.vendorGstin}</p>
                      </div>
                      <div>
                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Total Amount</p>
                        <p className="text-white font-medium mt-1.5 tabular-nums">₹{extractedData.totalAmount}</p>
                      </div>
                   </div>
                </div>
                <Button onClick={onClose} className="w-full mt-2">Done</Button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
