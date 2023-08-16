import {Vacation} from "./Vacation";
import User from "../User";

export interface VacationResponse {
    vacation: Vacation,
    user: User,
    approver: User | null
}