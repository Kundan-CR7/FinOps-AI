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
      
      {/* Minimalist Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-black">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full blur-[160px] opacity-[0.03]" style={{ background: 'white' }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full blur-[140px] opacity-[0.02]" style={{ background: 'white' }} />
      </div>

      {/* Navbar Minimal & Working */}
      <nav className="w-full px-8 py-5 flex justify-between items-center relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 flex flex-col justify-between">
            <div className="w-full h-[4.5px] bg-text-primary rounded-r-full" />
            <div className="w-2/3 h-[4.5px] bg-text-primary rounded-r-full opacity-50" />
            <div className="w-full h-[4.5px] bg-text-primary rounded-r-full" />
          </div>
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
            <Button onClick={() => handleGetStarted()} className="h-9 px-5 text-xs font-semibold tracking-widest uppercase">
              {user?.email ? 'Dashboard' : 'Get Started'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="flex flex-col items-center pt-24 pb-16 px-6 relative z-10">
        {/* Hero Section */}
        <div className="max-w-5xl w-full text-center">
          <h1 className="text-6xl md:text-[7rem] leading-[0.95] font-light tracking-tighter mb-8 text-white mx-auto">
            The future of<br/>financial Ops.
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-medium tracking-tight max-w-xl mx-auto mb-16">
            Automate extraction, reconciliation, and reporting with absolute precision and zero noise.
          </p>

          <div className="group relative max-w-[500px] w-full mx-auto mb-32">
            <div className="relative flex items-center bg-transparent border border-white/10 rounded-xl p-1.5 overflow-hidden">
              <div className="pl-6 pr-2 flex-grow h-12 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-text-secondary" />
                <input 
                   readOnly
                   type="text" 
                   value="Jump into your intelligent workspace..." 
                   className="w-full bg-transparent border-none text-text-secondary focus:outline-none focus:ring-0 text-sm font-medium cursor-default"
                />
              </div>
              <Button type="button" onClick={() => handleGetStarted()} className="h-11 px-8 rounded-lg text-xs uppercase tracking-widest font-bold">
                Enter Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Cards in Framer Aesthetic */}
        <section id="features" className="w-full max-w-5xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card rounded-2xl p-8 border border-white/[0.04] transition-all hover:border-white/10">
                <div className="w-10 h-10 rounded-xl border border-white/[0.04] flex items-center justify-center mb-6">
                  <feature.icon className="w-4 h-4 text-text-secondary" />
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium tracking-tight">{feature.description}</p>
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
                    <p className="text-[14px] font-semibold tracking-tight text-white">Email Operations</p>
                    <p className="text-[14px] text-text-secondary font-medium tracking-tight mt-0.5">support@finops-ai.com</p>
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
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2">Full Name</label>
                  <input required type="text" className="input-dark rounded-xl" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2">Email Address</label>
                  <input required type="email" defaultValue={user?.email || ''} className="input-dark rounded-xl" placeholder="jane@company.com" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-text-secondary mb-2">Message</label>
                  <textarea required rows={4} className="input-dark rounded-xl resize-none py-3" placeholder="How can we help?"></textarea>
                </div>
                <Button type="submit" className="w-full mt-4 h-12 uppercase tracking-widest text-xs font-bold" isLoading={isSubmitting}>
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
