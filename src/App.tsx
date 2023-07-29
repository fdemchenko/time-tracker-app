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
import FireUserForm from "./components/user/FireUserForm";
import {Notify} from "./helpers/notifications";
import WorkSessionList from "./components/time-tracking/WorkSessionList";
import WorkSessionUpdateDialog from "./components/time-tracking/WorkSessionUpdateDialog";
import WorkSessionDeleteDialog from "./components/time-tracking/WorkSessionDeleteDialog";
import TrackerScheduler from "./components/scheduler/TrackerScheduler";

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
						<ProtectedRoute isLogged={userData.isLogged}>
							<MainPage userData={userData} />
						</ProtectedRoute>
					} />
					<Route path="/user/login" element={<AuthForm userData={userData} />} />
					<Route path="/set-password/:link" element={<SetPasswordFrom />} />
					<Route path="/user/logout" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<LogoutForm userData={userData} />
						</ProtectedRoute>
					} />
					<Route path="/users" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<UsersList />
						</ProtectedRoute>
					} />
					<Route path="/user/create" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<CreateUserForm />
						</ProtectedRoute>
					} />
					<Route path="/user/update/:id" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<UpdateUserForm />
						</ProtectedRoute>
					} />
					<Route path="/user/fire/:id" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<FireUserForm />
						</ProtectedRoute>
					} />

					<Route path="/worksession" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<WorkSessionList />
						</ProtectedRoute>
					}>
						<Route path="/worksession/update/:id" element={<WorkSessionUpdateDialog />}/>
						<Route path="/worksession/delete/:id" element={<WorkSessionDeleteDialog />}/>
					</Route>
					<Route path="/scheduler" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<TrackerScheduler />
						</ProtectedRoute>
					}/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SideBar>
		</div>
	);
}

export default App;