import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, LayoutDashboard, Sparkles } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTab?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-8 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle size={28} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Dashboard View Recovered</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                A rendering issue was prevented. You can reload this view or return to the dashboard.
              </p>
              {this.state.error?.message && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-xs font-mono break-all text-left">
                  {this.state.error.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                <Sparkles size={14} />
                <span>Retry View</span>
              </button>

              {this.props.fallbackTab && (
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: null });
                    this.props.fallbackTab?.();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  <LayoutDashboard size={14} />
                  <span>Go to Overview</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
