import IconButton from "@mui/material/IconButton";
import * as React from "react";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import Typography from "@mui/material/Typography";
import {Box, Button} from "@mui/material";

interface TimerBarProps {
    open: boolean,
    handleTimerBarOpen: (value: boolean) => void,
    timerParameters: {
        seconds: number,
        minutes: number,
        hours: number,
        isRunning: boolean,
        start: () => void,
        pause: () => void,
        reset: (offsetTimestamp?: (Date | undefined), autoStart?: (boolean | undefined)) => void,
    }
}
export default function TimerBar({
        open,
        handleTimerBarOpen,
        timerParameters
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
                    <Typography variant="h3">
                        <span>{timerParameters.hours < 10 ? `0${timerParameters.hours}` : timerParameters.hours}</span>:
                        <span>{timerParameters.minutes < 10 ? `0${timerParameters.minutes}` : timerParameters.minutes}</span>:
                        <span>{timerParameters.seconds < 10 ? `0${timerParameters.seconds}` : timerParameters.seconds}</span>
                    </Typography>
                    <Typography variant="h6" color="darkgrey">
                        {timerParameters.isRunning ? 'Running' : 'Not running'}
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignItems: "center",
                        mt: "10px",
                        gap: "10px"
                    }}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={timerParameters.start}
                            sx={{w: 1}}
                        >
                            Start
                        </Button>
                        {/*<Button*/}
                        {/*    variant="contained"*/}
                        {/*    color="secondary"*/}
                        {/*    size="large"*/}
                        {/*    onClick={timerParameters.pause}*/}
                        {/*>*/}
                        {/*    Pause*/}
                        {/*</Button>*/}
                        <Button
                            variant="contained"
                            color="error"
                            size="large"
                            onClick={() => timerParameters.reset(undefined, false)}
                        >
                            Finish
                        </Button>
                    </Box>
                </div>
            </div>
        </div>
    );
}