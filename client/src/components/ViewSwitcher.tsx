import { useState } from "react"
import { useTableContext } from "../context/TableContext"
import DetailedView from "./DetailedView"
import NewTableView from "./NewTableView"
import TableAnalytics from "./TableAnalytics"
import type { RootState } from "../store/store";
import { useSelector } from "react-redux";
import AdminDetailedView from "./adminDetailedView"
function ViewSwitcher() {
    const { selectedTable } = useTableContext()
    const [side, setSide] = useState<'ujasztal' | 'asztaldata'>('asztaldata')
    const user = useSelector((state: RootState) => state.auth.user);
    return (
        <div className="border border-gray-400 p-2 gap-1">
            <div className="border border-gray-400 p-2 flex gap-1">
                {user?.role === "admin" && (
                    <button
                        onClick={() => setSide('ujasztal')}
                        className={`flex-1 border ${side === 'ujasztal' ? 'bg-gray-400' : ''}`}
                    >
                        Új asztal létrehozása
                    </button>
                )
                }
                {selectedTable && (
                    <button
                        onClick={() => setSide('asztaldata')}
                        className={`flex-1 border ${side === 'asztaldata' ? 'bg-gray-400' : ''}`}
                    >
                        Asztal adatai
                    </button>
                )}
            </div>
            <TableAnalytics />
            {user?.role === "user" &&side === 'asztaldata' && selectedTable && <DetailedView />}
            {user?.role === "admin" && side === 'asztaldata' && selectedTable && <AdminDetailedView />}
            {user?.role === "admin" && side === 'ujasztal' && <NewTableView />}
        </div>
    )
}

export default ViewSwitcher