import {of} from "rxjs";
import {SetGlobalMessage} from "../redux/slices/GlobalMessageSlice";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

const defaultErrorMessage = "Fatal error, something went wrong with server connection " +
    "or business logic. Please try again later.";
export const NoPermissionErrorMessage = "You do not have a permission to complete this " +
    "action";
export const InvalidUserStatusErrorMessage = "User have inappropriate status";
export const ActiveWorkSessionErrorMessage = "Can not update or delete work session until " +
    "it is finished";
export const InvalidInputErrorMessage = "Invalid input data";

export interface HandleErrorMessageType {
    response: any,
    message?: string,
    title?: string,
    sendGlobalMessage: boolean
}
export function handleErrorMessage(data: HandleErrorMessageType, actionCreator: ActionCreatorWithPayload<string | null>) {
    let message = data.message ? data.message: defaultErrorMessage;
    let title = data.title ? data.title: "Error";
    let response = data.response;
    if (process.env.REACT_APP_MODE === 'DEVELOPMENT' && response.errors?.[0]) {
        console.error(`${response.errors?.[0].extensions?.code}: ${response.errors?.[0].message}`);
    }
    else if (typeof response == "string") {
        message = response;
    }

    if (data.sendGlobalMessage) {
        return of(actionCreator(message), SetGlobalMessage({title: title, message: message, type: "danger"}));
    }
    else {
        return of(actionCreator(message));
    }
}

/**
 * List of error codes from backend which need to be handled on client.
 *
 * Try 'ErrorCodes[ErrorCodes.NO_PERMISSION]' to get 'NO_PERMISSION' instead '0'.
 **/
export enum ErrorCodes {
    NO_PERMISSION,
    WORK_SESSION_IS_ACTIVE,
    INVALID_INPUT_DATA,
    INVALID_USER_STATUS
}