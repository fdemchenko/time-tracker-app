import {
    DragAndDrop,
    Inject,
    Month,
    Resize,
    ScheduleComponent, ViewDirective,
    ViewsDirective,
    Week,
    Year
} from "@syncfusion/ej2-react-schedule";
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";

// class CustomAdaptor extends ODataV4Adaptor {
//     processResponse(): Object {
//         let i: number = 0;
//         // calling base class processResponse function
//         let original: Object[] = super.processResponse.apply(this, arguments);
//         // adding employee id
//         original.forEach((item: Object) => item['EventID'] = ++i);
//         return original;
//     }
// }
//
// CustomAdaptor.prototype.processResponse = function () {
//     let i = 0;
//     let original = ODataV4Adaptor.prototype.processResponse.apply(this, arguments);
//     original.forEach((item) => (item['EventID'] = ++i));
//     return original;
// };

export default function Scheduler() {

    const fieldsData = {
        id: "id",
        //subject: { name: 'TravelSummary' },
        //isAllDay: { name: 'FullDay' },
        //location: { name: 'Source' },
        //description: { name: 'Comments' },
        startTime: { name: 'Start' },
        endTime: { name: 'End' },
        //startTimezone: { name: 'Origin' },
        //endTimezone: { name: 'Destination' }
    }
    const eventSettings = { /*dataSource: data,*/ fields: fieldsData }

    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Work sessions
            </Typography>
            <ScheduleComponent timeFormat="HH:mm" eventSettings={eventSettings}>
                <ViewsDirective>
                    <ViewDirective option="Week" firstDayOfWeek={1} startHour="08:00" endHour="08:00" />
                    <ViewDirective option="Month" />
                    <ViewDirective option="Year" />
                </ViewsDirective>
                <Inject services={[Week, Month, Year, DragAndDrop, Resize]} />
            </ScheduleComponent>
        </Box>
    );
}