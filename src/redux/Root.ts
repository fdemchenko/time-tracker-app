import {combineEpics, Epic} from "redux-observable";
import {
    UserErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    SetSendPasswordLinkEpic,
    SetPasswordEpic, CreateUserEpic, UpdateUserEpic, DeactivateUserEpic, ManageUsersErrorEpic,
    GetProfilesEpic, ProfileErrorEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";
import {
    CreateWorkSessionEpic, DeleteWorkSessionEpic,
    GetActiveWorkSessionEpic, GetUsersWorkSessionsEpic,
    SetEndWorkSessionEpic, UpdateWorkSessionEpic,
    WorkSessionErrorEpic,
} from "./epics/WorkSessionEpics";
import {
    CreateHolidayEpic,
    DeleteHolidayEpic,
    GetHolidaysEpic,
    SchedulerErrorEpic,
    UpdateHolidayEpic
} from "./epics/SchedulerEpics";
import {
    ApproverUpdateVacationEpic,
    CreateVacationEpic, DeleteVacationEpic,
    GetVacationInfoByUserIdEpic, GetVacationRequestsEpic,
    GetVacationsByUserIdEpic,
    VacationErrorEpic
} from "./epics/VacationEpics";
import {
    CreateSickLeaveDataEpic, DeleteSickLeaveDataEpic,
    GetSickLeavesDataEpic,
    SickLeaveErrorEpic,
    UpdateSickLeaveDataEpic
} from "./epics/SickLeaveEpics";

export const RootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        LoginEpic,
        LogoutEpic,
        GetUsersEpic,
        SetSendPasswordLinkEpic,
        SetPasswordEpic,
        CreateUserEpic,
        UpdateUserEpic,
        DeactivateUserEpic,
        UserErrorEpic,
        ManageUsersErrorEpic,
        WorkSessionErrorEpic,
        ProfileErrorEpic,
        GetProfilesEpic,
        GetActiveWorkSessionEpic,
        SetEndWorkSessionEpic,
        CreateWorkSessionEpic,
        GetUsersWorkSessionsEpic,
        UpdateWorkSessionEpic,
        DeleteWorkSessionEpic,
        SchedulerErrorEpic,
        GetHolidaysEpic,
        CreateHolidayEpic,
        UpdateHolidayEpic,
        DeleteHolidayEpic,
        VacationErrorEpic,
        GetVacationsByUserIdEpic,
        GetVacationInfoByUserIdEpic,
        GetVacationRequestsEpic,
        CreateVacationEpic,
        ApproverUpdateVacationEpic,
        DeleteVacationEpic,
        SickLeaveErrorEpic,
        GetSickLeavesDataEpic,
        CreateSickLeaveDataEpic,
        UpdateSickLeaveDataEpic,
        DeleteSickLeaveDataEpic
    )(action$, store$, dependencies).pipe(
        catchError((error, source) => {
            console.error(error);
            return source;
        })
    );
