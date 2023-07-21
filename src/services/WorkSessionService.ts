import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import WorkSession from "../models/WorkSession";

export function getNewIsoDate() {
    let date = new Date();
    date.setTime(date.getTime() + (-date.getTimezoneOffset() * 60 * 1000));
    return date.toISOString();
}

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
            "endDateTime": getNewIsoDate()
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
export function RequestCreateWorkSession(userId: string) {
    return ajaxAuth<CreateWorkSessionResponse>(JSON.stringify({
        query: `
                mutation CreateWorkSession($workSession: WorkSessionInputType!) {
                  workSession {
                    create(workSession: $workSession) {
                      id,
                      userId,
                      start,
                      end
                    }
                  }
                }
            `,
        variables: {
            "workSession": {
                "userId": userId,
                "start": getNewIsoDate()
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface GetUsersWorkSessionsResponse extends GraphQLResponse {
    data?: {
        workSession?: {
            getWorkSessionsByUserId: WorkSession[] | null
        }
    }
}
export function RequestGetUserWorkSessions(userId: string) {
    return ajaxAuth<GetUsersWorkSessionsResponse>(JSON.stringify({
        query: `
                query GetWorkSessionsByUserId($userId: ID!) {
                  workSession {
                    getWorkSessionsByUserId(userId: $userId) {
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