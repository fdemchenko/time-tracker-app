import {Alert, Box, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React from "react";
import Typography from "@mui/material/Typography";
import {countIsoDateDiff, formatIsoDateTime, parseIsoDateToLocal} from "../../helpers/date";
import Tooltip from "@mui/material/Tooltip";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";
import WorkSession from "../../models/work-session/WorkSession";
import {useAppSelector} from "../../redux/CustomHooks";

interface WorkSessionListProps {
    workSessionList: {
        count: number,
        items: WorkSession[]
    }
}
export default function WorkSessionList({workSessionList}: WorkSessionListProps) {
    const users = useAppSelector(state => state.manageUsers.usersWithoutPagination);

    function calculateWorkSessionWidth(start: string, end?: string | null | undefined) {
        const startDate = new Date(start);
        const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        const endDate = end ? new Date(end) : new Date(new Date().getTime() + timeZoneOffset);

        const eightHoursInMillis = 8 * 60 * 60 * 1000;
        const durationInMillis = endDate.getTime() - startDate.getTime();

        let percentage = (durationInMillis / eightHoursInMillis) * 100;
        percentage = Math.min(Math.max(percentage, 3), 100);

        return percentage;
    }

    function generateToolTipString(workSession: WorkSession): string[] {
        const lastModifier = users.find(u => u.id === workSession.lastModifierId);

        const tooltipStrings: string[] = [];
        if (workSession.title) {
            tooltipStrings.push(`Title: ${workSession.title}`);
        }
        if (workSession.description) {
            tooltipStrings.push(`Description: ${workSession.description}`);
        }

        tooltipStrings.push(`Type: ${workSession.type}`);
        tooltipStrings.push(`Last modifier: ${lastModifier?.fullName}`);
        return tooltipStrings;
    }

    return (
        <>
            {
                workSessionList.items.length > 0 ? (
                  <>
                      <TableContainer  sx={{"& td": { border: 0 }}}
                                       className="custom-table-container"
                      >
                          <Table>
                              <TableBody>
                                  {workSessionList.items.map((ws, index) => {
                                      return <React.Fragment key={ws.id}>
                                          <TableRow key={ws.id}>
                                              <TableCell padding="none">
                                                  {index === 0 &&
                                                    <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                        {formatIsoDateTime(parseIsoDateToLocal(ws.start)).split(' ')[0]}
                                                    </Typography>
                                                  }
                                                  {index > 0 && new Date(workSessionList.items[index - 1].start).getDate() !==
                                                    new Date(ws.start).getDate()  &&
                                                    <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                        {formatIsoDateTime(parseIsoDateToLocal(ws.start)).split(' ')[0]}
                                                    </Typography>
                                                  }
                                                  <Tooltip
                                                    title={
                                                        <React.Fragment>
                                                            {generateToolTipString(ws).map((line, index) => (
                                                              <React.Fragment key={index}>
                                                                  {line}
                                                                  <br />
                                                              </React.Fragment>
                                                            ))}
                                                        </React.Fragment>
                                                    }
                                                    arrow
                                                    placement="right"
                                                  >
                                                      <div style={
                                                          {backgroundColor: ws.type !==
                                                                WorkSessionTypesEnum[WorkSessionTypesEnum.Planned] ?
                                                             '#47817F' : "#68B38D",
                                                          width: `${calculateWorkSessionWidth(ws.start, ws.end)}%`,
                                                          display: 'flex', cursor: 'pointer', flexDirection: 'column', padding: '5px', gap: '15px', marginTop: '10px',
                                                          borderRadius: "5px"}}>
                                                          <Typography style={{fontSize: '12px'}}>
                                                              {
                                                                  `Start: ${formatIsoDateTime(parseIsoDateToLocal(ws.start))}`
                                                              }
                                                          </Typography>

                                                          {ws.end &&
                                                            <Typography style={{fontSize: '12px'}}>
                                                                {
                                                                    `${ws.end ? `End: 
                                                                    ${formatIsoDateTime(parseIsoDateToLocal(ws.end))}` : ''}`
                                                                }
                                                            </Typography>
                                                          }

                                                          <Typography style={{fontSize: '12px'}}>
                                                              {
                                                                ws.end &&
                                                                `Duration: ${countIsoDateDiff(ws.start, ws.end)}`
                                                              }
                                                          </Typography>
                                                      </div>
                                                  </Tooltip>
                                              </TableCell>

                                              <TableCell sx={{width: "10%"}}>
                                                  {ws.end &&
                                                    <Box
                                                      sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 2
                                                      }}
                                                    >
                                                        <Link to={`/worksession/update/${ws.id}`}>
                                                            <EditIcon />
                                                        </Link>


                                                        <Link to={`/worksession/delete/${ws.id}`}>
                                                            <DeleteIcon />
                                                        </Link>
                                                    </Box>
                                                  }
                                              </TableCell>
                                          </TableRow>
                                      </React.Fragment>
                                  })}
                              </TableBody>
                          </Table>
                      </TableContainer>
                  </>
                ) : (
                  <Alert severity="info" sx={{my: 2, w: 1}}>
                      There are no records for now
                  </Alert>
                )
            }
        </>
    );
}