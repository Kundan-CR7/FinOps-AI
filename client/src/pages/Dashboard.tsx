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
  const paidInvoices = invoices?.filter(i => i.status === 'PAID' || i.status === 'RECONCILED') || [];
  const pendingInvoices = invoices?.filter(i => i.status !== 'PAID' && i.status !== 'RECONCILED') || [];
  const flaggedInvoices = invoices?.filter(i => i.status === 'FLAGGED') || [];
  const reconRate = invoices && invoices.length > 0
    ? Math.round((paidInvoices.length / invoices.length) * 100)
    : 0;

  const totalCredits = transactions?.filter(t => t.type === 'CREDIT').reduce((s, t) => s + parseFloat(t.amount.toString()), 0) || 0;
  const totalDebits = transactions?.filter(t => t.type === 'DEBIT').reduce((s, t) => s + parseFloat(t.amount.toString()), 0) || 0;
  const matchedTxns = transactions?.filter(t => t.status === 'MATCHED' || t.status === 'RECONCILED') || [];

  const isLoading = loadingInv || loadingTxn;

  const stats = [
    {
      title: 'Total Invoice Value',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      subtitle: `${invoices?.length || 0} invoices tracked`,
      icon: IndianRupee,
      headerIconColor: 'text-[#0099ff]',
      headerBg: 'bg-[#0099ff]/10 border-[#0099ff]/20'
    },
    {
      title: 'Pending Invoices',
      value: `${pendingInvoices.length}`,
      subtitle: flaggedInvoices.length > 0 ? `${flaggedInvoices.length} flagged for review` : 'All clear',
      icon: FileText,
      headerIconColor: pendingInvoices.length > 0 ? 'text-rose-400' : 'text-zinc-500',
      headerBg: pendingInvoices.length > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-white/5 border-white/5'
    },
    {
      title: 'Reconciliation Rate',
      value: `${reconRate}%`,
      subtitle: `${paidInvoices.length} of ${invoices?.length || 0} matched`,
      icon: Activity,
      headerIconColor: reconRate >= 70 ? 'text-emerald-400' : reconRate >= 40 ? 'text-amber-400' : 'text-rose-400',
      headerBg: reconRate >= 70 ? 'bg-emerald-500/10 border-emerald-500/20' : reconRate >= 40 ? 'bg-amber-500/10 border-amber-500/20' : 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Net Cash Flow',
      value: `₹${(totalCredits - totalDebits).toLocaleString('en-IN')}`,
      subtitle: `Credits: ₹${totalCredits.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      headerIconColor: totalCredits >= totalDebits ? 'text-emerald-400' : 'text-rose-400',
      headerBg: totalCredits >= totalDebits ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
    },
  ];

  const recentTransactions = (transactions || []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Your financial operations at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.headerBg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.headerIconColor}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1 tracking-tight">
                {isLoading ? <span className="text-zinc-600">—</span> : stat.value}
              </div>
              <p className="text-sm font-medium text-zinc-300">{stat.title}</p>
              <p className="text-xs text-zinc-500 mt-1">{isLoading ? 'Loading...' : stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="w-4 h-4 text-zinc-500" />
                Cash Flow Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-full text-zinc-500 text-sm">Loading data...</div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-sm text-zinc-300">Total Credits</span>
                      </div>
                      <span className="text-sm font-medium text-white">₹{totalCredits.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${totalCredits + totalDebits > 0 ? (totalCredits / (totalCredits + totalDebits)) * 100 : 0}%` }}
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-sm text-zinc-300">Total Debits</span>
                      </div>
                      <span className="text-sm font-medium text-white">₹{totalDebits.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${totalCredits + totalDebits > 0 ? (totalDebits / (totalCredits + totalDebits)) * 100 : 0}%` }}
                        className="h-full bg-rose-500 rounded-full transition-all duration-1000"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Transactions Matched</span>
                      <span className="text-sm font-medium text-white">{matchedTxns.length} / {transactions.length}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm gap-2 mt-8">
                  <TrendingUp className="w-8 h-8 text-zinc-700 mb-2" />
                  <p>No transactions available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col p-0">
            <CardHeader className="px-6 py-5">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-zinc-500" />
                Recent Bank Activity
              </CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-6 text-center text-zinc-500 text-sm">Loading activity...</div>
              ) : recentTransactions.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-4 px-6 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-[10px] border flex items-center justify-center flex-shrink-0 ${
                          txn.type === 'CREDIT' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'
                        }`}>
                          {txn.type === 'CREDIT'
                            ? <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                            : <ArrowDownRight className="w-4 h-4 text-zinc-500" />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-200 truncate">{txn.description}</p>
                          <p className="text-xs text-zinc-500">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className={`text-sm font-medium tabular-nums tracking-tight ${txn.type === 'CREDIT' ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {txn.type === 'CREDIT' ? '+' : '-'}₹{parseFloat(txn.amount.toString()).toLocaleString('en-IN')}
                        </p>
                        {txn.status && txn.status !== 'PENDING' && (
                          <span className={`text-[10px] font-bold tracking-wider uppercase mt-1 inline-block ${
                            txn.status === 'MATCHED' || txn.status === 'RECONCILED' ? 'text-emerald-500' : 'text-amber-500'
                          }`}>
                            {txn.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm gap-2 py-12">
                  <Clock className="w-8 h-8 text-zinc-700 mb-2" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
