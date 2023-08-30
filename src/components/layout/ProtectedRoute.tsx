import {ReactNode} from "react";
import {useAppSelector} from "../../redux/CustomHooks";
import LoginRequiredDialog from "../LoginRequiredDialog";

interface ProtectedRouteProps {
    children: ReactNode
}
export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const {isLogged} = useAppSelector(state => state.user);

    return (
      <>
        {
          isLogged ? (
            <>{children}</>
          ) : (
            <LoginRequiredDialog />
          )
        }
      </>
    );
}