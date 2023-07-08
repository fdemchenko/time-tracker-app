import {isRouteErrorResponse, useRouteError} from "react-router-dom";

export default function NotFound() {
    return (
        <div style={{textAlign: "center"}}>
            <h1>Oops!</h1>
            <h2>This page was not found</h2>
        </div>
    );
}