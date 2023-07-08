import {combineEpics, Epic} from "redux-observable";
import {LoginActionEpic, LogoutActionEpic} from "./epics/UserEpics";
import {catchError} from "rxjs";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        LoginActionEpic,
        LogoutActionEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );