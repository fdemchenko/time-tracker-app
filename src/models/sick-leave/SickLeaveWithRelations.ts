import {SickLeave} from "./SickLeave";
import User from "../User";

export interface SickLeaveWithRelations {
    sickLeave: SickLeave,
    user: User,
    lastModifier: User
}