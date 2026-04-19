import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { finopsApi } from '../services/finopsApi';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const loginFn = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await finopsApi.login(data);
      loginFn(res.user, res.token);
      navigate('/welcome');
    } catch {
      // Toast already handles error messages
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
      
      {/* Framer Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0099ff]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0099ff] to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(0,153,255,0.3)] mb-6">
          <Building className="text-white w-6 h-6" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">Welcome back</h2>
        <p className="mt-2 text-center text-zinc-400 font-medium">
          Or <Link to="/signup" className="text-[#0099ff] hover:text-white transition-colors">start your 14-day free trial</Link>
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

            <div className="flex items-center justify-between px-2">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#0099ff] focus:ring-[#0099ff]/30" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-zinc-400 cursor-pointer">Remember me</label>
              </div>
              <a href="#" className="text-sm font-medium text-[#0099ff] hover:text-white transition-colors">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full mt-4" isLoading={isLoading}>
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
