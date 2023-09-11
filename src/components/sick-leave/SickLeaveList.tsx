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
  const {usersWithoutPagination} = useAppSelector(state => state.manageUsers);

  function getIsActiveStatus(sickLeve: SickLeave) {
    return isTodayIsInRange(sickLeve.start, sickLeve.end) ? "Active" : "Not active";
  }

  return (
    <>
      {
        sickLeaveList.length > 0
          ?
          <>
            <TableContainer sx={{mt: 2}} className="custom-table-container" component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight: 'bold'}}>User</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>Last modifier</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>Start</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>End</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}>Is active</TableCell>
                    <TableCell style={{fontWeight: 'bold'}}/>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sickLeaveList.map((sickLeave) => (
                    <TableRow key={sickLeave.id}>
                      <TableCell>
                        <Link to={`/profile/${sickLeave.userId}`} target="_blank" className="general_link">
                          {usersWithoutPagination.find(u => u.id === sickLeave.userId)?.fullName || ""}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link to={`/profile/${sickLeave.lastModifierId}`} target="_blank" className="general_link">
                          {usersWithoutPagination.find(u => u.id === sickLeave.lastModifierId)?.fullName || ""}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {formatIsoDateWithoutTime(sickLeave.start)}
                      </TableCell>
                      <TableCell>
                        {formatIsoDateWithoutTime(sickLeave.end)}
                      </TableCell>
                      <TableCell>
                        {getIsActiveStatus(sickLeave)}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2
                          }}
                        >
                          <Link to={`/sick-leave/update/${sickLeave.id}`} className="general_link">
                            <EditIcon/>
                          </Link>

                          <Link to={`/sick-leave/delete/${sickLeave.id}`} className="general_link">
                            <DeleteIcon/>
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
          <Alert severity="info" sx={{mt: 2}}>
            There is no sick leave data to be found
          </Alert>
      }
    </>
  );
}