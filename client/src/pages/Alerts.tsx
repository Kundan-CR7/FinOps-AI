import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';
import { finopsApi } from '../services/finopsApi';
import toast from 'react-hot-toast';

const severityConfig = {
  HIGH: {
    icon: AlertTriangle,
    color: 'text-rose-400',
    bg: 'border-white/[0.04]',
    badge: 'border border-rose-500/20 text-rose-400',
    label: 'High Priority'
  },
  MEDIUM: {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'border-white/[0.04]',
    badge: 'border border-amber-500/20 text-amber-400',
    label: 'Medium'
  },
  LOW: {
    icon: Info,
    color: 'text-blue-400',
    bg: 'border-white/[0.04]',
    badge: 'border border-blue-500/20 text-blue-400',
    label: 'Low'
  }
};

export const Alerts = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: finopsApi.getAlerts,
  });

  const resolveMutation = useMutation({
    mutationFn: (alertId: string) => finopsApi.resolveAlert(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      toast.success('Alert resolved');
    },
    onError: () => {
      toast.error('Failed to resolve alert');
    }
  });

  const alerts = data?.alerts || [];
  const unresolvedCount = data?.unresolvedCount || 0;
  const unresolvedAlerts = alerts.filter(a => !a.isResolved);
  const resolvedAlerts = alerts.filter(a => a.isResolved);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-text-secondary" />
            Alerts & Anomalies
          </h1>
          <p className="text-text-secondary text-sm mt-1">Monitor discrepancies, validation failures, and reconciliation anomalies</p>
        </div>
        {unresolvedCount > 0 && (
          <div className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2">
            <Bell className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-medium text-text-primary">{unresolvedCount} unresolved</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <Card className="p-12">
          <div className="text-center text-text-secondary text-sm">Loading alerts...</div>
        </Card>
      ) : alerts.length === 0 ? (
        <Card className="p-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 border border-white/[0.04] rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">All Clear</h3>
            <p className="text-sm text-text-secondary max-w-sm">No alerts or anomalies detected. Your financial data looks healthy.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Unresolved Alerts */}
          {unresolvedAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wider">Active Alerts</h2>
              {unresolvedAlerts.map((alert) => {
                const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.LOW;
                const Icon = config.icon;
                return (
                  <Card key={alert.id} className={`border ${alert.severity === 'HIGH' ? 'border-rose-500/20' : 'border-white/[0.04]'}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${config.bg}`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${config.badge}`}>
                              {config.label}
                            </span>
                            <span className="text-xs text-text-secondary opacity-60">
                              {new Date(alert.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-text-primary leading-relaxed">{alert.message}</p>
                          {alert.invoiceId && (
                            <p className="text-xs text-text-secondary mt-1.5 font-mono">Invoice: {alert.invoiceId.substring(0, 8)}...</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveMutation.mutate(alert.id)}
                          disabled={resolveMutation.isPending}
                          className="flex-shrink-0"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                          Resolve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Resolved Alerts */}
          {resolvedAlerts.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-text-secondary opacity-60 uppercase tracking-wider">Resolved</h2>
              {resolvedAlerts.map((alert) => {
                const config = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.LOW;
                const Icon = config.icon;
                return (
                  <Card key={alert.id} className="opacity-60 border-white/[0.04]">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-white/[0.02] border-white/[0.04] flex-shrink-0">
                          <Icon className="w-4 h-4 text-text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400">
                              Resolved
                            </span>
                            <span className="text-xs text-text-secondary opacity-60">
                              {new Date(alert.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">{alert.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
