import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-full relative text-zinc-100 font-sans overflow-hidden bg-transparent">
      {/* Exact Framer Ambient Base for Interior */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ backgroundColor: '#020511' }}>
        <div className="absolute top-0 right-0 w-[70vw] h-[70vw] rounded-full blur-[180px]" style={{ background: 'radial-gradient(circle, rgba(0,178,255,0.15) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] rounded-full blur-[180px]" style={{ background: 'radial-gradient(circle, rgba(0,25,120,0.4) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(-20%, 20%)' }} />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-10 py-10 pb-24">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
