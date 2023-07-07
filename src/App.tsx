import './App.css'
import {useAppSelector} from "./redux/CustomHooks";
import {Navigate, Outlet} from "react-router-dom";
import SidePanel from "./components/side-panel/SidePanel";
import Box from "@mui/material/Box";
import * as React from "react";

function App() {
	const {user, isLogged} = useAppSelector(state => state.user);
	const drawerWidth = 240;

	if (!isLogged) {
		return (
			<Navigate to="/login" />
		);
	}

	return (
		<div>
			<Box sx={{ display: 'flex' }}>
				<SidePanel drawerWidth={drawerWidth} />
				<Box
					sx={{ p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
				>
					<Outlet />
				</Box>
			</Box>
		</div>
	);
}

export default App;
