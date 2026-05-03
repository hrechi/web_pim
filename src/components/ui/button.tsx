import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft hover:bg-primary-600 active:bg-primary-700',
        secondary:
          'bg-secondary text-secondary-foreground shadow-soft hover:opacity-90',
        accent:
          'bg-accent text-accent-foreground shadow-soft hover:opacity-90',
        gradient:
          'bg-gradient-brand text-white shadow-card hover:shadow-glow',
        outline:
          'border border-border bg-surface text-ink hover:bg-muted/40',
        ghost: 'text-ink hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
        destructive:
          'bg-danger text-danger-foreground shadow-soft hover:opacity-90',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const content = asChild ? (
      children
    ) : (
      <>
        {loading ? (
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        ) : null}
        {children}
      </>
    );
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
