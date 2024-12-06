import React from 'react';

export default class ErrorBoundaryBaseGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('🚀error >>', error);
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('🚀errorInfo >>', errorInfo);
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex justify-content-center">
          <h5>{this.props.message || 'Something went wrong on the base grid component'}</h5>
        </div>
      );
    }

    return this.props.children;
  }
}
