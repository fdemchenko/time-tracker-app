import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import WorkSession from "../models/WorkSession";
import {CreateWorkSessionPayload, GetWorkSessionsInput} from "../redux/epics/WorkSessionEpics";

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
                      id
                      userId
                      start
                      end
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
export function RequestSetEndWorkSession(id: string) {
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
            "endDateTime": new Date().toISOString()
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
export function RequestCreateWorkSession(workSession: CreateWorkSessionPayload) {
    return ajaxAuth<CreateWorkSessionResponse>(JSON.stringify({
        query: `
                mutation CreateWorkSession($workSession: WorkSessionInputType!) {
                  workSession {
                    create(workSession: $workSession) {
                      id,
                      userId,
                      start,
                      end,
                      type,
                      title,
                      description,
                    }
                  }
                }
            `,
        variables: {
            "workSession": {
                "userId": workSession.UserId,
                "start": workSession.Start ?? new Date().toISOString(),
                "end": workSession.End ?? null,
                "type": workSession.Type ?? "active",
                "title": workSession.Title,
                "description": workSession.Description
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
                items: WorkSession[]
            } | null
        }
    }
}
export function RequestGetUserWorkSessions(fetchData: GetWorkSessionsInput) {
    return ajaxAuth<GetUsersWorkSessionsResponse>(JSON.stringify({
        query: `
                query GetWorkSessionsByUserId($userId: ID!, $orderByDesc: Boolean,
                             $offset: Int, $limit: Int, $filterDate: DateTime) {
                  workSession {
                    getWorkSessionsByUserId(userId: $userId, orderByDesc: $orderByDesc, offset: $offset, limit: $limit, filterDate: $filterDate) {
                      count,
                      items {
                        id,
                        userId,
                        start,
                        end,
                        title,
                        description,
                        type
                      }
                    } 
                  }
                }
            `,
        variables: {
            "userId": fetchData.userId,
            "orderByDesc": fetchData.orderByDesc ?? null,
            "offset": fetchData.offset ?? null,
            "limit": fetchData.limit ?? null,
            "filterDate": fetchData.filterDate ?? null
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
export function RequestUpdateWorkSession(workSession: WorkSession) {
    return ajaxAuth<UpdateWorkSessionResponse>(JSON.stringify({
        query: `
                mutation UpdateWorkSession($id: ID!, $workSession: WorkSessionInputUpdateType!) {
                  workSession {
                    update(id: $id, workSession: $workSession)
                  }
                }
            `,
        variables: {
            "id": workSession.id,
            "workSession": {
                "userId": workSession.userId,
                "start": workSession.start,
                "end": workSession.end,
                "title": workSession.title,
                "description": workSession.description
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