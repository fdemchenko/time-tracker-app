import {map} from "rxjs";
import {GetUserFromToken, SetAccessToken} from "./JwtService";
import {LoginActionPayload} from "../redux/epics/UserEpics";
import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import User from "../models/User";

interface LoginResponse extends GraphQLResponse {
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
            getAll: User[] | null
        }
    }
}
export function RequestGetUsers() {
    return ajaxAuth<GetUsersResponse>(JSON.stringify({
        query: `
                query GetUser {
                  user {
                    getAll {
                      id,
                      email,
                      fullName,
                      employmentRate,
                      permissions,
                      status
                    }
                  }
                }
            `
    })).pipe(
        map(res => res.response)
    );
}