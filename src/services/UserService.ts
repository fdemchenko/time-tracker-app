import {map, Observable} from "rxjs";
import {GetUserFromToken, SetAccessToken} from "./JwtService";
import {
    CreateUserActionPayload, GetProfilesActionPayload, GetUsersActionPayload, GetUsersWorkInfoActionPayload,
    LoginActionPayload,
    SetPasswordPayload,
    UpdateUserActionPayload
} from "../redux/epics/UserEpics";
import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import User from "../models/User";
import Profile from "../models/Profile";
import UserWorkInfo from "../models/UserWorkInfo";

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

interface GetProfilesResponse extends GraphQLResponse {
    data?: {
        user: {
            getAllProfiles: {
                items: Profile[],
                count: number
            }
        }
    }
}

export function RequestGetProfiles(payload: GetProfilesActionPayload): Observable<GetProfilesResponse> {
    return ajaxAuth<GetProfilesResponse>(JSON.stringify({
        query: `
               query getAllProfiles($offset: Int, $limit: Int, $search: String, $filteringStatus: String) {
                  user {
                    getAllProfiles(offset: $offset, limit: $limit, search: $search, filteringStatus: $filteringStatus) {
                       items {
                         id, 
                         email, 
                         fullName,
                         status
                        }, count
                    }
                  }
                }
            `,
        variables: {
            "offset": payload.Offset,
            "limit": payload.Limit,
            "search": payload.Search,
            "filteringStatus": payload.FilteringStatus
        }
    })).pipe(
      map(res => res.response)
    );
}

interface GetUsersWorkInfoResponse extends GraphQLResponse {
    data?: {
        user: {
            getAllWorkInfo: {
                items: UserWorkInfo[],
                count: number
            }
        }
    }
}

export function RequestGetUsersWorkInfo(payload: GetUsersWorkInfoActionPayload): Observable<GetUsersWorkInfoResponse> {
    return ajaxAuth<GetUsersWorkInfoResponse>(JSON.stringify({
        query: `
               query getAllWorkInfo($offset: Int, $limit: Int, $sortingColumn: String, $search: String, $filteringEmploymentRate: Int, $filteringStatus: String, 
                                     $start: DateTime, $end: DateTime, $withoutPagination: Boolean) {
                  user {
                    getAllWorkInfo(offset: $offset, limit: $limit, sortingColumn: $sortingColumn, search: $search, filteringEmploymentRate: $filteringEmploymentRate, filteringStatus: $filteringStatus, start: $start, end: $end, withoutPagination: $withoutPagination) {
                      items {
                        userId, email, employmentRate, fullName, 
                        workedHours, plannedWorkingHours, vacationHours, sickLeaveHours
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
            "filteringStatus": payload.FilteringStatus,
            "start": payload.Start,
            "end": payload.End,
            "withoutPagination": payload.WithoutPagination
        }
    })).pipe(
      map(res => res.response)
    );
}

interface GetExcelUsersWorkInfoResponse extends GraphQLResponse {
    data?: {
        user: {
            exportWorkInfoToExcel: number[]
        }
    }
}

export function RequestGetExcelUsersWorkInfo(payload: GetUsersWorkInfoActionPayload): Observable<GetExcelUsersWorkInfoResponse> {
    return ajaxAuth<GetExcelUsersWorkInfoResponse>(JSON.stringify({
        query: `
            query exportWorkInfoToExcel($sortingColumn: String, $search: String, $filteringEmploymentRate: Int, $filteringStatus: String, 
            $start: DateTime, $end: DateTime){
              user {
                exportWorkInfoToExcel(sortingColumn: $sortingColumn, search: $search, filteringEmploymentRate: $filteringEmploymentRate,
                 filteringStatus: $filteringStatus, start: $start, end: $end)
              }
            }
            `,
        variables: {
            "sortingColumn": payload.SortingColumn,
            "search": payload.Search,
            "filteringEmploymentRate": payload.FilteringEmploymentRate,
            "filteringStatus": payload.FilteringStatus,
            "start": payload.Start,
            "end": payload.End,
        }
    })).pipe(
      map(res => res.response)
    );
}

interface GetUsersWithoutPaginationResponse extends GraphQLResponse {
    data?: {
        user: {
            getAllWithoutPagination: User[] | null
        }
    }
}
export function RequestGetUsersWithoutPagination(showFired: boolean) {
    return ajaxAuth<GetUsersWithoutPaginationResponse>(JSON.stringify({
        query: `
                query GetAllUsersWithoutPagination($showFired: Boolean!) {
                  user {
                    getAllWithoutPagination(showFired: $showFired) {
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
            `,
        variables: {
            "showFired": showFired
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
export function RequestDeactivateUser(payload: string) {
    return ajaxAuth<FireUserResponse>(JSON.stringify({
        query: `
                mutation deactivateUser($id: ID!) {
                  user {
                    deactivate(id: $id)
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