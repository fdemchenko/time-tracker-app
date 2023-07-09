import {LOGIN_ACTION, LOGOUT_ACTION} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {RequestLogin, RequestLogout} from "../../services/UserService";
import {AuthError, FinishLoading, AuthStart, RemoveUser, SetUser} from "../slices/UserSlice";

export const loginActionCreator = (payload: LoginActionPayload) => (
    {type: LOGIN_ACTION, payload: payload});
export interface LoginActionPayload {
    Email: string,
    Password: string
}
export const LoginActionEpic: Epic = (action$: Observable<PayloadAction<LoginActionPayload>>) =>
    action$.pipe(
        ofType(LOGIN_ACTION),
        map(action => action.payload),
        mergeMap((payload) => RequestLogin(payload).pipe(
            map((res) => SetUser(res)),
            catchError(() => of(AuthError())),
            startWith(AuthStart()),
            endWith(FinishLoading())
        ))
    );

export const logoutActionCreator = () => ({type: LOGOUT_ACTION});
export const LogoutActionEpic: Epic = (action$) =>
    action$.pipe(
        ofType(LOGOUT_ACTION),
        mergeMap(() => RequestLogout().pipe(
            map(() => RemoveUser()),
            catchError(() => of(AuthError())),
            startWith(AuthStart()),
            endWith(FinishLoading())
        ))
    );