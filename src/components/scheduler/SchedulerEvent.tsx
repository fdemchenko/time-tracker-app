import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import Typography from "@mui/material/Typography";
import {formatIsoTime} from "../../helpers/date";
import {Box} from "@mui/material";
import React from "react";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";
import {Link} from "react-router-dom";

interface SchedulerEventProps {
  event: ProcessedEvent;
  eventRendererProps: any;
}
export default function SchedulerEvent({event, eventRendererProps}: SchedulerEventProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "5px",
        height: "100%",
        background: event.color,
        padding: "10px",
        textOverflow: "ellipsis",
        color: "#E3E0F3"
      }}
      {...eventRendererProps}
    >
      <Box>
        <Typography
          variant="body1"
          sx={{
            textTransform: "uppercase",
            fontWeight: "bold",
            color: "white"
          }}
        >
          {event.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: "bold"
          }}
        >
          {
            formatIsoTime(event.start.toISOString()) + "-" +
            formatIsoTime(event.end.toISOString())
          }
        </Typography>
      </Box>

      <Box sx={{pb: 3}}>
        <Typography
          variant="body2"
        >
          for&nbsp;
          <Link to={`/profile/${event.user.id}`} target="_blank">
            {event.user.fullName}
          </Link>
        </Typography>
        <Typography
          variant="body2"
        >
          last modifier&nbsp;
          <Link to={`/profile/${event.lastModifier.id}`} target="_blank">
            {event.lastModifier.fullName}
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}