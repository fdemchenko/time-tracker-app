import {GetAccessToken, GetUserFromToken, SetAccessToken} from "./JwtService";
import {ajax} from "rxjs/internal/ajax/ajax";
import {endWith, map} from "rxjs";
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

// export function ajaxAuthRefresh<T extends AjaxResponseType>(body: string) {
//     return ajaxAuth<T>(body).pipe(
//         map(res => {
//             let result = res.response;
//             if (result.errors?.extensions.code === "ACCESS_DENIED") {
//                 return ajaxRefresh();
//             }
//
//         })
//     );
// }