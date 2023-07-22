import {combineEpics, Epic} from "redux-observable";
import {
    UserErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    SetSendPasswordLinkEpic,
    SetPasswordEpic, CreateUserEpic, UpdateUserEpic, FireUserEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";
import {
    CreateWorkSessionEpic,
    GetActiveWorkSessionEpic,
    SetEndWorkSessionEpic,
    WorkSessionErrorEpic
} from "./epics/WorkSessionEpics";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        LoginEpic,
        LogoutEpic,
        GetUsersEpic,
        SetSendPasswordLinkEpic,
        SetPasswordEpic,
        CreateUserEpic,
        UpdateUserEpic,
        FireUserEpic,
        UserErrorEpic,
        WorkSessionErrorEpic,
        GetActiveWorkSessionEpic,
        SetEndWorkSessionEpic,
        CreateWorkSessionEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );