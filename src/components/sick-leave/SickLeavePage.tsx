import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useEffect} from "react";
import {getSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";
import moment from "moment";

export default function SickLeavePage() {
    const dispatch = useAppDispatch();

    const {sickLeaveList} = useAppSelector(state => state.sickLeave);
    const {user} = useAppSelector(state => state.user);

    useEffect(() => {
        dispatch(getSickLeaveDataActionCreator({
            userId: user.id,
            date: moment(),
            searchByYear: false
        }))
    }, []);

    useEffect(() => {
        console.log(sickLeaveList)
    }, sickLeaveList);

    return (<></>);
}