export interface WorkSessionUpdateInput {
  start: string, //datetime
  end: string //datetime,
  title?: string | null,
  description?: string | null,
  lastModifierId: string
}