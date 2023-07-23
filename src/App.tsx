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
import {Notify} from "./helpers/notifications";
import WorkSessionList from "./components/time-tracking/WorkSessionList";
import WorkSessionUpdateDialog from "./components/time-tracking/WorkSessionUpdateDialog";

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
			Notify("Error", globalErrorData.message);
		}
	}, [globalErrorData.message]);

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
					<Route path="/user/logout" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<LogoutForm userData={userData} />
						</ProtectedRoute>
					} />
					<Route path="/worksession" element={
						<ProtectedRoute isLogged={userData.isLogged}>
							<WorkSessionList />
						</ProtectedRoute>
					}>
						<Route path="/worksession/:id" element={<WorkSessionUpdateDialog />}/>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SideBar>
		</div>
	);
}

export default App;