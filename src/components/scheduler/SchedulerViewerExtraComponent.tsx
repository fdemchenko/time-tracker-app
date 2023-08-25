import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import React from "react";
import {Box} from "@mui/material";

interface SchedulerViewerExtraComponentProps {
  event: ProcessedEvent
}

export default function SchedulerViewerExtraComponent({event}: SchedulerViewerExtraComponentProps) {
  return (
    <Box sx={{color: "#00000099"}}>
      {
        event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Completed]
        || event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Planned]
        || event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Auto] ?
          (
            <>
              <Typography variant="body2">
                <b>For:&nbsp;</b>
                <Link to={`/profile/${event.user.id}`} target="_blank">
                  {event.user.fullName}
                </Link>
              </Typography>

              <Typography
                variant="body2"
              >
                <b>Last modifier:&nbsp;</b>
                <Link to={`/profile/${event.lastModifier.id}`} target="_blank">
                  {event.lastModifier.fullName}
                </Link>
              </Typography>

              <Typography
                variant="body2"
              >
                <b>Type:</b> {event.type}
              </Typography>

              {
                event.description &&
                <Typography
                  variant="body2"
                >
                  <b>Description:</b> {event.description}
                </Typography>
              }
            </>
          ):
          (
            <>
              <Typography
                variant="body2"
              >
                <b>Type:</b> {event.type.split(/(?=[A-Z])/).map((s: string) => s.toLowerCase()).join(' ')}
              </Typography>
            </>
          )
      }
    </Box>
  );
}