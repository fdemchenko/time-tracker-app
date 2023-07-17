import {createEpicMiddleware} from "redux-observable";
import {configureStore} from "@reduxjs/toolkit";
import UserReducer from "./slices/UserSlice";
import WorkSessionReducer from "./slices/WorkSessionSlice";
import {RootEpic} from "./Root";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
    reducer: {
        user: UserReducer,
        workSession: WorkSessionReducer
    },
    middleware: [epicMiddleware]
});

epicMiddleware.run(RootEpic);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;