import {createEpicMiddleware} from "redux-observable";
import {configureStore} from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import UserWorkInfoReducer from "./slices/UserWorkInfoSlice";
import ManageUsersReducer from "./slices/ManageUsersSlice";
import WorkSessionReducer from "./slices/WorkSessionSlice";
import SchedulerReducer from "./slices/SchedulerSlice";
import VacationReducer from "./slices/VacationSlice";
import SickLeaveReducer from "./slices/SickLeaveSlice";
import GlobalMessageReducer from "./slices/GlobalMessageSlice";
import ProfileReducer from "./slices/ProfileSlice";
import {RootEpic} from "./Root";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: {
        user: UserReducer,
        userWorkInfo: UserWorkInfoReducer,
        profile: ProfileReducer,
        manageUsers: ManageUsersReducer,
        workSession: WorkSessionReducer,
        scheduler: SchedulerReducer,
        vacation: VacationReducer,
        sickLeave: SickLeaveReducer,
        message: GlobalMessageReducer
    },
    middleware: [epicMiddleware]
});

epicMiddleware.run(RootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;