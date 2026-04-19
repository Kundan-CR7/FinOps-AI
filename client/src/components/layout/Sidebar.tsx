import { NavLink, useNavigate } from 'react-router-dom';
import { FileText, Landmark, RefreshCcw, Settings, LayoutDashboard, LogOut } from 'lucide-react';
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
    <aside className="w-[280px] bg-black/40 backdrop-blur-md border-r border-white/5 flex flex-col flex-shrink-0 relative z-20">
      <div className="p-8 flex items-center gap-4">
        <div className="w-5 h-5 flex flex-col justify-between">
          <div className="w-full h-[4.5px] bg-[#00B2FF] rounded-r-full" />
          <div className="w-2/3 h-[4.5px] bg-white rounded-r-full" />
          <div className="w-full h-[4.5px] bg-[#00B2FF] rounded-r-full" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white mb-0.5">FinOps-AI</span>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1.5">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                "w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-[18px] h-[18px] stroke-[2.5]", isActive ? "text-[#0099ff]" : "text-zinc-600")} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mx-4 mb-6 rounded-2xl bg-[#0f1115] border border-white/5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3 flex-1 overflow-hidden" title={user?.email}>
          <div className="w-9 h-9 flex-shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-300 font-semibold text-sm border border-zinc-700">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-sm font-medium text-zinc-200 truncate">{user?.email || 'User'}</span>
            <span className="text-[11px] text-zinc-500 tracking-wider uppercase">{user?.role || 'ADMIN'}</span>
          </div>
        </div>
        
        <button onClick={handleLogout} className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-2 flex-shrink-0" title="Logout">
           <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
