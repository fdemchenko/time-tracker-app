import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import moment from 'moment';
import {
    Alert, Autocomplete,
    Button,
    Link as MuiLink, TextField,
} from "@mui/material";
import {Link, Outlet, useParams} from "react-router-dom";
import {getUserWorkSessionsActionCreator} from "../../redux/epics/WorkSessionEpics";
import {Moment} from "moment";
import {hasPermit} from "../../helpers/hasPermit";
import Typography from "@mui/material/Typography";
import WorkSessionFilters from "./WorkSessionFilters";
import WorkSessionList from "./WorkSessionList";
import Pagination from "../layout/Pagination";
import {getUsersWithoutPaginationActionCreator} from "../../redux/epics/UserEpics";
import User from "../../models/User";

export default function WorkSessionPage() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const {
        workSessionsList, error, isLoading,
        activeWorkSession
    } = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);
    const usersList = useAppSelector(state => state.manageUsers.usersWithoutPagination);

    const [startDate, setStartDate] = useState<Moment | null>(null);
    const [endDate, setEndDate] = useState<Moment | null>(() => moment());
    const [orderByDesc, setOrderByDesc] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(8);

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
        }));
    }, [page, limit, startDate, endDate, orderByDesc, activeWorkSession, userInput]);

    useEffect(() => {
        dispatch(getUsersWithoutPaginationActionCreator(false));
    }, []);

    function handleClearFilters() {
        setPage(1);
        setStartDate(null);
        setEndDate(null);
        setOrderByDesc(true);
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

                        {hasPermit(user.permissions, "CreateWorkSessions")
                          &&
                          <Link to={`/worksession/create/${id}`}>
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
                        }

                        <Autocomplete
                          getOptionLabel={(option: User) => option.fullName}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          options={usersList}
                          renderInput={(params) => <TextField
                            {...params}
                            label="Select user"
                          />}
                          sx={{
                              maxWidth: "260px",
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
                          setPage={setPage}
                        />
                        <MuiLink
                          sx={{cursor: "pointer"}}
                          onClick={() => handleClearFilters()}
                        >
                            Clear filters
                        </MuiLink>

                        <WorkSessionList workSessionList={workSessionsList} />

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