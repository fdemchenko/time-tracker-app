import {of} from "rxjs";
import {SetGlobalMessage} from "../redux/slices/GlobalMessageSlice";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

const defaultErrorMessage = "Fatal error, something went wrong with server connection " +
    "or business logic. Please try again later.";

export interface HandleErrorMessageType {
    response: any,
    message?: string,
    sendGlobalMessage: boolean
}
export function handleErrorMessage(data: HandleErrorMessageType, actionCreator: ActionCreatorWithPayload<string>) {
    let message = data.message ? data.message: defaultErrorMessage;
    let response = data.response;
    console.log(data.response)
    if (response.errors?.[0]) {
        console.error(`${response.errors?.[0].extensions?.code}: ${response.errors?.[0].message}`);
    }
    else if (typeof response == "string") {
        message = response;
    }

    if (data.sendGlobalMessage) {
        return of(actionCreator(message), SetGlobalMessage(message));
    }
    else {
        return of(actionCreator(message));
    }
}