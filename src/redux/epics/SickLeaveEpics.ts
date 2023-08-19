import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
    ErrorCodes,
    handleErrorMessage,
    HandleErrorMessageType,
    InvalidUserStatusErrorMessage,
} from "../../helpers/errors";
import {
    CREATE_SICK_LEAVE_DATA_ACTION,
    GET_SICK_LEAVE_DATA_ACTION,
    SICK_LEAVE_ERROR_ACTION
} from "../actions";
import {
    SetIsSickLeaveLoading,
    SetSickLeaveError,
    SetSickLeaveList,
    SetSickLeaveRequireUpdate
} from "../slices/SickLeaveSlice";
import {Moment} from "moment";
import {RequestCreateSickLeaveDataRequest, RequestGetSickLeaveDataRequest} from "../../services/SickLeaveService";
import {SetGlobalMessage} from "../slices/GlobalMessageSlice";
import {SickLeaveInput} from "../../models/sick-leave/SickLeaveInput";

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

export const createSickLeaveDataActionCreator = (sickLeaveInput: SickLeaveInput) =>
    ({type: CREATE_SICK_LEAVE_DATA_ACTION, payload: sickLeaveInput});
export const CreateSickLeaveDataEpic: Epic = (action$: Observable<PayloadAction<SickLeaveInput>>) =>
    action$.pipe(
        ofType(CREATE_SICK_LEAVE_DATA_ACTION),
        map(action => action.payload),
        mergeMap((sickLeaveInput) => RequestCreateSickLeaveDataRequest(sickLeaveInput).pipe(
            mergeMap((res) => {
                const errorMsg = "Failed to create sick leave record";
                if (res.errors) {
                    if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.INVALID_USER_STATUS]) {
                        return of(SetGlobalMessage({title: "Error", message: InvalidUserStatusErrorMessage, type: "danger"}));
                    }
                    return of(sickLeaveErrorActionCreator(res, errorMsg));
                }
                if (res.data?.sickLeave?.create) {
                    return of(SetSickLeaveRequireUpdate(), SetGlobalMessage({
                        title: "Success",
                        message: "Sick leave record was successfully created",
                        type: "success"
                    }));
                }
                return of(sickLeaveErrorActionCreator(res, errorMsg));
            }),
            catchError((err) => of(sickLeaveErrorActionCreator(err))),
            startWith(SetIsSickLeaveLoading(true)),
            endWith(SetIsSickLeaveLoading(false))
        ))
    );
