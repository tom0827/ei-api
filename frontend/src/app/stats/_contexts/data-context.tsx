"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Stats } from "../_types/stats";

interface DataContextType {
  data: Stats[];
  loading: boolean;
  error: null | string;
  refetch: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Stats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://eiapi.tomchap.dev/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      // const formattedData = formatData(json.data);
      setData(json.data as Stats[]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // const formatData = (data: Stats[]) => {
  //   // let runningSum = 0;
  //   return data.map((item, idx) => {
  //     // runningSum += Number(item.soulEggs); // replace 'value' with your actual numeric field name
  //     // const runningAvg = runningSum / (idx + 1);
  //     return {
  //       ...item,
  //       createdAt: new Date(item.createdAt).toLocaleString([], {
  //         month: "short",
  //         day: "numeric",
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }),
  //     };
  //   });
  // };

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
