import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { type TableType, createTable } from "../utils";

type ApiTable = {
  id: number;
  name: string;
  type: string;
  category: string;
  color: string;
  status: number;
  position: { x: number; y: number };
  isLocked: boolean;
};

type TableContextType = {
  tables: TableType[];
  setTables: React.Dispatch<React.SetStateAction<TableType[]>>;
  selectedTableId: number | null;
  setSelectedTableId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedTable: TableType | null;
  draggedTable: React.RefObject<TableType | null>;
  dragOffset: React.RefObject<{ x: number; y: number }>;
  loading: boolean;
  error: string | null;
  reloadTables: () => Promise<void>;
};

const TableContext = createContext<TableContextType | null>(null);

export function TableProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<TableType[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null;
  const draggedTable = useRef<TableType | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  async function reloadTables() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/tables`);

      if (!response.ok) {
        throw new Error("Nem sikerült lekérni az asztalokat.");
      }

      const data: ApiTable[] = await response.json();

      setTables(
        data.map((table) =>
          createTable({
            id: table.id,
            type: table.type,
            category: table.category,
            color: table.color,
            status: table.status,
            position: table.position,
            "is-locked": table.isLocked,
          })
        )
      );
    } catch (err) {
      console.error(err);
      setError("Nem sikerült betölteni az asztalokat a szerverről.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reloadTables();
  }, []);

  return (
    <TableContext
      value={{
        tables,
        setTables,
        selectedTableId,
        setSelectedTableId,
        selectedTable,
        draggedTable,
        dragOffset,
        loading,
        error,
        reloadTables,
      }}
    >
      {children}
    </TableContext>
  );
}

export function useTableContext() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error("useTableContext must be used within TableProvider");
  return ctx;
}