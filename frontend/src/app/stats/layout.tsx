import { ReactNode } from "react";
import { DataProvider } from "./_contexts/data-context";

export default function StatsLayout({ children }: { children: ReactNode }) {
  return (
    <DataProvider>
      {children}
    </DataProvider>
  );
}