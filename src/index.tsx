import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import {Provider} from "react-redux";
import store from "./redux/store";
import AuthForm from "./components/authorization/AuthForm";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />
    },
    {
        path: "/login",
        element: <AuthForm />,
        errorElement: <ErrorPage />
    },
]);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);