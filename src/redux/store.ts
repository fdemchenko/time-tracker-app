import {createEpicMiddleware} from "redux-observable";
import {configureStore} from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import ManageUsersReducer from "./slices/ManageUsersSlice";
import WorkSessionReducer from "./slices/WorkSessionSlice";
import SchedulerReducer from "./slices/SchedulerSlice";
import GlobalMessageReducer from "./slices/GlobalMessageSlice";
import ProfileReducer from "./slices/ProfileSlice";
import {RootEpic} from "./Root";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: {
        user: UserReducer,
        profile: ProfileReducer,
        manageUsers: ManageUsersReducer,
        workSession: WorkSessionReducer,
        message: GlobalMessageReducer,
        scheduler: SchedulerReducer
    },
    middleware: [epicMiddleware]
});

epicMiddleware.run(RootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;