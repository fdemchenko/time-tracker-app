import {
  CREATE_USER_ACTION,
  DEACTIVATE_USER_ACTION,
  GET_PROFILES_ACTION,
  GET_USERS_ACTION,
  GET_USERS_BY_IDS_ACTION,
  GET_USERS_WITHOUT_PAGINATION_ACTION,
  GET_USERS_WORK_INFO_ACTION,
  GET_USERS_WORK_INFO_EXCEL_ACTION,
  LOGIN_ACTION,
  LOGOUT_ACTION,
  MANAGE_USERS_ERROR_ACTION,
  PROFILE_ERROR_ACTION,
  SET_PASSWORD_ACTION,
  SET_SEND_PASSWORD_LINK_ACTION,
  UPDATE_USER_ACTION,
  USER_ERROR_ACTION,
  USER_WORK_INFO_ERROR_ACTION,
} from "../actions";
import {Epic, ofType, StateObservable} from "redux-observable";
import {
  catchError,
  endWith,
  ignoreElements,
  map,
  mergeMap,
  Observable,
  of,
  startWith,
} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";

import {
  RequestCreateUser, RequestDeactivateUser, RequestGetProfiles, RequestGetExcelUsersWorkInfo,
  RequestGetUsers, RequestGetUsersWithoutPagination, RequestGetUsersWorkInfo,
  RequestLogin,
  RequestLogout,
  RequestSetPassword,
  RequestSetSendPasswordLink,
  RequestUpdateUser, RequestGetUsersByIds
} from "../../services/UserService";
import {
  SetUsers,
  SetError as SetManageUsersError,
  SetSendPasswordLink,
  CreateUser,
  UpdateUser, FireUser, SetUsersWithoutPagination, SetUserLoading, AddUsersWithoutPagination
} from "../slices/ManageUsersSlice";
import {
  SetProfiles,
  SetError as SetProfilesError,
  SetLoading as SetProfilesLoading,
} from "../slices/ProfileSlice";
import {
  SetUserWorkInfoList,
  SetExcelBytesNumbers,
  SetError as SetUserWorkInfoError,
  SetLoading as SetUserWorkInfoLoading
} from "../slices/UserWorkInfoSlice";
import {
    SetUserError,
    UserRequestFinish,
    UserRequestStart,
    RemoveUser,
    SetUser
} from "../slices/UserSlice";
import {GetUserFromToken, RemoveAccessToken, SetAccessToken} from "../../services/JwtService";
import {handleErrorMessage, HandleErrorMessageType} from "../../helpers/errors";
import {RootState} from "../store";

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

export const profileErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
  {type: PROFILE_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const ProfileErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
  action$.pipe(
    ofType(PROFILE_ERROR_ACTION),
    map(action => action.payload),
    mergeMap((payload) => handleErrorMessage(payload, SetProfilesError))
  );

export const userWorkInfoErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
  {type: USER_WORK_INFO_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const UserWorkInfoErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
  action$.pipe(
    ofType(USER_WORK_INFO_ERROR_ACTION),
    map(action => action.payload),
    mergeMap((payload) => handleErrorMessage(payload, SetUserWorkInfoError))
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
            startWith(SetUserLoading(true)),
            endWith(SetUserLoading(false)),
        ))
    );

//epic to get users which is not currently in state (manageUser state)
export const getUsersByIdsActionCreator = (ids: Set<string>) =>
  ({type: GET_USERS_BY_IDS_ACTION, payload: ids});
export const GetUsersByIdsEpic: Epic = (action$:  Observable<PayloadAction<Set<string>>>,
                                        state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType(GET_USERS_BY_IDS_ACTION),
    map(action => action.payload),
    mergeMap((rawIds) => {
      const existingUsersIds = state$.value.manageUsers.usersWithoutPagination.map(u => u.id);
      const idsToFind = Array.from(rawIds).filter(id => !existingUsersIds.includes(id));

      if (idsToFind.length > 0) {
        return RequestGetUsersByIds(idsToFind).pipe(
          map(res => {
            const errorMsg = "Failed to load users data";
            if (res.errors) {
              return manageUsersErrorActionCreator(res, errorMsg);
            }

            let users = res.data?.user.getUsersByIds;
            if (users) {
              const stateUsersIds = state$.value.manageUsers.usersWithoutPagination.map(stateUser => stateUser.id);
              return AddUsersWithoutPagination(users.filter(u => !stateUsersIds.includes(u.id)));
            }
            return manageUsersErrorActionCreator(res, errorMsg);
          }),
          catchError((err) => of(manageUsersErrorActionCreator(err))),
          startWith(SetUserLoading(true)),
          endWith(SetUserLoading(false)),
        )
      }

      return of(SetUserLoading(false));
    })
  );

