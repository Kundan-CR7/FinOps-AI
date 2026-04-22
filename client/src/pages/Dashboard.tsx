import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { IndianRupee, FileText, Activity, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { finopsApi } from '../services/finopsApi';

export const Dashboard = () => {
  const { data: invoices, isLoading: loadingInv } = useQuery({
    queryKey: ['invoices'],
    queryFn: finopsApi.getInvoices,
  });

  const { data: transactions, isLoading: loadingTxn } = useQuery({
    queryKey: ['transactions'],
    queryFn: finopsApi.getTransactions,
  });

  const totalRevenue = invoices?.reduce((sum, inv) => sum + parseFloat(inv.totalAmount.toString()), 0) || 0;
  const totalDebits = transactions?.filter(t => t.type === 'DEBIT').reduce((s, t) => s + parseFloat(t.amount.toString()), 0) || 0;
  
  // Calculate Tax Liability locally from invoice items
  const taxLiability = invoices?.reduce((sum, inv) => {
    return sum + inv.items.reduce((itemSum, item) => itemSum + (parseFloat(item.amount.toString()) * (item.gstRate / 100)), 0);
  }, 0) || 0;

  const paidInvoices = invoices?.filter(i => i.status === 'PAID' || i.status === 'RECONCILED') || [];
  const pendingInvoices = invoices?.filter(i => i.status !== 'PAID' && i.status !== 'RECONCILED') || [];
  const flaggedInvoices = invoices?.filter(i => i.status === 'FLAGGED') || [];
  const reconRate = invoices && invoices.length > 0
    ? Math.round((paidInvoices.length / invoices.length) * 100)
    : 0;

  const isLoading = loadingInv || loadingTxn;

  // The Bento Grid structure as requested
  // Income (2 cols), Expenses (1 col)
  // Tax Liability (1 col), AI Insights (2 cols)

  const recentTransactions = (transactions || []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Your financial operations at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Income */}
        <div className="flex flex-col justify-end pb-6 border-b border-white/[0.04] md:border-b-0 md:border-r md:pr-6">
          <h2 className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.2em] mb-3">Total Income</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-zinc-500 font-light text-2xl">₹</span>
            <div className="text-5xl font-light text-text-primary tracking-tighter">
              {isLoading ? <span className="opacity-50">...</span> : totalRevenue.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs text-text-secondary">Across {invoices?.length || 0} tracked invoices</span>
          </div>
        </div>

        {/* Expenses */}
        <div className="flex flex-col justify-end pb-6 border-b border-white/[0.04] md:border-b-0 md:border-r md:pr-6 md:pl-6">
          <h2 className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.2em] mb-3">Expenses</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-zinc-500 font-light text-2xl">₹</span>
            <div className="text-5xl font-light text-text-primary tracking-tighter">
              {isLoading ? <span className="opacity-50">...</span> : totalDebits.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span className="text-xs text-text-secondary">Bank synced debits</span>
          </div>
        </div>

        {/* Tax Liability */}
        <div className="flex flex-col justify-end pb-6 md:pl-6">
          <h2 className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.2em] mb-3">Est. Tax Liability</h2>
          <div className="flex items-baseline gap-2">
            <span className="text-zinc-500 font-light text-2xl">₹</span>
            <div className="text-5xl font-light text-text-primary tracking-tighter">
              {isLoading ? <span className="opacity-50">...</span> : taxLiability.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-xs text-text-secondary">Calculated from items</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI & Recon */}
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-white/[0.04]">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
               <Activity className="w-4 h-4 text-text-secondary" /> Reconciliation Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.04]">
              <div className="p-8">
                <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.2em] mb-6">Match Rate</div>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-4xl font-light text-text-primary tracking-tighter">
                    {isLoading ? '...' : reconRate}<span className="text-2xl text-zinc-500">%</span>
                  </span>
                </div>
                <div className="w-full h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-text-primary rounded-full transition-all duration-1000"
                    style={{ width: `${reconRate}%` }} 
                  />
                </div>
                <p className="text-xs text-text-secondary mt-4">
                  {isLoading ? 'Loading...' : `${paidInvoices.length} of ${invoices?.length || 0} successfully reconciled`}
                </p>
              </div>

              <div className="p-8 flex flex-col justify-center space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-text-primary font-medium">{pendingInvoices.length}</div>
                    <div className="text-xs text-text-secondary mt-0.5">Pending Invoices</div>
                  </div>
                  <FileText className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-rose-400 font-medium">{flaggedInvoices.length}</div>
                    <div className="text-xs text-text-secondary mt-0.5">Anomalies Detected</div>
                  </div>
                  <Activity className="w-4 h-4 text-rose-500/50" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Small Recent List */}
        <Card className="lg:col-span-1">
          <CardHeader className="border-b border-white/[0.04]">
             <CardTitle className="text-sm font-medium flex items-center gap-2">
               <Clock className="w-4 h-4 text-text-secondary" /> Live Feed
             </CardTitle>
          </CardHeader>
          <div className="divide-y divide-white/[0.04] max-h-[300px] overflow-y-auto">
             {recentTransactions.map((txn) => (
                <div key={txn.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm text-text-primary font-medium truncate">{txn.description}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{new Date(txn.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-sm tracking-tight ${txn.type === 'CREDIT' ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {txn.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(txn.amount.toString()).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
             ))}
             {recentTransactions.length === 0 && !isLoading && (
               <div className="p-8 text-center text-xs text-text-secondary">No recent transactions</div>
             )}
          </div>
        </Card>
      </div>
    </div>
  );
};
