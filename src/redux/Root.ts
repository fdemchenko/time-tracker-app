import {combineEpics, Epic} from "redux-observable";
import {
    UserErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    SetSendPasswordLinkEpic,
    SetPasswordEpic, CreateUserEpic, UpdateUserEpic, FireUserEpic, ManageUsersErrorEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";
import {
    CreateWorkSessionEpic,
    GetActiveWorkSessionEpic,
    GetUsersWorkSessionsEpic,
    SetEndWorkSessionEpic,
    UpdateWorkSessionEpic,
    WorkSessionErrorEpic,
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
        ManageUsersErrorEpic,
        WorkSessionErrorEpic,
        GetActiveWorkSessionEpic,
        SetEndWorkSessionEpic,
        CreateWorkSessionEpic,
        GetUsersWorkSessionsEpic,
        UpdateWorkSessionEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );
