import {map, Observable} from "rxjs";
import {GetUserFromToken, SetAccessToken} from "./JwtService";
import {
    CreateUserActionPayload,
    LoginActionPayload,
    SetPasswordPayload,
    UpdateUserActionPayload
} from "../redux/epics/UserEpics";
import {ajaxAuth, AjaxResponseType} from "./AuthInterceptors";
import User from "../models/User";

interface LoginResponse extends AjaxResponseType {
    data?: {
        auth: {
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
        map(res => {
            if (res.data?.auth.login) {
                SetAccessToken(res.data.auth.login);
                return GetUserFromToken(res.data.auth.login);
            }
            return null;
        })
    );
}

interface LogoutResponse extends AjaxResponseType {
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

interface GetUsersResponse extends AjaxResponseType {
    data?: {
        user: {
            getAll: {
                items: User[],
                count: number
            }
        }
    }
}

export function RequestGetUsers(): Observable<GetUsersResponse> {
    return ajaxAuth<GetUsersResponse>(JSON.stringify({
        query: `
               query getAllUsers {
                  user {
                    getAll {
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
            `
    })).pipe(
        map(res => res.response)
    );
}

interface SetSendPasswordLink extends AjaxResponseType {
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

interface SetPasswordResponse extends AjaxResponseType {
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

interface CreateUserResponse extends AjaxResponseType {
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

interface UpdateUserResponse extends AjaxResponseType {
    data?: {
        user: {
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

interface FireUserResponse extends AjaxResponseType {
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
