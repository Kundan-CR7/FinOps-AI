import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Landmark, RefreshCcw, Settings, LayoutDashboard, LogOut, ShieldAlert, FileBarChart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { finopsApi } from '../../services/finopsApi';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Bank Feeds', href: '/bank-feeds', icon: Landmark },
  { name: 'Reconciliation', href: '/reconciliation', icon: RefreshCcw },
  { name: 'Alerts', href: '/alerts', icon: ShieldAlert, requiredRole: 'ADMIN' },
  { name: 'Reports', href: '/reports', icon: FileBarChart, requiredRole: 'ADMIN' },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const { data: alertData } = useQuery({
    queryKey: ['alerts'],
    queryFn: finopsApi.getAlerts,
    refetchInterval: 30000, // Poll every 30s for new alerts
  });

  const unresolvedCount = alertData?.unresolvedCount || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-[280px] bg-background border-r border-white/[0.04] flex flex-col flex-shrink-0 relative z-20">
      <div className="p-8 flex items-center gap-4">
        <div className="w-5 h-5 flex flex-col justify-between">
          <div className="w-full h-[4.5px] bg-text-primary rounded-r-full" />
          <div className="w-2/3 h-[4.5px] bg-text-primary rounded-r-full opacity-50" />
          <div className="w-full h-[4.5px] bg-text-primary rounded-r-full" />
        </div>
        <span className="font-bold text-xl tracking-tight text-text-primary mb-0.5">FinOps-AI</span>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1.5">
        {navigation.filter(item => !item.requiredRole || item.requiredRole === user?.role).map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3.5 px-4 py-3 text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "text-text-primary border-l-2 border-text-primary bg-white/[0.02]" 
                  : "text-text-secondary hover:bg-white/[0.02] hover:text-text-primary border-l-2 border-transparent"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-[18px] h-[18px] stroke-[2.5]", isActive ? "text-text-primary" : "text-text-secondary")} />
                <span className="flex-1">{item.name}</span>
                {item.name === 'Alerts' && unresolvedCount > 0 && (
                  <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold px-1.5">
                    {unresolvedCount > 99 ? '99+' : unresolvedCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mx-4 mb-6 rounded-xl bg-transparent border border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 overflow-hidden" title={user?.email}>
          <div className="w-9 h-9 flex-shrink-0 rounded-full bg-white/[0.02] flex items-center justify-center text-text-primary font-semibold text-sm border border-white/[0.04]">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-medium text-text-primary truncate">{user?.email || 'User'}</span>
            <span className="text-[10px] text-text-secondary tracking-widest uppercase">{user?.role || 'ADMIN'}</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className="p-2 text-text-secondary hover:text-white rounded-full transition-colors ml-2 flex-shrink-0" title="Logout">
           <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

