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

export const workSessionErrorActionCreator = (errorMessage: string) => (
    {type: WORK_SESSION_ERROR_ACTION, payload: errorMessage});
export const WorkSessionErrorEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(WORK_SESSION_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((message) => {
            // if (message) {
            //     return of(SetWorkSessionError(payload.response.errors[0].message));
            // }
            // return of(SetWorkSessionError("Operation failed. Try again later."));
            return of(SetWorkSessionError(message));
        })
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
                    throw new Error(res.errors.message);
                }
                return res.data?.workSession.getActiveWorkSessionByUserId
            }),
            map(workSession => SetActiveWorkSession(workSession)),
            catchError((err) => of(workSessionErrorActionCreator(err))),
        ))
    );

export const setEndWorkSessionActionCreator = (id: string) =>
    ({type: SET_END_WORK_SESSION_ACTION, payload: id});
export const SetEndWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(SET_END_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((id) => RequestSetEndWorkSession(id).pipe(
            map(() => RemoveActiveWorkSession()),
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
            map((res) => res.data?.workSession.create),
            map((workSession) => SetActiveWorkSession(workSession)),
            catchError((err) => of(workSessionErrorActionCreator(err))),
        ))
    );