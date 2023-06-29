import User from "../../models/User";
import {TEST_ACTION} from "../actions";
import {Epic, ofType} from "redux-observable";
import {map, mergeMap, Observable} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";

export const testActionCreator = (user: User) => (
    {type: TEST_ACTION, payload: user});
export const testActionEpic: Epic = (action$: Observable<PayloadAction<User>>) =>
    action$.pipe(
        ofType(TEST_ACTION),
        map(action => action.payload),
        // mergeMap((payload) => RequestCompleteToDoItem(payload.id, payload.storageType).pipe(
        //     map(() => getToDoItems(payload.storageType)),
        //     catchError((error) => of(getToDoItemsRejected(error.message)))
        // ))
    );