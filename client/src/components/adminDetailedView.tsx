import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTableContext } from "../context/TableContext";
import type { RootState } from "../store/store";
import { createTable } from "../utils";

function AdminDetailedView() {
    const { selectedTable, selectedTableId, setSelectedTableId, setTables } = useTableContext();
    const token = useSelector((state: RootState) => state.auth.token);

    const [newType, setType] = useState<"" | "snooker" | "air-hockey" | "foosball">("");
    const [newCategory, setCategory] = useState<"" | "normal" | "competition" | "kids">("");
    const [newColor, setColor] = useState<"red" | "green" | "blue" | "yellow" | "purple">("red");
    const [newStatus, setStatus] = useState(5);
    const [newIsLocked, setIsLocked] = useState(false);

    async function deleteTable() {
        if (!selectedTableId) return;

        if (!token) {
            alert("Asztal törléséhez admin bejelentkezés szükséges.");
            return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/tables/${selectedTableId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => null);
            alert(error?.message ?? "Nem sikerült törölni az asztalt.");
            return;
        }

        setTables((prevTables) => prevTables.filter((t) => t.id !== selectedTableId));
        setSelectedTableId(null);
        alert("Asztal sikeresen törölve.");
    }

    useEffect(() => {
        if (!selectedTable) return;

        setType(selectedTable.type as "snooker" | "air-hockey" | "foosball");
        setCategory(selectedTable.category as "normal" | "competition" | "kids");
        setColor(selectedTable.color as "red" | "green" | "blue" | "yellow" | "purple");
        setStatus(selectedTable.status);
        setIsLocked(selectedTable["is-locked"]);
    }, [selectedTable]);

    async function saveTable() {
        if (!selectedTable || !selectedTableId) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/tables/${selectedTableId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                type: newType,
                category: newCategory,
                color: newColor,
                status: newStatus,
                position: selectedTable.position,
                isLocked: newIsLocked,
            }),
        });

        if (!response.ok) {
            alert("Nem sikerült menteni a változásokat.");
            return;
        }

        const savedTable = await response.json();

        setTables((prevTables) =>
            prevTables.map((table) =>
                table.id === selectedTableId
                    ? createTable({
                        id: savedTable.id,
                        type: savedTable.type,
                        category: savedTable.category,
                        color: savedTable.color,
                        status: savedTable.status,
                        position: savedTable.position,
                        "is-locked": savedTable.isLocked,
                    })
                    : table
            )
        );

        alert("Változások mentve.");
    }

    if (!selectedTable) return null;

    return (
        <div className="border border-gray-400 p-2 flex flex-col gap-1 w-80">
            <div className="flex justify-between">
                <span>Type</span>
                <select value={newType} onChange={e => setType(e.target.value as "" | "snooker" | "air-hockey" | "foosball")}>
                    <option value="snooker">Snooker</option>
                    <option value="air-hockey">Air-hockey</option>
                    <option value="foosball">Foosball</option>
                </select>
            </div>

            <div className="flex justify-between">
                <span>Category</span>
                <select value={newCategory} onChange={e => setCategory(e.target.value as "" | "normal" | "competition" | "kids")}>
                    <option value="normal">Normal</option>
                    <option value="competition">Competition</option>
                    <option value="kids">Kids</option>
                </select>
            </div>

            <div className="flex justify-between">
                <span>Color</span>
                <select value={newColor} onChange={e => setColor(e.target.value as "red" | "green" | "blue" | "yellow" | "purple")}>
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="purple">Purple</option>
                </select>
            </div>

            <div>
                <span>Status: {newStatus}</span>
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

            <button className="border border-gray-400 hover:bg-blue-50 active:brightness-75 bg-white" onClick={saveTable}>
                Változások mentése
            </button>
            <button
                className="border border-gray-400 hover:bg-blue-50 active:brightness-75 bg-white"
                onClick={deleteTable}
            >
                Asztal törlése
            </button>
        </div>
    );
}

export default AdminDetailedView;