import './App.css'
import {useAppSelector} from "./redux/CustomHooks";
import {Link, Navigate} from "react-router-dom";

function App() {
	const {user, isLogged} = useAppSelector(state => state.user)

	if (!isLogged) {
		return (
			<Navigate to="/login" />
		);
	}

	return (
		<div>
			<h1 className="greeting">Hello from Time Tracker development branch</h1>
			<Link to="/login">Login</Link>
		</div>
	);
}

export default App;
