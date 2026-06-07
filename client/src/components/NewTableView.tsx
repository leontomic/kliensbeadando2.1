import { useState } from "react"
import { useTableContext } from "../context/TableContext"
import { createTable, NEW_TABLE_ID } from "../utils"

function NewTableView() {
    const { setTables, draggedTable, dragOffset } = useTableContext()
    const [newType, setType] = useState<'' | 'snooker' | 'air-hockey' | 'foosball'>('')
    const [newCategory, setCategory] = useState<'' | 'normal' | 'competition' | 'kids'>('')
    const [newColor, setColor] = useState<'red' | 'green' | 'blue' | 'yellow' | 'purple'>('red')
    const [newStatus, setStatus] = useState(5)
    const [newIsLocked, setIsLocked] = useState(false)

    function newTable() {
        if (draggedTable.current || (newType === '' || newCategory === '')) {
            return;
        }
        let table = createTable({
            "id": NEW_TABLE_ID,
            "type": newType,
            "category": newCategory,
            "color": newColor,
            "status": newStatus,
            "position": { "x": 0, "y": 0 },
            "is-locked": newIsLocked
        })
        setTables((prev) => [...prev, table])
        draggedTable.current = table
        dragOffset.current.x = table.size.width / 2
        dragOffset.current.y = table.size.height / 2
    }


    return (
        <div className="border border-gray-400 p-2 flex flex-col gap-1 w-80">
            <div className="flex justify-between">
                <span>Type</span>
                <select value={newType} onChange={e => setType(e.target.value as '' | 'snooker' | 'air-hockey' | 'foosball')}>
                    <option value="">Válassz...</option>
                    <option value="snooker">Snooker</option>
                    <option value="air-hockey">Air-hockey</option>
                    <option value="foosball">Foosball</option>
                </select>
            </div>
            <div className="flex justify-between">
                <span>Category</span>
                <select value={newCategory} onChange={e => setCategory(e.target.value as '' | 'normal' | 'competition' | 'kids')}>
                    <option value="">Válassz...</option>
                    <option value="normal">Normal</option>
                    <option value="competition">Competition</option>
                    <option value="kids">Kids</option>
                </select>
            </div>
            <div className="flex justify-between">
                <span>Color</span>
                <select value={newColor} onChange={e => setColor(e.target.value as 'red' | 'green' | 'blue' | 'yellow' | 'purple')}>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                </select>
            </div>
            <div>
                <span>Status:</span>
                <div className="flex justify-between">
                    1
                    <input value={newStatus} type="range" min="1" max="10" onChange={e => setStatus(Number(e.target.value))} />
                    10
                </div>
            </div>
            <div className="flex justify-between">
                Locked
                <input checked={newIsLocked} type="checkbox" className="border border-gray-400" onChange={e => setIsLocked(e.target.checked)} />
            </div>
            <button className="border border-gray-400 hover:bg-blue-50 active:brightness-75 bg-white" onClick={newTable}>
                Új asztal létrehozása
            </button>
        </div>
    )
}

export default NewTableView