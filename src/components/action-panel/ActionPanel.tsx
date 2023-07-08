import {Button} from "@mui/material";
import {Link} from "react-router-dom";

export default function ActionPanel() {
    return (
        <Link to="/user/create">
            <Button variant="contained">Add new worker</Button>
        </Link>
    );
}