import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}


interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}


export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }


  componentDidCatch(error: Error) {
    console.error("Error capturado por ErrorBoundary:", error);
  }
  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow">
            {/* Título del error */}
            <h1 className="mb-2 text-xl font-bold text-red-600">Algo salió mal</h1>
            <p className="mb-4 text-gray-600">
              Ha ocurrido un error inesperado en la interfaz. Tu sesión y tus datos están a salvo.
            </p>
            <p className="mb-4 rounded bg-red-50 p-2 text-sm text-red-700">{this.state.message}</p>
            <button
              onClick={this.handleReload}
              className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700"
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }
    // Si no hay error, renderizamos los hijos con normalidad.
    return this.props.children;
  }
}
