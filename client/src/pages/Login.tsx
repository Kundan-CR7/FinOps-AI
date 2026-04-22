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

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl border border-white/[0.04] flex items-center justify-center mb-6">
          <Building className="text-text-primary w-6 h-6" />
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-text-primary">Welcome back</h2>
        <p className="mt-2 text-center text-text-secondary font-medium">
          Don’t have an account? <Link to="/signup" className="text-text-primary hover:underline transition-colors focus:outline-none">Sign up</Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[420px] relative z-10">
        <div className="bg-card py-10 px-8 shadow-2xl sm:rounded-2xl border border-white/[0.04]">
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

            <div className="flex items-center px-2">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-white/10 bg-transparent text-white focus:ring-white/20" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary cursor-pointer">Remember me</label>
              </div>
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
