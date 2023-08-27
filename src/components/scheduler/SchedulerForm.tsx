import {SchedulerHelpers} from "@aldabil/react-scheduler/types";
import WorkSessionCreateDialog from "../work-session/WorkSessionCreateDialog";
import WorkSessionUpdateDialog from "../work-session/WorkSessionUpdateDialog";

interface SchedulerFormProps {
  scheduler: SchedulerHelpers;
}
export default function SchedulerForm({scheduler}: SchedulerFormProps) {

  return (
    <>
      {
        scheduler.edited ? (
          <WorkSessionUpdateDialog scheduler={scheduler} />
        ) : (
          <WorkSessionCreateDialog scheduler={scheduler} />
        )
      }
    </>
  );
}