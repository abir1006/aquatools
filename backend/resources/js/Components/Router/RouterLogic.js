import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { useHistory } from 'react-router-dom'
import TokenService from '../../Services/TokenServices'
import { fetchSettings } from '../../Store/Actions/SiteSettingsActions'
import { setCurrentRoute } from "../../Store/Actions/pageActions";
import { fetchunreadNotifications } from "../../Store/Actions/MaterialsActions";
import { useAuth0 } from '@auth0/auth0-react';
import { getAuthUser, SSOLogout } from '../../Store/Actions/authActions';


const RouterLogic = (props) => {
    const history = useHistory()
    const { i18n } = useTranslation();
    const { user, getAccessTokenSilently, loginWithRedirect } = useAuth0();

    const generateNewToken = () => {
        //props.SSOLogout()
        // getAccessTokenSilently({ ignoreCache: true })
        //     .then(token => {
        //         TokenService.saveToken(token);
        //         props.getAuthUser(history);
        //     })
        //     .catch(error => {
        //         console.log(error.message);
        //         TokenService.removeToken();
        //         loginWithRedirect();
        //     });
    }

    setInterval(generateNewToken, 10000);

    // this function will be call on any route change
    useEffect(() => {
        return history.listen((location) => {

            //check auth0 logout from other system

            //generateNewToken();

            // set current route name
            props.setCurrentRoute(history.location.pathname.split('/').pop());
            // load translations on each
            i18n.reloadResources();

            // load site settings
            if (Boolean(TokenService.getToken())) {
                props.fetchSettings();
                props.fetchunreadNotifications();
            }
        })
    }, [history])

    return '';
}


const mapStateToProps = state => (
    {

    }
);

export default connect(mapStateToProps, {
    fetchSettings,
    setCurrentRoute,
    fetchunreadNotifications,
    getAuthUser,
    SSOLogout
})(RouterLogic);
