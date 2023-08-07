export default interface WorkSession {
    id: string,
    userId: string,
    start: string, //datetime
    end?: string | null //datetime,
    type: string,
    title?: string | null,
    description?: string | null,
    lastModifierId: string,
    lastModifierName: string
}