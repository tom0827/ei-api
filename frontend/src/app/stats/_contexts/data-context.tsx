"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Stat } from "../_types/stats";

interface DataContextType {
  data: Stat[];
  loading: boolean;
  error: null | string;
  refetch: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://eiapi.tomchap.dev/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      const stats: Stat[] = addPercentGain(json.data);
      setData(stats);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DataContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx)
    throw new Error("useDataContext must be used within a DataProvider");
  return ctx;
}

const addPercentGain = (data: any): Stat[] => {
  return data.map((row: Stat, i: number, arr: Stat[]) => {
    const prevSoulEggs = Number(arr[i - 1]?.soulEggs) ?? null;
    const gain =
      prevSoulEggs && prevSoulEggs !== 0
        ? ((Number(row.soulEggs) / prevSoulEggs - 1) * 100).toFixed(2)
        : null;
    return {
      ...row,
      soulEggsGain: gain,
    };
  });
};
