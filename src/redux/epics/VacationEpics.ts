import {
    CREATE_VACATION_ACTION,
    GET_VACATION_INFO_BY_USER_ID_ACTION,
    GET_VACATIONS_BY_USER_ID_ACTION,
    VACATION_ERROR_ACTION,
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
    RequestCreateVacation,
    RequestGetVacationInfoByUserId,
    RequestGetVacationsByUserId
} from "../../services/VacationService";
import {handleErrorMessage, HandleErrorMessageType} from "../../helpers/errors";
import {SetIsVacationLoading, SetVacationError, SetVacationInfo, SetVacationList} from "../slices/VacationSlice";
import {VacationCreate} from "../../models/vacation/VacationCreate";

export const vacationErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
    {type: VACATION_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const VacationErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
    action$.pipe(
        ofType(VACATION_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => handleErrorMessage(payload, SetVacationError))
    );

export const getVacationsByUserIdActionCreator = (payload: GetVacationsByUserIdInput) =>
    ({type: GET_VACATIONS_BY_USER_ID_ACTION, payload: payload});
export interface GetVacationsByUserIdInput {
    userId: string,
    onlyApproved: boolean | null,
    orderByDesc: boolean
}
export const GetVacationsByUserIdEpic: Epic = (action$: Observable<PayloadAction<GetVacationsByUserIdInput>>) =>
    action$.pipe(
        ofType(GET_VACATIONS_BY_USER_ID_ACTION),
        map(action => action.payload),
        mergeMap((fetchInput) => RequestGetVacationsByUserId(fetchInput).pipe(
            map((res) => {
                const errorMsg = "Failed to load user vacations";
                if (res.errors) {
                    return vacationErrorActionCreator(res, errorMsg);
                }
                let vacationList = res.data?.vacation?.getVacationsByUserId;
                if (vacationList) {
                    return SetVacationList(vacationList);
                }
                return vacationErrorActionCreator(res, errorMsg);
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );

export const getVacationInfoByUserIdActionCreator = (userId: string) =>
    ({type: GET_VACATION_INFO_BY_USER_ID_ACTION, payload: userId});
export const GetVacationInfoByUserIdEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(GET_VACATION_INFO_BY_USER_ID_ACTION),
        map(action => action.payload),
        mergeMap((userId) => RequestGetVacationInfoByUserId(userId).pipe(
            map((res) => {
                const errorMsg = "Failed to load user vacation info";
                if (res.errors) {
                    return vacationErrorActionCreator(res, errorMsg);
                }
                let vacationInfo = res.data?.vacation?.getVacationInfoByUserId;
                if (vacationInfo) {
                    return SetVacationInfo(vacationInfo);
                }
                return vacationErrorActionCreator(res, errorMsg);
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );

export const createVacationActionCreator = (payload: CreateVacationsInput) =>
    ({type: CREATE_VACATION_ACTION, payload: payload});
export interface CreateVacationsInput {
    data: VacationCreate,
    onlyApproved: boolean | null,
    orderByDesc: boolean
}
export const CreateVacationEpic: Epic = (action$: Observable<PayloadAction<CreateVacationsInput>>) =>
    action$.pipe(
        ofType(CREATE_VACATION_ACTION),
        map(action => action.payload),
        mergeMap((payload) => RequestCreateVacation(payload.data).pipe(
            map((res) => {
                const errorMsg = "Failed to create vacation request";
                if (res.errors) {
                    return vacationErrorActionCreator(res, errorMsg);
                }
                if (res.data?.vacation?.createVacation) {
                    return getVacationsByUserIdActionCreator({
                        userId: payload.data.userId,
                        onlyApproved: payload.onlyApproved,
                        orderByDesc: payload.orderByDesc
                    });
                }
                return vacationErrorActionCreator(res, errorMsg);
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );