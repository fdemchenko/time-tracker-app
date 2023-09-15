import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import {GetVacationsByUserIdInput} from "../redux/epics/VacationEpics";
import {VacationInfo} from "../models/vacation/VacationInfo";
import moment from "moment";
import {VacationCreate} from "../models/vacation/VacationCreate";
import {VacationApprove} from "../models/vacation/VacationApprove";
import {formatIsoDateForApi} from "../helpers/date";
import {Vacation} from "../models/vacation/Vacation";

export const VacationDaysInYear = 30;

export function GetAvailableVacationDays(employmentDate: string): number {
    return ((moment().diff(employmentDate, "years")) + 1) * VacationDaysInYear;
}
interface GetVacationsByUserIdResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            getVacationsByUserId: Vacation[] | null
        }
    }
}
export function RequestGetVacationsByUserId(fetchInput: GetVacationsByUserIdInput) {
    return ajaxAuth<GetVacationsByUserIdResponse>(JSON.stringify({
        query: `
                query GetVacationsByUserId($userId: ID!, $onlyApproved: Boolean, $orderByDesc: Boolean!) {
                  vacation {
                    getVacationsByUserId(userId: $userId, onlyApproved: $onlyApproved, orderByDesc: $orderByDesc) {
                        id
                        userId
                        start
                        end
                        comment
                        isApproved
                        approverId
                        approverComment
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

interface GetUsersVacationsForMonthResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            getUsersVacationsForMonth: Vacation[] | null
        }
    }
}
export interface GetUsersVacationsForMonthInput {
    userIds: string[],
    monthDate: string
}
export function RequestGetUsersVacationsForMonth(input: GetUsersVacationsForMonthInput) {
    return ajaxAuth<GetUsersVacationsForMonthResponse>(JSON.stringify({
        query: `
                query GetUsersVacationForMonth($userIds: [ID]!, $monthDate: Date!) {
                  vacation {
                    getUsersVacationsForMonth(userIds: $userIds, monthDate: $monthDate) {
                        id
                        userId
                        start
                        end
                        comment
                        isApproved
                        approverId
                        approverComment
                    } 
                  }
                }
            `,
        variables: {
            "userIds": input.userIds,
            "monthDate": formatIsoDateForApi(input.monthDate)
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

interface GetVacationRequestsResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            getVacationsRequests: Vacation[] | null
        }
    }
}
export function RequestGetVacationRequest(getNotStarted: boolean) {
    return ajaxAuth<GetVacationRequestsResponse>(JSON.stringify({
        query: `
                query GetVacationRequests($getNotStarted: Boolean!) {
                  vacation {
                    getVacationsRequests(getNotStarted: $getNotStarted) {
                        id
                        userId
                        start
                        end
                        comment
                        isApproved
                        approverId
                        approverComment
                    } 
                  }
                }
            `,
        variables: {
            "getNotStarted": getNotStarted
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

interface DeleteVacationResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            delete: boolean | null
        }
    }
}
export function RequestDeleteVacation(id: string) {
    return ajaxAuth<DeleteVacationResponse>(JSON.stringify({
        query: `
                mutation DeleteVacation($id: ID!) {
                  vacation {
                    delete(id: $id)
                  }
                }
            `,
        variables: {
            "id": id
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface ApproverUpdateVacationResponse extends GraphQLResponse {
    data?: {
        vacation?: {
            updateByApprover: boolean | null
        }
    }
}
export function RequestApproverUpdateVacation(vacationApprove: VacationApprove) {
    return ajaxAuth<ApproverUpdateVacationResponse>(JSON.stringify({
        query: `
                mutation ApproverUpdate($approverUpdate: VacationApproveInputType!) {
                  vacation {
                    updateByApprover(approverUpdate: $approverUpdate)
                  }
                }
            `,
        variables: {
            "approverUpdate": {
                "id": vacationApprove.id,
                "isApproved": vacationApprove.isApproved,
                "approverId": vacationApprove.approverId,
                "approverComment": vacationApprove.approverComment
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}