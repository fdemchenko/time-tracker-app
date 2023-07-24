import {map, Observable} from "rxjs";
import {GetUserFromToken, SetAccessToken} from "./JwtService";
import {
    CreateUserActionPayload, GetUsersActionPayload,
    LoginActionPayload,
    SetPasswordPayload,
    UpdateUserActionPayload
} from "../redux/epics/UserEpics";
import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import User from "../models/User";

interface LoginResponse extends GraphQLResponse {
    data?: {
        auth?: {
            login: string | null
        }
    }
}
export function RequestLogin(payload: LoginActionPayload) {
    return ajaxAuth<LoginResponse>(JSON.stringify({
        query: `
                mutation login($auth: AuthInput!) {
                  auth {
                    login(auth: $auth)
                  }
                }
            `,
        variables: {
            "auth": {
                "email": payload.Email,
                "password": payload.Password
            }
        }
    })).pipe(
        map(res => res.response),
    );
}

interface LogoutResponse extends GraphQLResponse {
    data?: {
        auth: {
            logout: boolean | null
        }
    }
}
export function RequestLogout() {
    return ajaxAuth<LogoutResponse>(JSON.stringify({
        query: `
                mutation logout {
                  auth {
                    logout
                  }
                }
            `
    })).pipe(
        map((res) => res.response)
    );
}

interface GetUsersResponse extends GraphQLResponse {
    data?: {
        user: {
            getAll: {
                items: User[],
                count: number
            }
        }
    }
}

export function RequestGetUsers(payload: GetUsersActionPayload): Observable<GetUsersResponse> {
    return ajaxAuth<GetUsersResponse>(JSON.stringify({
        query: `
               query getAllUsers($offset: Int, $limit: Int, $sortingColumn: String, $search: String, $filteringEmploymentRate: Int, $filteringStatus: String) {
                  user {
                    getAll(offset: $offset, limit: $limit, sortingColumn: $sortingColumn, search: $search, filteringEmploymentRate: $filteringEmploymentRate, filteringStatus: $filteringStatus) {
                       items {
                         id, 
                         email, 
                         employmentRate,
                         employmentDate,
                         fullName,
                         status,
                         hasPassword,
                         permissions,
                         hasValidSetPasswordLink
                        }, count
                    }
                  }
                }
            `,
        variables: {
            "offset": payload.Offset,
            "limit": payload.Limit,
            "sortingColumn": payload.SortingColumn,
            "search": payload.Search,
            "filteringEmploymentRate": payload.FilteringEmploymentRate,
            "filteringStatus": payload.FilteringStatus
        }
    })).pipe(
        map(res => res.response)
    );
}

interface SetSendPasswordLink extends GraphQLResponse {
    data?: {
        user: {
            addSetPasswordLink: boolean
        }
    }
}
export function RequestSetSendPasswordLink(payload: string): Observable<SetSendPasswordLink> {
    return ajaxAuth<SetSendPasswordLink>(JSON.stringify({
        query: `
               mutation addSetPasswordLink($email: String!) {
                  user {
                    addSetPasswordLink(email: $email)
                  }
               }
            `,
        variables: {
            "email": payload,
        }
    })).pipe(
      map(res => res.response)
    );
}

interface SetPasswordResponse extends GraphQLResponse {
    data?: {
        user: {
            setPassword: boolean
        }
    }
}
export function RequestSetPassword(payload: SetPasswordPayload) {
    return ajaxAuth<SetPasswordResponse>(JSON.stringify({
        query: `
                mutation setPassword($user: SetPasswordUserInput!) {
                  user {
                    setPassword(user: $user)
                  }
                }
            `,
        variables: {
            "user": {
                "email": payload.Email,
                "password": payload.Password,
                "setPasswordLink": payload.SetPasswordLink
            }
        }
    })).pipe(
      map(res => res.response)
    );
}

interface CreateUserResponse extends GraphQLResponse {
    data?: {
        user: {
            create: {
                id: string,
                email: string,
                fullName: string
                employmentRate: number,
                employmentDate: string,
                status: string,
                permissions: string,
                hasPassword: boolean,
                hasValidSetPasswordLink: boolean,
            }
        }
    }
}

export function RequestCreateUser(payload: CreateUserActionPayload) {
    return ajaxAuth<CreateUserResponse>(JSON.stringify({
        query: `
                mutation addUser($user: CreateUpdateUser!) {
                 user {
                  create(user: $user) {
                    id,
                    email,
                    refreshToken,
                    status,
                    fullName,
                    employmentRate,
                    employmentDate
                    permissions,
                    hasPassword,
                    hasValidSetPasswordLink
                   } 
                  }
                }
            `,
        variables: {
            "user": {
                "email": payload.Email,
                "fullName": payload.FullName,
                "status": payload.Status,
                "employmentRate": payload.EmploymentRate,
                "employmentDate": payload.EmploymentDate,
                "permissions": payload.Permissions
            }
        }
    })).pipe(
      map(res => res.response)
    );
}

interface UpdateUserResponse extends GraphQLResponse {
    data?: {
        user?: {
            update: {
                id: string,
                email: string,
                fullName: string
                employmentRate: number,
                employmentDate: string,
                status: string,
                permissions: string,
                hasPassword: boolean,
                hasValidSetPasswordLink: boolean,
            }
        }
    }
}

export function RequestUpdateUser(payload: UpdateUserActionPayload) {
    return ajaxAuth<UpdateUserResponse>(JSON.stringify({
        query: `
               mutation updateUser($user: CreateUpdateUser!, $id: ID!) {
                  user {
                    update(user: $user, id: $id){
                        id,
                        email,
                        refreshToken,
                        status,
                        fullName,
                        employmentRate,
                        employmentDate
                        permissions,
                        hasPassword,
                        hasValidSetPasswordLink
                    }
                  }
                }
            `,
        variables: {
            "user": {
                "email": payload.Email,
                "fullName": payload.FullName,
                "status": payload.Status,
                "employmentRate": payload.EmploymentRate,
                "employmentDate": payload.EmploymentDate,
                "permissions": payload.Permissions
            },
            "id": payload.Id,
        }
    })).pipe(
      map(res => res.response)
    );
}

interface FireUserResponse extends GraphQLResponse {
    data?: {
        user: {
            fire: boolean
        }
    }
}
export function RequestFireUser(payload: string) {
    return ajaxAuth<FireUserResponse>(JSON.stringify({
        query: `
                mutation fireUser($id: ID!) {
                  user {
                    fire(id: $id)
                  }
                }
            `,
        variables: {
            "id": payload,
        }
    })).pipe(
      map(res => res.response)
    );
}
