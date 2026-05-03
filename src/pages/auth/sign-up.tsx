import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth-store';
import { getErrorMessage } from '@/lib/api/client';

const schema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    farmName: z.string().min(2, 'Enter your farm name'),
    email: z
      .string()
      .email('Enter a valid email')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    phone: z
      .string()
      .min(6, 'Enter a valid phone number')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    password: z.string().min(6, 'At least 6 characters'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: 'Passwords do not match' })
  .refine((d) => Boolean(d.email || d.phone), {
    path: ['email'],
    message: 'Provide an email or a phone number',
  });

type FormValues = z.infer<typeof schema>;

export function SignUpScreen() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', farmName: '', email: '', phone: '', password: '', confirm: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await authService.signUp({
        name: values.name.trim(),
        farmName: values.farmName.trim(),
        email: values.email?.trim() || undefined,
        phone: values.phone?.trim() || undefined,
        password: values.password,
      });
      setSession(res);
      toast.success('Welcome to Fieldly!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Join thousands of farmers using Fieldly to grow smarter.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" autoComplete="name" {...register('name')} />
            {errors.name ? <p className="text-xs text-danger">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="farmName">Farm name</Label>
            <Input id="farmName" {...register('farmName')} />
            {errors.farmName ? (
              <p className="text-xs text-danger">{errors.farmName.message}</p>
            ) : null}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" autoComplete="email" {...register('email')} />
            {errors.email ? <p className="text-xs text-danger">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
            {errors.phone ? <p className="text-xs text-danger">{errors.phone.message}</p> : null}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
              onClick={() => setShow((s) => !s)}
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-danger">{errors.password.message}</p>
          ) : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input id="confirm" type={show ? 'text' : 'password'} {...register('confirm')} />
          {errors.confirm ? <p className="text-xs text-danger">{errors.confirm.message}</p> : null}
        </div>
        <Button type="submit" size="lg" variant="gradient" className="w-full" loading={submitting}>
          {!submitting && <UserPlus className="size-4" />} Create account
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/auth/sign-in" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SignUpScreen;

