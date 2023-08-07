export interface Holiday {
    id: string,
    title: string,
    type: "DayOff" | "Holiday" | "ShortDay",
    date: string,
    endDate?: string
}
