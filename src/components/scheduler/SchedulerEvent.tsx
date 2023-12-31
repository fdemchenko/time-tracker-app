import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import Typography from "@mui/material/Typography";
import {formatIsoTime} from "../../helpers/date";
import {Box} from "@mui/material";
import React from "react";
import {Link} from "react-router-dom";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import {isPlannedEvent} from "../../services/SchedulerService";

interface SchedulerEventProps {
  event: ProcessedEvent;
  eventRendererProps: any;
}
export default function SchedulerEvent({event, eventRendererProps}: SchedulerEventProps) {
  return (
    <Box
      sx={{
        height: "100%",
        background: event.color,
        padding: "10px",
        textOverflow: "ellipsis",
        color: "#E3E0F3"
      }}
      {...eventRendererProps}
    >
      <Typography
        variant="body1"
        sx={{
          textTransform: "uppercase",
          fontWeight: "bold",
          color: "white"
        }}
      >
        {isPlannedEvent(event) ? <CalendarMonthIcon fontSize="small" /> : <EventAvailableIcon fontSize="small" />}&nbsp;
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
  );
}