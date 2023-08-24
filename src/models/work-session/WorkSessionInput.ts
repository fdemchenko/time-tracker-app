export interface WorkSessionInput {
  userId: string,
  start: string, //datetime
  end?: string | null //datetime,
  title?: string | null,
  description?: string | null,
  type: string,
  lastModifierId: string
}