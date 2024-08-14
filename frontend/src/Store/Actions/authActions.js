import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { fetchunreadNotifications } from "./MaterialsActions";
import { showSuccessMessage, showFailedMessage } from "./popupActions";
import { fetchSettings } from "./SiteSettingsActions";
import { fetchLanguages } from "./TranslationsActions";

axios.defaults.baseURL = window.env.REACT_APP_BACKEND_API_URL + '/'

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response) {
        if (error.response.status === 404 && error.response?.data?.message === 'User not found') {
            TokenService.removeToken();
            window.location.href = error.response.data?.redirect_url;
        }
    }
    return Promise.reject(error);
});

export const SSOLogout = () => async dispatch => {
    const toolboxApi = window.env.REACT_APP_TOOLBOX_API_BASE_URL;
    const url = `${toolboxApi}/authentication/do_sso_logout`;
    axios.get(url,
        {
            transformRequest: [function (data, headers) {
                delete headers['X-Socket-Id'];
                return data;
            }],
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TokenService.getToken()}`
            }
        })
        .then(res => {
            //dispatch(logLogout(page.currentRoute));
            //logout({ returnTo: window.location.origin })
        })
        .catch(error => {

            console.log(error.response);

            //dispatch(logLogout(page.currentRoute));
            //logout({ returnTo: window.location.origin })
        });


}
export const getAuthUser = history => async dispatch => {
    if (!TokenService.getToken()) {
        await dispatch(logout(history));
    }
    try {
        const authUserResponse = await axios.post(
            'api/user/details', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        dispatch({ type: 'SET_PERMITTED_MODELS', payload: authUserResponse.data.user.permitted_tools });
        dispatch({ type: 'SET_PERMITTED_ADDONS', payload: authUserResponse.data.user.permitted_addons });
        dispatch({ type: 'SET_PERMITTED_USERS', payload: authUserResponse.data.user.company.last_invoice[0].number_of_user });
        dispatch({ type: 'SET_COOKIE_CONSENT', payload: authUserResponse.data.user.accept_cookie });

        // build ACL states
        const acl = { dashboard: { list: true } };
        authUserResponse.data.user.roles[0].permissions.map(permission => {
            acl[permission.name] = permission.slug;
        });

        acl.tools = { list: true };

        await dispatch({ type: 'SET_AUTH_TRUE', payload: authUserResponse.data });
        await dispatch({ type: 'SET_ACL', payload: acl });


    } catch (error) {
        console.log(error)
        TokenService.removeToken();
        await dispatch({ type: 'SET_AUTH_FALSE' });
    }
}

export const checkRouteAccess = (history, hasRouteAccess, routeName) => dispatch => {
    if (hasRouteAccess === false) {
        dispatch(showFailedMessage('You do not have permissions to access ' + routeName + ' page!'));
        history.push('/admin/dashboard');
    }
}

export const logout = history => async dispatch => {

    try {
        const logoutResponse = await axios.post(
            'api/user/logout', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        dispatch({ type: 'DO_LOGOUT' });
        history.push('/admin/login');

    } catch (error) {
        console.log(error);
    }
}

export const logLogout = currentRouteName => async dispatch => {

    try {
        const logoutResponse = await axios.post(
            'api/user/logout?logout_page=' + currentRouteName, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        dispatch({ type: 'DO_LOGOUT' });
        TokenService.removeStorage();
        //history.push('/admin/login');

    } catch (error) {
        console.log(error);
    }
}

export const loginSucceeded = () => async dispatch => {

    //fetch languages
    dispatch(fetchLanguages(1));

    //fetch notifications
    dispatch(fetchunreadNotifications());

    // fetch site settings
    dispatch(fetchSettings());
}

export const setAuthFailedMessage = message => dispatch => {
    dispatch({ type: 'SET_AUTH_FAILED_MESSAGE', payload: message });
}
