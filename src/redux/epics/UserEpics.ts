import {
    USER_ERROR_ACTION,
    GET_USERS_ACTION,
    LOGIN_ACTION,
    LOGOUT_ACTION,
    LOGIN_ERROR_ACTION
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
    SetLoginError, SetUser
} from "../slices/UserSlice";
import {GetUserFromToken, RemoveAccessToken, SetAccessToken} from "../../services/JwtService";
import {SetGlobalErrorMessage} from "../slices/GlobalErrorSlice";
import {defaultErrorMessage} from "../../helpers/notifications";

export const userErrorActionCreator = (error: any) => (
    {type: USER_ERROR_ACTION, payload: error});
export const UserErrorEpic: Epic = (action$: Observable<PayloadAction<any>>) =>
    action$.pipe(
        ofType(USER_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((error) => {
            //console.log(error);
            let message = defaultErrorMessage;
            if (error.response?.errors?.[0].message) {
                message = error.response?.errors?.[0].message;
            }
            return of(SetUserError(message), SetGlobalErrorMessage(message));
        })
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
                    return loginErrorActionCreator();
                }
                return loginErrorActionCreator();
            }),
            catchError((err) => of(userErrorActionCreator(err))),
            startWith(UserRequestStart()),
            endWith(UserRequestFinish())
        ))
    );

export const loginErrorActionCreator = () => ({type: LOGIN_ERROR_ACTION});
export const LoginErrorEpic: Epic = (action$) =>
    action$.pipe(
        ofType(LOGIN_ERROR_ACTION),
        map(() => SetLoginError(true))
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
            //catchError((err) => of(userErrorActionCreator(err))),
            startWith(UserRequestStart()),
            endWith(UserRequestFinish())
        ))
    );

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