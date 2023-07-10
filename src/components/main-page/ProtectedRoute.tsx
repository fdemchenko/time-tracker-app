import {ReactNode, useEffect} from "react";
import {useNavigate} from "react-router-dom";

interface ProtectedRouteProps {
    isLogged: boolean
    children: ReactNode
}
export default function ProtectedRoute({isLogged, children}: ProtectedRouteProps) {
    const navigate = useNavigate();

    useEffect(() => {
       if (!isLogged) {
            //navigate("/user/login");
       }
    });

    return (
        <div>
            {children}
        </div>
    );
}