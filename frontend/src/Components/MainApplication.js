import React, {Component} from 'react';
import LandingPage from "../Pages/LandingPage";
import Login from "../Components/Login/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Companies from "../Pages/Companies/Companies";
import Users from "../Pages/Users/Users";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import UserRoles from "../Pages/Settings/UserRoles";
import ACL from "../Pages/Settings/ACL";
import {connect} from 'react-redux';
import Settings from "../Pages/Settings/Settings";
import ConfirmPopup from "./Popups/ConfirmPopup";
import InvoiceSettings from "../Pages/Settings/InvoiceSettings";
import Models from "../Pages/Settings/Models";
import MTBModel from "../Pages/Models/MTB";
import FeedModel from "../Pages/Models/Feed";
import Templates from "../Pages/Templates/Templates";
import Reports from "../Pages/Reports/Reports";
import FeedLibrary from "../Pages/FeedLibrary/FeedLibrary";
import PushNotification from "./Popups/PushNotification/PushNotification";
import FeedSettings from "../Pages/Settings/FeedSettings";
import Translations from "../Pages/Settings/Translations";
import SiteSettings from "../Pages/Settings/SiteSettings";
import VaksineringModel from "../Pages/Models/Vaksinering";
import CodModel from "../Pages/Models/Cod";
import OptimaliseringModel from "../Pages/Models/Optimalisering";
import Profiles from "../Pages/Profiles/UserProfiles";
import GeneticsModel from "../Pages/Models/Genetics";
import ForgotPass from './ForgotPass/ForgotPass';
import {getAuthUser, loginSucceeded, logLogout} from "../Store/Actions/authActions";
import NavService from "../Services/NavServices";
import TokenServices from "../Services/TokenServices";
import ATMaterials from "../Pages/ATMaterials/ATMaterials"
import Categories from "../Pages/ATMaterials/Categories"
import ATMaterialsDetails from "../Pages/ATMaterials/ATMaterialsDetails"
import {resetPriceModuleInputs} from "../Store/Actions/PriceModuleActions";
import {Suspense} from 'react';
import Tags from '../Pages/ATMaterials/Tags';
import UserLogs from "../Pages/Settings/UserLogs";
import {fetchunreadNotifications} from '../Store/Actions/MaterialsActions';
import RouterLogic from './Router/RouterLogic';
import {fetchSettings} from '../Store/Actions/SiteSettingsActions';
import {setCurrentRoute} from "../Store/Actions/pageActions";
import {showRemoveAccountSpinner} from "../Store/Actions/spinnerActions";
import {withAuth0} from '@auth0/auth0-react';
import ButtonSpinner from './Spinners/ButtonSpinner';
import ErrorModal from './Auth0/ErrorModal';
import TemplateNotesPopup from "./Popups/TemplateNotes/TemplateNotesPopup";
import {showTemplateNotesPopup} from "../Store/Actions/popupActions";
import Logout from "./Auth0/Logout";
import {withTranslation} from "react-i18next";
import Error403 from "../Pages/Error403";

class MainApplication extends Component {

    constructor(props) {
        super(props);
        this.state = {
            auth0Token: '',
            loadedUser: null,
            isInitializationDone: false,
            error: null,
        };
        this.props.hideRoleForms();
        this.props.hideConfirmPopup();
        this.props.hideNotificationPopup();
        this.props.resetPriceModuleInputs();
        this.props.showRemoveAccountSpinner(undefined);

    }

    async componentDidMount() {

        this.props.setCurrentRoute(window.location.pathname.split('/').pop());

        if (Boolean(TokenServices.getToken())) {
            this.props.fetchNofications();
            this.props.fetchSiteSettings();
        }

        //auth0

        const queryParams = new URLSearchParams(window.location.search);
        const error = queryParams.get('error');
        const error_description = queryParams.get('error_description');

        if (!Boolean(error))
            await this.checkAuthentication();
        else
            this.setState({error: {error_code: error, error_description: error_description}})

    }

    async componentDidUpdate(prevProps, prevState) {

        if (prevProps.auth0.isAuthenticated !== this.props.auth0.isAuthenticated) {
            const {user, logout} = this.props.auth0;
            this.setState({loadedUser: user});
            window.Echo.channel(`sso.logout`)
                .listen('SSOLogout', (data) => {
                    if (data.email === user.email) {
                        window.onbeforeunload = null;
                        this.props.logLogout(this.props.page.currentRoute);
                        const return_url = window.env.REACT_APP_TOOLBOX_DASHBOARD_URL ? window.env.REACT_APP_TOOLBOX_DASHBOARD_URL : window.location.origin;
                        logout({returnTo: return_url})
                    }
                });
        }
        const {auth0Token, loadedUser, isInitializationDone} = this.state;
        if (Boolean(auth0Token) && Boolean(loadedUser) && !isInitializationDone) {
            this.fetchUser();
        }
    }

    fetchUser() {
        const {auth0Token} = this.state;
        TokenServices.saveToken(auth0Token);
        this.props.getAuthUser(this.props.history);
        this.props.loginSucceeded();
        this.setState({isInitializationDone: true});
    }

    async checkAuthentication() {

        // Try to login with auth0
        const {loginWithRedirect} = this.props.auth0;
        await this.getAuth0Token()
            .then(token => {
                this.setState({auth0Token: token})
            })
            .catch(err => {
                console.log(err);
                loginWithRedirect({prompt: 'login'});
            });

    }

