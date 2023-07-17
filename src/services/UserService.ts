import {map, Observable} from "rxjs";
import {GetUserFromToken, SetAccessToken} from "./JwtService";
import {LoginActionPayload} from "../redux/epics/UserEpics";
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