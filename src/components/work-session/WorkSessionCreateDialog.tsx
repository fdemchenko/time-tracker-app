export default function WorkSessionCreateDialog() {
  return (<>Create dialog</>);
}
// import React, {useEffect, useState} from 'react';
// import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
// import {useNavigate, useParams} from "react-router-dom";
// import {Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
// import DialogContent from "@mui/material/DialogContent";
// import {DateTimePicker} from "@mui/x-date-pickers";
// import DialogActions from "@mui/material/DialogActions";
// import moment, {Moment} from "moment/moment";
// import {createWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
// import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";
// import {hasPermit} from "../../helpers/hasPermit";
// import DialogWindow from "../layout/DialogWindow";
// import {getUsersWithoutPaginationActionCreator} from "../../redux/epics/UserEpics";
//
// interface WorkSessionCreateDialogProps {
//   isUpdate?: boolean
// }
// const WorkSessionCreateDialog = ({isUpdate = false}: WorkSessionCreateDialogProps) => {
//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();
//   const {id} = useParams();
//
//   const {user} = useAppSelector(state => state.user);
//   const {error} = useAppSelector(state => state.workSession);
//   const curWorkSession = useAppSelector(state => state.workSession.workSessionsList.items)
//     .find(ws => ws.id === id);
//
//   useEffect(() => {
//     dispatch(getUsersWithoutPaginationActionCreator(false));
//   }, []);
//
//   function getInitialSelectUser() {
//     if (isUpdate && curWorkSession) {
//
//     }
//   }
//
//   function handleUpdate() {
//     if (start?.isValid() && end?.isValid() && id) {
//       start.set("seconds", 0);
//       end?.set("seconds", 0);
//       dispatch(createWorkSessionActionCreator({
//         UserId: id,
//         Start: start.toISOString(),
//         End: end.toISOString(),
//         Title: title,
//         Description: description,
//         Type: type
//       }));
//
//       navigate(`/worksession/${id}`);
//     }
//     else {
//       dispatch(SetGlobalMessage({
//         title: "Validation Error",
//         message: "Date or user is invalid",
//         type: "warning"
//       }));
//     }
//     setIsRequireChange(true);
//   }
//
//   return (
//     <DialogWindow title="Create work session">
//       {
//           id === user.id || hasPermit(user.permissions, "CreateWorkSessions") ?
//           (
//             <>
//               <DialogContent>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "flex-start",
//                     gap: 3
//                   }}
//                 >
//                   <TextField
//                     label="Optional title"
//                     value={title}
//                     onChange={(e) => {
//                       setTitle(e.target.value);
//                       setIsRequireChange(false);
//                     }}
//                     variant="outlined"
//                     fullWidth
//                   />
//
//                   <DateTimePicker
//                     label="Session start date"
//                     ampm={false}
//                     value={start}
//                     onChange={(newValue) => {
//                       setIsRequireChange(false);
//                       setStart(newValue);
//                     }}
//                     dayOfWeekFormatter={(day) => `${day}`}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true
//                       }
//                     }}
//                   />
//                     <DateTimePicker
//                       label="Session end date"
//                       ampm={false}
//                       value={end}
//                       onChange={(newValue) => {
//                         setIsRequireChange(false);
//                         setEnd(newValue);
//                       }}
//                       dayOfWeekFormatter={(day) => `${day}`}
//                       slotProps={{
//                         textField: {
//                           fullWidth: true
//                         }
//                       }}
//                     />
//
//                   <FormControl fullWidth>
//                     <InputLabel id="type_select_label">Type</InputLabel>
//                     <Select
//                         labelId="type_select_label"
//                         label="Type"
//                         value={type}
//                         onChange={(e) => {
//                           setType(e.target.value);
//                           setIsRequireChange(false);
//                         }}
//                         variant="outlined"
//                         fullWidth
//                     >
//                       <MenuItem value="completed">Completed</MenuItem>
//                       <MenuItem value="planned">Planned</MenuItem>
//                     </Select>
//                   </FormControl>
//
//                   <TextField
//                     label="Optional description"
//                     value={description}
//                     onChange={(e) => {
//                       setDescription(e.target.value);
//                       setIsRequireChange(false);
//                     }}
//                     variant="outlined"
//                     multiline
//                     minRows={3}
//                     fullWidth
//                   />
//                 </Box>
//                 {
//                   error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
//                 }
//               </DialogContent>
//               <DialogActions sx={{mx: 3, my: 2}}>
//                 <Button
//                   size="large"
//                   onClick={handleUpdate}
//                   disabled={isRequireChange}
//                 >
//                   Create
//                 </Button>
//                 <Button
//                   size="large"
//                   color="secondary"
//                   onClick={() => navigate(-1)}
//                 >
//                   Back
//                 </Button>
//               </DialogActions>
//             </>
//           )
//             :
//         (
//         <Alert severity="error" sx={{m: 2}}>You have no access for create this work session</Alert>
//         )
//       }
//     </DialogWindow>
//   );
// };
//
// export default WorkSessionCreateDialog;