import {combineEpics, Epic} from "redux-observable";
import {
    UserErrorEpic,
    GetUsersEpic,
    LoginEpic,
    LogoutEpic,
    SetSendPasswordLinkEpic,
    SetPasswordEpic, CreateUserEpic, UpdateUserEpic, DeactivateUserEpic, ManageUsersErrorEpic,
    GetProfilesEpic, ProfileErrorEpic, GetUsersWithoutPaginationEpic, GetUsersWorkInfoEpic, UserWorkInfoErrorEpic, GetUsersWorkInfoExcelEpic
} from "./epics/UserEpics";
import {catchError} from "rxjs";
import {
    CreateWorkSessionEpic, DeleteWorkSessionEpic,
    GetActiveWorkSessionEpic, GetUsersWorkSessionsEpic, GetWorkSessionsByUserIdsByMonthEpic,
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
    CreateVacationEpic, DeleteVacationEpic, GetUsersVacationsForMonthEpic,
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
        GetUsersWithoutPaginationEpic,
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
        GetUsersWorkInfoEpic,
        GetUsersWorkInfoExcelEpic,
        UserWorkInfoErrorEpic,
        GetActiveWorkSessionEpic,
        SetEndWorkSessionEpic,
        CreateWorkSessionEpic,
        GetUsersWorkSessionsEpic,
        GetWorkSessionsByUserIdsByMonthEpic,
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
        GetUsersVacationsForMonthEpic,
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
