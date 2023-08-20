import {Autocomplete, Box, TextField, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {getProfilesActionCreator} from "../../redux/epics/UserEpics";
import Profile from "../../models/Profile";
import {DatePicker} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";

interface SickLeaveListFiltersProps {
    filterUser: Profile | null,
    setFilterUser: Dispatch<SetStateAction<Profile | null>>,
    searchByYear: boolean,
    setSearchByYear: Dispatch<SetStateAction<boolean>>,
    filterDate: Moment,
    setFilterDate: Dispatch<SetStateAction<Moment>>
}
export default function SickLeaveListFilters({filterUser, setFilterUser, searchByYear, setSearchByYear,
         filterDate, setFilterDate}: SickLeaveListFiltersProps) {
    const dispatch = useAppDispatch();

    const profiles = useAppSelector(state => state.profile.profiles.items);

    const [filterUserInput, setFilterUserInput] = useState<string>("");

    useEffect(() => {
        dispatch(getProfilesActionCreator({}));
    }, []);

    function handleSearchByYearChange(e: React.MouseEvent<HTMLElement>, value: string) {
        setSearchByYear(value === "year");
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3
            }}
        >
            <Autocomplete
                getOptionLabel={(option: Profile) => option.fullName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={profiles}
                renderInput={(params) => <TextField {...params} label="Select user" />}
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                sx={{
                    maxWidth: "300px"
                }}
                value={filterUser}
                inputValue={filterUserInput}
                onChange={(event: any, newUser: Profile | null) => {
                    setFilterUser(newUser);
                }}
                onInputChange={(event, newInputValue) => {
                    setFilterUserInput(newInputValue);
                }}
            />

            <ToggleButtonGroup
                value={searchByYear ? "year" : "month"}
                onChange={handleSearchByYearChange}
                exclusive={true}
            >
                <ToggleButton value="month" key="month">
                    Month
                </ToggleButton>
                <ToggleButton value="year" key="year">
                    Year
                </ToggleButton>
            </ToggleButtonGroup>

            <Box>
                <DatePicker
                    views={searchByYear ? ['year'] : ['year' ,'month']}
                    label={searchByYear ? "Year" : "Month"}
                    value={filterDate}
                    onChange={(newDate) => setFilterDate(newDate || moment())}
                    format={searchByYear ? "YYYY" : "YYYY-MM"}
                    slotProps={{
                        textField: {
                            onBeforeInput: disableKeyboardEntry
                        }
                    }}
                    dayOfWeekFormatter={(day) => `${day}`}
                />
            </Box>
        </Box>
    );
}

const disableKeyboardEntry = (e: any) => {
    if (e?.preventDefault) {
        e?.preventDefault();
        e?.stopPropagation();
    }
}