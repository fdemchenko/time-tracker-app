import {combineEpics, Epic} from "redux-observable";
import {testActionEpic} from "./epics/UserEpics";
import {catchError} from "rxjs";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        testActionEpic,
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );