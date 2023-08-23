import {
    CREATE_WORK_SESSION_ACTION, DELETE_WORK_SESSION_ACTION,
    GET_ACTIVE_WORK_SESSION_ACTION, GET_USER_WORK_SESSIONS_ACTION,
    SET_END_WORK_SESSION_ACTION, UPDATE_WORK_SESSION_ACTION,
    WORK_SESSION_ERROR_ACTION
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
  GetUsersWorkSessionsFetchParams,
  RequestCreateWorkSession, RequestDeleteWorkSession,
  RequestGetActiveWorkSession, RequestGetUserWorkSessions,
  RequestSetEndWorkSession, RequestUpdateWorkSession
} from "../../services/WorkSessionService";
import {
  SetActiveWorkSession, SetIsWorkSessionLoading,
  SetWorkSessionError,
  SetWorkSessionList, SetWorkSessionRequireUpdate
} from "../slices/WorkSessionSlice";
import {
    handleErrorMessage,
    HandleErrorMessageType,
} from "../../helpers/errors";
import {SetGlobalMessage} from "../slices/GlobalMessageSlice";
import {Moment} from "moment";
import {WorkSessionInput} from "../../models/work-session/WorkSessionInput";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";
import {WorkSessionUpdateInput} from "../../models/work-session/WorkSessionUpdateInput";

export const workSessionErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
    {type: WORK_SESSION_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const WorkSessionErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
    action$.pipe(
        ofType(WORK_SESSION_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => handleErrorMessage(payload, SetWorkSessionError))
    );

export const getActiveWorkSessionActionCreator = (userId: string) =>
    ({type: GET_ACTIVE_WORK_SESSION_ACTION, payload: userId});
export const GetActiveWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(GET_ACTIVE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((userId) => RequestGetActiveWorkSession(userId).pipe(
            map(res => {
                const errorMsg = "Failed to load active session";
                if (res.errors) {
                    return workSessionErrorActionCreator(res, errorMsg);
                }
                let workSession = res.data?.workSession?.getActiveWorkSessionByUserId;
                if (workSession || workSession === null) {
                    return SetActiveWorkSession(workSession);
                }
                return workSessionErrorActionCreator(res, errorMsg);
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
            startWith(SetIsWorkSessionLoading(true)),
            endWith(SetIsWorkSessionLoading(false))
        ))
    );

export const setEndWorkSessionActionCreator = (id: string, date: Moment) =>
    ({type: SET_END_WORK_SESSION_ACTION, payload: {id, date}});
export const SetEndWorkSessionEpic: Epic = (action$: Observable<PayloadAction<{id: string, date: Moment}>>) =>
    action$.pipe(
        ofType(SET_END_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((payload) => RequestSetEndWorkSession(payload.id, payload.date).pipe(
            map((res) => {
              const errorMsg = "Failed to set work session end";
              if (res.errors) {
                return workSessionErrorActionCreator(res, errorMsg);
              }
              return SetActiveWorkSession(null);
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
            startWith(SetIsWorkSessionLoading(true)),
            endWith(SetIsWorkSessionLoading(false))
        ))
    );

export const createWorkSessionActionCreator = (workSession: WorkSessionInput) =>
    ({type: CREATE_WORK_SESSION_ACTION, payload: workSession});
export const CreateWorkSessionEpic: Epic = (action$: Observable<PayloadAction<WorkSessionInput>>) =>
    action$.pipe(
        ofType(CREATE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((workSession) => RequestCreateWorkSession(workSession).pipe(
            mergeMap((res) => {
                const errorMsg = "Failed to create work session";
                if (res.errors) {
                  return of(workSessionErrorActionCreator(res, errorMsg));
                }
                let workSession = res.data?.workSession?.create;

                if (workSession) {
                  if (workSession.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Active]) {
                    return of(SetActiveWorkSession(workSession));
                  }

                  return of(SetWorkSessionRequireUpdate(),
                    SetGlobalMessage({
                      title: "Success",
                      message: "Work session was successfully created",
                      type: "success"
                    }));
                }

                return of(workSessionErrorActionCreator(res, errorMsg));
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
            startWith(SetIsWorkSessionLoading(true)),
            endWith(SetIsWorkSessionLoading(false))
        ))
    );

export const getUserWorkSessionsActionCreator = (fetchData: GetUsersWorkSessionsFetchParams) =>
    ({type: GET_USER_WORK_SESSIONS_ACTION, payload: fetchData});
export const GetUsersWorkSessionsEpic: Epic = (action$: Observable<PayloadAction<GetUsersWorkSessionsFetchParams>>) =>
    action$.pipe(
        ofType(GET_USER_WORK_SESSIONS_ACTION),
        map(action => action.payload),
        mergeMap((fetchData) => RequestGetUserWorkSessions(fetchData).pipe(
            map((res) => {
                const errorMsg = "Failed to load user sessions";
                if (res.errors) {
                    return workSessionErrorActionCreator(res, errorMsg);
                }
                let workSessions = res.data?.workSession?.getWorkSessionsByUserId;
                if (workSessions) {
                    return SetWorkSessionList(workSessions);
                }
                return workSessionErrorActionCreator(res, errorMsg);
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
            startWith(SetIsWorkSessionLoading(true)),
            endWith(SetIsWorkSessionLoading(false))
        ))
    );

export const updateWorkSessionActionCreator = (id: string, workSession: WorkSessionUpdateInput) =>
    ({type: UPDATE_WORK_SESSION_ACTION, payload: {id, workSession}});
export const UpdateWorkSessionEpic: Epic = (action$: Observable<PayloadAction<{id: string, workSession: WorkSessionUpdateInput}>>) =>
    action$.pipe(
        ofType(UPDATE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((data) => RequestUpdateWorkSession(data.id, data.workSession).pipe(
                mergeMap((res) => {
                  const errorMsg = "Failed to update work session";
                  if (res.errors) {
                    return of(workSessionErrorActionCreator(res, errorMsg));
                  }
                  let workSession = res.data?.workSession?.update;

                  if (workSession) {
                    return of(SetWorkSessionRequireUpdate(),
                      SetGlobalMessage({
                        title: "Success",
                        message: "Work session was successfully updated",
                        type: "success"
                      }));
                  }

                  return of(workSessionErrorActionCreator(res, errorMsg));
                }),
                catchError((err) => of(workSessionErrorActionCreator(err))),
                startWith(SetIsWorkSessionLoading(true)),
                endWith(SetIsWorkSessionLoading(false))
            )
        )
    );

export const deleteWorkSessionActionCreator = (id: string) =>
    ({type: DELETE_WORK_SESSION_ACTION, payload: id});
export const DeleteWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(DELETE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((id) => RequestDeleteWorkSession(id).pipe(
                mergeMap((res) => {
                  const errorMsg = "Failed to delete work session";
                  if (res.errors) {
                    return of(workSessionErrorActionCreator(res, errorMsg));
                  }
                  let workSession = res.data?.workSession?.delete;

                  if (workSession) {
                    return of(SetWorkSessionRequireUpdate(),
                      SetGlobalMessage({
                        title: "Success",
                        message: "Work session was successfully deleted",
                        type: "success"
                      }));
                  }

                  return of(workSessionErrorActionCreator(res, errorMsg));
                }),
                catchError((err) => of(workSessionErrorActionCreator(err))),
                startWith(SetIsWorkSessionLoading(true)),
                endWith(SetIsWorkSessionLoading(false))
            )
        )
    );