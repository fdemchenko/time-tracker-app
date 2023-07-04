import User from "../../models/User";
import {LOGIN_ACTION} from "../actions";
import {Epic, ofType} from "redux-observable";
import {map, mergeMap, Observable} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {RequestLogin} from "../../services/AuthService";
import {testAction} from "../slices/UserSlice";

export const loginActionCreator = (payload: LoginActionPayload) => (
    {type: LOGIN_ACTION, payload: payload});
export interface LoginActionPayload {
    Email: string,
    Password: string
}
export const LoginActionEpic: Epic = (action$: Observable<PayloadAction<LoginActionPayload>>) =>
    action$.pipe(
        ofType(LOGIN_ACTION),
        map(action => action.payload),
        mergeMap((payload) => RequestLogin(payload).pipe(
            //map(() => NotExistingFunctionToGetUserWithAccessToken()),
            map((res) => testAction(res))
            //catchError((error) => of(getToDoItemsRejected(error.message)))
        ))
    );