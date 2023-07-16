import {GET_ACTIVE_WORK_SESSION_ACTION, WORK_SESSION_ERROR_ACTION} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, Observable, of} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {RequestGetActiveWorkSession} from "../../services/WorkSessionService";
import {SetActiveWorkSession, SetWorkSessionError} from "../slices/WorkSessionSlice";

export const workSessionErrorActionCreator = (errorMessage: any) => (
    {type: WORK_SESSION_ERROR_ACTION, payload: errorMessage});
export const WorkSessionErrorEpic: Epic = (action$: Observable<PayloadAction<any>>) =>
    action$.pipe(
        ofType(WORK_SESSION_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => {
            if (payload.response?.errors?.[0].message) {
                return of(SetWorkSessionError(payload.response.errors[0].message));
            }
            return of(SetWorkSessionError("Operation failed. Try again later."));
        })
    );

export const getActiveWorkSessionActionCreator = (userId: string) =>
    ({type: GET_ACTIVE_WORK_SESSION_ACTION, payload: userId});
export const GetActiveWorkSessionEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(GET_ACTIVE_WORK_SESSION_ACTION),
        map(action => action.payload),
        mergeMap((userId) => RequestGetActiveWorkSession(userId).pipe(
            map(res => res.data?.workSession.getActiveWorkSessionByUserId),
            map(workSession => {
                if (workSession) {
                    return SetActiveWorkSession(workSession);
                }
            }),
            catchError((err) => of(workSessionErrorActionCreator(err))),
        ))
    );