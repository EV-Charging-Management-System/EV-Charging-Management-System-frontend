import React from 'react'

type State = { hasError: boolean; error?: Error }

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h2>Something went wrong</h2>
          <pre>{String(this.state.error)}</pre>
        </div>
      )
    }

    return this.props.children as React.ReactElement
  }
}

export default ErrorBoundary
