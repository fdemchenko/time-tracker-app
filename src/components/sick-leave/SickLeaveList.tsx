import {Alert, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {formatIsoDateWithoutTime} from "../../helpers/date";
import {Link} from "react-router-dom";
import React from "react";
import {SickLeave} from "../../models/sick-leave/SickLeave";
import {isTodayIsInRange} from "../../helpers/date";
import {useAppSelector} from "../../redux/CustomHooks";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SickLeaveList() {
    const {sickLeaveList} = useAppSelector(state => state.sickLeave);

    function getIsActiveStatus(sickLeve: SickLeave) {
        return isTodayIsInRange(sickLeve.start, sickLeve.end) ? "Active" : "Not active";
    }

    return (
        <>
            {sickLeaveList.length > 0
                ?
                <>
                    <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{fontWeight: 'bold'}}>User</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Last modifier</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Start</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>End</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}}>Is active</TableCell>
                                    <TableCell style={{fontWeight: 'bold'}} />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sickLeaveList.map((sickLeaveItem) => (
                                    <TableRow key={sickLeaveItem.sickLeave.id}>
                                        <TableCell>
                                            <Link to={`/user/${sickLeaveItem.user.id}`} target="_blank">
                                                {sickLeaveItem.user.fullName}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Link to={`/user/${sickLeaveItem.lastModifier.id}`} target="_blank">
                                                {sickLeaveItem.lastModifier.fullName}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {formatIsoDateWithoutTime(sickLeaveItem.sickLeave.start)}
                                        </TableCell>
                                        <TableCell>
                                            {formatIsoDateWithoutTime(sickLeaveItem.sickLeave.end)}
                                        </TableCell>
                                        <TableCell>
                                            {getIsActiveStatus(sickLeaveItem.sickLeave)}
                                        </TableCell>
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 2
                                                }}
                                            >
                                                <Link to={`/sick-leave/update/${sickLeaveItem.sickLeave.id}`}>
                                                    <EditIcon />
                                                </Link>

                                                <Link to={`/sick-leave/delete/${sickLeaveItem.sickLeave.id}`}>
                                                    <DeleteIcon />
                                                </Link>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
                :
                <Alert severity="info" sx={{ mt: 2 }}>
                    There is no sick leave data to be found
                </Alert>
            }
        </>
    );
}