import {
  ERROR_ACTION,
  GET_USERS_ACTION,
  LOGIN_ACTION,
  LOGOUT_ACTION,
  SET_SEND_PASSWORD_LINK_ACTION,
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
  startWith, tap,
} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {RequestGetUsers, RequestLogin, RequestLogout, RequestSetSendPasswordLink} from "../../services/UserService";
import {SetError, RequestFinish, RequestStart, RemoveUser, SetUser} from "../slices/UserSlice";
import {SetUsers, SetError as SetManageUsersError, SetLoading as SetManageUsersLoading, SetSendPasswordLink} from "../slices/ManageUsersSlice";
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

export const errorActionCreator = (errorMessage: any) => (
    {type: ERROR_ACTION, payload: errorMessage});
export const ErrorEpic: Epic = (action$: Observable<PayloadAction<any>>) =>
    action$.pipe(
        ofType(ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => {
            if (payload.response?.errors?.[0].message) {
                return of(SetError(payload.response.errors[0].message));
            }
            return of(SetError("Operation failed. Try again later."));
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
            catchError((err) => of(errorActionCreator(err))),
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
            catchError((err) => of(errorActionCreator(err))),
            startWith(RequestStart()),
            endWith(RequestFinish())
        ))
    );

export const getUsersActionCreator = () => ({type: GET_USERS_ACTION});
export const GetUsersEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_USERS_ACTION),
        mergeMap(() => RequestGetUsers().pipe(
            map(res => {
              if (res.data)
                return res.data.user.getAll;
              else
                return {items: [], count: 0};
            }),
            mergeMap(payload => of(SetUsers(payload))),
            catchError((err) => of(SetManageUsersError(err))),
            startWith(SetManageUsersLoading(true)),
            endWith(SetManageUsersLoading(false)),
        ))
    );

export const setSendPasswordLinkActionCreator = (payload: string) => (
  {type: SET_SEND_PASSWORD_LINK_ACTION, payload: payload});
export const SetSendPasswordLinkEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
  action$.pipe(
    ofType(SET_SEND_PASSWORD_LINK_ACTION),
    mergeMap(action => {
      const payload = action.payload;

      return RequestSetSendPasswordLink(payload).pipe(
        mergeMap(() => of(SetSendPasswordLink(payload))),
        catchError((err) => of(SetManageUsersError(err))),
        startWith(SetManageUsersLoading(true)),
        endWith(SetManageUsersLoading(false))
      );
    })
  );