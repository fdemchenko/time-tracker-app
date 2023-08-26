import {TimePicker} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import {Box, Link as MuiLink} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";

interface SchedulerRangePickerProps {
  startRange: number;
  setStartRange: Dispatch<SetStateAction<number>>;
  endRange: number;
  setEndRange: Dispatch<SetStateAction<number>>;
}
export default function SchedulerRangePicker({startRange, setStartRange, endRange,
    setEndRange}: SchedulerRangePickerProps) {
  const startDefault = 8;
  const endDefault = 20;

  function handleSetStartTime(newValue: Moment | null) {
    let newHour = startDefault;
    if (newValue) {
      newHour = newValue.hours();
      if (newHour < 0 || newHour >= endRange) {
        newHour = 0;
      }
    }
    setStartRange(newHour);
  }
  function handleSetEndTime(newValue: Moment | null) {
    let newHour = endDefault;
    if (newValue) {
      newHour = newValue.hours();
      if (newHour > 23 || newHour <= startRange) {
        newHour = 23;
      }
    }
    setEndRange(newHour);
  }

  function setDefaultRange() {
    setStartRange(startDefault);
    setEndRange(endDefault);
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          gap: 3
        }}
      >
        <TimePicker
          label="Scheduler start"
          ampm={false}
          views={["hours"]}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                width: "130px"
              }
            }
          }}
          value={moment().set("hours", startRange)}
          onChange={(newValue) => handleSetStartTime(newValue)}
        />

        <TimePicker
          label="Scheduler end"
          ampm={false}
          views={["hours"]}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                width: "130px"
              }
            }
          }}
          minTime={moment().set("hours", startRange + 1)}
          value={moment().set("hours", endRange)}
          onChange={(newValue) => handleSetEndTime(newValue)}
        />
      </Box>

      {
        (startRange !== startDefault || endRange !== endDefault) &&
        <Box>
          <MuiLink
            sx={{cursor: "pointer"}}
            onClick={setDefaultRange}
          >
            Set default range
          </MuiLink>
        </Box>
      }
    </Box>
  );
}