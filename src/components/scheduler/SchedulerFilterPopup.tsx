import {TimePicker} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import {Box, Button, Checkbox, FormControlLabel, Link as MuiLink, Popover} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface SchedulerRangePickerProps {
  startRange: number;
  setStartRange: Dispatch<SetStateAction<number>>;
  endRange: number;
  setEndRange: Dispatch<SetStateAction<number>>;
  hidePlanned: boolean;
  setHidePlanned: Dispatch<SetStateAction<boolean>>;
}
export default function SchedulerFilterPopup({startRange, setStartRange, endRange,
    setEndRange, hidePlanned, setHidePlanned}: SchedulerRangePickerProps) {
  const startDefault = 8;
  const endDefault = 20;

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const openPopup = Boolean(anchorEl);

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
      <Button
        variant="outlined"
        size="large"
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <FilterAltIcon /> Filters
      </Button>
      <Popover
        open={openPopup}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2
          }}
        >
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

          <FormControlLabel
            label="Hide planned work sessions"
            control={ <Checkbox
              checked={hidePlanned}
              onChange={(e) => setHidePlanned(e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />}
          />
        </Box>
      </Popover>
    </Box>
  );
}