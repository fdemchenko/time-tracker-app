import './App.css'
import {Route, Routes} from "react-router-dom";
import * as React from "react";
import MainPage from "./components/main-page/MainPage";
import SideBar from "./components/main-page/SideBar";
import AuthForm from "./components/user/AuthForm";
import NotFound from "./components/NotFound";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./redux/CustomHooks";
import {SetUser} from "./redux/slices/UserSlice";
import LogoutForm from "./components/user/LogoutForm";
import ProtectedRoute from "./components/main-page/ProtectedRoute";
import {FetchUserFromToken} from "./services/JwtService";

function App() {
	const dispatch = useAppDispatch();
	const userData = useAppSelector(state => state.user)

	useEffect(() => {
		let user = FetchUserFromToken();
		if (user !== null) {
			dispatch(SetUser(user));
		}
	}, [])

	return (
		<div>
			<SideBar isLogged={userData.isLogged}>
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