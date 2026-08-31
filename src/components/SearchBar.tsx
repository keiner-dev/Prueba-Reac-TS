
import { useState, type FormEvent } from "react";


interface SearchBarProps {
  onSearch: (term: string) => void;
}


export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(term);
  };

 
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={term} 
        onChange={(e) => setTerm(e.target.value)} 
        placeholder="Buscar eventos…"
        className="flex-1 rounded border border-gray-300 px-3 py-2"
      />
      <button type="submit" className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-700">
        Buscar
      </button>
    </form>
  );
}
