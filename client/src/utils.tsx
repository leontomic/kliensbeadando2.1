export interface TableType {
    "id": number
    "type": string //"snooker" | "air-hockey" | "foosball"
    "size": {"width": number, "height": number}
    "margin": number
    "category": string //"competition" | "normal" | "kids"
    "color": string
    "status": number
    "position": {"x": number, "y": number}
    "is-locked": boolean


}

export function createTable(tableInput: Omit<TableType, "size" | "margin">){
    const table = tableInput as TableType;
    switch (table.type) {
        case "snooker":
            table.size = {width: 190, height: 100}
            table.margin = 50
            break;
        
        case "air-hockey":
            table.size = {width: 140, height: 70}
            table.margin = 40
            break;

        case "foosball":
            table.size = {width: 120, height: 60}
            table.margin = 30
            break;
    
        default:
            break;
    }
    return table;
}

export const NEW_TABLE_ID = -1;