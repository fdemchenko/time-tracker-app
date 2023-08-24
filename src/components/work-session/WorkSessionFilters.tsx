import {DesktopDatePicker} from "@mui/x-date-pickers";
import {
    Box, Checkbox,
    FormControl, FormControlLabel, Link as MuiLink,
    MenuItem,
    Select,
    ToggleButton, ToggleButtonGroup
} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";
import {Moment} from "moment";

interface WorkSessionFiltersProps {
    startDate: Moment | null;
    setStartDate: Dispatch<SetStateAction<Moment | null>>;
    endDate: Moment | null;
    setEndDate: Dispatch<SetStateAction<Moment | null>>;
    orderByDesc: boolean;
    setOrderByDesc: Dispatch<SetStateAction<boolean>>;
    limit: number;
    setLimit: Dispatch<SetStateAction<number>>;
    showPlanned: boolean;
    setShowPlanned: Dispatch<SetStateAction<boolean>>;
    setPage?: Dispatch<SetStateAction<number>>;
}
export default function WorkSessionFilters({startDate, setStartDate, endDate, setEndDate,
        orderByDesc, setOrderByDesc, limit, setLimit, showPlanned, setShowPlanned,setPage}: WorkSessionFiltersProps) {

    function handleClearFilters() {
        if (setPage) {
            setPage(1);
        }
        setStartDate(null);
        setEndDate(null);
        setOrderByDesc(true);
        setShowPlanned(false);
    }

    return (
        <Box
            sx={{
                width: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
        >

            <DesktopDatePicker
                label="Start date"
                value={startDate}
                onChange={(newDate) => setStartDate(newDate)}
            />
            <DesktopDatePicker
                label="End date"
                value={endDate}
                onChange={(newDate) => setEndDate(newDate)}
            />

            <ToggleButtonGroup
                value={orderByDesc ? "true" : "false"}
                onChange={(event, value) => setOrderByDesc(value === "true")}
                exclusive={true}
                fullWidth
            >
                <ToggleButton value="true" key="true">
                    Newest first
                </ToggleButton>
                <ToggleButton value="false" key="false">
                    Oldest first
                </ToggleButton>
            </ToggleButtonGroup>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2
                }}
            >
                <FormControl>
                    <Select
                      value={limit}
                      onChange={(e) => {
                          setLimit(Number(e.target.value));
                          if (setPage) {
                              setPage(1);
                          }
                      }}
                      variant="outlined"
                    >
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="8">8</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPlanned}
                      onChange={(e) => setShowPlanned(e.target.checked)}
                    />
                  }
                  label="Show planned"
                />

                <MuiLink
                  sx={{cursor: "pointer"}}
                  onClick={() => handleClearFilters()}
                >
                    Clear filters
                </MuiLink>
            </Box>
        </Box>
    );
}