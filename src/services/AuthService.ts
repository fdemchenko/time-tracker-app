import {ajax} from "rxjs/internal/ajax/ajax";
import {LoginActionPayload} from "../redux/epics/AuthEpics";
import {map} from "rxjs";

export function SetAccessToken(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
}
export function GetAccessToken(): string | null {
    return localStorage.getItem("accessToken");
}

interface LoginResponse {
    data: {
        auth: {
            login: {
                accessToken: string,
                refreshToken: string
            }
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
                mutation Login($auth: AuthInput!){
                  auth {
                    login(auth: $auth) {
                      accessToken,
                      refreshToken
                    }
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
        map(res => {
            SetAccessToken(res.accessToken);
            return res;
        })
    );
}