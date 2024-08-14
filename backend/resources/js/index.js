import React, { Component } from 'react';
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

ReactDOM.render(
    <Auth0Provider
        domain="login.toolbox.spillfree.no"
        clientId="0ksMetC64xbeqTxYScs729uFVyHi0MY8"
        redirectUri={window.location.origin}
        audience="ToolBox_Django_API"
        scope="openid profile email"
    // useRefreshTokens
    // cacheLocation="localstorage"
    >
        <Provider store={store}>
            <MainApplication />
        </Provider>
    </Auth0Provider>,
    document.getElementById('app')
);