export const getProfilesActionCreator = (payload: GetProfilesActionPayload ) =>
  ({type: GET_PROFILES_ACTION, payload: payload});
export interface GetProfilesActionPayload {
  Offset?: number,
  Limit?: number,
  Search?: string,
  FilteringStatus?: string
}
export const GetProfilesEpic: Epic = (action$:  Observable<PayloadAction<GetProfilesActionPayload>>) =>
  action$.pipe(
    ofType(GET_PROFILES_ACTION),
    mergeMap((action) => RequestGetProfiles(action.payload).pipe(
      map(res => {
        if (res.data)
          return res.data.user.getAllProfiles;
        else
          return {items: [], count: 0};
      }),

      mergeMap(payload => of(SetProfiles(payload))),
      catchError((err) => of(profileErrorActionCreator(err))),
      startWith(SetProfilesLoading(true)),
      endWith(SetProfilesLoading(false)),
    ))
  );

export const getUsersWorkInfoActionCreator = (payload: GetUsersWorkInfoActionPayload ) =>
  ({type: GET_USERS_WORK_INFO_ACTION, payload: payload});
export interface GetUsersWorkInfoActionPayload {
  Offset?: number,
  Limit?: number,
  Search?: string,
  SortingColumn?: string,
  FilteringEmploymentRate?: number | null,
  FilteringStatus?: string,
  Start?: string | null,
  End?: string | null,
  WithoutPagination?: boolean
}
export const GetUsersWorkInfoEpic: Epic = (action$:  Observable<PayloadAction<GetUsersWorkInfoActionPayload>>) =>
  action$.pipe(
    ofType(GET_USERS_WORK_INFO_ACTION),
    mergeMap((action) => RequestGetUsersWorkInfo(action.payload).pipe(
      map(res => {
        if (res.data) {
          return res.data.user.getAllWorkInfo;
        }
        else
          return {items: [], count: 0};
      }),

      mergeMap(payload => of(SetUserWorkInfoList(payload))),
      catchError((err) => of(userWorkInfoErrorActionCreator(err))),
      startWith(SetUserWorkInfoLoading(true)),
      endWith(SetUserWorkInfoLoading(false)),
    ))
  );

export const getUsersWorkInfoExcelActionCreator = (payload: GetUsersWorkInfoActionPayload ) =>
  ({type: GET_USERS_WORK_INFO_EXCEL_ACTION, payload: payload});

export const GetUsersWorkInfoExcelEpic: Epic = (action$:  Observable<PayloadAction<GetUsersWorkInfoActionPayload>>) =>
  action$.pipe(
    ofType(GET_USERS_WORK_INFO_EXCEL_ACTION),
    mergeMap((action) => RequestGetExcelUsersWorkInfo(action.payload).pipe(
      map(res => {
        if (res.data)
          return res.data.user.exportWorkInfoToExcel;
        else
          return [];
      }),

      mergeMap(payload => of(SetExcelBytesNumbers(payload))),
      catchError((err) => of(userWorkInfoErrorActionCreator(err))),
      startWith(SetUserWorkInfoLoading(true)),
      endWith(SetUserWorkInfoLoading(false)),
    ))
  );

export const getUsersWithoutPaginationActionCreator = (showFired: boolean) =>
  ({type: GET_USERS_WITHOUT_PAGINATION_ACTION, payload: showFired});
export const GetUsersWithoutPaginationEpic: Epic = (action$:  Observable<PayloadAction<boolean>>,
                                                    state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType(GET_USERS_WITHOUT_PAGINATION_ACTION),
    map(action => action.payload),
    mergeMap((showFired) => RequestGetUsersWithoutPagination(showFired).pipe(
      map(res => {
        const errorMsg = "Failed to load users";
        if (res.errors) {
          return userErrorActionCreator(res, errorMsg);
        }

        let users = res.data?.user.getAllWithoutPagination;
        if (users) {
          const stateUsersIds = state$.value.manageUsers.usersWithoutPagination.map(stateUser => stateUser.id);
          return AddUsersWithoutPagination(users.filter(u => !stateUsersIds.includes(u.id)));
        }
        return userErrorActionCreator(res, errorMsg);
      }),
      catchError((err) => of(profileErrorActionCreator(err))),
      startWith(SetUserLoading(true)),
      endWith(SetUserLoading(false)),
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
      startWith(SetUserLoading(true)),
      endWith(SetUserLoading(false)),
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
        startWith(SetUserLoading(true)),
        endWith(SetUserLoading(false))
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
        startWith(SetUserLoading(true)),
        endWith(SetUserLoading(false))
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
      startWith(SetUserLoading(true)),
      endWith(SetUserLoading(false)),
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
        startWith(SetUserLoading(true)),
        endWith(SetUserLoading(false))
      );
    })
  );