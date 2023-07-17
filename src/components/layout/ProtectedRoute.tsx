import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

interface ProtectedRouteProps {
    isLogged: boolean
    children: ReactNode
}
export default function ProtectedRoute({isLogged, children}: ProtectedRouteProps) {
    if (!isLogged) {
        return <Navigate to="/user/login" />;
    }

    return (
        <div>
            {children}
        </div>
    );
}