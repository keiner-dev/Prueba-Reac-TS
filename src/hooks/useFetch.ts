import { useEffect, useState } from "react";
import { request } from "@/lib/api";


interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

  
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await request<T>("get", url);

        if (!cancelled) setData(result);
      } catch (err) {
      
        if (!cancelled) setError(err as Error);
      } finally {
   
        if (!cancelled) setLoading(false);
      }
    })();


    return () => {
      cancelled = true;
    };


  }, [url, reloadKey]);


  const refetch = () => setReloadKey((k) => k + 1);
  return { data, loading, error, refetch };
}
