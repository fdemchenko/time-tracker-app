import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {handleErrorMessage, HandleErrorMessageType} from "../../helpers/errors";
import {GET_SICK_LEAVE_DATA_ACTION, SICK_LEAVE_ERROR_ACTION} from "../actions";
import {SetIsSickLeaveLoading, SetSickLeaveError, SetSickLeaveList} from "../slices/SickLeaveSlice";
import {Moment} from "moment";
import {RequestGetSickLeaveDataRequest} from "../../services/SickLeaveService";

export const sickLeaveErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
    {type: SICK_LEAVE_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const SickLeaveErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
    action$.pipe(
        ofType(SICK_LEAVE_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => handleErrorMessage(payload, SetSickLeaveError))
    );

export const getSickLeaveDataActionCreator = (payload: GetSickLeaveDataInput) =>
    ({type: GET_SICK_LEAVE_DATA_ACTION, payload: payload});
export interface GetSickLeaveDataInput {
    date: Moment,
    userId: string | null,
    searchByYear: boolean
}
export const GetSickLeavesDataEpic: Epic = (action$: Observable<PayloadAction<GetSickLeaveDataInput>>) =>
    action$.pipe(
        ofType(GET_SICK_LEAVE_DATA_ACTION),
        map(action => action.payload),
        mergeMap((fetchInput) => RequestGetSickLeaveDataRequest(fetchInput).pipe(
            map((res) => {
                const errorMsg = "Failed to load sick leave data";
                if (res.errors) {
                    return sickLeaveErrorActionCreator(res, errorMsg);
                }
                let sickLeaveList = res.data?.sickLeave?.getSickLeaves;

                if (sickLeaveList) {
                    return SetSickLeaveList(sickLeaveList);
                }
                console.log(sickLeaveList)
                return sickLeaveErrorActionCreator(res, errorMsg);
            }),
            catchError((err) => of(sickLeaveErrorActionCreator(err))),
            startWith(SetIsSickLeaveLoading(true)),
            endWith(SetIsSickLeaveLoading(false))
        ))
    );