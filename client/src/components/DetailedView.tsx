import { useTableContext } from "../context/TableContext";

function DetailedView() {
    const { selectedTable, selectedTableId, setTables } = useTableContext();

    if (!selectedTable) return null;

    return (
        <div className="border border-gray-400 p-2 flex flex-col gap-1 w-80">
            <div className="flex justify-between">
                <span>Type</span>
                <span>{selectedTable.type}</span>
            </div>

            <div className="flex justify-between">
                <span>Category</span>
                <span>{selectedTable.category}</span>
            </div>

            <div className="flex justify-between">
                <span>Color</span>
                <span>{selectedTable.color}</span>
            </div>

            <div className="flex justify-between">
                <span>Position</span>
                <span>
                    {Math.round(selectedTable.position.x)}, {Math.round(selectedTable.position.y)}
                </span>
            </div>

            <div>
                <span>Status:</span>
                <div className="flex justify-between">
                    1
                    <input
                        disabled
                        type="range"
                        min="1"
                        max="10"
                        value={selectedTable.status}
                        onChange={(e) =>
                            setTables((prev) =>
                                prev.map((table) =>
                                    table.id === selectedTableId
                                        ? { ...table, status: Number(e.target.value) }
                                        : table
                                )
                            )
                        }
                    />
                    10
                </div>
            </div>

            <div className="flex justify-between">
                Locked
                <input
                    disabled
                    checked={selectedTable["is-locked"]}
                    type="checkbox"
                    className="border border-gray-400"
                />
            </div>

            
        </div>
    );
}

export default DetailedView;