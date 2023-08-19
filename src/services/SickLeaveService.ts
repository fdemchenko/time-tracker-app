import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import {SickLeaveWithRelations} from "../models/sick-leave/SickLeaveWithRelations";
import {GetSickLeaveDataInput} from "../redux/epics/SickLeaveEpics";

interface GetSickLeaveDataResponse extends GraphQLResponse {
    data?: {
        sickLeave?: {
            getSickLeaves: SickLeaveWithRelations[]
        }
    }
}
export function RequestGetSickLeaveDataRequest(fetchData: GetSickLeaveDataInput) {
    return ajaxAuth<GetSickLeaveDataResponse>(JSON.stringify({
        query: `
                query GetSickLeaveData($date: Date!, $userId: ID, $searchByYear: Boolean) {
                  sickLeave {
                    getSickLeaves(date: $date, userId: $userId, searchByYear: $searchByYear) {
                      sickLeave {
                        id
                        userId
                        lastModifierId
                        start
                        end
                      }
                      user {
                        id
                        email
                        fullName
                        employmentRate
                        employmentDate
                        permissions
                        status
                        hasPassword
                        hasValidSetPasswordLink
                      }
                      lastModifier {
                        id
                        email
                        fullName
                        employmentRate
                        employmentDate
                        permissions
                        status
                        hasPassword
                        hasValidSetPasswordLink
                      } 
                    }
                  }
                }
            `,
        variables: {
            "date": fetchData.date.format("YYYY-MM-DD"),
            "userId": fetchData.userId,
            "searchByYear": fetchData.searchByYear
        }
    })).pipe(
        map((res) => res.response)
    );
}