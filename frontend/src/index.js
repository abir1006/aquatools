import React from 'react';
import ReactDOM from 'react-dom';
import MainApplication from "./Components/MainApplication";
import { Provider } from 'react-redux';
import store from './Store';
import { saveState } from "./Store/localStorage";
import './i18n';
import { Auth0Provider } from '@auth0/auth0-react';

store.subscribe(() => {
    saveState(store.getState());
});

require('./bootstrap.js')

ReactDOM.render(
    <Auth0Provider
        domain={window.env.REACT_APP_AUTH0_DOMAIN}
        clientId={window.env.REACT_APP_AUTH0_CLIENT_ID}
        redirectUri={window.location.origin}
        audience={window.env.REACT_APP_AUTH0_AUDIENCE}
        scope={window.env.REACT_APP_AUTH0_SCOPE}>
        <Provider store={store}>
            <MainApplication />
        </Provider>
    </Auth0Provider>,
    document.getElementById('app')
);

