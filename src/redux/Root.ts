import {combineEpics, Epic} from "redux-observable";
import {
    UserErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    UserFoundEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";
import {GetActiveWorkSessionEpic, WorkSessionErrorEpic} from "./epics/WorkSessionEpics";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        UserFoundEpic,
        LoginEpic,
        LogoutEpic,
        GetUsersEpic,
        UserErrorEpic,
        WorkSessionErrorEpic,
        GetActiveWorkSessionEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );