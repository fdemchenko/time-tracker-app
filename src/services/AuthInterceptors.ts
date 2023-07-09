import {GetAccessToken, GetUserFromToken, SetAccessToken} from "./JwtService";
import {ajax} from "rxjs/internal/ajax/ajax";
import {catchError, endWith, firstValueFrom, map, of, take} from "rxjs";
import {RemoveUser, SetUser} from "../redux/slices/UserSlice";

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
    let accessToken = GetAccessToken();

    let headers = {
        "Content-Type": "application/json",
        ...(accessToken && {
            Authorization: `Bearer ${accessToken}`,
        }),
    };

    const apiBaseUrl: string = "https://localhost:7145/graphql";

    return ajax<T>({
        url: apiBaseUrl,
        method: "POST",
        async: true,
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
function ajaxRefresh() {
    return ajaxAuth<RefreshResponse>(JSON.stringify({
        query: `
                mutation refresh {
                  auth {
                    refresh
                  }
                }
            `
    })).pipe(
        map(res => {
            let result = res.response;
            if (result.data?.auth.refresh) {
                SetAccessToken(result.data?.auth.refresh);
                let user = GetUserFromToken(result.data.auth.refresh);
                return SetUser(user);
            }
            return RemoveUser();
        }),
        endWith()
    );
}

export function ajaxAuthRefresh<T extends AjaxResponseType>(body: string) {
    return ajaxAuth<T>(body).pipe(
        map(res => {
            let result = res.response;
            if (result.errors?.extensions.code === "ACCESS_DENIED") {
                return ajaxRefresh();
            }

        })
    );
}