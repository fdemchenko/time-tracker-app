import {
  APPROVER_UPDATE_VACATION_ACTION,
  CREATE_VACATION_ACTION, DELETE_VACATION_ACTION, GET_USERS_VACATIONS_FOR_MONTH_ACTION,
  GET_VACATION_INFO_BY_USER_ID_ACTION, GET_VACATION_REQUESTS_ACTION,
  GET_VACATIONS_BY_USER_ID_ACTION,
  VACATION_ERROR_ACTION,
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
  GetUsersVacationsForMonthInput,
  RequestApproverUpdateVacation,
  RequestCreateVacation, RequestDeleteVacation, RequestGetUsersVacationsForMonth,
  RequestGetVacationInfoByUserId, RequestGetVacationRequest,
  RequestGetVacationsByUserId
} from "../../services/VacationService";
import {handleErrorMessage, HandleErrorMessageType} from "../../helpers/errors";
import {
    SetIsVacationLoading,
    SetVacationRequireUpdate,
    SetVacationError,
    SetVacationInfo,
    SetVacationList
} from "../slices/VacationSlice";
import {VacationCreate} from "../../models/vacation/VacationCreate";
import {SetGlobalMessage} from "../slices/GlobalMessageSlice";
import {VacationApprove} from "../../models/vacation/VacationApprove";
import {getUsersByIdsActionCreator} from "./UserEpics";

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
            mergeMap((res) => {
                const errorMsg = "Failed to load user vacations";
                if (res.errors) {
                    return of(vacationErrorActionCreator(res, errorMsg));
                }
                let vacationList = res.data?.vacation?.getVacationsByUserId;
                if (vacationList) {
                    let missingUsersIdsToFind = new Set<string>(vacationList.map(v => v.userId));
                    vacationList.map(v => v.approverId).filter(v => v).forEach(v => missingUsersIdsToFind.add(v));
                    return of(getUsersByIdsActionCreator(missingUsersIdsToFind), SetVacationList(vacationList));
                }
                return of(vacationErrorActionCreator(res, errorMsg));
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );

export const getUsersVacationsForMonthActionCreator = (payload: GetUsersVacationsForMonthInput) =>
  ({type: GET_USERS_VACATIONS_FOR_MONTH_ACTION, payload: payload});
export const GetUsersVacationsForMonthEpic: Epic = (action$: Observable<PayloadAction<GetUsersVacationsForMonthInput>>) =>
  action$.pipe(
    ofType(GET_USERS_VACATIONS_FOR_MONTH_ACTION),
    map(action => action.payload),
    mergeMap((fetchInput) => RequestGetUsersVacationsForMonth(fetchInput).pipe(
      mergeMap((res) => {
        const errorMsg = "Failed to load user vacations";
        if (res.errors) {
          return of(vacationErrorActionCreator(res, errorMsg));
        }
        let vacationList = res.data?.vacation?.getUsersVacationsForMonth;
        if (vacationList) {
          let missingUsersIdsToFind = new Set<string>(vacationList.map(v => v.userId));
          vacationList.map(v => v.approverId).filter(v => v).forEach(v => missingUsersIdsToFind.add(v));
          return of(getUsersByIdsActionCreator(missingUsersIdsToFind), SetVacationList(vacationList));
        }
        return of(vacationErrorActionCreator(res, errorMsg));
      }),
      catchError((err) => of(vacationErrorActionCreator(err))),
      startWith(SetIsVacationLoading(true)),
      endWith(SetIsVacationLoading(false))
    ))
  );

export const getVacationRequestsActionCreator = (getNotStarted: boolean) =>
    ({type: GET_VACATION_REQUESTS_ACTION, payload: getNotStarted});
export const GetVacationRequestsEpic: Epic = (action$: Observable<PayloadAction<boolean>>) =>
    action$.pipe(
        ofType(GET_VACATION_REQUESTS_ACTION),
        map(action => action.payload),
        mergeMap((getNotStarted) => RequestGetVacationRequest(getNotStarted).pipe(
            mergeMap((res) => {
                const errorMsg = "Failed to load vacation requests";
                if (res.errors) {
                    return of(vacationErrorActionCreator(res, errorMsg));
                }
                let vacationList = res.data?.vacation?.getVacationsRequests;
                if (vacationList) {
                    let missingUsersIdsToFind = new Set<string>(vacationList.map(v => v.userId));
                    vacationList.map(v => v.approverId).filter(v => v).forEach(v => missingUsersIdsToFind.add(v));
                    return of(getUsersByIdsActionCreator(missingUsersIdsToFind), SetVacationList(vacationList));
                }
                return of(vacationErrorActionCreator(res, errorMsg));
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

export const createVacationActionCreator = (payload: VacationCreate) =>
    ({type: CREATE_VACATION_ACTION, payload: payload});
export const CreateVacationEpic: Epic = (action$: Observable<PayloadAction<VacationCreate>>) =>
    action$.pipe(
        ofType(CREATE_VACATION_ACTION),
        map(action => action.payload),
        mergeMap((vacation) => RequestCreateVacation(vacation).pipe(
            mergeMap((res) => {
                const errorMsg = "Failed to create vacation request";
                if (res.errors) {
                    return of(vacationErrorActionCreator(res, errorMsg));
                }
                if (res.data?.vacation?.createVacation) {
                    return of(SetVacationRequireUpdate(), SetGlobalMessage({
                        title: "Success",
                        message: "Vacation request was successfully created",
                        type: "success"
                    }));
                }
                return of(vacationErrorActionCreator(res, errorMsg));
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );

export const approverUpdateVacationActionCreator = (vacationApprove: VacationApprove) =>
    ({type: APPROVER_UPDATE_VACATION_ACTION, payload: vacationApprove});
export const ApproverUpdateVacationEpic: Epic = (action$: Observable<PayloadAction<VacationApprove>>) =>
    action$.pipe(
        ofType(APPROVER_UPDATE_VACATION_ACTION),
        map(action => action.payload),
        mergeMap((vacationApprove) => RequestApproverUpdateVacation(vacationApprove).pipe(
            mergeMap((res) => {
                const errorMsg = "Failed to update vacation request";
                if (res.errors) {
                    return of(vacationErrorActionCreator(res, errorMsg));
                }
                if (res.data?.vacation?.updateByApprover) {
                    return of(SetVacationRequireUpdate(), SetGlobalMessage({
                        title: "Success",
                        message: "Vacation request was successfully updated",
                        type: "success"
                    }));
                }
                return of(vacationErrorActionCreator(res, errorMsg));
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );

export const deleteVacationActionCreator = (vacationId: string) =>
    ({type: DELETE_VACATION_ACTION, payload: vacationId});
export const DeleteVacationEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(DELETE_VACATION_ACTION),
        map(action => action.payload),
        mergeMap((vacationId) => RequestDeleteVacation(vacationId).pipe(
            mergeMap((res) => {
                const errorMsg = "Failed to delete vacation request";
                if (res.errors) {
                    return of(vacationErrorActionCreator(res, errorMsg));
                }
                if (res.data?.vacation?.delete) {
                    return of(SetVacationRequireUpdate(), SetGlobalMessage({
                        title: "Success",
                        message: "Vacation request was successfully deleted",
                        type: "success"
                    }));
                }
                return of(vacationErrorActionCreator(res, errorMsg));
            }),
            catchError((err) => of(vacationErrorActionCreator(err))),
            startWith(SetIsVacationLoading(true)),
            endWith(SetIsVacationLoading(false))
        ))
    );