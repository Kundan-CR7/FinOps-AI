
import { NavLink, useNavigate } from 'react-router-dom';
import { Building, FileText, Landmark, RefreshCcw, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Bank Feeds', href: '/bank-feeds', icon: Landmark },
  { name: 'Reconciliation', href: '/reconciliation', icon: RefreshCcw },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shadow-sm z-10 flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200">
          <Building className="text-white w-5 h-5" />
        </div>
        <span className="font-semibold text-xl tracking-tight text-slate-900">FinOps-AI</span>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-700" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
        <div className="flex items-center gap-3 px-1 py-2 rounded-lg cursor-pointer flex-1 overflow-hidden" title={user?.email}>
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-sm border border-slate-300">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-medium text-slate-700 truncate">{user?.email || 'User Workspace'}</span>
            <span className="text-xs text-slate-500">{user?.role || 'Basic Plan'}</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2 flex-shrink-0" title="Logout">
           <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
