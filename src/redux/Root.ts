import {combineEpics, Epic} from "redux-observable";
import {
    ErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    UserFoundEpic,
    SetSendPasswordLinkEpic,
    SetPasswordEpic, CreateUserEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        UserFoundEpic,
        LoginEpic,
        LogoutEpic,
        GetUsersEpic,
        ErrorEpic,
        SetSendPasswordLinkEpic,
        SetPasswordEpic,
        CreateUserEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );