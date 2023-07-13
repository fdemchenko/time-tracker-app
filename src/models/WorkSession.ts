export default interface WorkSession {
    id: string,
    userId: string,
    start: string, //datetime
    end: string | null //datetime
}