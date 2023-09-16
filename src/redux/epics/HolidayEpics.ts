import {
  CREATE_HOLIDAY_ACTION,
  DELETE_HOLIDAY_ACTION,
  GET_HOLIDAYS_ACTION, GET_HOLIDAYS_FOR_MONTH_ACTION,
  HOLIDAYS_ERROR_ACTION,
  UPDATE_HOLIDAY_ACTION
} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {
    ErrorCodes,
    handleErrorMessage,
    HandleErrorMessageType, InvalidInputErrorMessage
} from "../../helpers/errors";
import {PayloadAction} from "@reduxjs/toolkit";
import {SetHolidays, SetIsSchedulerLoading, SetSchedulerError} from "../slices/SchedulerSlice";
import {
  RequestCreateHoliday,
  RequestDeleteHoliday,
  RequestGetHolidays, RequestGetHolidaysForMonth,
  RequestUpdateHoliday
} from "../../services/HolidayService";
import {Holiday} from "../../models/Holiday";
import {SetGlobalMessage} from "../slices/GlobalMessageSlice";

export const schedulerErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
    {type: HOLIDAYS_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const SchedulerErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
    action$.pipe(
        ofType(HOLIDAYS_ERROR_ACTION),
        map(action => action.payload),
        mergeMap((payload) => handleErrorMessage(payload, SetSchedulerError))
    );

export const getHolidaysActionCreator = () => ({type: GET_HOLIDAYS_ACTION});
export const GetHolidaysEpic: Epic = (action$) =>
    action$.pipe(
        ofType(GET_HOLIDAYS_ACTION),
        mergeMap(() => RequestGetHolidays().pipe(
                map((res) => {
                    if (res.errors) {
                        return schedulerErrorActionCreator(res,"Failed to get holidays");
                    }
                    let holidays = res.data?.holiday?.getHolidays;
                    if (holidays) {
                        return SetHolidays(holidays);
                    }
                    return schedulerErrorActionCreator(res,"Failed to get holidays");
                }),
                catchError((err) => of(schedulerErrorActionCreator(err))),
                startWith(SetIsSchedulerLoading(true)),
                endWith(SetIsSchedulerLoading(false))
            )
        )
    );

export const getHolidaysForMontyActionCreator = (monthDate: string) =>
  ({type: GET_HOLIDAYS_FOR_MONTH_ACTION, payload: monthDate});
export const GetHolidaysForMonthEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
  action$.pipe(
    ofType(GET_HOLIDAYS_FOR_MONTH_ACTION),
    map(action => action.payload),
    mergeMap((monthDate) => RequestGetHolidaysForMonth(monthDate).pipe(
        map((res) => {
          const errMsg = "Failed to get holidays";
          if (res.errors) {
            return schedulerErrorActionCreator(res,errMsg);
          }
          let holidays = res.data?.holiday?.getHolidaysForMonth;
          if (holidays) {
            return SetHolidays(holidays);
          }
          return schedulerErrorActionCreator(res,errMsg);
        }),
        catchError((err) => of(schedulerErrorActionCreator(err))),
        startWith(SetIsSchedulerLoading(true)),
        endWith(SetIsSchedulerLoading(false))
      )
    )
  );

export const createHolidayActionCreator = (holiday: Holiday) =>
    ({type: CREATE_HOLIDAY_ACTION, payload: holiday});
export const CreateHolidayEpic: Epic = (action$: Observable<PayloadAction<Holiday>>) =>
    action$.pipe(
        ofType(CREATE_HOLIDAY_ACTION),
        map(action => action.payload),
        mergeMap((holidayToCreate) => RequestCreateHoliday(holidayToCreate).pipe(
                mergeMap((res) => {
                    if (res.errors) {
                        if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.INVALID_INPUT_DATA]) {
                            return of(SetGlobalMessage({
                                title: "Error",
                                message: res.errors[0]?.message || InvalidInputErrorMessage,
                                type: "warning"
                            }));
                        }
                        return of(schedulerErrorActionCreator(res,"Failed to create holiday"));
                    }
                    let holiday = res.data?.holiday?.create;
                    if (holiday) {
                        return of(SetGlobalMessage({title: "Success", message: "Holiday was successfully added",
                                type: "success"}), getHolidaysActionCreator());
                    }
                    return of(schedulerErrorActionCreator(res,"Failed to create holidays"));
                }),
                catchError((err) => of(schedulerErrorActionCreator(err))),
                startWith(SetIsSchedulerLoading(true)),
                endWith(SetIsSchedulerLoading(false))
            )
        )
    );

export const updateHolidayActionCreator = (holiday: Holiday) =>
    ({type: UPDATE_HOLIDAY_ACTION, payload: holiday});
export const UpdateHolidayEpic: Epic = (action$: Observable<PayloadAction<Holiday>>) =>
    action$.pipe(
        ofType(UPDATE_HOLIDAY_ACTION),
        map(action => action.payload),
        mergeMap((holiday) => RequestUpdateHoliday(holiday).pipe(
                mergeMap((res) => {
                    if (res.errors) {
                        if (res.errors[0]?.extensions?.code === ErrorCodes[ErrorCodes.INVALID_INPUT_DATA]) {
                            return of(SetGlobalMessage({
                                title: "Error",
                                message: res.errors[0]?.message || InvalidInputErrorMessage,
                                type: "warning"
                            }));
                        }
                        return of(schedulerErrorActionCreator(res,"Failed to update holiday"));
                    }
                    let holiday = res.data?.holiday?.update;
                    if (holiday) {
                        return of(SetGlobalMessage({title: "Success", message: "Holiday was successfully updated",
                            type: "success"}), getHolidaysActionCreator());
                    }
                    return of(schedulerErrorActionCreator(res,"Failed to update holidays"));
                }),
                catchError((err) => of(schedulerErrorActionCreator(err))),
                startWith(SetIsSchedulerLoading(true)),
                endWith(SetIsSchedulerLoading(false))
            )
        )
    );

export const deleteHolidayActionCreator = (id: string) =>
    ({type: DELETE_HOLIDAY_ACTION, payload: id});
export const DeleteHolidayEpic: Epic = (action$: Observable<PayloadAction<string>>) =>
    action$.pipe(
        ofType(DELETE_HOLIDAY_ACTION),
        map(action => action.payload),
        mergeMap((id) => RequestDeleteHoliday(id).pipe(
                mergeMap((res) => {
                    if (res.errors) {
                        return of(schedulerErrorActionCreator(res,"Failed to delete holiday"));
                    }
                    let holiday = res.data?.holiday?.delete;
                    if (holiday) {
                        return of(SetGlobalMessage({title: "Success", message: "Holiday was successfully deleted",
                            type: "success"}), getHolidaysActionCreator());
                    }
                    return of(schedulerErrorActionCreator(res,"Failed to delete holidays"));
                }),
                catchError((err) => of(schedulerErrorActionCreator(err))),
                startWith(SetIsSchedulerLoading(true)),
                endWith(SetIsSchedulerLoading(false))
            )
        )
    );