    async getAuth0Token() {
        const {getAccessTokenSilently} = this.props.auth0;
        return await getAccessTokenSilently();
    }

    render() {

        const {error, auth0Token, loadedUser, isInitializationDone} = this.state;
        if (Boolean(error))
            return <ErrorModal error={error || {}}/>


        if (!isInitializationDone || this.props.auth.authenticated === undefined)
            return (
                <div className="d-flex justify-content-center mt-2">
                    <ButtonSpinner showSpinner={true}/>
                </div>
            )

        // If failed to fetch user details (Company licence expired etc..)
        // If user has no access in AquaTools..
        if (!Boolean(this.props.auth.authenticated) ||
            !Boolean(loadedUser[window.env.REACT_APP_AUTH0_NAMESPACE]?.permissions) ||
            !loadedUser[window.env.REACT_APP_AUTH0_NAMESPACE]['permissions'].includes("list:aquatools")
        ) {
            return <Error403 errorText={'failed_to_load_aquatools'} loadedUser={loadedUser}/>
        }

        const showPushNotification = !(this.props.user === undefined || this.props.user.id === undefined)

        return (
            <Suspense fallback={null}>
                <div className="container-fluid h-100">
                    <Router>
                        <RouterLogic/>
                        <Switch>
                            <Route exact path='/' component={LandingPage}/>
                            <Route path="/403" component={Error403}/>
                            <Route path='/admin/login' component={Login}/>
                            <Route path='/admin/dashboard' component={Dashboard}/>
                            <Route path='/admin/companies' component={Companies}/>
                            <Route path='/admin/users' component={Users}/>
                            <Route path='/admin/reports' component={Reports}/>
                            <Route path='/admin/models/mtb' component={MTBModel}/>
                            <Route path='/admin/models/kn_for' component={FeedModel}/>
                            <Route path='/admin/models/vaksinering' component={VaksineringModel}/>
                            <Route path='/admin/models/optimalisering' component={OptimaliseringModel}/>
                            <Route path='/admin/models/genetics' component={GeneticsModel}/>
                            <Route path='/admin/models/cost_of_disease' component={CodModel}/>
                            <Route path='/admin/templates' component={Templates}/>
                            <Route path='/admin/feedLibrary' component={FeedLibrary}/>
                            <Route path='/admin/settings/models' component={Models}/>
                            <Route path='/admin/settings/user-roles' component={UserRoles}/>
                            <Route path='/admin/settings/acl' component={ACL}/>
                            <Route path='/admin/settings/invoice' component={InvoiceSettings}/>
                            <Route path='/admin/settings/feed-library' component={FeedSettings}/>
                            <Route path='/admin/settings/translations' component={Translations}/>
                            <Route path='/admin/settings/site_settings' component={SiteSettings}/>
                            <Route path='/admin/settings/user_logs' component={UserLogs}/>
                            <Route path='/admin/settings' component={Settings}/>
                            <Route path='/admin/profiles' component={Profiles}/>
                            <Route path='/admin/forgotPassword' component={ForgotPass}/>
                            <Route path='/admin/at_materials/tags' component={Tags}/>
                            <Route path='/admin/at_materials/categories' component={Categories}/>
                            <Route path='/admin/at_materials/:id' component={ATMaterialsDetails}/>
                            <Route path='/admin/at_materials' component={ATMaterials}/>

                            <Route path='/admin' component={LandingPage}/>

                        </Switch>
                    </Router>
                    {this.props.popup.showTemplateNotesPopup && <TemplateNotesPopup/>}
                    {this.props.popup.showPopup && <ConfirmPopup/>}
                    {showPushNotification === true && <PushNotification currentUserID={this.props.user.id}/>}
                </div>
            </Suspense>
        );
    }
}

const mapStateToProps = state => (
    {
        popup: state.popup,
        auth: state.auth,
        user: state.auth.data.user,
        page: state.page,
    }
);

const mapDispatchToProps = dispatch => {
    return {
        hideConfirmPopup: () => {
            dispatch({type: 'HIDE_CONFIRM_POPUP'})
        },
        hideNotificationPopup: () => {
            dispatch({type: 'HIDE_NOTIFICATION_POPUP'})
        },
        hideRoleForms: () => {
            dispatch({type: 'HIDE_ADD_EDIT_ROLE'})
        },
        getAuthUser: () => {
            dispatch(getAuthUser())
        },
        logLogout: () => {
            dispatch(logLogout())
        },
        loginSucceeded: () => {
            dispatch(loginSucceeded())
        },
        fetchNofications: () => {
            //fetch notifications
            dispatch(fetchunreadNotifications());
        },
        resetPriceModuleInputs: () => {
            dispatch(resetPriceModuleInputs());
        },
        fetchSiteSettings: () => {
            dispatch(fetchSettings());
        },
        setCurrentRoute: routeName => {
            dispatch(setCurrentRoute(routeName))
        },
        showRemoveAccountSpinner: status => {
            dispatch(showRemoveAccountSpinner(status));
        },
        showTemplateNotesPopup: status => {
            dispatch(showTemplateNotesPopup(status))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withAuth0(MainApplication));
