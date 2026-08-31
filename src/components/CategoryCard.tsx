import { Link } from "react-router-dom";
import type { Category } from "@/types/category";


interface CategoryCardProps {
  category: Category;
}


export default function CategoryCard({ category }: CategoryCardProps) {

  return (
    <Link
      to={`/categorias/${category.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >

      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>

      {category.description && <p className="mt-1 text-sm text-gray-600">{category.description}</p>}
    </Link>
  );
}
