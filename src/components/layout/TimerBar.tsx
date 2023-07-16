import IconButton from "@mui/material/IconButton";
import * as React from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {WorkSessionSliceState} from "../../redux/slices/WorkSessionSlice";
import Tracker from "../time-tracking/Tracker";

interface TimerBarProps {
    open: boolean,
    workSessionData: WorkSessionSliceState,
    handleTimerBarOpen: (value: boolean) => void,
    //handleSetTrackerDisplay: (value: string) => void
}
export default function TimerBar({
        open,
        workSessionData,
        handleTimerBarOpen,
        //handleSetTrackerDisplay
    }: TimerBarProps) {

    return (
        <div className={`timer_bar ${open ? "active" : ""}`}>
            <div className="timer_bar_arrow">
                <IconButton
                    color="inherit"
                    aria-label="open timer"
                    onClick={() => handleTimerBarOpen(!open)}
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <KeyboardArrowLeftIcon />
                </IconButton>
            </div>

            <div className="timer_bar_center">
                <div>
                    <Tracker
                        workSessionData={workSessionData}
                        //handleSetTrackerDisplay={handleSetTrackerDisplay}
                    />
                </div>
            </div>
        </div>
    );
}