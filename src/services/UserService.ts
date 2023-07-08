import {ajax} from "rxjs/internal/ajax/ajax";
import {map} from "rxjs";
import {GetAccessToken, GetUserFromToken, RemoveAccessToken, SetAccessToken} from "./JwtService";
import {LoginActionPayload} from "../redux/epics/UserEpics";

export function FetchUserFromToken() {
    let token = GetAccessToken();
    if (token === null) {
        return null;
    }
    return GetUserFromToken(token);
}

interface LoginResponse {
    data: {
        auth: {
            login: string
        }
    }
}
export function RequestLogin(payload: LoginActionPayload) {
    return ajax<LoginResponse>({
        url: "https://localhost:7145/graphql",
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
        })
    }).pipe(
        map(res => res.response.data.auth.login),
        map(accessToken => {
            SetAccessToken(accessToken);
            return GetUserFromToken(accessToken);
        })
    );
}

export function RequestLogout() {
    let accessToken = GetAccessToken();

    return ajax({
        url: "https://localhost:7145/graphql",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            query: `
                mutation logout {
                  auth {
                    logout
                  }
                }
            `
        })
    }).pipe(
        map(() => {
            RemoveAccessToken();
        })
    );
}