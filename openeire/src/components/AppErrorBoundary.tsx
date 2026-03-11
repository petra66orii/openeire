import React from "react";
import { useLocation } from "react-router-dom";
import ServerErrorPage from "../pages/ServerErrorPage";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryImpl extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled render error captured by ErrorBoundary", {
      error,
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return <ServerErrorPage />;
    }
    return this.props.children;
  }
}

const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const resetKey = `${location.pathname}${location.search}${location.hash}`;

  return <ErrorBoundaryImpl resetKey={resetKey}>{children}</ErrorBoundaryImpl>;
};

export default AppErrorBoundary;
