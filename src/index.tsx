import './index.css';
import "./components/layout/Layout.css";
import "react-notifications-component/dist/theme.css";

import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import store from "./redux/store";
import {ReactNotifications} from 'react-notifications-component'
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {LocalizationProvider} from "@mui/x-date-pickers";
import moment from "moment";
import {GoogleOAuthProvider} from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
moment.updateLocale("en", {
  week: {
    dow: 1
  }
});

root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID || ""}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <ReactNotifications/>
          <App/>
        </LocalizationProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);