import {
    USER_ERROR_ACTION,
    GET_USERS_ACTION,
    LOGIN_ACTION,
    LOGOUT_ACTION,
    USER_FOUND_ACTION
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
import {SetUserError, UserRequestFinish, UserRequestStart, RemoveUser, SetUser} from "../slices/UserSlice";
import {RemoveAccessToken} from "../../services/JwtService";
import User from "../../models/User";

//mb we should delete it
export const userFoundActionCreator = (payload: User | null) => (
    {type: USER_FOUND_ACTION, payload: payload});
export const UserFoundEpic: Epic = (action$: Observable<PayloadAction<User | null>>) =>
    action$.pipe(
        ofType(USER_FOUND_ACTION),
        map(action => action.payload),
        mergeMap((payload) => of(SetUser(payload)))
    );

export const userErrorActionCreator = (errorMessage: any) => (
    {type: USER_ERROR_ACTION, payload: errorMessage});
export const UserErrorEpic: Epic = (action$: Observable<PayloadAction<any>>) =>
    action$.pipe(
        ofType(USER_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => {
            if (payload.response?.errors?.[0].message) {
                return of(SetUserError(payload.response.errors[0].message));
            }
            return of(SetUserError("Operation failed. Try again later."));
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
            map((res) => userFoundActionCreator(res)),
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
                return RemoveUser()
            }),
            catchError((err) => of(userErrorActionCreator(err))),
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