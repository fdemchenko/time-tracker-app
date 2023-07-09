import {UserSliceState} from "../../redux/slices/UserSlice";

interface MainPageProps {
    userData: UserSliceState
}
export default function MainPage({userData}: MainPageProps) {
    return (
        <div>
            Hello, {userData.user.FullName}!
        </div>
    );
}