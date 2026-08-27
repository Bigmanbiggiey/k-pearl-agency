import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/** Last-resort UI error boundary. Route- and feature-level boundaries come later. */
export class RootErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Phase 7: forward to an error-monitoring service (decision 26.a).
    console.error('Unhandled UI error:', error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-2xl">Something went wrong</h1>
          <p className="mt-3 text-muted">
            Please refresh the page. If the problem persists, contact K Pearl Agency directly.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
