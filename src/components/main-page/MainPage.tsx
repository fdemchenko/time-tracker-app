import {useAppSelector} from "../../redux/CustomHooks";

export default function MainPage() {
    const user = useAppSelector((state) => state.user.user);

    return (
        <div>
            Hello, {user.FullName}!
        </div>
    );
}