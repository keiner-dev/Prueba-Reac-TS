import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-full text-sm transition-colors ${isActive ? "bg-[#7d8f4a] text-white font-semibold" : "text-[#2d4120] hover:bg-[#e7efd0] hover:text-[#203218]"}`;

  return (
    <div className="min-h-screen bg-[#f8f8f3] text-[#1f2a1b]">
      <header className="border-b border-[#dfe8cf] bg-[#f7f9f2] shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="text-xl font-black tracking-tight text-[#314b1b]">
            PlanCity
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={navClass}>
              Eventos
            </NavLink>
            <NavLink to="/categorias" className={navClass}>
              Categorías
            </NavLink>
            {user && (
              <>
                <NavLink to="/favoritos" className={navClass}>
                  Mis favoritos
                </NavLink>
                <NavLink to="/eventos/nuevo" className={navClass}>
                  Crear evento
                </NavLink>
                {user.role === "admin" && (
                  <NavLink to="/categorias/nueva" className={navClass}>
                    Crear categoría
                  </NavLink>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm font-medium text-[#48602f]">
                  {user.name} · {user.role}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-[#536a2d] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#405024]"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navClass}>
                  Iniciar sesión
                </NavLink>
                <NavLink to="/registro" className={navClass}>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
