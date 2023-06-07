import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log('ERROR',error,errorInfo);
    this.setState({ hasError: true })
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return <h1>You need to log in to use this feature.</h1>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundary