// src/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 以触发 fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你也可以在这里把错误信息上传到日志服务
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 style={{ color: 'red' }}>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
