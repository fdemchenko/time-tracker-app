import {combineEpics, Epic} from "redux-observable";
import {
    ErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    RefreshEpic,
    RefreshFailedEpic,
    UserFoundEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        UserFoundEpic,
        LoginEpic,
        LogoutEpic,
        RefreshEpic,
        GetUsersEpic,
        ErrorEpic,
        RefreshFailedEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );