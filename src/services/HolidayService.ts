import {ajaxAuth, GraphQLResponse} from "./AuthInterceptors";
import {map} from "rxjs";
import {Holiday} from "../models/Holiday";
import moment from "moment/moment";

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

interface CreateHolidayResponse extends GraphQLResponse {
    data?: {
        holiday?: {
            create: Holiday | null
        }
    }
}
export function RequestCreateHoliday(holiday: Holiday) {
    return ajaxAuth<CreateHolidayResponse>(JSON.stringify({
        query: `
               mutation CreateHoliday($holiday: HolidayInputType!) {
                  holiday {
                    create(holiday: $holiday) {
                      id
                      title
                      type
                      date
                      endDate
                    } 
                  }
                }
            `,
        variables: {
            "holiday": {
                "title": holiday.title,
                "type": holiday.type,
                "date": moment(holiday.date).format("YYYY-MM-DD"),
                "endDate": holiday.endDate ? moment(holiday.endDate).format("YYYY-MM-DD") : null
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface UpdateHolidayResponse extends GraphQLResponse {
    data?: {
        holiday?: {
            update: boolean | null
        }
    }
}
export function RequestUpdateHoliday(holiday: Holiday) {
    return ajaxAuth<UpdateHolidayResponse>(JSON.stringify({
        query: `
               mutation UpdateHoliday($id: ID!, $holiday: HolidayInputType!) {
                    holiday {
                        update(id: $id, holiday: $holiday)
                    }
                }
            `,
        variables: {
            "id": holiday.id,
            "holiday": {
                "title": holiday.title,
                "type": holiday.type,
                "date": moment(holiday.date).format("YYYY-MM-DD"),
                "endDate": holiday.endDate ? moment(holiday.endDate).format("YYYY-MM-DD") : null
            }
        }
    })).pipe(
        map((res) => res.response)
    );
}

interface DeleteHolidayResponse extends GraphQLResponse {
    data?: {
        holiday?: {
            delete: boolean | null
        }
    }
}
export function RequestDeleteHoliday(id: string) {
    return ajaxAuth<DeleteHolidayResponse>(JSON.stringify({
        query: `
               mutation DeleteHoliday($id: ID!) {
                    holiday {
                        delete(id: $id)
                    }
                }
            `,
        variables: {
            "id": id
        }
    })).pipe(
        map((res) => res.response)
    );
}