import {
    ERROR_ACTION,
    GET_USERS_ACTION,
    LOGIN_ACTION,
    LOGOUT_ACTION,
    REFRESH_ACTION, REFRESH_FAILED_ACTION,
    USER_FOUND_ACTION
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {
    catchError,
    endWith,
    map, merge,
    mergeMap,
    mergeWith,
    Observable,
    of,
    startWith,
    take,
    takeUntil, tap
} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {RequestGetUsers, RequestLogin, RequestLogout, RequestRefresh} from "../../services/UserService";
import {SetError, RequestFinish, RequestStart, RemoveUser, SetUser} from "../slices/UserSlice";
import {GetUserFromToken, RemoveAccessToken, SetAccessToken} from "../../services/JwtService";
import User from "../../models/User";

export const userFoundActionCreator = (payload: User | null) => (
    {type: USER_FOUND_ACTION, payload: payload});
export const UserFoundEpic: Epic = (action$: Observable<PayloadAction<User | null>>) =>
    action$.pipe(
        ofType(USER_FOUND_ACTION),
        map(action => action.payload),
        mergeMap((payload) => of(SetUser(payload)))
    );

export const errorActionCreator = () => (
    {type: ERROR_ACTION});
export const ErrorEpic: Epic = (action$) =>
    action$.pipe(
        ofType(ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => of(SetError(payload)))
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
            catchError(() => of(errorActionCreator())),
            startWith(RequestStart()),
            endWith(RequestFinish())
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
            catchError((err) => of(errorActionCreator())),
            startWith(RequestStart()),
            endWith(RequestFinish())
        ))
    );

export const refreshFailedActionCreator = (payload: any) => (
    {type: REFRESH_FAILED_ACTION, payload: payload});
export const RefreshFailedEpic: Epic = (action$: Observable<PayloadAction<any>>) =>
    action$.pipe(
        ofType(REFRESH_FAILED_ACTION),
        map(action => action.payload),
        mergeMap((error) => of(SetError()))
    );

export const refreshActionCreator = () => ({type: REFRESH_ACTION});
export const RefreshEpic: Epic = (action$) =>
    action$.pipe(
        ofType(REFRESH_ACTION),
        tap(() => console.log("refresh")),
        mergeMap(() => RequestRefresh().pipe(
            map(res => {
                if (res.data?.auth.refresh) {
                    let accessToken = res.data?.auth.refresh;
                    SetAccessToken(accessToken);
                    let user = GetUserFromToken(accessToken);
                    return userFoundActionCreator(user);
                }
                return logoutActionCreator();
            }),
            catchError((err) => of(logoutActionCreator()))
        ))
    );

// export const ReLoginEpic: Epic = (action$) =>
//     action$.pipe(
//         ofType(USER_FOUND_ACTION),
//         takeUntil(action$.pipe(ofType(LOGOUT_ACTION))),
//         take(1),
//         mergeMapTo(source),
//         mergeWith(of(refreshActionCreator()))
//     );

export const handleError = (error: any, action$: Observable<any>)  => {
    if (error.response?.errors?.[0]?.extensions?.code === "ACCESS_DENIED") {
        return action$.pipe(
            ofType(USER_FOUND_ACTION),
            take(1),
            mergeMap(() => action$),
            mergeWith(of(refreshActionCreator()))
        )
    }
    return of(errorActionCreator());
}

export const getUsersActionCreator = () => ({type: GET_USERS_ACTION});
export const GetUsersEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_USERS_ACTION),
        mergeMap(() => RequestGetUsers().pipe(
            map(res => {
                console.log(res)
            }),
            catchError((error, source) => {
                if(error.response?.errors?.[0]?.extensions?.code === "ACCESS_DENIED") {
                    return action$.pipe(
                        ofType(USER_FOUND_ACTION),
                        takeUntil(action$.pipe(ofType(LOGOUT_ACTION))),
                        take(1),
                        mergeMap(() => source),
                        //merge(of(refreshActionCreator()))
                    )
                } else {
                    return of(errorActionCreator()) // failure action
                }
            })
        ))
    );