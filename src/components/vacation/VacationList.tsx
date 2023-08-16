import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {formatIsoDateWithoutTime} from "../../helpers/date";
import Tooltip from "@mui/material/Tooltip";
import {Link} from "react-router-dom";
import React from "react";
import {VacationResponse} from "../../models/vacation/VacationResponse";
import {Vacation} from "../../models/vacation/Vacation";

interface VacationListProps {
    vacationList: VacationResponse[],
    actionsCellRenderer: (vacation: Vacation) => React.ReactNode
}
export default function VacationList({vacationList, actionsCellRenderer}: VacationListProps) {
    function getVacationStatus(vacation: Vacation): string {
        if (vacation.isApproved === null) {
            return "waiting for approve";
        }
        return vacation ? "approved" : "declined";
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
                                    <TableCell style={{fontWeight: 'bold'}}>Approver</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Approver comment</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vacationList.map((vacationItem) => (
                                    <TableRow style={{backgroundColor: vacationItem.vacation.isApproved === null ? 'inherit' :
                                            vacationItem.vacation.isApproved ? '#6fbf73' : '#ffa733'}}
                                              key={vacationItem.vacation.id}>
                                        <TableCell>
                                            {formatIsoDateWithoutTime(vacationItem.vacation.start)}
                                        </TableCell>
                                        <TableCell>
                                            {formatIsoDateWithoutTime(vacationItem.vacation.end)}
                                        </TableCell>
                                        <TableCell sx={{maxWidth: "150px"}}>
                                            <Tooltip title={vacationItem.vacation.comment}>
                                                <Box sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {vacationItem.vacation.comment || "missing"}
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                vacationItem.approver ?
                                                    (
                                                        <Link to={`/user/${vacationItem.approver.id}`} target="_blank">
                                                            {vacationItem.approver.fullName}
                                                        </Link>
                                                    ) : "none"
                                            }
                                        </TableCell>
                                        <TableCell sx={{maxWidth: "150px"}}>
                                            <Tooltip title={vacationItem.vacation.approverComment}>
                                                <Box sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {
                                                        vacationItem.vacation.approverComment || "missing"
                                                    }
                                                </Box>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{getVacationStatus(vacationItem.vacation)}</TableCell>
                                        <TableCell>{actionsCellRenderer(vacationItem.vacation)}</TableCell>
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