import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { finopsApi } from '../services/finopsApi';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export const Signup = () => {
  const navigate = useNavigate();
  const loginFn = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const res = await finopsApi.register(data);
      loginFn(res.user, res.token);
      navigate('/welcome');
    } catch {
      // Toast handles error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      
      {/* Framer Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0099ff] to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,153,255,0.3)] mb-6">
          <Building className="text-white w-6 h-6" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">Create your account</h2>
        <p className="mt-2 text-center text-zinc-400 font-medium">
          Already have an account? <Link to="/login" className="text-[#0099ff] hover:text-white transition-colors">Sign in here</Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10">
        <div className="bg-[#0f1115]/80 backdrop-blur-3xl py-10 px-8 shadow-2xl sm:rounded-3xl border border-white/5">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email address</label>
              <input
                {...register('email')}
                type="email"
                className="input-dark"
                placeholder="you@company.com"
              />
              {errors.email && <p className="mt-2 text-xs text-rose-400 font-medium ml-4">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                className="input-dark"
              />
              {errors.password && <p className="mt-2 text-xs text-rose-400 font-medium ml-4">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
              Sign up free
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
};
