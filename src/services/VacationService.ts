import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import {VacationResponse} from "../models/vacation/VacationResponse";
import {GetVacationsByUserIdInput} from "../redux/epics/VacationEpics";
import {VacationInfo} from "../models/vacation/VacationInfo";
import moment from "moment";
import {VacationCreate} from "../models/vacation/VacationCreate";

export const VacationDaysInYear = 30;

export function GetAvailableVacationDays(employmentDate: string): number {
    return ((moment().diff(employmentDate, "years")) + 1) * VacationDaysInYear;
}
interface GetVacationsByUserIdResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            getVacationsByUserId: VacationResponse[] | null
        }
    }
}
export function RequestGetVacationsByUserId(fetchInput: GetVacationsByUserIdInput) {
    return ajaxAuth<GetVacationsByUserIdResponse>(JSON.stringify({
        query: `
                query GetVacationsByUserId($userId: ID!, $onlyApproved: Boolean, $orderByDesc: Boolean!) {
                  vacation {
                    getVacationsByUserId(userId: $userId, onlyApproved: $onlyApproved, orderByDesc: $orderByDesc) {
                      vacation {
                        id
                        userId
                        start
                        end
                        comment
                        isApproved
                        approverId
                        approverComment
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
                      approver {
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
            "userId": fetchInput.userId,
            "onlyApproved": fetchInput.onlyApproved,
            "orderByDesc": fetchInput.orderByDesc
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface GetVacationInfoByUserIdResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            getVacationInfoByUserId: VacationInfo | null
        }
    }
}
export function RequestGetVacationInfoByUserId(userId: string) {
    return ajaxAuth<GetVacationInfoByUserIdResponse>(JSON.stringify({
        query: `
                query GetVacationInfoByUserId($userId: ID!) {
                  vacation {
                    getVacationInfoByUserId(userId: $userId) {
                      userId
                      employmentDate
                      daysSpent
                    } 
                  }
                }
            `,
        variables: {
            "userId": userId
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface CreateVacationResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            createVacation: boolean | null
        }
    }
}
export function RequestCreateVacation(data: VacationCreate) {
    return ajaxAuth<CreateVacationResponse>(JSON.stringify({
        query: `
                mutation CreateVacation($vacation: VacationInputType!) {
                  vacation {
                    createVacation(vacation: $vacation)  
                  }
                }
            `,
        variables: {
            "vacation": {
                "userId": data.userId,
                "start": moment(data.start).format("YYYY-MM-DD"),
                "end": moment(data.end).format("YYYY-MM-DD"),
                "comment": data.comment
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}