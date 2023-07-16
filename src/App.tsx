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
import {getActiveWorkSessionActionCreator} from "./redux/epics/WorkSessionEpics";
import {toIsoString} from "./services/WorkSessionService";

function App() {
	const dispatch = useAppDispatch();
	const userData = useAppSelector(state => state.user);
	const workSessionData = useAppSelector(state => state.workSession);

	useEffect(() => {
		let user = FetchUserFromToken();
		if (user !== null) {
			dispatch(SetUser(user));
			dispatch(getActiveWorkSessionActionCreator(user.id));
		}
	}, [])

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
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SideBar>
		</div>
	);
}

export default App;