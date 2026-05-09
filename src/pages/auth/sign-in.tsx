import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import { getErrorMessage } from '@/lib/api/client';

const schema = z.object({
  identifier: z.string().min(3, 'Enter your email, phone, or username'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function SignInScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const setRememberMe = useAuthStore((s) => s.setRememberMe);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: '', password: '', remember: true },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await authService.signIn({
        identifier: values.identifier.trim(),
        password: values.password,
      });
      setSession(res);
      setRememberMe(Boolean(values.remember));
      toast.success(`Welcome back, ${res.user.name.split(' ')[0]}!`);
      const from = (location.state as { from?: Location })?.from?.pathname;
      navigate(from && from !== '/' ? from : '/app/dashboard', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage your farm with Fieldly.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="identifier">Email, phone, or username</Label>
          <Input
            id="identifier"
            autoComplete="username"
            placeholder="you@farm.com or +216…"
            {...register('identifier')}
          />
          {errors.identifier ? (
            <p className="text-xs text-danger">{errors.identifier.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? <p className="text-xs text-danger">{errors.password.message}</p> : null}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="size-4 rounded border-border text-primary focus:ring-primary"
            {...register('remember')}
          />
          Remember me
        </label>
        <Button type="submit" size="lg" variant="gradient" className="w-full" loading={submitting}>
          {!submitting && <LogIn className="size-4" />} Sign in
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        New to Fieldly?{' '}
        <Link to="/auth/sign-up" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default SignInScreen;

