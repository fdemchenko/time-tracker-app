import {ProcessedEvent} from "@aldabil/react-scheduler/types";

interface SchedulerViewerExtraComponentProps {
  event: ProcessedEvent
}
export default function SchedulerViewerExtraComponent({event}: SchedulerViewerExtraComponentProps) {
  return (
    <>{event.type}</>
  );
}