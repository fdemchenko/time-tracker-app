import {
    CREATE_WORK_SESSION_ACTION, DELETE_WORK_SESSION_ACTION,
    GET_ACTIVE_WORK_SESSION_ACTION, GET_USER_WORK_SESSIONS_ACTION,
    SET_END_WORK_SESSION_ACTION, UPDATE_WORK_SESSION_ACTION,
    WORK_SESSION_ERROR_ACTION
} from "../actions";
import {Epic, ofType, StateObservable} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
    RequestCreateWorkSession, RequestDeleteWorkSession,
    RequestGetActiveWorkSession, RequestGetUserWorkSessions,
    RequestSetEndWorkSession, RequestUpdateWorkSession
} from "../../services/WorkSessionService";
import {
    RemoveActiveWorkSession,
    SetActiveWorkSession, SetIsWorkSessionLoading,
    SetWorkSessionError,
    SetWorkSessionList
} from "../slices/WorkSessionSlice";
import {
    ActiveWorkSessionErrorMessage,
    ErrorCodes,
    handleErrorMessage,
    HandleErrorMessageType,
    NoPermissionErrorMessage
} from "../../helpers/errors";
import WorkSession from "../../models/WorkSession";
import {SetGlobalMessage} from "../slices/GlobalMessageSlice";
import {RootState} from "../store";

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
                if (res.errors) {
                    return workSessionErrorActionCreator(res, "Failed to load active session");
                }
                let workSession = res.data?.workSession?.getActiveWorkSessionByUserId;
                if (workSession !== undefined) {
                    return SetActiveWorkSession(workSession);
                }
                return workSessionErrorActionCreator(res, "Failed to load active session");
            }),
            catchError((err) => of(workSessionErrorActionCreator(err)))
        ))
    );

export const setEndWorkSessionActionCreator = (id: string) =>
    ({type: SET_END_WORK_SESSION_ACTION, payload: id});
export const SetEndWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(SET_END_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((id) => RequestSetEndWorkSession(id).pipe(
            map((res) => {
                if (res.data?.workSession?.setEnd) {
                    return RemoveActiveWorkSession();
                }
                return workSessionErrorActionCreator(res, "Failed to finish session");
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
        ))
    );

export const createWorkSessionActionCreator = (userId: string) =>
    ({type: CREATE_WORK_SESSION_ACTION, payload: userId});
export const CreateWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(CREATE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((userId) => RequestCreateWorkSession(userId).pipe(
            map((res) => {
                let workSession = res.data?.workSession?.create;
                if (workSession) {
                    return SetActiveWorkSession(workSession);
                }
                return workSessionErrorActionCreator(res, "Failed to start new session");
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
        ))
    );

export const getUserWorkSessionsActionCreator = (fetchData: GetWorkSessionsInput) =>
    ({type: GET_USER_WORK_SESSIONS_ACTION, payload: fetchData});

export interface GetWorkSessionsInput {
    userId: string,
    orderByDesc: boolean,
    offset: number,
    limit: number,
    filterDate: string | null
}

export const GetUsersWorkSessionsEpic: Epic = (action$: Observable<PayloadAction<GetWorkSessionsInput>>) =>
    action$.pipe(
        ofType(GET_USER_WORK_SESSIONS_ACTION),
        map(action => action.payload),
        mergeMap((fetchData) => RequestGetUserWorkSessions(fetchData).pipe(
            map((res) => {
                if (res.errors) {
                    return workSessionErrorActionCreator(res, "Failed to load user sessions");
                }
                let workSessions = res.data?.workSession?.getWorkSessionsByUserId;
                if (workSessions) {
                    return SetWorkSessionList(workSessions);
                }
                return workSessionErrorActionCreator(res, "Failed to load user sessions");
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
            startWith(SetIsWorkSessionLoading(true)),
            endWith(SetIsWorkSessionLoading(false))
        ))
    );

export const updateWorkSessionActionCreator = (data: WorkSession) =>
    ({type: UPDATE_WORK_SESSION_ACTION, payload: data});
export const UpdateWorkSessionEpic: Epic = (action$: Observable<PayloadAction<WorkSession>>) =>
    action$.pipe(
        ofType(UPDATE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((workSession) => RequestUpdateWorkSession(workSession).pipe(
                mergeMap((res) => {
                    if (res.errors) {
                        if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.NO_PERMISSION]) {
                            return of(SetGlobalMessage({title: "Error", message: NoPermissionErrorMessage, type: "danger"}));
                        }
                        if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.WORK_SESSION_IS_ACTIVE]) {
                            return of(SetGlobalMessage({title: "Error", message: ActiveWorkSessionErrorMessage, type: "danger"}));
                        }
                        return of(SetGlobalMessage({title: "Error", message: "Failed to update session", type: "danger"}));
                    }
                    return of(SetGlobalMessage({title: "Success", message: "Updated successfully", type: "success"}),
                        getActiveWorkSessionActionCreator(workSession.userId));
                }),
                catchError((err) => of(workSessionErrorActionCreator(err))),
                startWith(SetIsWorkSessionLoading(true)),
                endWith(SetIsWorkSessionLoading(false))
            )
        )
    );

export const deleteWorkSessionActionCreator = (id: string) =>
    ({type: DELETE_WORK_SESSION_ACTION, payload: id});
export const DeleteWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>, state$: StateObservable<RootState>) =>
    action$.pipe(
        ofType(DELETE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((id) => RequestDeleteWorkSession(id).pipe(
                mergeMap((res) => {
                    if (res.errors) {
                        if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.NO_PERMISSION]) {
                            return of(SetGlobalMessage({title: "Error", message: NoPermissionErrorMessage, type: "danger"}));
                        }
                        if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.WORK_SESSION_IS_ACTIVE]) {
                            return of(SetGlobalMessage({title: "Error", message: ActiveWorkSessionErrorMessage, type: "danger"}));
                        }
                        return of(SetGlobalMessage({title: "Error", message: "Failed to delete session", type: "danger"}));
                    }
                    return of(SetGlobalMessage({title: "Success", message: "Deleted successfully", type: "success"}),
                        getActiveWorkSessionActionCreator(state$.value.user.user.id));
                }),
                catchError((err) => of(workSessionErrorActionCreator(err))),
                startWith(SetIsWorkSessionLoading(true)),
                endWith(SetIsWorkSessionLoading(false))
            )
        )
    );