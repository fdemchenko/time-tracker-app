import {GetAccessToken} from "./JwtService";
import {ajax} from "rxjs/internal/ajax/ajax";

export interface AjaxResponseType {
    data?: any,
    errors?: {
        message: string,
        extensions: {
            "code": string
        }
    }
}
export function ajaxAuth<T>(body: string) {
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
    })
}