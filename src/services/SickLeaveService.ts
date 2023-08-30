import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import {SickLeaveWithRelations} from "../models/sick-leave/SickLeaveWithRelations";
import {GetSickLeaveDataInput, UpdateSickLeaveDataInput} from "../redux/epics/SickLeaveEpics";
import {SickLeaveInput} from "../models/sick-leave/SickLeaveInput";
import {formatIsoDateForApi} from "../helpers/date";

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

interface GetUsersSickLeavesFormMonthResponse extends GraphQLResponse {
    data?: {
        sickLeave?: {
            getUsersSickLeavesForMonth: SickLeaveWithRelations[]
        }
    }
}
export interface GetUsersSickLeavesForMonthInput {
    userIds: string[],
    monthDate: string
}
export function RequestGetUsersSickLeavesForMonthRequest(input: GetUsersSickLeavesForMonthInput) {
    return ajaxAuth<GetUsersSickLeavesFormMonthResponse>(JSON.stringify({
        query: `
                query GetUsersSickLeavesForMonth($userIds: [ID]!, $monthDate: Date!) {
                  sickLeave {
                    getUsersSickLeavesForMonth(userIds: $userIds, monthDate: $monthDate) {
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
            "userIds": input.userIds,
            "monthDate": formatIsoDateForApi(input.monthDate)
        }
    })).pipe(
      map((res) => res.response)
    );
}

interface CreateSickLeaveDataResponse extends GraphQLResponse {
    data?: {
        sickLeave?: {
            create: boolean
        }
    }
}
export function RequestCreateSickLeaveDataRequest(sickLeaveInput: SickLeaveInput) {
    return ajaxAuth<CreateSickLeaveDataResponse>(JSON.stringify({
        query: `
                mutation CreateSickLeave($sickLeave: SickLeaveInputType!) {
                  sickLeave {
                    create(sickLeave: $sickLeave)
                  }
                }
            `,
        variables: {
            "sickLeave": {
                "userId": sickLeaveInput.userId,
                "lastModifierId": sickLeaveInput.lastModifierId,
                "start": formatIsoDateForApi(sickLeaveInput.start),
                "end": formatIsoDateForApi(sickLeaveInput.end)
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface UpdateSickLeaveDataResponse extends GraphQLResponse {
    data?: {
        sickLeave?: {
            update: boolean
        }
    }
}
export function RequestUpdateSickLeaveDataRequest(data: UpdateSickLeaveDataInput) {
    return ajaxAuth<UpdateSickLeaveDataResponse>(JSON.stringify({
        query: `
                mutation UpdateSickLeave($id: ID!, $sickLeave: SickLeaveInputType!) {
                  sickLeave {
                    update(id: $id, sickLeave: $sickLeave)
                  }
                }
            `,
        variables: {
            "id": data.id,
            "sickLeave": {
                "userId": data.sickLeaveInput.userId,
                "lastModifierId": data.sickLeaveInput.lastModifierId,
                "start": formatIsoDateForApi(data.sickLeaveInput.start),
                "end": formatIsoDateForApi(data.sickLeaveInput.end)
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface DeleteSickLeaveDataResponse extends GraphQLResponse {
    data?: {
        sickLeave?: {
            delete: boolean
        }
    }
}
export function RequestDeleteSickLeaveDataRequest(id: string) {
    return ajaxAuth<DeleteSickLeaveDataResponse>(JSON.stringify({
        query: `
                mutation DeleteSickLeave($id: ID!) {
                  sickLeave {
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