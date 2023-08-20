import './App.css'
import {Route, Routes} from "react-router-dom";
import * as React from "react";
import MainPage from "./components/main-page/MainPage";
import SideBar from "./components/layout/SideBar";
import AuthForm from "./components/user/AuthForm";
import NotFound from "./components/NotFound";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./redux/CustomHooks";
import {SetUser} from "./redux/slices/UserSlice";
import LogoutForm from "./components/user/LogoutForm";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import {FetchUserFromToken} from "./services/JwtService";
import UsersList from "./components/user/UsersList";
import SetPasswordFrom from "./components/user/SetPasswordForm";
import CreateUserForm from "./components/user/CreateUserForm";
import UpdateUserForm from "./components/user/UpdateUserForm";
import DeactivateUserForm from "./components/user/DeactivateUserForm";
import {Notify} from "./helpers/notifications";
import WorkSessionList from "./components/time-tracking/WorkSessionList";
import WorkSessionUpdateDialog from "./components/time-tracking/WorkSessionUpdateDialog";
import WorkSessionDeleteDialog from "./components/time-tracking/WorkSessionDeleteDialog";
import TrackerScheduler from "./components/scheduler/TrackerScheduler";
import HolidaysDialog from "./components/scheduler/HolidaysDialog";
import WorkSessionCreateDialog from "./components/time-tracking/WorkSessionCreateDialog";
import UserVacations from "./components/vacation/UserVacations";
import ProfilesList from "./components/user/ProfilesList";
import ApproveVacation from "./components/vacation/ApproveVacation";
import SickLeavePage from "./components/sick-leave/SickLeavePage";
import VacationCreateDialog from "./components/vacation/VacationCreateDialog";
import VacationDeleteDialog from "./components/vacation/VacationDeleteDialog";
import VacationApproveDialog from "./components/vacation/VacationApproveDialog";
import SickLeaveFormDialog from "./components/sick-leave/SickLeaveFormDialog";
import SickLeaveDeleteDialog from "./components/sick-leave/SickLeaveDeleteDialog";

function App() {
	const dispatch = useAppDispatch();
	const userData = useAppSelector(state => state.user);
	const workSessionData = useAppSelector(state => state.workSession);
	const globalErrorData = useAppSelector(state => state.message);

	useEffect(() => {
		let user = FetchUserFromToken();
		if (user !== null) {
			dispatch(SetUser(user));
		}
	}, [])

	useEffect(() => {
		if (globalErrorData.message) {
			Notify(globalErrorData.title, globalErrorData.message, globalErrorData.type);
		}
	}, [globalErrorData.requireShowMessageToggle]);

	return (
		<div>
			<SideBar userData={userData} workSessionData={workSessionData}>
				<Routes>
					<Route path="/" element={
						<ProtectedRoute>
							<MainPage userData={userData} />
						</ProtectedRoute>
					} />
					<Route path="/user/login" element={<AuthForm userData={userData} />} />
					<Route path="/set-password/:link" element={<SetPasswordFrom />} />
					<Route path="/user/logout" element={
						<ProtectedRoute>
							<LogoutForm userData={userData} />
						</ProtectedRoute>
					} />
					<Route path="/users" element={
						<ProtectedRoute>
							<UsersList />
						</ProtectedRoute>
					} />
					<Route path="/profiles" element={
						<ProtectedRoute>
							<ProfilesList />
						</ProtectedRoute>
					} />
					<Route path="/user/create" element={
						<ProtectedRoute>
							<CreateUserForm />
						</ProtectedRoute>
					} />
					<Route path="/user/update/:id" element={
						<ProtectedRoute>
							<UpdateUserForm />
						</ProtectedRoute>
					} />
					<Route path="/user/deactivate/:id" element={
						<ProtectedRoute>
							<DeactivateUserForm />
						</ProtectedRoute>
					} />

					<Route path="/worksession/:id" element={
						<ProtectedRoute>
							<WorkSessionList />
						</ProtectedRoute>
					}/>
						<Route path="/worksession/create/:id" element={<WorkSessionCreateDialog />}/>
						<Route path="/worksession/update/:id/:userId" element={<WorkSessionUpdateDialog />}/>
						<Route path="/worksession/delete/:id/:userId" element={<WorkSessionDeleteDialog />}/>
					<Route path="/scheduler/:id" element={
						<ProtectedRoute>
							<TrackerScheduler />
						</ProtectedRoute>
					}>
					</Route>

					<Route path="/vacations" element={
						<ProtectedRoute>
							<UserVacations />
						</ProtectedRoute>
					}
					>
						<Route path="/vacations/create" element={<VacationCreateDialog />} />
						<Route path="/vacations/delete/:vacationId" element={<VacationDeleteDialog />} />
					</Route>
					<Route
						path="/vacations/approvement"
						element={<ProtectedRoute><ApproveVacation /></ProtectedRoute>}
					>
						<Route path="/vacations/approvement/:vacationId" element={<VacationApproveDialog />} />
					</Route>

					<Route path="/holidays" element={<HolidaysDialog />}/>

					<Route path="/sick-leave" element={<ProtectedRoute><SickLeavePage /></ProtectedRoute>}>
						<Route path="/sick-leave/create" element={<SickLeaveFormDialog />} />
						<Route path="/sick-leave/update/:id" element={<SickLeaveFormDialog isUpdate />} />
						<Route path="/sick-leave/delete/:id" element={<SickLeaveDeleteDialog />} />
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SideBar>
		</div>
	);
}

export default App;