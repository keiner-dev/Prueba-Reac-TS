import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "@/components/Layout";
import EventsPage from "@/pages/EventsPage";
import EventDetailPage from "@/pages/EventDetailPage";
import EventNewPage from "@/pages/EventNewPage";
import EventEditPage from "@/pages/EventEditPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryDetailPage from "@/pages/CategoryDetailPage";
import CategoryNewPage from "@/pages/CategoryNewPage";
import FavoritesPage from "@/pages/FavoritesPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import { requireAdmin, requireAuth } from "@/routes/PrivateRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <EventsPage /> },
      { path: "eventos", element: <EventsPage /> },
      { path: "eventos/:id", element: <EventDetailPage /> },
      { path: "categorias", element: <CategoriesPage /> },
      { path: "categorias/:id", element: <CategoryDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "registro", element: <RegisterPage /> },
      { path: "favoritos", element: <FavoritesPage />, loader: requireAuth },
      { path: "eventos/nuevo", element: <EventNewPage />, loader: requireAuth },
      { path: "eventos/:id/editar", element: <EventEditPage />, loader: requireAuth },
      { path: "categorias/nueva", element: <CategoryNewPage />, loader: requireAdmin },
    ],
  },
  { path: "*", element: <EventsPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}

