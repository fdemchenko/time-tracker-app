import WorkSession from "../../models/WorkSession";
import {Alert, Box, Pagination, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React from "react";
import Typography from "@mui/material/Typography";
import {countIsoDateDiff, formatIsoDateTime, parseIsoDateToLocal} from "../../helpers/date";
import Tooltip from "@mui/material/Tooltip";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface WorkSessionListProps {
    workSessionList: {
        count: number,
        items: WorkSession[]
    }
}
export default function WorkSessionList({workSessionList}: WorkSessionListProps) {
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
        const { type, title, description, lastModifierName } = workSession;

        const tooltipStrings: string[] = [];
        if (title) {
            tooltipStrings.push(`Title: ${title}`);
        }
        if (description) {
            tooltipStrings.push(`Description: ${description}`);
        }

        tooltipStrings.push(`Type: ${type}`);
        tooltipStrings.push(`Last modifier: ${lastModifierName}`);
        return tooltipStrings;
    }

    return (
        <>
            {
                workSessionList.items.length > 0 ? (
                  <>
                      <TableContainer  sx={{ mt: 2 , "& td": { border: 0 }}}
                                       className="custom-table-container"
                      >
                          <Table>
                              <TableBody>
                                  {workSessionList.items.map((workSession, index) => {
                                      return <React.Fragment key={workSession.id}>
                                          <TableRow key={workSession.id}>
                                              <TableCell padding="none">
                                                  {index === 0 &&
                                                    <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                        {formatIsoDateTime(parseIsoDateToLocal(workSession.start)).split(' ')[0]}
                                                    </Typography>
                                                  }
                                                  {index > 0 && new Date(workSessionList.items[index - 1].start).getDate() !== new Date(workSession.start).getDate()  &&
                                                    <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                        {formatIsoDateTime(parseIsoDateToLocal(workSession.start)).split(' ')[0]}
                                                    </Typography>
                                                  }
                                                  <Tooltip
                                                    title={
                                                        <React.Fragment>
                                                            {generateToolTipString(workSession).map((line, index) => (
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
                                                      <div style={{backgroundColor: '#faec8e', width: `${calculateWorkSessionWidth(workSession.start, workSession.end)}%`, display: 'flex', cursor: 'pointer', flexDirection: 'column', padding: '5px', gap: '15px', marginTop: '10px'}}>
                                                          <Typography style={{fontSize: '12px'}}>
                                                              {
                                                                  `Start: ${formatIsoDateTime(parseIsoDateToLocal(workSession.start))}`
                                                              }
                                                          </Typography>

                                                          {workSession.end &&
                                                            <Typography style={{fontSize: '12px'}}>
                                                                {
                                                                    `${workSession.end ? `End: ${formatIsoDateTime(parseIsoDateToLocal(workSession.end))}` : ''}`
                                                                }
                                                            </Typography>
                                                          }

                                                          <Typography style={{fontSize: '12px'}}>
                                                              {
                                                                workSession.end &&
                                                                `Duration: ${countIsoDateDiff(workSession.start, workSession.end)}`
                                                              }
                                                          </Typography>
                                                      </div>
                                                  </Tooltip>
                                              </TableCell>

                                              <TableCell sx={{width: "10%"}}>
                                                  {workSession.end &&
                                                    <Box
                                                      sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 2
                                                      }}
                                                    >
                                                        <Link to={`/worksession/update/${workSession.id}`}>
                                                            <EditIcon />
                                                        </Link>


                                                        <Link to={`/worksession/delete/${workSession.id}`}>
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
                  <Alert severity="info" sx={{my: 2}}>
                      There are no records for now
                  </Alert>
                )
            }
        </>
    );
}