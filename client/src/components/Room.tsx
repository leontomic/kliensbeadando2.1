import { useEffect, useRef} from "react";
import { useTableContext } from "../context/TableContext"
import { NEW_TABLE_ID, type TableType } from "../utils";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";


function Room() {
    const token = useSelector((state: RootState) => state.auth.token);
    const user = useSelector((state: RootState) => state.auth.user);
    const {
        tables,
        setTables,
        selectedTableId,
        setSelectedTableId,
        draggedTable,
        dragOffset,
        loading,
        error,
    } = useTableContext();
    const currentRoomSize = { width: 1000, height: 500 }
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseStart = useRef({ x: 0, y: 0 })
    const mouseEnd = useRef({ x: 0, y: 0 })

    async function saveNewTable(table: TableType) {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/tables`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE
            },
            body: JSON.stringify({
                type: table.type,
                category: table.category,
                color: table.color,
                status: table.status,
                position: table.position,
                isLocked: table["is-locked"],
            }),
        });

        return await response.json();
    }
    async function updateTablePosition(table: TableType) {

        const response = await fetch(`${import.meta.env.VITE_API_URL}/tables/${table.id}/position`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Neptun-Code": import.meta.env.VITE_NEPTUN_CODE
            },
            body: JSON.stringify({
                x: table.position.x,
                y: table.position.y,
            }),
        });

        return await response.json();
    }

    function getScale(): number {
        if (!canvasRef.current) return 1
        return canvasRef.current.getBoundingClientRect().width / currentRoomSize.width
    }

    function desaturate(r: number, g: number, b: number, status: number): string {
        const grey = 0.299 * r + 0.587 * g + 0.114 * b
        const amount = (10 - status) / 9
        const mix = (c: number) => Math.round(c + (grey - c) * amount)
        return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`
    }

    function drawTables() {
        if (!canvasRef.current)
            return
        const ctx = canvasRef.current.getContext("2d")
        if (!ctx)
            return

        const dpr = window.devicePixelRatio || 1

        canvasRef.current.width = currentRoomSize.width * dpr
        canvasRef.current.height = currentRoomSize.height * dpr
        ctx.scale(dpr, dpr)

        ctx.clearRect(0, 0, currentRoomSize.width, currentRoomSize.height)

        tables.forEach(table => {
            ctx.fillStyle = table.color
            ctx.strokeStyle = "black"
            const [r, g, b] = ctx.fillStyle.match(/\w\w/g)!.map(x => parseInt(x, 16))
            ctx.fillStyle = desaturate(r, g, b, table.status)
            ctx.lineWidth = 2
            ctx.fillRect(table.position.x, table.position.y, table.size.width, table.size.height)
            let lineWidth = ctx.lineWidth = 2;
            if (table.category == "competition")
                lineWidth = ctx.lineWidth = 6;
            if (table.category == "kids") {
                const circleRadius = table.size.width / 30;

                for (let y = table.position.y + circleRadius; y < table.position.y + table.size.height - circleRadius; y += circleRadius * 3)
                    for (let x = table.position.x + circleRadius; x < table.position.x + table.size.width - circleRadius; x += circleRadius * 3) {
                        ctx.fillStyle = "white"
                        ctx.beginPath()
                        ctx.arc(x, y, circleRadius, 0, Math.PI * 2)
                        ctx.fill()
                    }
            }

            if (!canBePlaced(table))
                ctx.strokeStyle = "#f04343"
            ctx.strokeRect(table.position.x + lineWidth / 2, table.position.y + lineWidth / 2, table.size.width - lineWidth, table.size.height - lineWidth)

            ctx.strokeStyle = "#4391f0"
            ctx.lineWidth = 2
            if (table.id == selectedTableId) {
                ctx.strokeRect(table.position.x, table.position.y, table.size.width, table.size.height)
            }

            //margin debug
            //ctx.lineWidth = 1
            //ctx.strokeRect(table.position.x-table.margin, table.position.y-table.margin, table.size.width+table.margin*2, table.size.height+table.margin*2)

        })
    }

    function isPointInTable(x: number, y: number, tables: TableType[], isSelect: boolean = true) {
        for (let table of tables) {
            if (x >= table.position.x && x <= (table.position.x + table.size.width) && y >= table.position.y && y <= (table.position.y + table.size.height))
                if ((isSelect || !table['is-locked']) && user?.role)
                    return table
        }
        return null
    }

    function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (!canvasRef.current || !mouseStart.current)
            return
        const canvas = canvasRef.current;
        const { left, top } = canvas.getBoundingClientRect()
        const canvasX = (e.clientX - left) / getScale();
        const canvasY = (e.clientY - top) / getScale();

        if (!draggedTable.current) {
            mouseStart.current = { x: canvasX, y: canvasY }
            draggedTable.current = isPointInTable(canvasX, canvasY, tables, false)
            if (draggedTable.current)
                dragOffset.current = { x: mouseStart.current.x - draggedTable.current.position.x, y: mouseStart.current.y - draggedTable.current.position.y }
        }

    }

    function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (!canvasRef.current || !mouseStart.current || !draggedTable.current || user?.role !== "admin")
            return
        const canvas = canvasRef.current;
        const { left, top } = canvas.getBoundingClientRect()
        const canvasX = (e.clientX - left) / getScale();
        const canvasY = (e.clientY - top) / getScale();

        draggedTable.current = { ...draggedTable.current, position: { x: canvasX - dragOffset.current.x, y: canvasY - dragOffset.current.y } }
        setTables((prevTables) => prevTables.map(table => {
            if (table.id == draggedTable.current?.id) {
                return {
                    ...draggedTable.current,
                    position: { x: canvasX - dragOffset.current.x, y: canvasY - dragOffset.current.y }
                }
            }
            return table
        }))
    }

    function handleMouseUp(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (!canvasRef.current || !mouseStart.current || !mouseEnd.current)
            return
        const canvas = canvasRef.current;
        const { left, top } = canvas.getBoundingClientRect()
        const canvasX = (e.clientX - left) / getScale();
        const canvasY = (e.clientY - top) / getScale();
        mouseEnd.current = { x: canvasX, y: canvasY }
        //click
        if (mouseStart.current.x == mouseEnd.current.x && mouseStart.current.y == mouseEnd.current.y) {
            const table = isPointInTable(canvasX, canvasY, tables)
            if (table?.id === selectedTableId) setSelectedTableId(null)
            else setSelectedTableId(table?.id ?? null)

            draggedTable.current = null
        }
        else if (user?.role !== "admin") {
            draggedTable.current = null;
            dragOffset.current = { x: 0, y: 0 };
            return;
        }
        else if (draggedTable.current) {
            const tableToSnap = draggedTable.current
            draggedTable.current = null
            if (!canBePlaced(tableToSnap)) {
                setTables((prevTables) => prevTables.map(table => {
                    if (table.id == tableToSnap.id) {
                        return {
                            ...table,
                            position: { x: mouseStart.current.x - dragOffset.current.x, y: mouseStart.current.y - dragOffset.current.y }
                        }
                    }
                    return table
                }).filter(t => t.id != NEW_TABLE_ID))
            }
            else {
                if (tableToSnap.id === NEW_TABLE_ID) {
                    saveNewTable(tableToSnap)
                        .then((savedTable) => {
                            setTables((prevTables) =>
                                prevTables.map((t) =>
                                    t.id === NEW_TABLE_ID
                                        ? {
                                            ...t,
                                            id: savedTable.id,
                                            name: savedTable.name,
                                            position: savedTable.position,
                                            "is-locked": savedTable.isLocked,
                                        }
                                        : t
                                )
                            );
                            alert("Asztal sikeresen létrehozva.");
                        })
                        .catch(() => {
                            setTables((prevTables) =>
                                prevTables.filter((t) => t.id !== NEW_TABLE_ID)
                            );
                        });
                } else {
                    updateTablePosition(tableToSnap)
                        .then(() => {
                            alert("Asztal pozíciója sikeresen mentve.");
                        })
                        .catch(() => {
                            setTables((prevTables) =>
                                prevTables.map((table) =>
                                    table.id === tableToSnap.id
                                        ? {
                                            ...table,
                                            position: {
                                                x: mouseStart.current.x - dragOffset.current.x,
                                                y: mouseStart.current.y - dragOffset.current.y,
                                            },
                                        }
                                        : table
                                )
                            );
                        });
                }
            }
        }

    }
    function canBePlaced(table: TableType) {
        if ((table.position.x - table.margin) < 0 || (table.position.x + table.size.width + table.margin) > currentRoomSize.width ||
            (table.position.y - table.margin) < 0 || (table.position.y + table.size.height + table.margin) > currentRoomSize.height)
            return false
        let isIntersecting = false;
        for (let t of tables) {
            if (t.id == table.id)
                continue;

            isIntersecting = isIntersecting || t.position.x < table.position.x + table.size.width + table.margin &&
                t.position.x + t.size.width > table.position.x - table.margin &&
                t.position.y < table.position.y + table.size.height + table.margin &&
                t.position.y + t.size.height > table.position.y - table.margin
        }
        return !isIntersecting
    }

    useEffect(() => {
        drawTables()

    }, [currentRoomSize, tables, selectedTableId])
    if (loading) return <div className="p-4">Asztalok betöltése...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;
    return (
        <div className="flex flex-col items-center gap-2">
            <canvas
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                width={currentRoomSize.width}
                height={currentRoomSize.height}
                className="border-2 max-w-full h-auto"
                ref={canvasRef}
                style={{ maxHeight: currentRoomSize.height }}
            />
        </div>
    )

}


export default Room