
interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="px-2 text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}
