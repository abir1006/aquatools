import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import axios from "axios";
import TokenServices from "../../Services/TokenServices";
import { connect } from "react-redux";
import SettingsTabs from "../../Components/Settings/Tabs";
import TabContentUserRoles from "../../Components/Settings/TabContentUserRole/TabContentUserRoles";
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import { setRolesData } from "../../Store/Actions/UserRolesActions";
import { showContentSpinner, hideContentSpinner } from "../../Store/Actions/spinnerActions";
import { withTranslation } from 'react-i18next';
import TabContentUserLogs from "../../Components/Settings/TabContentUserLogs/TabContentUserLogs";


class UserLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRouteName: null
        }
    }

    async componentDidMount() {

        await this.checkAuthAndRouteAccess();

        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });
    }

    async checkAuthAndRouteAccess() {
        await this.props.getAuthUser(this.props.history);

        // check if have route access
        const action = this.props.auth.acl.roles !== undefined ? this.props.auth.acl.roles.list : false;
        this.props.checkRouteAccess(this.props.history, action, 'user logs');

        await this.props.handleWindowResize();

        window.addEventListener('resize', () => {
            this.props.handleWindowResize()
        });
    }

    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';

        return (
            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('settings')}
                                    iconClass="settings-icon" />
                            </div>
                            <NotificationPopup />
                            <SettingsTabs />
                            <TabContentUserLogs />
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


const mapStateToProps = state => ({
    page: state.page,
    navigation: state.navigation,
    auth: state.auth,
    data: state.auth.data,
    popup: state.popup,
});

export default connect(mapStateToProps, {
    handleWindowResize,
    checkRouteAccess,
    getAuthUser,
    setCurrentRoute,
    setRolesData,
    showContentSpinner,
    hideContentSpinner,
})(withTranslation()(UserLogs));
