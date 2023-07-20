import {
    USER_ERROR_ACTION,
    GET_USERS_ACTION,
    LOGIN_ACTION,
    LOGOUT_ACTION
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {
    catchError,
    endWith,
    map,
    mergeMap,
    Observable,
    of,
    startWith,
} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {RequestGetUsers, RequestLogin, RequestLogout} from "../../services/UserService";
import {
    SetUserError,
    UserRequestFinish,
    UserRequestStart,
    RemoveUser,
    SetUser
} from "../slices/UserSlice";
import {GetUserFromToken, RemoveAccessToken, SetAccessToken} from "../../services/JwtService";
import {handleErrorMessage, HandleErrorMessageType} from "../../helpers/errors";

export const userErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
    {type: USER_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const UserErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
    action$.pipe(
        ofType(USER_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => handleErrorMessage(payload, SetUserError))
    );

export const loginActionCreator = (payload: LoginActionPayload) => (
    {type: LOGIN_ACTION, payload: payload});
export interface LoginActionPayload {
    Email: string,
    Password: string
}
export const LoginEpic: Epic = (action$: Observable<PayloadAction<LoginActionPayload>>) =>
    action$.pipe(
        ofType(LOGIN_ACTION),
        map(action => action.payload),
        mergeMap((payload) => RequestLogin(payload).pipe(
            map((res) => {
                let accessToken = res.data?.auth?.login;
                if (accessToken) {
                    SetAccessToken(accessToken);
                    let user = GetUserFromToken(accessToken);
                    if (user) {
                        return SetUser(user);
                    }
                    return userErrorActionCreator(res, "Login failed, please write your correct data", false);
                }
                return userErrorActionCreator(res, "Login failed, please write your correct data", false);
            }),
            catchError((err) => of(userErrorActionCreator(err))),
            startWith(UserRequestStart()),
            endWith(UserRequestFinish())
        ))
    );

export const logoutActionCreator = () => ({type: LOGOUT_ACTION});
export const LogoutEpic: Epic = (action$) =>
    action$.pipe(
        ofType(LOGOUT_ACTION),
        mergeMap(() => RequestLogout().pipe(
            map(() => {
                RemoveAccessToken();
                return RemoveUser();
            }),
            catchError((err) => of(userErrorActionCreator(err))),
            startWith(UserRequestStart()),
            endWith(UserRequestFinish())
        ))
    );

//require rework
export const getUsersActionCreator = () => ({type: GET_USERS_ACTION});
export const GetUsersEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_USERS_ACTION),
        mergeMap(() => RequestGetUsers().pipe(
            map(res => {
                console.log(res)
            }),
            catchError((err) => of(userErrorActionCreator(err))
            )
        ))
    );