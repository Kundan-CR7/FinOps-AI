
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { ArrowUpRight, ArrowDownRight, IndianRupee, FileText, Activity } from 'lucide-react';

const stats = [
  { title: 'Total Revenue', value: '₹0.00', change: '0%', trend: 'neutral', icon: IndianRupee },
  { title: 'Pending Invoices', value: '0', change: '0%', trend: 'neutral', icon: FileText },
  { title: 'Reconciliation Rate', value: '0%', change: '0%', trend: 'neutral', icon: Activity },
];

export const Dashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-slate-500 text-sm mt-1">Your autonomous financial snapshot</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <p className={`text-xs mt-1 flex items-center ${stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-rose-600' : 'text-slate-400'}`}>
                {stat.trend === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                {stat.trend === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.trend === 'neutral' && <span className="mr-1">-</span>}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity Mock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80 flex flex-col">
          <CardHeader>
             <CardTitle>Cash Flow Forecast</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center border-t border-slate-100 bg-slate-50/50 m-6 rounded-lg text-slate-400 text-sm border-dashed">
             No financial data available yet.
          </CardContent>
        </Card>
        <Card className="h-80 flex flex-col">
          <CardHeader>
             <CardTitle>Recent Recon Activities</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto flex items-center justify-center border-t border-slate-100">
             <p className="text-sm text-slate-400">No recent reconciliations</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
