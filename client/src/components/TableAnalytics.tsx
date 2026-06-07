import { useTableContext } from '../context/TableContext'
import { NEW_TABLE_ID } from '../utils'

const TABLE_TYPES = ['snooker', 'air-hockey', 'foosball']

export function TableAnalytics() {
    const { tables } = useTableContext()

    const placedTables = tables.filter(t => t.id !== NEW_TABLE_ID)
    const total = placedTables.length

    const avgStatusByType = TABLE_TYPES.map(type => {
        const ofType = placedTables.filter(t => t.type === type)
        const avg = ofType.length > 0
            ? ofType.reduce((sum, t) => sum + t.status, 0) / ofType.length
            : null
        return { type, avg }
    })

    return (
        <div className="border border-gray-400 p-2 flex flex-col gap-1 w-80">
            <div className="flex justify-between font-semibold">
                <span>Lehelyezett asztalok</span>
                <span>{total} db</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold">
                <span>Átlagolt állapotértékek</span>
            </div>
            {avgStatusByType.map(({ type, avg }) => (
                <div key={type} className="flex justify-between">
                    <span>{type}</span>
                    <span>{avg !== null ? avg.toFixed(1) : '—'}</span>
                </div>
            ))}
        </div>
    )
}

export default TableAnalytics