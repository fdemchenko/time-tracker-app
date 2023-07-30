import {GET_HOLIDAYS_ACTION, HOLIDAYS_ERROR_ACTION} from "../actions";
import {Epic, ofType} from "redux-observable";
import {catchError, endWith, map, mergeMap, Observable, of, startWith} from "rxjs";
import {
    handleErrorMessage,
    HandleErrorMessageType
} from "../../helpers/errors";
import {PayloadAction} from "@reduxjs/toolkit";
import {SetHolidays, SetIsSchedulerLoading, SetSchedulerError} from "../slices/SchedulerSlice";
import {RequestGetHolidays} from "../../services/HolidayService";

export const holidayErrorActionCreator = (response: any, message?: string, sendGlobalMessage: boolean = true) => (
    {type: HOLIDAYS_ERROR_ACTION, payload: {response, message, sendGlobalMessage}});
export const HolidayErrorEpic: Epic = (action$: Observable<PayloadAction<HandleErrorMessageType>>) =>
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
                        return holidayErrorActionCreator(res,"Failed to get holidays");
                    }
                    let holidays = res.data?.holiday?.getHolidays;
                    if (holidays) {
                        return SetHolidays(holidays);
                    }
                    return holidayErrorActionCreator(res,"Failed to get holidays");
                }),
                catchError((err) => of(holidayErrorActionCreator(err))),
                startWith(SetIsSchedulerLoading(true)),
                endWith(SetIsSchedulerLoading(false))
            )
        )
    );