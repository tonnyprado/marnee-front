import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f6f6f6] p-6">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-[#40086d] mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an error while loading this page. Please try refreshing.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#40086d] hover:bg-[#300654] text-white font-medium px-6 py-3 rounded-lg transition"
            >
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error details</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
