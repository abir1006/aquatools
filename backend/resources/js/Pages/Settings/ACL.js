import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import axios from "axios";
import TokenServices from "../../Services/TokenServices";
import { connect } from "react-redux";
import SettingsTabs from "../../Components/Settings/Tabs";
import TabContentACL from "../../Components/Settings/TabContentACL/TabContentACL";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { getAuthUser } from "../../Store/Actions/authActions";
import { handleWindowResize } from "../../Store/Actions/pageActions";
import { setRolesData } from "../../Store/Actions/UserRolesActions";
import { showEditPermission, hideEditPermission } from "../../Store/Actions/ACLActions";
import { showContentSpinner } from "../../Store/Actions/spinnerActions";
import { checkRouteAccess } from "../../Store/Actions/authActions";
import { withTranslation } from 'react-i18next';

class ACL extends Component {
    constructor(props) {
        super(props);
        this.props.hideEditPermission();
        this.state = {
            currentRouteName: null
        }
    }

    // call API to check if the token is valid
    async componentDidMount() {

        await this.checkAuthAndRouteAccess();

        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });

        this.props.showContentSpinner();

        try {

            const userRolesResponse = await axios.post('api/role/list?page=settings-acl', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            });

            this.props.setRolesData(userRolesResponse.data.data);

            this.props.hideContentSpinner();

        } catch (error) {
            //console.log(error.response.data);
        }
    }

    async checkAuthAndRouteAccess() {
        this.props.getAuthUser(this.props.history);

        // check if have route access
        const action = this.props.auth.acl.permissions !== undefined ? this.props.auth.acl.permissions.list : false;
        this.props.checkRouteAccess(this.props.history, action, 'acl settings');

        this.props.handleWindowResize();

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
                            <SettingsTabs />
                            <TabContentACL />
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
});

export default connect(mapStateToProps, {
    handleWindowResize,
    getAuthUser,
    checkRouteAccess,
    setRolesData,
    showEditPermission,
    hideEditPermission,
    showContentSpinner,
})(withTranslation()(ACL));
