//user actions
export const LOGIN_ACTION = "LOGIN";
export const LOGOUT_ACTION = "LOGOUT";

export const GET_USERS_ACTION = "GET_USERS";
export const GET_USERS_BY_IDS_ACTION = "GET_USERS_BY_IDS";
export const GET_PROFILES_ACTION = "GET_PROFILES";
export const GET_USERS_WORK_INFO_ACTION = "GET_USERS_WORK_INFO";
export const GET_USERS_WORK_INFO_EXCEL_ACTION = "GET_USERS_WORK_INFO_EXCEL";
export const GET_USERS_WITHOUT_PAGINATION_ACTION = "GET_USERS_WITHOUT_PAGINATION";
export const SET_SEND_PASSWORD_LINK_ACTION = "SET_SEND_PASSWORD_LINK";
export const SET_PASSWORD_ACTION = "SET_PASSWORD";
export const CREATE_USER_ACTION = "CREATE_USER";
export const UPDATE_USER_ACTION = "UPDATE_USER";
export const DEACTIVATE_USER_ACTION = "FIRE_USER";
export const USER_ERROR_ACTION = "USER_ERROR";

export const MANAGE_USERS_ERROR_ACTION = "MANAGE_USERS_ERROR";

export const PROFILE_ERROR_ACTION = "PROFILE_ERROR";

export const USER_WORK_INFO_ERROR_ACTION = "PROFILE_ERROR";

//time tracker (work session) actions
export const WORK_SESSION_ERROR_ACTION = "WORK_SESSION_ERROR";
export const GET_ACTIVE_WORK_SESSION_ACTION = "GET_ACTIVE_WORK_SESSION";
export const SET_END_WORK_SESSION_ACTION = "SET_END_WORK_SESSION";
export const CREATE_WORK_SESSION_ACTION = "CREATE_WORK_SESSION_ACTION";
export const GET_USER_WORK_SESSIONS_ACTION = "GET_USER_WORK_SESSIONS";
export const GET_WORK_SESSIONS_BY_USER_IDS_BY_MONTH_ACTION = "GET_WORK_SESSIONS_BY_USER_IDS_BY_MONTH";
export const UPDATE_WORK_SESSION_ACTION = "UPDATE_WORK_SESSION";
export const DELETE_WORK_SESSION_ACTION = "DELETE_WORK_SESSION";

//holidays
export const HOLIDAYS_ERROR_ACTION = "HOLIDAYS_ERROR";
export const GET_HOLIDAYS_ACTION = "GET_HOLIDAYS";
export const GET_HOLIDAYS_FOR_MONTH_ACTION = "GET_HOLIDAYS_FOR_MONTH";
export const CREATE_HOLIDAY_ACTION = "CREATE_HOLIDAY";
export const UPDATE_HOLIDAY_ACTION = "UPDATE_HOLIDAY";
export const DELETE_HOLIDAY_ACTION = "DELETE_HOLIDAY";

//vacations
export const VACATION_ERROR_ACTION = "VACATION_ERROR";
export const GET_VACATIONS_BY_USER_ID_ACTION = "GET_VACATIONS_BY_USER_ID";
export const GET_USERS_VACATIONS_FOR_MONTH_ACTION = "GET_USERS_VACATIONS_FOR_MONTH";
export const GET_VACATION_INFO_BY_USER_ID_ACTION = "GET_VACATION_INFO_BY_USER_ID";
export const GET_VACATION_REQUESTS_ACTION = "GET_VACATION_REQUESTS";
export const CREATE_VACATION_ACTION = "CREATE_VACATION";
export const APPROVER_UPDATE_VACATION_ACTION = "APPROVER_UPDATE_VACATION";
export const DELETE_VACATION_ACTION = "DELETE_VACATION";

//sick leave
export const SICK_LEAVE_ERROR_ACTION = "SICK_LEAVE_ERROR";
export const GET_SICK_LEAVE_DATA_ACTION = "GET_SICK_LEAVE_DATA";
export const GET_USERS_SICK_LEAVE_FOR_MONTH_ACTION = "GET_USERS_SICK_LEAVE_FOR_MONTH";
export const CREATE_SICK_LEAVE_DATA_ACTION = "CREATE_SICK_LEAVE_DATA";
export const UPDATE_SICK_LEAVE_DATA_ACTION = "UPDATE_SICK_LEAVE_DATA";
export const DELETE_SICK_LEAVE_DATA_ACTION = "DELETE_SICK_LEAVE_DATA";