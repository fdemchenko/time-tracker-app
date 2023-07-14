import IconButton from "@mui/material/IconButton";
import * as React from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

interface TimerBarProps {
    open: boolean,
    handleTimerBarOpen: (value: boolean) => void
}
export default function TimerBar({open, handleTimerBarOpen}: TimerBarProps) {
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
                Timer
            </div>
        </div>
    );
}