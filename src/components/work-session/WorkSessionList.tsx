import {Alert, Box, Table, TableBody, TableCell, TableContainer, TableRow} from "@mui/material";
import React from "react";
import Typography from "@mui/material/Typography";
import {countIsoDateDiff, formatIsoDateTime, parseIsoDateToLocal} from "../../helpers/date";
import Tooltip from "@mui/material/Tooltip";
import {Link} from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {WorkSessionWithRelations} from "../../models/work-session/WorkSessionWithRelations";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";

interface WorkSessionListProps {
    workSessionList: {
        count: number,
        items: WorkSessionWithRelations[]
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

    function generateToolTipString(workSessionData: WorkSessionWithRelations): string[] {
        const { workSession, lastModifier } = workSessionData;

        const tooltipStrings: string[] = [];
        if (workSession.title) {
            tooltipStrings.push(`Title: ${workSession.title}`);
        }
        if (workSession.description) {
            tooltipStrings.push(`Description: ${workSession.description}`);
        }

        tooltipStrings.push(`Type: ${workSession.type}`);
        tooltipStrings.push(`Last modifier: ${lastModifier.fullName}`);
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
                                  {workSessionList.items.map((workSessionData, index) => {
                                      return <React.Fragment key={workSessionData.workSession.id}>
                                          <TableRow key={workSessionData.workSession.id}>
                                              <TableCell padding="none">
                                                  {index === 0 &&
                                                    <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                        {formatIsoDateTime(parseIsoDateToLocal(workSessionData.workSession.start)).split(' ')[0]}
                                                    </Typography>
                                                  }
                                                  {index > 0 && new Date(workSessionList.items[index - 1].workSession.start).getDate() !==
                                                    new Date(workSessionData.workSession.start).getDate()  &&
                                                    <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                        {formatIsoDateTime(parseIsoDateToLocal(workSessionData.workSession.start)).split(' ')[0]}
                                                    </Typography>
                                                  }
                                                  <Tooltip
                                                    title={
                                                        <React.Fragment>
                                                            {generateToolTipString(workSessionData).map((line, index) => (
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
                                                          {backgroundColor: workSessionData.workSession.type !==
                                                                WorkSessionTypesEnum[WorkSessionTypesEnum.Planned] ?
                                                             '#68B38D' : "#FAF1CB",
                                                          width: `${calculateWorkSessionWidth(workSessionData.workSession.start, workSessionData.workSession.end)}%`,
                                                          display: 'flex', cursor: 'pointer', flexDirection: 'column', padding: '5px', gap: '15px', marginTop: '10px',
                                                          borderRadius: "5px"}}>
                                                          <Typography style={{fontSize: '12px'}}>
                                                              {
                                                                  `Start: ${formatIsoDateTime(parseIsoDateToLocal(workSessionData.workSession.start))}`
                                                              }
                                                          </Typography>

                                                          {workSessionData.workSession.end &&
                                                            <Typography style={{fontSize: '12px'}}>
                                                                {
                                                                    `${workSessionData.workSession.end ? `End: 
                                                                    ${formatIsoDateTime(parseIsoDateToLocal(workSessionData.workSession.end))}` : ''}`
                                                                }
                                                            </Typography>
                                                          }

                                                          <Typography style={{fontSize: '12px'}}>
                                                              {
                                                                workSessionData.workSession.end &&
                                                                `Duration: ${countIsoDateDiff(workSessionData.workSession.start, workSessionData.workSession.end)}`
                                                              }
                                                          </Typography>
                                                      </div>
                                                  </Tooltip>
                                              </TableCell>

                                              <TableCell sx={{width: "10%"}}>
                                                  {workSessionData.workSession.end &&
                                                    <Box
                                                      sx={{
                                                          display: "flex",
                                                          alignItems: "center",
                                                          gap: 2
                                                      }}
                                                    >
                                                        <Link to={`/worksession/update/${workSessionData.workSession.id}`}>
                                                            <EditIcon />
                                                        </Link>


                                                        <Link to={`/worksession/delete/${workSessionData.workSession.id}`}>
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