import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import {Provider} from "react-redux";
import store from "./redux/store";
import AuthForm from "./components/authorization/AuthForm";
import MainPage from "./components/main-page/MainPage";
import AdminPanel from "./components/admin/AdminPanel";
import CreateUserForm from "./components/user/CreateUserForm";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Navigate to="/main" replace />
            },
            {
                path: "/main",
                element: <MainPage />,
            },
            {
                path: "/panel",
                element: <AdminPanel />
            },
            {
                path: "/user/create",
                element: <CreateUserForm />,
                errorElement: <ErrorPage />
            }
        ]
    },
    {
        path: "/login",
        element: <AuthForm />,
        errorElement: <ErrorPage />
    }
]);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);