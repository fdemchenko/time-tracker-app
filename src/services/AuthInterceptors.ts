import {GetAccessToken, IsTokenExpiredInMinute, SetAccessToken} from "./JwtService";
import {ajax} from "rxjs/internal/ajax/ajax";
import {defer, map} from "rxjs";

export interface AjaxResponseType {
    data?: any,
    errors?: {
        message: string,
        extensions: {
            "code": string
        }
    }
}
export function ajaxAuth<T extends AjaxResponseType>(body: string) {
    const apiBaseUrl: string = "https://localhost:7145/graphql";

    let accessToken = GetAccessToken();

    if (IsTokenExpiredInMinute(accessToken)) {
        const refreshObs = defer(() => RequestRefresh(apiBaseUrl));
        refreshObs.subscribe((res) => {
            if (res.data?.auth.refresh) {
                SetAccessToken(res.data?.auth.refresh)
                accessToken = GetAccessToken();
            }
        })
    }


    let headers = {
        "Content-Type": "application/json",
        ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
        }),
    };

    return ajax<T>({
        url: apiBaseUrl,
        method: "POST",
        withCredentials: true,
        headers: headers,
        body: body
    });
}

interface RefreshResponse extends AjaxResponseType {
    data?: {
        auth: {
            refresh: string | null
        }
    }
}
export function RequestRefresh(url: string) {
    return ajax<RefreshResponse>({
        url: url,
        method: "POST",
        withCredentials: true,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `
                mutation refresh {
                  auth {
                    refresh
                  }
                }
            `
        })
    }).pipe(
        map(res => res.response)
    );
}