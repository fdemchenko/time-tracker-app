import {ajax} from "rxjs/internal/ajax/ajax";
import {map} from "rxjs";
import {GetAccessToken, GetUserFromToken, RemoveAccessToken, SetAccessToken} from "./JwtService";
import {LoginActionPayload} from "../redux/epics/UserEpics";
import {ajaxAuth, AjaxResponseType} from "./AuthInterceptors";

export function FetchUserFromToken() {
    let token = GetAccessToken();
    if (token === null) {
        return null;
    }
    return GetUserFromToken(token);
}

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
        map((res) => {
            if (res.response.data?.auth.logout) {
                RemoveAccessToken();
            }
        })
    );
}