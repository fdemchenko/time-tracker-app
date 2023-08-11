import {ReactNode} from "react";
import {Navigate} from "react-router-dom";
import {useAppSelector} from "../../redux/CustomHooks";

interface ProtectedRouteProps {
    children: ReactNode
}
export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const {isLogged} = useAppSelector(state => state.user);

    if (!isLogged) {
        return <Navigate to="/user/login" />;
    }

    return (
        <div>
            {children}
        </div>
    );
}