import './index.css';
import "./components/layout/Layout.css";
import "react-notifications-component/dist/theme.css";
import ReactDOM from 'react-dom/client';

import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";
import { ReactNotifications } from 'react-notifications-component'
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <ReactNotifications />
                <App />
            </LocalizationProvider>
        </BrowserRouter>
    </Provider>
);