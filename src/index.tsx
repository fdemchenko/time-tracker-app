import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./components/ErrorPage";
import {Provider} from "react-redux";
import store from "./redux/store";

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
        element: <h1>Login</h1>,
        errorElement: <ErrorPage />
    },
]);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);