import { useNavigate } from 'react-router-dom';
import { FileText, RefreshCcw, Landmark, Building, Sparkles, Mail, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';

const features = [
  {
    icon: FileText,
    title: 'Invoice Extraction',
    description: 'Upload invoices and let our system extract vendor details and line items securely.',
  },
  {
    icon: Landmark,
    title: 'Bank Reconciliation',
    description: 'Sync feeds and match transactions against invoices using an advanced matching engine.',
  },
  {
    icon: RefreshCcw,
    title: 'Automated Matching',
    description: 'Detect partial payments by identifying multiple transactions that satisfy an invoice.',
  },
];

export const Welcome = () => {
  const navigate = useNavigate();
  const markWelcomeSeen = useAuthStore((state) => state.markWelcomeSeen);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetStarted = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    markWelcomeSeen();
    navigate('/', { replace: true });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent successfully. Our team will get back to you securely.");
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full font-sans overflow-y-auto overflow-x-hidden relative bg-transparent">
      
      {/* Framer-Style Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" style={{ backgroundColor: '#020511' }}>
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] rounded-full blur-[180px]" style={{ background: 'radial-gradient(circle, rgba(0,178,255,0.3) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(30%, -20%)' }} />
        <div className="absolute top-1/4 left-0 w-[90vw] h-[90vw] rounded-full blur-[180px]" style={{ background: 'radial-gradient(circle, rgba(0,25,120,0.5) 0%, rgba(0,0,0,0) 60%)', transform: 'translate(-40%, 10%)' }} />
        <div className="absolute bottom-0 right-0 w-[50vw] h-[50vw] rounded-full blur-[140px]" style={{ background: 'radial-gradient(circle, rgba(0,178,255,0.2) 0%, rgba(0,0,0,0) 70%)', transform: 'translate(10%, 40%)' }} />
      </div>

      {/* Navbar Minimal & Working */}
      <nav className="w-full px-8 py-5 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-3">
          <Building className="text-[#00B2FF] w-6 h-6" />
          <span className="font-bold text-xl tracking-tight text-white mb-0.5">FinOps-AI</span>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-[14px] font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#contact" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
            <Button onClick={() => handleGetStarted()} className="h-9 px-5 text-sm font-semibold bg-[#00B2FF] text-white tracking-wide">
              {user?.email ? 'Dashboard' : 'Sign up'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center pt-24 pb-16 px-6 relative z-10">
        {/* Hero Section */}
        <div className="max-w-5xl w-full text-center">
          <h1 className="text-6xl md:text-[5.5rem] leading-[1.02] font-bold tracking-[-0.04em] mb-6 text-white mx-auto">
            Your financial<br/>canvas.
          </h1>

          <p className="text-[#a1a1aa] text-xl md:text-[22px] font-medium tracking-tight max-w-2xl mx-auto mb-14">
            Automate invoice extraction, reconcile bank feeds, and maintain absolute financial accuracy with AI.
          </p>

          <form onSubmit={handleGetStarted} className="group relative max-w-[560px] w-full mx-auto mb-32">
            <div className="absolute -inset-1 bg-white/20 rounded-full blur-[8px] transition duration-1000 group-hover:bg-white/30" />
            <div className="relative flex items-center bg-white rounded-full p-1.5 shadow-2xl">
              <div className="pl-6 pr-2 flex-grow h-12 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-zinc-400" />
                <input 
                   readOnly
                   type="text" 
                   value="Jump into your intelligent workspace..." 
                   className="w-full bg-transparent border-none text-zinc-500 focus:outline-none focus:ring-0 placeholder-zinc-400 font-medium cursor-default"
                />
              </div>
              <Button type="button" onClick={() => handleGetStarted()} className="h-11 px-8 shrink-0 bg-[#00B2FF] hover:bg-[#009ce0] font-semibold text-white">
                Get Started
              </Button>
            </div>
          </form>
        </div>

        {/* Feature Cards in Framer Aesthetic */}
        <section id="features" className="w-full max-w-5xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-[#0f1115]/80 backdrop-blur-3xl rounded-3xl p-8 border border-white/5 transition-all hover:border-white/10">
                <div className="w-12 h-12 rounded-2xl bg-[#00B2FF]/10 border border-[#00B2FF]/20 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[#00B2FF]" />
                </div>
                <h3 className="font-semibold text-xl text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[15px] text-zinc-400 leading-relaxed font-medium tracking-tight">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="w-full max-w-5xl mx-auto bg-[#0a0d14]/80 backdrop-blur-3xl rounded-[2rem] border border-white/5 overflow-hidden mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-10 md:p-14 border-r border-white/5">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-3">Enterprise Support</h2>
              <p className="text-zinc-400 text-[15px] mb-10 leading-relaxed font-medium tracking-tight">
                Our reconciliation operations team is ready to assist with integration queries or workspace configuration.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-white">Email Operations</p>
                    <p className="text-[15px] text-[#00B2FF] font-medium tracking-tight mt-0.5">support@finops-ai.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold tracking-tight text-white">Live Chat</p>
                    <p className="text-[15px] text-zinc-400 font-medium tracking-tight mt-0.5">Available 9am — 5pm IST</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-10 md:p-14 bg-white/[0.02]">
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 tracking-tight">Full Name</label>
                  <input required type="text" className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3 text-white placeholder-zinc-600 focus:border-[#00B2FF]/50 focus:outline-none focus:ring-4 focus:ring-[#00B2FF]/10 transition-all font-medium" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 tracking-tight">Email Address</label>
                  <input required type="email" defaultValue={user?.email || ''} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3 text-white placeholder-zinc-600 focus:border-[#00B2FF]/50 focus:outline-none focus:ring-4 focus:ring-[#00B2FF]/10 transition-all font-medium" placeholder="jane@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 tracking-tight">Message</label>
                  <textarea required rows={4} className="w-full rounded-2xl border border-white/10 bg-black/50 px-5 py-3 text-white placeholder-zinc-600 focus:border-[#00B2FF]/50 focus:outline-none focus:ring-4 focus:ring-[#00B2FF]/10 transition-all resize-none font-medium" placeholder="How can we help?"></textarea>
                </div>
                <Button type="submit" className="w-full mt-2 rounded-2xl h-12 font-semibold text-[15px]" isLoading={isSubmitting}>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-black/40 py-10 px-8 relative z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-white" />
            <span className="font-bold tracking-tight text-white">FinOps-AI</span>
          </div>
          <p className="text-zinc-500 font-medium tracking-tight text-[14px]">© {new Date().getFullYear()} FinOps-AI platform. All rights reserved.</p>
          <div className="flex gap-6 text-[14px] font-medium tracking-tight">
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
