import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import './MainNavigation.css';
import AdminLogo from "./Images/at2_admin_logo_new.svg";
import MenuToggleIcon from "./Images/menu_toggle_icon.svg";
import {useAuth0} from "@auth0/auth0-react";
import LanguageSelector from "../Translation/LanguageSelector";


const BlankNavigation = ({loadedUser, t}) => {
    const navigation = useSelector(state => state.navigation);
    const page = useSelector(state => state.page);
    const dispatch = useDispatch()
    const {logout} = useAuth0();

    const handleMenuCollapseExpand = e => {
        if (page?.screenSize <= 767) {
            dispatch({type: 'MOBILE_NAV_SLIDING'})
            return false;
        }
        dispatch({type: 'NAV_EXPAND_COLLAPSE'})
    }

    const handleLogout = (e) => {
        e.preventDefault();
        try {
            logout({returnTo: 'https://spillfree.no'})
        } catch (error) {
            console.log(error);
        }
    }

    const mainNavigationClass = navigation.mobileNavSliding === true ? 'main-navigation-panel nav-mobile-expand' : 'main-navigation-panel';
    let profileMenuPosition = 18;
    let userName = loadedUser['name'];
    let shortName = userName.split(' ').length === 1 ? userName.charAt(0) : userName.split(' ')[0].charAt(0) + userName.split(' ')[1].charAt(0);
    let companyName = Boolean(loadedUser[window.env.REACT_APP_AUTH0_NAMESPACE]?.organizations)
    && loadedUser[window.env.REACT_APP_AUTH0_NAMESPACE]['organizations'].length > 0 ? loadedUser[window.env.REACT_APP_AUTH0_NAMESPACE]['organizations'][0]['display_name'] : ''


    if (navigation.navCollapse === true) {
        return (
            <div className="main-navigation-panel">
                <div className="admin-logo-panel no-gutters">
                    <button onClick={e => handleMenuCollapseExpand(e)} id="menuToggle" type="button">
                        <img src={MenuToggleIcon} alt=""/>
                    </button>
                </div>

                <div id="navigation-bottom">
                    <LanguageSelector/>
                    <nav
                        className={navigation.profilePopup ? 'navbar my-profile-menu transition-yes menu-sliding-up' : 'navbar my-profile-menu transition-yes'}>
                        <ul className="nav">
                            <li className="nav-item">
                                <a href="" className="nav-link menu-logout-icon"
                                   onClick={handleLogout}>
                                    {t('logout')}
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div tabIndex="1" id="user-logged-panel" onClick={e => dispatch({type: 'PROFILE_CLICK'})}
                         onBlur={e => navigation.profilePopup === true ? dispatch({type: 'PROFILE_CLICK'}) : ''}>
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
                <a id="logo-link">
                    <img className="img-fluid" src={AdminLogo} alt="AquaTools2.0 Logo"/>
                </a>
                <button onClick={e => handleMenuCollapseExpand()} id="menuToggle" type="button">
                    {!navigation.mobileNavSliding && <img src={MenuToggleIcon} alt=""/>}
                    {navigation.mobileNavSliding && <i className="fa fa-times blue-stroke"></i>}
                </button>
            </div>
            <nav className="navbar navbar-light">
                <div id="navigation-main-links">
                    <ul className="nav">
                    </ul>
                </div>
            </nav>

            <div id="navigation-bottom" style={{bottom: profileMenuPosition}}>
                <nav className="navbar navbar-light">
                    <ul className="nav d-flex align-items-center justify-content-between">
                        <li className="">
                            <LanguageSelector class="text-right"/>
                        </li>
                    </ul>

                </nav>
                <nav
                    className={navigation.profilePopup ? 'navbar my-profile-menu transition-yes menu-sliding-up' : 'navbar my-profile-menu transition-yes'}>
                    <ul className="nav">
                        <li className="nav-item">
                            <a href="" className="nav-link menu-logout-icon"
                               onClick={handleLogout}>
                                {t('logout')}
                            </a>
                        </li>
                    </ul>
                </nav>

                <div tabIndex="1" id="user-logged-panel" onClick={e => dispatch({type: 'PROFILE_CLICK'})}
                     onBlur={e => navigation.profilePopup === true ? dispatch({type: 'PROFILE_CLICK'}) : ''}>
                    <div className="user-img-panel">
                        <div className="user-name-img">
                            {shortName}
                        </div>
                    </div>
                    <div className="profile-company-panel">
                        <p className="profile-name">{userName}</p>
                        <p className="profile-company-name">{companyName}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlankNavigation;
