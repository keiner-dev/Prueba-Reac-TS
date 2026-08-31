import { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import ErrorMessage from "@/components/ErrorMessage";
import { ApiError } from "@/lib/errors";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login({ email, password });
      const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.kind === "unauthorized") {
          setError("Credenciales incorrectas."); // 401: mal email o password.
        } else if (err.kind === "validation") {
          setError(err.message); // 400: error de formato.
        } else if (err.kind === "network") {
          setError("No se pudo conectar con el servidor."); // red: backend caído.
        } else {
          setError(err.message || "Error al iniciar sesión."); 
        }
      } else {
        setError("Error al iniciar sesión.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">

      <h1 className="mb-6 text-2xl font-bold">Iniciar sesión</h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Campo contraseña */}
        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Ingresando…" : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" className="text-blue-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
