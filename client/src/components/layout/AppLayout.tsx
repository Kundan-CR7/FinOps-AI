import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="flex h-screen w-full relative text-text-primary font-sans overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth">
        <div className="max-w-[1400px] mx-auto px-6 py-6 pb-24 animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
