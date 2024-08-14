import React, {Component} from 'react';
import {Link, withRouter} from "react-router-dom";
import '../MainNavigation/MainNavigation.css';
import TokenServices from "../../Services/TokenServices";
import AdminLogo from "./Images/at2_admin_logo_new.svg";
import MenuToggleIcon from "./Images/menu_toggle_icon.svg";
import SubMenus from './SubMenus/SubMenus';
import adminNavigationsObj from './MainMenus';
import {connect} from "react-redux";
import LanguageSelector from '../Translation/LanguageSelector';
import {withTranslation} from 'react-i18next';
import axios from "axios";
import {logLogout, SSOLogout} from "../../Store/Actions/authActions";
import {withAuth0} from '@auth0/auth0-react';

class MainNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRouteName: null,

        }
    }

    componentDidMount() {
        this.props.loadDefaultNavState();
        const routeName = window.location.pathname.split('/');
        this.setState({
            ...this.state,
            currentRouteName: routeName[2]
        });
    }

    handleLogout(e) {
        if (this.props.popup.isDirty) {
            return false;

        } else {
            try {

                const {logout} = this.props.auth0;
                // this.props.SSOLogout();
                //this.props.logLogout(this.props.page.currentRoute);
                logout({returnTo: window.location.origin})
            } catch (error) {
                console.log(error);
            }
        }
    }

    handleMenuCollapseExpand(e) {

        if (this.props.page.screenSize <= 767) {
            this.props.handleMobileNavSliding();
            return false;
        }
        this.props.handleNavExpandCollapse();
    }

    materialNotifications(title) {

        return (
            <>
                <div className="notify-container">
                    {this.props.materialNotifications && this.props.materialNotifications.length > 0 &&
                    <span
                        className={Boolean(title) ? 'notify-bubble' : 'notify-bubble no-text-bubble'}>{this.props.materialNotifications.length}</span>}
                    <span>{title}</span>
                </div>
            </>
        );
    }

    render() {

        const {t} = this.props;

        let count = 0;

        let adminNavigations = {};

        //check all the menus if user have permission and permitted models

        const currentUserRole = this.props.data.length === 0 || this.props.data.user.roles === undefined ? '' : this.props.data.user.roles[0].slug;

        let hasModelPermission = currentUserRole === 'super_admin' || (this.props.permittedModels !== undefined && this.props.permittedModels.length > 0);


        if (this.props.acl !== undefined) {
            for (let property in adminNavigationsObj) {
                if (property === 'tools' && hasModelPermission) {
                    adminNavigations[property] = adminNavigationsObj[property];
                }
                if (property !== 'tools' && this.props.acl[property] !== undefined && this.props.acl[property].list === true) {
                    adminNavigations[property] = adminNavigationsObj[property];
                }
            }
        }


        const mainNavigationMenus = Object.keys(adminNavigations).map(index =>
            <li className={index.toLowerCase() === this.state.currentRouteName || (index.toLowerCase() === 'tools' && this.state.currentRouteName === 'models') ? 'current-nav-menu' : ''}
                key={count++}>
                <Link
                    className={'nav-link ' + adminNavigations[index].iconClass}
                    to={adminNavigations[index].link}
                    onClick={e => this.props.handleSubMenuOpen(e,
                        adminNavigations[index].subMenus,
                        adminNavigations[index].name.toLowerCase()
                    )}>

                    {adminNavigations[index].name === 'at_materials' ? this.materialNotifications(t(adminNavigations[index].name)) : t(adminNavigations[index].name)}

                </Link>
                <SubMenus
                    subMenuShow={this.props.navigation.subMenuShow}
                    parentMenuName={adminNavigations[index].name}
                    currentSubMenuName={this.props.navigation.currentSubMenuName}
                    subMenuIconClass={adminNavigations[index].subMenuIconClass}
                    items={adminNavigations[index].subMenus}
                    sideBarWidth={this.props.sideBarWidth}
                    materialNotificationsrenderer={this.materialNotifications.bind(this)}
                />
            </li>
        );


        const collapsedNavigationMenus = Object.keys(adminNavigations).map(index =>
            <li className={index.toLowerCase() === this.state.currentRouteName ? 'current-nav-menu' : ''} key={count++}>
                <Link
                    className={'nav-link ' + adminNavigations[index].iconClass}
                    to={adminNavigations[index].link}
                    onClick={e => this.props.handleSubMenuOpen(
                        e,
                        adminNavigations[index].subMenus,
                        adminNavigations[index].name.toLowerCase()
                    )}>
                    {adminNavigations[index].name === 'at_materials' ? this.materialNotifications('') : ''}

                </Link>
                <SubMenus
                    parentMenuName={adminNavigations[index].name}
                    subMenuIconClass={adminNavigations[index].subMenuIconClass}
                    items={adminNavigations[index].subMenus}
                    materialNotificationsrenderer={this.materialNotifications.bind(this)}
                />
            </li>
        );

        let fullName = this.props?.data?.user?.name || '';

        let lastName = fullName.split(' ')[1] || '';

        let firstNameFirstLetter = fullName && fullName.substr(0, 1);
        let lastNameFirstLetter = lastName && lastName.substr(0, 1);
        let shortName = firstNameFirstLetter + lastNameFirstLetter;
        let companyName = this.props.data.length === 0 ? '' : this.props.data.user.company.name;

        const mainNavigationClass = this.props.navigation.mobileNavSliding === true ? 'main-navigation-panel nav-mobile-expand' : 'main-navigation-panel';
        let profileMenuPosition = 18;

        if (this.props.page.screenSize <= 767) {
            profileMenuPosition = this.props.navigation.mobileNavSliding === true ? 0 : -220;
        }

        // const profilePic = this.props?.data?.user?.profile_pic_url && this.props.data.user.profile_pic_url || '';

        if (this.props.navigation.navCollapse === true) {
            return (
                <div className="main-navigation-panel">
                    <div className="admin-logo-panel no-gutters">
                        <button onClick={e => this.handleMenuCollapseExpand(e)} id="menuToggle" type="button">
                            <img src={MenuToggleIcon} alt=""/>
                        </button>
                    </div>
                    <nav className="navbar navbar-light">
                        <div id="navigation-main-links">
                            <ul className="nav">
                                {collapsedNavigationMenus}
                            </ul>
                        </div>
                    </nav>

                    <div id="navigation-bottom">
                        <LanguageSelector/>
                        <nav className="navbar navbar-light">
                            <ul className="nav">
                                {
                                    this.props.acl !== undefined && this.props.acl['settings'] !== undefined && this.props.acl['settings'].list !== undefined && this.props.acl['settings'].list === true &&
                                    <li className={this.state.currentRouteName === 'settings' ? 'nav-item current-nav-menu' : 'nav-item'}>
                                        <Link className="nav-link menu-settings-icon" to="/admin/settings"></Link>
                                    </li>
                                }

                            </ul>
                        </nav>

                        <nav
                            className={this.props.navigation.profilePopup ? 'navbar my-profile-menu transition-yes menu-sliding-up' : 'navbar my-profile-menu transition-yes'}>
                            <ul className="nav">
                                {/*<li className="nav-item">*/}

                                {/*    <Link className="nav-link menu-account-icon" to="/admin/profiles">*/}

                                {/*        {t('my_profile')}*/}
                                {/*    </Link>*/}
                                {/*</li>*/}
                                {/* <li className="nav-item">
                                    <Link className="nav-link menu-lock-screen-icon" to="/admin/dashboard">
                                        Lock screen
                                    </Link>
                                </li> */}
                                <li className="nav-item">

                                    <Link to="/admin/login" className="nav-link menu-logout-icon"
                                          onClick={e => this.handleLogout(e)}>
                                        {t('logout')}
                                    </Link>


                                </li>
                            </ul>
                        </nav>

                        <div tabIndex="1" id="user-logged-panel" onClick={e => this.props.handleProfileClick(e)}
                             onBlur={e => this.props.navigation.profilePopup === true ? this.props.handleProfileClick(e) : ''}>
                            <div className="user-img-panel">
                                <div className="user-name-img">
                                    {shortName}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }


        return (

            <div className={mainNavigationClass}>
                <div className="admin-logo-panel">
                    <a id="logo-link" href="/admin/dashboard">
                        <img className="img-fluid" src={AdminLogo} alt="AquaTools2.0 Logo"/>
                    </a>
                    <button onClick={e => this.handleMenuCollapseExpand(e)} id="menuToggle" type="button">
                        {!this.props.navigation.mobileNavSliding && <img src={MenuToggleIcon} alt=""/>}
                        {this.props.navigation.mobileNavSliding && <i className="fa fa-times blue-stroke"></i>}
                    </button>
                </div>
                <nav className="navbar navbar-light">
                    <div id="navigation-main-links">
                        <ul className="nav">
                            {mainNavigationMenus}
                        </ul>
                    </div>
                </nav>

                <div id="navigation-bottom" style={{bottom: profileMenuPosition}}>


                    <nav className="navbar navbar-light">
                        <ul className="nav d-flex align-items-center justify-content-between">
                            {
                                this.props.acl !== undefined && this.props.acl['settings'] !== undefined && this.props.acl['settings'].list !== undefined && this.props.acl['settings'].list === true &&
                                <li className={this.state.currentRouteName === 'settings' ? 'nav-item current-nav-menu  flex-grow-1' : 'nav-item  flex-grow-1'}>
                                    <Link style={{padding: '6px 0 6px 33px'}}
                                          className="nav-link menu-settings-icon pr-1"
                                          to="/admin/settings">{t('settings')}</Link>
                                </li>
                            }
                            <li className=""><LanguageSelector
                                class="text-right"/></li>
                        </ul>

                    </nav>

                    <nav
                        className={this.props.navigation.profilePopup ? 'navbar my-profile-menu transition-yes menu-sliding-up' : 'navbar my-profile-menu transition-yes'}>
                        <ul className="nav">
                            {/*<li className="nav-item">*/}
                            {/*    <Link className="nav-link menu-account-icon" to="/admin/profiles">*/}
                            {/*        {t('my_profile')}*/}
                            {/*    </Link>*/}
                            {/*</li>*/}
                            {/* <li className="nav-item">

                                <Link className="nav-link menu-lock-screen-icon" to="/admin/dashboard">
                                    Lock screen
                                    </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/admin/login" className="nav-link menu-logout-icon"
                                      onClick={e => this.handleLogout(e)}>
                                    {t('logout')}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div tabIndex="1" id="user-logged-panel" onClick={e => this.props.handleProfileClick(e)}
                         onBlur={e => this.props.navigation.profilePopup === true ? this.props.handleProfileClick(e) : ''}>
                        <div className="user-img-panel">
                            <div className="user-name-img">
                                {shortName}
                            </div>
                        </div>
                        <div className="profile-company-panel">
                            <p className="profile-name">{fullName}</p>
                            <p className="profile-company-name">{companyName}</p>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}

// Component states from Redux
const mapStateToProps = state => (
    {
        navigation: state.navigation,
        page: state.page,
        auth: state.auth,
        data: state.auth.data,
        acl: state.auth.acl,
        permittedModels: state.auth.permittedModels,
        popup: state.popup,
        materialNotifications: state.materials.notifications

    }
)

// Component Action Dispatches
const mapDispatchToProp = dispatch => {
    return {
        SSOLogout: () => {
            dispatch(SSOLogout());
        },
        logLogout: (routeName) => {
            dispatch(logLogout(routeName));
        },
        handleProfileClick: () => {
            dispatch({type: 'PROFILE_CLICK'})
        },
        handleSubMenuOpen: (e, subMenus, subMenuName) => {

            if (subMenus === null || subMenus === undefined || Object.keys(subMenus).length === 0) {
                return true;
            }

            e.preventDefault();

            dispatch({
                type: 'SCREEN_RESIZE',
                payload: {
                    sideBarWidth: document.getElementById('sidebar').offsetWidth,
                    screenSize: window.innerWidth,
                }
            })

            dispatch(
                {
                    type: 'SUBMENU_OPEN',
                    payload: {
                        subMenuName: subMenuName
                    }
                }
            )
        },
        handleNavExpandCollapse: () => {
            dispatch({type: 'NAV_EXPAND_COLLAPSE'})
        },
        handleMobileNavSliding: () => {
            dispatch({type: 'MOBILE_NAV_SLIDING'})
        },
        loadDefaultNavState: () => {
            dispatch({type: 'LOAD_DEFAULT_NAV_STATE'})
        },
        setAuthFalse: () => {
            dispatch({type: 'SET_AUTH_FALSE'})
        },
        unsetUserData: user => {
            dispatch({type: 'UNSET_AUTH_USER_DATA'})
        },
        doLogout: () => {
            dispatch({type: 'DO_LOGOUT'})
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProp)(withTranslation()(withRouter(withAuth0(MainNavigation))));

