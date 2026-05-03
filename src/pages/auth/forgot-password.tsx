import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 font-bold text-ink">Reset your password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the email or phone associated with your account and we&apos;ll send you a reset code.
        </p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="identifier">Email or phone</Label>
          <Input id="identifier" placeholder="you@farm.com" />
        </div>
        <Button variant="gradient" size="lg" className="w-full" disabled>
          Send reset code (coming soon)
        </Button>
      </form>
      <Link
        to="/auth/sign-in"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" /> Back to sign in
      </Link>
    </div>
  );
}

export default ForgotPasswordScreen;

