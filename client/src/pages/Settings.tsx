import { useAuthStore } from '../store/authStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { User, RefreshCcw, Database, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export const Settings = () => {
  const user = useAuthStore((state) => state.user);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-semibold text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-secondary text-sm mt-1">Manage your workspace preferences and configuration.</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <div className="w-8 h-8 rounded-lg border border-white/[0.04] flex items-center justify-center">
              <User className="w-4 h-4 text-text-secondary" />
            </div>
            <div>
              <CardTitle className="text-base">Profile</CardTitle>
              <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-0.5">Account baseline</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04]">
                <div>
                  <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest mb-1">Email Address</p>
                  <p className="text-sm font-medium text-text-primary">{user?.email || 'N/A'}</p>
                </div>
                <button onClick={() => handleCopy(user?.email || '', 'email')} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.04]">
                <div>
                  <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-widest mb-1">Role Authorization</p>
                  <p className="text-sm font-medium text-text-primary">{user?.role || 'USER'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-white/[0.04] flex items-center justify-center">
                <RefreshCcw className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <CardTitle className="text-base">Matching Rules</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Precision Tolerance</span>
                  <span className="font-mono font-medium text-text-primary">± 0.01</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-text-secondary">Fallback Threshold</span>
                  <span className="font-mono font-medium text-text-primary">Max Depth: 12</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-white/[0.04] flex items-center justify-center">
                <Database className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <CardTitle className="text-base">System Cache</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-text-secondary">Release local IndexedDB allocations used by internal query tables.</p>
                <Button variant="outline" className="w-full border-white/10" onClick={() => window.location.reload()}>
                  Force Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
