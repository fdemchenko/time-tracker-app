import IconButton from "@mui/material/IconButton";
import * as React from "react";
import Tracker from "./Tracker";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

interface TimerBarProps {
    open: boolean,
    handleTimerBarOpen: (value: boolean) => void,
    handleSetTrackerDisplay: (value: string) => void
}
export default function TrackerBar({
        open,
        handleTimerBarOpen,
        handleSetTrackerDisplay
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
                        handleSetTrackerDisplay={handleSetTrackerDisplay}
                    />
                </div>
            </div>
        </div>
    );
}