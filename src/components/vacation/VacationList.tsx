import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
    Alert,
    Box,
    Button,
    FormControl, Grid, InputAdornment,
    InputLabel, MenuItem,
    Pagination,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {FilterAltOutlined} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {getVacationInfoByUserIdActionCreator, getVacationsByUserIdActionCreator} from "../../redux/epics/VacationEpics";

export default  function VacationList() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {manageUsers} = useAppSelector(state => state.manageUsers);
    const {vacationList, vacationInfo, error, isLoading} = useAppSelector(state => state.vacation);
    const {user} = useAppSelector(state => state.user);

    const [sortByDesc, setSortDesc] = useState<boolean>(true);

    useEffect(() => {
        //getVacationList
        dispatch(getVacationsByUserIdActionCreator({
            userId: user.id,
            onlyApproved: null,
            orderByDesc: sortByDesc
        }));

        //getVacation info if null
        dispatch(getVacationInfoByUserIdActionCreator(user.id));
    }, []);

    useEffect(() => {
        console.log(vacationList);
        console.log(vacationInfo);
    }, [vacationInfo]);

    return (
        <>
            {error
                ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
                : <>
                    {isLoading
                        ? <div className="lds-dual-ring"></div>
                        :
                        <>
                            <h3 style={{marginBottom: '10px'}}>
                                List of vacations

                                <Button
                                    //onClick={() => navigate('/user/create')}
                                    variant="outlined"
                                    color="success"
                                    type="submit"
                                    size="small"
                                    sx={{
                                        mx: 1,
                                    }}
                                >
                                    Create new
                                </Button>
                            </h3>

                            {manageUsers.items && manageUsers.items.length > 0
                                ? <>LIST</>
                                // <>
                                //     <Grid container spacing={2}>
                                //         <Grid item xs={4}>
                                //             <FormControl fullWidth>
                                //                 <TextField
                                //                     id="fullName"
                                //                     variant="outlined"
                                //                     color="secondary"
                                //                     size="small"
                                //                     label="Full name"
                                //                     inputRef={fullNameInputRef}
                                //                     value={fullNameInput}
                                //                     onChange={(event) => {
                                //                         setFullNameInput(event.target.value);
                                //
                                //                         if (!event.target.value) {
                                //                             setFullName('');
                                //                         }
                                //                     }}
                                //                     InputProps={{
                                //                         endAdornment: (
                                //                             <InputAdornment position="end">
                                //                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                //                                     <Button size="small" onClick={() => {setFullName(fullNameInputRef.current ? fullNameInputRef.current?.value : '')}}
                                //                                     >
                                //                                         <FilterAltOutlined color="secondary" />
                                //                                     </Button>
                                //
                                //                                 </Box>
                                //                             </InputAdornment>
                                //                         ),
                                //                     }}
                                //                 />
                                //             </FormControl>
                                //         </Grid>
                                //
                                //         <Grid item xs={3}>
                                //             <FormControl fullWidth>
                                //                 <TextField
                                //                     id="status"
                                //                     variant="outlined"
                                //                     color="secondary"
                                //                     size="small"
                                //                     label="Status"
                                //                     inputRef={statusInputRef}
                                //                     value={statusInput}
                                //                     onChange={(event) => {
                                //                         setStatusInput(event.target.value);
                                //
                                //                         if (!event.target.value) {
                                //                             setStatus('');
                                //                         }
                                //                     }}
                                //                     InputProps={{
                                //                         endAdornment: (
                                //                             <InputAdornment position="end">
                                //                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                //                                     <Button size="small" onClick={() => {setStatus(statusInputRef.current ? statusInputRef.current?.value : '')}}
                                //                                     >
                                //                                         <FilterAltOutlined color="secondary" />
                                //                                     </Button>
                                //
                                //                                 </Box>
                                //                             </InputAdornment>
                                //                         ),
                                //                     }}
                                //                 />
                                //             </FormControl>
                                //         </Grid>
                                //
                                //         <Grid item xs={3}>
                                //             <FormControl fullWidth>
                                //                 <TextField
                                //                     id="employmentRate"
                                //                     variant="outlined"
                                //                     color="secondary"
                                //                     size="small"
                                //                     type="number"
                                //                     label="Employment Rate"
                                //                     inputRef={employmentRateInputRef}
                                //                     value={employmentRateInput}
                                //                     onChange={(event) => {
                                //                         setEmploymentRateInput(event.target.value);
                                //
                                //                         if (!event.target.value) {
                                //                             setEmploymentRate(null);
                                //                         }
                                //                     }}
                                //                     InputProps={{
                                //                         endAdornment: (
                                //                             <InputAdornment position="end">
                                //                                 <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                //                                     <Button size="small" onClick={() => {setEmploymentRate(employmentRateInputRef.current ? parseInt(employmentRateInputRef.current?.value) : null)}}
                                //                                     >
                                //                                         <FilterAltOutlined color="secondary" />
                                //                                     </Button>
                                //
                                //                                 </Box>
                                //                             </InputAdornment>
                                //                         ),
                                //                     }}
                                //                 />
                                //             </FormControl>
                                //         </Grid>
                                //
                                //         <Grid item xs={2}>
                                //             <FormControl fullWidth>
                                //                 <InputLabel htmlFor="selectBox">Sort by:</InputLabel>
                                //                 <Select
                                //                     id="selectBox"
                                //                     label="Select Option"
                                //                     variant="outlined"
                                //                     value={sortBy}
                                //                     color="secondary"
                                //                     size="small"
                                //                     onChange={(event) => setSortBy(event.target.value)}
                                //                 >
                                //                     <MenuItem value="fullName">Full Name</MenuItem>
                                //                     <MenuItem value="employmentDate">Employment Date</MenuItem>
                                //                 </Select>
                                //             </FormControl>
                                //         </Grid>
                                //     </Grid>
                                //
                                //     <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                                //         <Table>
                                //             <TableHead>
                                //                 <TableRow>
                                //                     <TableCell style={{fontWeight: 'bold'}}>Full Name</TableCell>
                                //                     <TableCell style={{fontWeight: 'bold'}}>Email</TableCell>
                                //                     <TableCell style={{fontWeight: 'bold'}}>Employment Rate</TableCell>
                                //                     <TableCell style={{fontWeight: 'bold'}}>Employment Date</TableCell>
                                //                     <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                                //                     <TableCell style={{fontWeight: 'bold'}}>Actions</TableCell>
                                //                 </TableRow>
                                //             </TableHead>
                                //             <TableBody>
                                //                 {manageUsers.items.map((user) => (
                                //                     <TableRow style={{backgroundColor: user.status === 'deactivated' ? 'rgba(255, 0, 0, 0.3)' : 'inherit'}} key={user.id}>
                                //                         <TableCell>{user.fullName}</TableCell>
                                //                         <TableCell>{user.email}</TableCell>
                                //                         <TableCell>{user.employmentRate}</TableCell>
                                //                         <TableCell>{formatIsoDate(getNewIsoDateWithTimeZone(new Date(user.employmentDate)))}</TableCell>
                                //                         <TableCell>
                                //                             {user.status}
                                //                         </TableCell>
                                //                         <TableCell>
                                //                             {user.status === 'deactivated' || user.permissions.toLowerCase() === "all"
                                //                                 ? <span>Actions are not available</span>
                                //                                 :
                                //                                 <>
                                //                                     {hasPermit(userData.permissions, "UpdateUser")
                                //                                         &&  <Button
                                //                                             onClick={() => navigate(`/user/update/${user.id}`)}
                                //                                             variant="outlined"
                                //                                             color="primary"
                                //                                             type="submit"
                                //                                             size='small'
                                //                                             sx={{
                                //                                                 mx: 1
                                //                                             }}
                                //                                         >
                                //                                             Edit
                                //                                         </Button>
                                //                                     }
                                //
                                //                                     {hasPermit(userData.permissions, "CreateUser") && hasPermit(userData.permissions, "UpdateUser")
                                //                                         && !user.hasPassword && !user.hasValidSetPasswordLink
                                //                                         && <Button
                                //                                             onClick={() => handleSendPasswordLink(user.email)}
                                //                                             variant="outlined"
                                //                                             color="secondary"
                                //                                             type="submit"
                                //                                             size='small'
                                //                                             sx={{
                                //                                                 mx: 1
                                //                                             }}
                                //                                         >
                                //                                             Send password link
                                //                                         </Button>
                                //                                     }
                                //                                 </>
                                //                             }
                                //                         </TableCell>
                                //                     </TableRow>
                                //                 ))}
                                //             </TableBody>
                                //         </Table>
                                //     </TableContainer>
                                // </>

                                :  <>
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        Users not found
                                    </Alert>

                                    <Button
                                        variant="outlined"
                                        color="primary" sx={{mt: 2}}
                                    >
                                        Back to list
                                    </Button>
                                </>
                            }
                        </>
                    }
                </>
            }
        </>

    );
};