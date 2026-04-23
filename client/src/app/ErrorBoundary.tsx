import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-center text-slate-200">
          <div className="max-w-md rounded-3xl border border-red-400/30 bg-red-500/10 p-6">
            <h1 className="mb-2 text-2xl font-semibold">Что-то сломалось</h1>
            <p>Перезагрузи страницу. Ошибка изолирована Error Boundary.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
