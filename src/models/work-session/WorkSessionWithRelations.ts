import WorkSession from "./WorkSession";
import User from "../User";

export interface WorkSessionWithRelations {
  workSession: WorkSession,
  user: User,
  lastModifier: User
}