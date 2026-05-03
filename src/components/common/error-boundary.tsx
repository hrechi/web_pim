import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/components/common/error-state';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-bg p-6">
          <ErrorState
            title="Unexpected error"
            message={this.state.error?.message ?? 'Something broke while rendering this view.'}
            onRetry={this.handleRetry}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
