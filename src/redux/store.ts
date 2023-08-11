import {createEpicMiddleware} from "redux-observable";
import {configureStore} from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import ManageUsersReducer from "./slices/ManageUsersSlice";
import WorkSessionReducer from "./slices/WorkSessionSlice";
import SchedulerReducer from "./slices/SchedulerSlice";
import VacationReducer from "./slices/VacationSlice";
import GlobalMessageReducer from "./slices/GlobalMessageSlice";
import {RootEpic} from "./Root";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: {
        user: UserReducer,
        manageUsers: ManageUsersReducer,
        workSession: WorkSessionReducer,
        scheduler: SchedulerReducer,
        vacation: VacationReducer,
        message: GlobalMessageReducer
    },
    middleware: [epicMiddleware]
});

epicMiddleware.run(RootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;