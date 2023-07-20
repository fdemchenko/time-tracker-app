import {
    CREATE_WORK_SESSION_ACTION,
    GET_ACTIVE_WORK_SESSION_ACTION,
    SET_END_WORK_SESSION_ACTION,
    WORK_SESSION_ERROR_ACTION
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, Observable, of} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
    RequestCreateWorkSession,
    RequestGetActiveWorkSession,
    RequestSetEndWorkSession
} from "../../services/WorkSessionService";
import {RemoveActiveWorkSession, SetActiveWorkSession, SetWorkSessionError} from "../slices/WorkSessionSlice";
import {handleErrorMessage, HandleErrorMessageType} from "../../helpers/errors";

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
                    return workSessionErrorActionCreator(res,"Failed to load active session");
                }
                let workSession = res.data?.workSession?.getActiveWorkSessionByUserId;
                if (workSession !== undefined) {
                    return SetActiveWorkSession(workSession);
                }
                return workSessionErrorActionCreator(res,"Failed to load active session");
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
                return  workSessionErrorActionCreator(res, "Failed to finish session")
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
                return workSessionErrorActionCreator(res, "Failed to start new session")
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
        ))
    );