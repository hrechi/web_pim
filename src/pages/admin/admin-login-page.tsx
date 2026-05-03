import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Sprout } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminStore } from '@/stores/admin-store';

const ADMIN_EMAIL = 'admin@fidly.com';
const ADMIN_PASSWORD = 'admin123';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const setAdminToken = useAdminStore((s) => s.setAdminToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple credential check
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const token = btoa(`${email}:${password}`);
        setAdminToken(token);
        toast.success('Welcome to the Admin Dashboard!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-bg to-accent/10 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-brand text-white shadow-soft">
              <Sprout className="size-6" />
            </span>
            <span className="font-display text-2xl font-bold text-ink">Fieldly Admin</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-border/60 bg-surface p-8 shadow-card">
          <h1 className="mb-2 font-display text-2xl font-bold text-ink">Admin Login</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="admin-email" className="text-xs font-semibold">
                Email Address
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@fidly.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-2 bg-bg/50"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="admin-password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative mt-2">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-bg/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-ink"
                >
                  {showPassword ? (
                    <Lock className="size-4" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !email || !password}
              className="mt-6 w-full"
              variant="gradient"
            >
              <LogIn className="size-4" />
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold text-ink">Demo Credentials:</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Email: <span className="font-mono text-ink">admin@fidly.com</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Password: <span className="font-mono text-ink">admin</span>
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          <a href="/" className="text-primary hover:underline">
            Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
