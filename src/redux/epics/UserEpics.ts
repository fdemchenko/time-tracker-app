import {
  CREATE_USER_ACTION,
  DEACTIVATE_USER_ACTION,
  GET_USERS_ACTION,
  LOGIN_ACTION,
  LOGOUT_ACTION, MANAGE_USERS_ERROR_ACTION, SET_PASSWORD_ACTION,
  SET_SEND_PASSWORD_LINK_ACTION, UPDATE_USER_ACTION, USER_ERROR_ACTION,
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {
  catchError, EMPTY,
  endWith,
  ignoreElements,
  map,
  mergeMap,
  Observable,
  of,
  startWith, switchMap, tap,
} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";

import {
  RequestCreateUser, RequestDeactivateUser,
  RequestGetUsers,
  RequestLogin,
  RequestLogout,
  RequestSetPassword,
  RequestSetSendPasswordLink,
  RequestUpdateUser
} from "../../services/UserService";
import {
  SetUsers,
  SetError as SetManageUsersError,
  SetLoading as SetManageUsersLoading,
  SetSendPasswordLink,
  CreateUser,
  UpdateUser, FireUser
} from "../slices/ManageUsersSlice";
import User from "../../models/User";
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

export const manageUsersErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
  {type: MANAGE_USERS_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const ManageUsersErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
  action$.pipe(
    ofType(MANAGE_USERS_ERROR_ACTION),
    map(action => action.payload),
    mergeMap((payload) => handleErrorMessage(payload, SetManageUsersError))
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
            catchError((err) => {
                RemoveAccessToken();
                return of(RemoveUser());
            }),
            startWith(UserRequestStart()),
            endWith(UserRequestFinish())
        ))
    );

export const getUsersActionCreator = (payload: GetUsersActionPayload ) =>
  ({type: GET_USERS_ACTION, payload: payload});
export interface GetUsersActionPayload {
  Offset?: number,
  Limit?: number,
  Search?: string,
  SortingColumn?: string,
  FilteringEmploymentRate?: number | null,
  FilteringStatus?: string
}
export const GetUsersEpic: Epic = (action$:  Observable<PayloadAction<GetUsersActionPayload>>) =>
    action$.pipe(
        ofType(GET_USERS_ACTION),
        mergeMap((action) => RequestGetUsers(action.payload).pipe(
            map(res => {
              if (res.data)
                return res.data.user.getAll;
              else
                return {items: [], count: 0};
            }),

            mergeMap(payload => of(SetUsers(payload))),
            catchError((err) => of(manageUsersErrorActionCreator(err))),
            startWith(SetManageUsersLoading(true)),
            endWith(SetManageUsersLoading(false)),
        ))
    );

export const createUserActionCreator = (payload: CreateUserActionPayload) => (
  {type: CREATE_USER_ACTION, payload: payload});
export interface CreateUserActionPayload {
  Email: string,
  FullName: string,
  EmploymentRate: number,
  EmploymentDate: string,
  Status: string,
  Permissions: string
}
export const CreateUserEpic: Epic = (action$: Observable<PayloadAction<CreateUserActionPayload>>) =>
  action$.pipe(
    ofType(CREATE_USER_ACTION),
    mergeMap((action) => RequestCreateUser(action.payload).pipe(
      map(res => {
        if (res.data)
          return res.data.user.create;
        else
          return null;
      }),
      mergeMap(payload => of(CreateUser(payload))),
      catchError((err) => of(manageUsersErrorActionCreator(err))),
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
        catchError((err) => of(manageUsersErrorActionCreator(err))),
        startWith(SetManageUsersLoading(true)),
        endWith(SetManageUsersLoading(false))
      );
    })
  );

export const setPasswordActionCreator = (payload: SetPasswordPayload) => (
  {type: SET_PASSWORD_ACTION, payload: payload});
export interface SetPasswordPayload {
  Email: string,
  Password: string,
  SetPasswordLink: string
}
export const SetPasswordEpic: Epic = (action$: Observable<PayloadAction<SetPasswordPayload>>) =>
  action$.pipe(
    ofType(SET_PASSWORD_ACTION),
    mergeMap(action => {
      const payload = action.payload;

      return RequestSetPassword(payload).pipe(
        catchError((err) => of(manageUsersErrorActionCreator(err))),
        ignoreElements(),
        startWith(SetManageUsersLoading(true)),
        endWith(SetManageUsersLoading(false))
      );
    })
  );

export const updateUserActionCreator = (payload: UpdateUserActionPayload) => (
  {type: UPDATE_USER_ACTION, payload: payload});
export interface UpdateUserActionPayload {
  Id: string,
  Email: string,
  FullName: string,
  EmploymentRate: number,
  EmploymentDate: string,
  Status: string,
  Permissions: string
}
export const UpdateUserEpic: Epic = (action$: Observable<PayloadAction<UpdateUserActionPayload>>) =>
  action$.pipe(
    ofType(UPDATE_USER_ACTION),
    mergeMap((action) => RequestUpdateUser(action.payload).pipe(
      map(res => {
        if (res.data?.user?.update)
          return res.data.user.update;
        else
          return null;
      }),
      mergeMap(payload => of(UpdateUser(payload))),
      catchError((err) => of(manageUsersErrorActionCreator(err))),
      startWith(SetManageUsersLoading(true)),
      endWith(SetManageUsersLoading(false)),
    ))
  );

export const deactivateUserActionCreator = (payload: string) => (
  {type: DEACTIVATE_USER_ACTION, payload: payload});
export const DeactivateUserEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
  action$.pipe(
    ofType(DEACTIVATE_USER_ACTION),
    mergeMap(action => {
      const payload = action.payload;
      return RequestDeactivateUser(payload).pipe(
        mergeMap(() => of(FireUser(payload))),
        catchError((err) => of(manageUsersErrorActionCreator(err))),
        startWith(SetManageUsersLoading(true)),
        endWith(SetManageUsersLoading(false))
      );
    })
  );