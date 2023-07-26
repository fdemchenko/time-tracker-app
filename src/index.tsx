import './index.css';
import "./components/layout/Layout.css";
import "react-notifications-component/dist/theme.css";
import "../node_modules/@syncfusion/ej2-base/styles/material.css";
import "../node_modules/@syncfusion/ej2-buttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-calendars/styles/material.css";
import "../node_modules/@syncfusion/ej2-dropdowns/styles/material.css";
import "../node_modules/@syncfusion/ej2-inputs/styles/material.css";
import "../node_modules/@syncfusion/ej2-lists/styles/material.css";
import "../node_modules/@syncfusion/ej2-navigations/styles/material.css";
import "../node_modules/@syncfusion/ej2-popups/styles/material.css";
import "../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css";
import "../node_modules/@syncfusion/ej2-react-schedule/styles/material.css";

import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";
import { ReactNotifications } from 'react-notifications-component'
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense("ORg4AjUWIQA/Gnt2V1hhQlJAfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hSn5UdENjXntbcXBTQmFb");

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