import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import {Holiday} from "../models/Holiday";

interface GetHolidaysResponse extends GraphQLResponse {
    data?: {
        holiday?: {
            getHolidays: Holiday[] | null
        }
    }
}
export function RequestGetHolidays() {
    return ajaxAuth<GetHolidaysResponse>(JSON.stringify({
        query: `
               query GetHolidays {
                  holiday {
                    getHolidays {
                      id,
                      title,
                      type,
                      date,
                      endDate
                    } 
                  }
                }
            `
    })).pipe(
        map((res) => res.response)
    );
}