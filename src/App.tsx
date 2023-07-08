import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import * as React from "react";
import MainPage from "./components/main-page/MainPage";
import SideBar from "./components/main-page/SideBar";
import AuthForm from "./components/user/AuthForm";
import NotFound from "./components/NotFound";
import {useEffect} from "react";
import {FetchUserFromToken} from "./services/UserService";
import {useAppDispatch, useAppSelector} from "./redux/CustomHooks";
import {SetUser} from "./redux/slices/UserSlice";
import LogoutForm from "./components/user/LogoutForm";

function App() {
	const dispatch = useAppDispatch();
	const {isLogged} = useAppSelector(state => state.user)
	const navigate = useNavigate();

	useEffect(() => {
		let user = FetchUserFromToken();
		if (user !== null) {
			dispatch(SetUser(user));
		}
	}, [])

	//not working for some reason
	// if (!isLogged) {
	// 	navigate("/user/login");
	// }

	return (
		<div>
			<SideBar isLogged={isLogged}>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/user/login" element={<AuthForm />} />
					<Route path="/user/logout" element={<LogoutForm />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</SideBar>
		</div>
	);
}

export default App;