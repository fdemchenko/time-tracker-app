import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {formatIsoDateWithoutTime} from "../../helpers/date";
import Tooltip from "@mui/material/Tooltip";
import {Link} from "react-router-dom";
import React from "react";
import {Vacation} from "../../models/vacation/Vacation";
import {useAppSelector} from "../../redux/CustomHooks";

interface VacationListProps {
    vacationList: Vacation[],
    actionsCellRenderer: (vacation: Vacation) => React.ReactNode,
    showUser?: boolean
}
export default function VacationList({vacationList, actionsCellRenderer, showUser}: VacationListProps) {
    const users = useAppSelector(state => state.manageUsers.usersWithoutPagination);

    function getVacationStatus(vacation: Vacation): string {
        if (vacation.isApproved === null) {
            return "waiting for approve";
        }
        else {
            return vacation.isApproved ? "approved" : "declined";
        }
    }

    return (
        <>
            {vacationList.length > 0
                ?
                <>
                    <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontWeight: 'bold'}}>Start</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>End</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Comment</TableCell>
                                    <TableCell
                                        style={{
                                            fontWeight: 'bold',
                                            display: showUser ? "table-cell" : "none"
                                        }}
                                    >
                                        User
                                    </TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Approver</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Approver comment</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vacationList.map((vacation) => (
                                    <TableRow style={{backgroundColor: vacation.isApproved === null ? 'inherit' :
                                            vacation.isApproved ? '#6fbf73' : '#ffa733'}}
                                              key={vacation.id}>
                                        <TableCell>
                                            {formatIsoDateWithoutTime(vacation.start)}
                                        </TableCell>
                                        <TableCell>
                                            {formatIsoDateWithoutTime(vacation.end)}
                                        </TableCell>
                                        <TableCell sx={{maxWidth: "150px"}}>
                                            <Tooltip title={vacation.comment}>
                                                <Box sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {vacation.comment || "missing"}
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{display: showUser ? "table-cell" : "none"}}>
                                            <Link to={`/profile/${vacation.userId}`} target="_blank">
                                                {users.find(u => u.id === vacation.userId)?.fullName}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                vacation.approverId ?
                                                    (
                                                        <Link to={`/profile/${vacation.approverId}`} target="_blank">
                                                            {users.find(u => u.id === vacation.approverId)?.fullName}
                                                        </Link>
                                                    ) : "none"
                                            }
                                        </TableCell>
                                        <TableCell sx={{maxWidth: "150px"}}>
                                            <Tooltip title={vacation.approverComment}>
                                                <Box sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {
                                                        vacation.approverComment || "missing"
                                                    }
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{getVacationStatus(vacation)}</TableCell>
                                        <TableCell>{actionsCellRenderer(vacation)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
                :
                <Alert severity="info" sx={{ mt: 2 }}>
                    There is no vacations to be found
                </Alert>
            }
        </>
    );
}