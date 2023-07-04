import {combineEpics, Epic} from "redux-observable";
import {testActionEpic} from "./epics/UserEpics";
import {catchError} from "rxjs";
import {LoginActionEpic} from "./epics/AuthEpics";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        testActionEpic,
        LoginActionEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );