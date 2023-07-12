import {GetAccessToken, IsTokenExpiredInMinute, SetAccessToken} from "./JwtService";
import {ajax} from "rxjs/internal/ajax/ajax";
import {defer, iif, map, mergeMap, of} from "rxjs";

export interface AjaxResponseType {
    data?: any,
    errors?: {
        message: string,
        extensions: {
            "code": string
        }
    }
}
function ajaxWithToken<T>(url: string, body: string, accessToken: string | null) {
    let headers = {
        "Content-Type": "application/json",
        ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
        })
    }
    return ajax<T>({
        url: url,
        method: "POST",
        withCredentials: true,
        headers: headers,
        body: body
    })
}

export function ajaxAuth<T extends AjaxResponseType>(body: string) {
    const apiBaseUrl: string = "https://localhost:7145/graphql";

    return of(GetAccessToken()).pipe(
        mergeMap(accessToken => iif(() => IsTokenExpiredInMinute(accessToken),
            RequestRefresh(apiBaseUrl).pipe(
                mergeMap(res => {
                    if (res.data?.auth.refresh) {
                        SetAccessToken(res.data?.auth.refresh)
                    }
                    return ajaxWithToken<T>(apiBaseUrl, body, GetAccessToken());
                })
            ),
            ajaxWithToken<T>(apiBaseUrl, body, accessToken))
            )
    );
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