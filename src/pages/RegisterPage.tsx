import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import ErrorMessage from "@/components/ErrorMessage";
import { ApiError } from "@/lib/errors";
import { useAuth } from "@/context/auth-context";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await register({ name, email, password });
      navigate("/");
    } catch (err) {
      // Si es un error de la API lo clasificamos.
      if (err instanceof ApiError) {
        // 409 = el email ya está registrado.
        if (err.kind === "conflict") {
          setError("El correo ya está registrado.");
        } else if (err.kind === "validation") {
          setError(err.message); // 400: datos inválidos (ej. contraseña corta).
        } else if (err.kind === "network") {
          setError("No se pudo conectar con el servidor.");
        } else {
          setError(err.message || "Error al registrarse.");
        }
      } else {
        // Mensaje genérico si no es ApiError.
        setError("Error al registrarse.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  
  return (
    <div className="mx-auto mt-10 max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
      {/* Título */}
      <h1 className="mb-6 text-2xl font-bold">Registrarse</h1>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Campo email */}
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
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
          <label className="mb-1 block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        {/* Botón de envío */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-gray-900 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
        >
          {submitting ? "Registrando…" : "Registrarse"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
