import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileBarChart, Send, Download, Calendar, IndianRupee, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { finopsApi } from '../services/finopsApi';
import type { GSTR1Report, FilingResult } from '../types';
import toast from 'react-hot-toast';

export const Reports = () => {
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [report, setReport] = useState<GSTR1Report | null>(null);
  const [filingResult, setFilingResult] = useState<FilingResult | null>(null);

  const generateMutation = useMutation({
    mutationFn: () => finopsApi.generateGSTR1(periodStart, periodEnd),
    onSuccess: (res) => {
      setReport(res.data);
      setFilingResult(null);
      toast.success('GSTR-1 report generated');
    },
    onError: () => {
      toast.error('Failed to generate report');
    }
  });

  const fileMutation = useMutation({
    mutationFn: () => finopsApi.fileReturn(report!),
    onSuccess: (res) => {
      setFilingResult(res.data);
      if (res.data.success) {
        toast.success('Return filed successfully');
      } else {
        toast.error(res.data.message);
      }
    },
    onError: () => {
      toast.error('Filing failed');
    }
  });

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR1_${report.periodStart}_to_${report.periodEnd}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setReport(null);
    setFilingResult(null);
    setPeriodStart('');
    setPeriodEnd('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary tracking-tight flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-text-secondary" />
          GST Returns
        </h1>
        <p className="text-text-secondary text-sm mt-1">Generate GSTR-1 reports and file returns to the Government portal</p>
      </div>

      {/* Period Selector */}
      <Card className="p-8">
        <h3 className="text-sm font-medium text-text-secondary mb-5 flex items-center gap-2 border-b border-white/[0.04] pb-4">
          <Calendar className="w-4 h-4 text-text-secondary" />
          Select Filing Period
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider font-medium">Period Start</label>
            <input
              type="date"
              value={periodStart}
              onChange={(e) => setPeriodStart(e.target.value)}
              className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-0 focus:border-white/20 transition-all [color-scheme:dark]"
              disabled={!!report}
            />
          </div>
          <div>
            <label className="block text-xs text-text-secondary mb-2 uppercase tracking-wider font-medium">Period End</label>
            <input
              type="date"
              value={periodEnd}
              onChange={(e) => setPeriodEnd(e.target.value)}
              className="w-full bg-transparent border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-0 focus:border-white/20 transition-all [color-scheme:dark]"
              disabled={!!report}
            />
          </div>
        </div>
        {!report && (
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={!periodStart || !periodEnd || generateMutation.isPending}
            isLoading={generateMutation.isPending}
            className="w-full h-12"
          >
            <FileBarChart className="w-4 h-4 mr-2" />
            Generate GSTR-1 Report
          </Button>
        )}
      </Card>

      {/* Report Content */}
      {report && (
        <div className="space-y-5">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Invoices', value: report.invoiceCount, icon: FileText, color: 'text-text-primary' },
              { label: 'Total Taxable', value: `₹${report.totalTaxLiability.totalTaxable.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-text-primary' },
              { label: 'Total Tax', value: `₹${report.totalTaxLiability.totalTax.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-amber-400' },
              { label: 'CGST + SGST', value: `₹${(report.totalTaxLiability.totalCGST + report.totalTaxLiability.totalSGST).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{stat.label}</span>
                </div>
                <div className={`text-xl font-bold tracking-tight ${stat.color}`}>{stat.value}</div>
              </Card>
            ))}
          </div>

          {/* B2B Table */}
          <Card>
            <CardHeader className="border-b border-white/[0.04]">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-text-secondary" />
                B2B Invoices ({report.b2b.length})
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              {report.b2b.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.04]">
                      <th className="text-left px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-medium">GSTIN</th>
                      <th className="text-right px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-medium">Taxable</th>
                      <th className="text-right px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-medium">CGST</th>
                      <th className="text-right px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-medium">SGST</th>
                      <th className="text-right px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-medium">IGST</th>
                      <th className="text-right px-6 py-3 text-xs text-text-secondary uppercase tracking-wider font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] bg-transparent">
                    {report.b2b.map((entry, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-3.5 text-text-secondary font-mono text-xs">{entry.vendorGstin}</td>
                        <td className="px-6 py-3.5 text-right text-text-primary tabular-nums">₹{entry.totalTaxable.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3.5 text-right text-text-secondary tabular-nums">₹{entry.cgst.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3.5 text-right text-text-secondary tabular-nums">₹{entry.sgst.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3.5 text-right text-text-secondary tabular-nums">₹{entry.igst.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3.5 text-right text-text-primary font-medium tabular-nums">₹{entry.totalInvoiceValue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-text-secondary text-sm">No B2B invoices in this period.</div>
              )}
            </div>
          </Card>

          {/* HSN Summary */}
          {report.hsnSummary.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  HSN Summary
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">HSN Code</th>
                      <th className="text-left px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Description</th>
                      <th className="text-right px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Qty</th>
                      <th className="text-right px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Taxable</th>
                      <th className="text-right px-6 py-3 text-xs text-zinc-500 uppercase tracking-wider font-medium">Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {report.hsnSummary.map((hsn, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3.5 text-zinc-300 font-mono text-xs">{hsn.hsnCode}</td>
                        <td className="px-6 py-3.5 text-zinc-300 truncate max-w-[200px]">{hsn.description}</td>
                        <td className="px-6 py-3.5 text-right text-zinc-400">{hsn.quantity}</td>
                        <td className="px-6 py-3.5 text-right text-zinc-200 tabular-nums">₹{hsn.totalTaxable.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-3.5 text-right text-amber-400 tabular-nums">₹{hsn.totalTax.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Filing Section */}
          <Card className="p-8 bg-card border-t border-t-white/[0.04]">
            {!filingResult ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-text-primary tracking-tight mb-1">Ready to File</h3>
                  <p className="text-sm text-text-secondary">
                    Submit GSTR-1 for period {new Date(report.periodStart).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })} — {new Date(report.periodEnd).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                  <Button
                    onClick={() => fileMutation.mutate()}
                    isLoading={fileMutation.isPending}
                    disabled={fileMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    File Return
                  </Button>
                </div>
              </div>
            ) : filingResult.success ? (
              <div className="w-full border border-white/[0.04] rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-14 h-14 rounded-xl border border-white/[0.04] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                  <h4 className="text-text-primary font-semibold tracking-tight text-xl mb-2 flex flex-col md:flex-row items-center gap-3">
                    Return Filed Successfully
                    <span className="text-[10px] uppercase font-semibold tracking-widest border border-emerald-500/20 px-2.5 py-1 rounded-full text-emerald-400">Acknowledged</span>
                  </h4>
                  <p className="text-text-secondary text-sm mb-1">
                    Acknowledgment Number: <span className="font-mono font-medium text-text-primary">{filingResult.acknowledgmentNumber}</span>
                  </p>
                  <p className="text-text-secondary text-xs mb-6">
                    Filed at {new Date(filingResult.filedAt).toLocaleString('en-IN')}
                  </p>
                  <Button onClick={resetAll} variant="outline">
                    Generate Another Report
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full border border-white/[0.04] rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-14 h-14 rounded-xl border border-white/[0.04] flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-rose-400" />
                </div>
                <div className="flex-1 w-full text-center md:text-left">
                  <h4 className="text-text-primary font-semibold tracking-tight text-xl mb-2">Filing Rejected</h4>
                  <p className="text-text-secondary text-sm mb-6">{filingResult.message}</p>
                  <Button onClick={() => setFilingResult(null)} variant="outline">
                    Retry
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
