import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import Typography from "@mui/material/Typography";
import {Link} from "react-router-dom";
import React from "react";
import {Box} from "@mui/material";
import {isSickLeaveEvent, isVacationEvent, isWorkSessionEvent} from "../../services/SchedulerService";
import {useAppSelector} from "../../redux/CustomHooks";

interface SchedulerViewerExtraComponentProps {
  event: ProcessedEvent
}

export default function SchedulerViewerExtraComponent({event}: SchedulerViewerExtraComponentProps) {
  const users = useAppSelector(state => state.manageUsers.usersWithoutPagination);

  return (
    <Box sx={{color: "#00000099"}}>
      {
        isWorkSessionEvent(event) ?
          (
            <>
              <Typography variant="body2">
                <b>For:&nbsp;</b>
                <Link to={`/profile/${event.user.id}`} {...LinkStyle}>
                  {event.user.fullName}
                </Link>
              </Typography>

              <Typography
                variant="body2"
              >
                <b>Last modifier:&nbsp;</b>
                <Link to={`/profile/${event.lastModifier.id}`} {...LinkStyle}>
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
          isVacationEvent(event) ? (
            <>
              <Typography variant="body2">
                <b>For:&nbsp;</b>
                <Link to={`/profile/${event.userId}`} {...LinkStyle}>
                  {users.find(u => u.id === event.userId)?.fullName}
                </Link>
              </Typography>
              <Typography variant="body2">
                <b>Approver:&nbsp;</b>
                <Link to={`/profile/${event.approverId}`} {...LinkStyle}>
                  {users.find(u => u.id === event.approverId)?.fullName}
                </Link>
              </Typography>
            </>
          ) :
          isSickLeaveEvent(event) ? (
            <>
              <Typography variant="body2">
                <b>For:&nbsp;</b>
                <Link to={`/profile/${event.userId}`} {...LinkStyle}>
                  {users.find(u => u.id === event.userId)?.fullName}
                </Link>
              </Typography>
              <Typography variant="body2">
                <b>Last modifier:&nbsp;</b>
                <Link to={`/profile/${event.lastModifierId}`} {...LinkStyle}>
                  {users.find(u => u.id === event.lastModifierId)?.fullName}
                </Link>
              </Typography>
            </>
          ) :
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

const LinkStyle = {
  "style": {
    "color": "#1976D2",
    "textDecoration": "none",
    "fontWeight": "600"
  },
  "target": "_blank"
};