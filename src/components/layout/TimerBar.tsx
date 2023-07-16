import IconButton from "@mui/material/IconButton";
import * as React from "react";
import {WorkSessionSliceState} from "../../redux/slices/WorkSessionSlice";
import Tracker from "../time-tracking/Tracker";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface TimerBarProps {
    open: boolean,
    workSessionData: WorkSessionSliceState,
    handleTimerBarOpen: (value: boolean) => void,
    userId: string
    //handleSetTrackerDisplay: (value: string) => void
}
export default function TimerBar({
        open,
        workSessionData,
        handleTimerBarOpen,
        userId
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
                    <KeyboardArrowRightIcon />
                </IconButton>
            </div>

            <div className="timer_bar_center">
                <div>
                    <Tracker
                        workSessionData={workSessionData}
                        userId={userId}
                        //handleSetTrackerDisplay={handleSetTrackerDisplay}
                    />
                </div>
            </div>
        </div>
    );
}