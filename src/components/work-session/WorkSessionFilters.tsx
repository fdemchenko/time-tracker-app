import {DesktopDatePicker} from "@mui/x-date-pickers";
import {
    Box,
    FormControl,
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
    setPage?: Dispatch<SetStateAction<number>>;
}
export default function WorkSessionFilters({startDate, setStartDate, endDate, setEndDate,
        orderByDesc, setOrderByDesc, limit, setLimit, setPage}: WorkSessionFiltersProps) {
    return (
        <Box
            sx={{
                mb: 1,
                display: "flex",
                flexWrap: "wrap",
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
            >
                <ToggleButton value="true" key="true">
                    Newest first
                </ToggleButton>
                <ToggleButton value="false" key="false">
                    Oldest first
                </ToggleButton>
            </ToggleButtonGroup>

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
                    fullWidth
                >
                    <MenuItem value="5">5</MenuItem>
                    <MenuItem value="8">8</MenuItem>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="15">15</MenuItem>
                    <MenuItem value="30">30</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}