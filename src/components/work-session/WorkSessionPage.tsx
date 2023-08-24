import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import moment from 'moment';
import {
    Alert, Autocomplete, Box,
    Button,
    TextField,
} from "@mui/material";
import {Link, Outlet} from "react-router-dom";
import {getUserWorkSessionsActionCreator} from "../../redux/epics/WorkSessionEpics";
import {Moment} from "moment";
import Typography from "@mui/material/Typography";
import WorkSessionFilters from "./WorkSessionFilters";
import WorkSessionList from "./WorkSessionList";
import Pagination from "../layout/Pagination";
import {getUsersWithoutPaginationActionCreator} from "../../redux/epics/UserEpics";
import User from "../../models/User";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";

export default function WorkSessionPage() {
    const dispatch = useAppDispatch();

    const {
        workSessionsList, error, isLoading,
        activeWorkSession, requireUpdateToggle
    } = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);
    const usersList = useAppSelector(state => state.manageUsers.usersWithoutPagination);

    const [startDate, setStartDate] = useState<Moment | null>(null);
    const [endDate, setEndDate] = useState<Moment | null>(() => moment.utc());
    const [orderByDesc, setOrderByDesc] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(8);
    const [showPlanned, setShowPlanned] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const pagesCount: number = Math.ceil(workSessionsList.count / limit);

    const [userInput, setUserInput] = useState<User>(user);
    const [userTextInput, setUserTextInput] = useState<string>(user.fullName);

    useEffect(() => {
        dispatch(getUserWorkSessionsActionCreator({
            userId: userInput.id,
            orderByDesc: orderByDesc,
            offset: (page - 1) * limit,
            limit: limit,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
            showPlanned: showPlanned
        }));
    }, [page, limit, startDate, endDate, orderByDesc, activeWorkSession, userInput, showPlanned,
        requireUpdateToggle]);

    useEffect(() => {
        dispatch(getUsersWithoutPaginationActionCreator(false));
    }, []);

    function generateCreateWorkSessionLink() {
        let link = "/worksession/create";
        if (hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.CreateWorkSessions])
          && userInput.id !== user.id) {
            link += `/${userInput.id}`;
        }
        return link;
    }

    return (
        <>
            {error
              ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
              : <>
                  <Outlet/>

                  {isLoading
                    ? <div className="lds-dual-ring"></div>
                    :
                    <>
                        <Typography variant="h3" gutterBottom>
                            List of work session
                        </Typography>

                        <Link to={generateCreateWorkSessionLink()}>
                            <Button
                              variant="outlined"
                              color="success"
                              type="submit"
                              sx={{
                                  mb: 3,
                              }}
                            >
                                Create new work session
                            </Button>
                        </Link>

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "start",
                                gap: "10px"
                            }}
                        >
                            <Box sx={{flex: "auto"}}>
                                <WorkSessionList workSessionList={workSessionsList} />
                            </Box>

                            <Box sx={{width: "25%"}}>
                                <Autocomplete
                                  getOptionLabel={(option: User) => option.fullName}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  options={usersList}
                                  renderInput={(params) => <TextField
                                    {...params}
                                    label="Select user"
                                  />}
                                  sx={{
                                      mb: 2
                                  }}
                                  selectOnFocus
                                  clearOnBlur
                                  handleHomeEndKeys
                                  value={userInput}
                                  inputValue={userTextInput}
                                  onChange={(event: any, selectedUser: User | null) => {
                                      setUserInput(selectedUser ? selectedUser : user);
                                  }}
                                  onInputChange={(event, newInputValue) => {
                                      setUserTextInput(newInputValue ? newInputValue : user.fullName);
                                  }}
                                />
                                <WorkSessionFilters
                                  startDate={startDate}
                                  setStartDate={setStartDate}
                                  endDate={endDate}
                                  setEndDate={setEndDate}
                                  orderByDesc={orderByDesc}
                                  setOrderByDesc={setOrderByDesc}
                                  limit={limit}
                                  setLimit={setLimit}
                                  showPlanned={showPlanned}
                                  setShowPlanned={setShowPlanned}
                                  setPage={setPage}
                                />
                            </Box>
                        </Box>

                        <Pagination
                          pagesCount={pagesCount}
                          page={page}
                          setPage={setPage}
                        />
                    </>
                  }
              </>
            }
        </>
    );
};