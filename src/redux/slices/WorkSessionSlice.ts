import WorkSession from "../../models/WorkSession";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface WorkSessionSliceState {
    activeWorkSession: WorkSession | null,
    workSessionsList: {
        count: number,
        items: WorkSession[]
    },
    isLoading: boolean,
    requireUpdateToggle: boolean
    error: string | null
}
const initialState: WorkSessionSliceState = {
    activeWorkSession: null,
    workSessionsList: {
        count: 0,
        items: []
    },
    isLoading: false,
    requireUpdateToggle: false,
    error: null
}

export const WorkSessionSlice = createSlice({
    name: "workSession",
    initialState,
    reducers: {
        SetWorkSessionError: (state,
                  action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        CreateWorkSession: (state, action:  PayloadAction<WorkSession | null>) => {
            if (action.payload) {
                const newSessionDate = action.payload.start;
                const lastIndexWithSameDate = state.workSessionsList.items.map((item) => item.start).lastIndexOf(newSessionDate);
                const insertionIndex = lastIndexWithSameDate === -1 ? 0 : lastIndexWithSameDate + 1;

                insertionIndex === 0
                  ? state.workSessionsList.items.push(action.payload)
                  : state.workSessionsList.items.splice(insertionIndex, 0, action.payload);
                state.workSessionsList.count += 1;

                state.requireUpdateToggle = !state.requireUpdateToggle;
            }
        },
        SetActiveWorkSession: (state
                               , action: PayloadAction<WorkSession | null>) => {
            state.activeWorkSession = action.payload;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        RemoveActiveWorkSession: (state) => {
            state.activeWorkSession = null;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        SetWorkSessionList: (state,
                             action: PayloadAction<{count: number, items: WorkSession[]}>) => {
            state.workSessionsList = action.payload;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        RemoveWorkSessionList: (state) => {
            state.workSessionsList = {
                count: 0,
                items: []
            };
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        SetIsWorkSessionLoading: (state,
                       action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        RemoveWorkSessionById: (state, action: PayloadAction<string>) => {
            const idToRemove = action.payload;

            state.workSessionsList.items = state.workSessionsList.items.filter(
              (workSession) => workSession.id !== idToRemove
            );

            state.workSessionsList.count -= 1;
            state.error = null;
            state.requireUpdateToggle = !state.requireUpdateToggle;
        },
        UpdateSession: (state, action: PayloadAction<WorkSession>) => {
            const updatedSession = action.payload;
            updatedSession.start = updatedSession.start.slice(0, -1);
            updatedSession.end = updatedSession.end?.slice(0, -1);

            const sessionIndex = state.workSessionsList.items.findIndex(
              (session) => session.id === updatedSession.id
            );

            if (sessionIndex !== -1) {
                state.workSessionsList.items[sessionIndex] = updatedSession;
                state.error = null;
                state.requireUpdateToggle = !state.requireUpdateToggle;
            }
        }
    }
});

export const {
    SetWorkSessionError,
    SetActiveWorkSession,
    RemoveActiveWorkSession,
    SetWorkSessionList,
    RemoveWorkSessionList,
    CreateWorkSession,
    RemoveWorkSessionById,
    UpdateSession,
    SetIsWorkSessionLoading
} = WorkSessionSlice.actions;

export default WorkSessionSlice.reducer;