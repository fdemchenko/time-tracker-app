import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import WorkSession from "../models/work-session/WorkSession";
import {Moment} from "moment";
import {WorkSessionInput} from "../models/work-session/WorkSessionInput";
import {WorkSessionWithRelations} from "../models/work-session/WorkSessionWithRelations";
import {WorkSessionUpdateInput} from "../models/work-session/WorkSessionUpdateInput";
import {formatIsoDateForApi} from "../helpers/date";

interface GetActiveWorkSessionResponse extends GraphQLResponse {
    data?: {
        workSession: {
            getActiveWorkSessionByUserId: WorkSession | null
        }
    }
}
export function RequestGetActiveWorkSession(userId: string) {
    return ajaxAuth<GetActiveWorkSessionResponse>(JSON.stringify({
        query: `
                query GetWorkSessionById($userId: ID!) {
                  workSession {
                    getActiveWorkSessionByUserId(userId: $userId) {
                        id,
                        userId,
                        lastModifierId,
                        start,
                        end,
                        type,
                        title,
                        description
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

interface SetEndWorkSessionResponse extends GraphQLResponse {
    data?: {
        workSession: {
            setEnd: boolean | null
        }
    }
}
export function RequestSetEndWorkSession(id: string, date: Moment) {
    return ajaxAuth<SetEndWorkSessionResponse>(JSON.stringify({
        query: `
                mutation SetWorkSessionEnd($id: ID!, $endDateTime: DateTime!) {
                  workSession {
                    setEnd(id: $id, endDateTime: $endDateTime)
                  }
                }
            `,
        variables: {
            "id": id,
            "endDateTime": date.toISOString()
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface CreateWorkSessionResponse extends GraphQLResponse {
    data?: {
        workSession: {
            create: WorkSession | null
        }
    }
}
export function RequestCreateWorkSession(workSession: WorkSessionInput) {
    return ajaxAuth<CreateWorkSessionResponse>(JSON.stringify({
        query: `
                mutation CreateWorkSession($workSession: WorkSessionInputType!) {
                  workSession {
                    create(workSession: $workSession) {
                      id
                      userId
                      start
                      end
                      type
                      title
                      description
                      lastModifierId
                    } 
                  }
                }
            `,
        variables: {
            "workSession": {
                "userId": workSession.userId,
                "start": workSession.start,
                "end": workSession.end,
                "type": workSession.type,
                "title": workSession.title,
                "description": workSession.description,
                "lastModifierId": workSession.lastModifierId
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface GetUsersWorkSessionsResponse extends GraphQLResponse {
    data?: {
        workSession?: {
            getWorkSessionsByUserId: {
                count: number,
                items: WorkSessionWithRelations[]
            } | null
        }
    }
}
export interface GetUsersWorkSessionsFetchParams {
    userId: string,
    orderByDesc?: boolean | null,
    offset?: number | null,
    limit?: number | null,
    startDate?: string | null,
    endDate?: string | null,
    showPlanned?: boolean | null
}
export function RequestGetUserWorkSessions(fetchData: GetUsersWorkSessionsFetchParams) {
    return ajaxAuth<GetUsersWorkSessionsResponse>(JSON.stringify({
        query: `
                query GetWorkSessionsWithPagination($userId: ID!, $orderByDesc: Boolean, $offset: Int, $limit: Int
                                   $startDate: Date, $endDate: Date, $showPlanned: Boolean) {
                  workSession {
                    getWorkSessionsByUserId(userId: $userId, orderByDesc: $orderByDesc, offset: $offset,
                    limit: $limit, startDate: $startDate, endDate: $endDate, showPlanned: $showPlanned)  {
                      count
                      items {
                        workSession {
                          id
                          userId
                          start
                          end
                          type
                          title
                          description
                          lastModifierId
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
                }
            `,
        variables: {
            "userId": fetchData.userId,
            "orderByDesc": fetchData.orderByDesc,
            "offset": fetchData.offset,
            "limit": fetchData.limit,
            "startDate": fetchData.startDate ? formatIsoDateForApi(fetchData.startDate) : null,
            "endDate": fetchData.endDate ? formatIsoDateForApi(fetchData.endDate) : null,
            "showPlanned": fetchData.showPlanned
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface GetWorkSessionsByUserIdsByMonthResponse extends GraphQLResponse {
    data?: {
        workSession?: {
            getWorkSessionsByUserIdsByMonth: WorkSessionWithRelations[] | null
        }
    }
}
export interface GetWorkSessionsByUserIdsByMonthFetchParams {
    userIds: string[],
    monthDate: string,
    hidePlanned: boolean
}
export function RequestGetWorkSessionsByUserIdsByMonth(fetchData: GetWorkSessionsByUserIdsByMonthFetchParams) {
    return ajaxAuth<GetWorkSessionsByUserIdsByMonthResponse>(JSON.stringify({
        query: `
                query GetWorkSessionsByUserIdsByMonth($userIds: [ID]!, $monthDate: Date!, $hidePlanned: Boolean!) {
                  workSession {
                    getWorkSessionsByUserIdsByMonth(userIds: $userIds, monthDate: $monthDate, hidePlanned: $hidePlanned) {
                      workSession {
                        id
                        userId
                        start
                        end
                        type
                        title
                        description
                        lastModifierId
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
            "userIds": fetchData.userIds,
            "monthDate": formatIsoDateForApi(fetchData.monthDate),
            "hidePlanned": fetchData.hidePlanned
        }
    })).pipe(
      map((res) => res.response)
    );
}

interface UpdateWorkSessionResponse extends GraphQLResponse {
    data?: {
        workSession?: {
            update: boolean | null
        }
    }
}
export function RequestUpdateWorkSession(id: string, workSession: WorkSessionUpdateInput) {
    return ajaxAuth<UpdateWorkSessionResponse>(JSON.stringify({
        query: `
                mutation UpdateWorkSession($id: ID!, $workSession: WorkSessionInputUpdateType!) {
                  workSession {
                    update(id: $id, workSession: $workSession)
                  }
                }
            `,
        variables: {
            "id": id,
            "workSession": {
                "start": workSession.start,
                "end": workSession.end,
                "title": workSession.title,
                "description": workSession.description,
                "lastModifierId": workSession.lastModifierId
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface DeleteWorkSessionResponse extends GraphQLResponse {
    data?: {
        workSession?: {
            delete: boolean | null
        }
    }
}
export function RequestDeleteWorkSession(id: string) {
    return ajaxAuth<DeleteWorkSessionResponse>(JSON.stringify({
        query: `
                mutation DeleteWorkSession($id: ID!) {
                  workSession {
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