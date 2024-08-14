import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import { connect } from "react-redux";
import SettingsTabs from "../../Components/Settings/Tabs";
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import { handleWindowResize } from "../../Store/Actions/pageActions";
import TabContentModels from "../../Components/Settings/TabContentModel/TabContentModels";
import {
    getModelList,
    hideModelForms,
} from "../../Store/Actions/ModelActions";

import { resetModelBlockInputs } from "../../Store/Actions/ModelBlockActions";
import { resetModuleInputs } from "../../Store/Actions/ModuleActions";
import { withTranslation } from 'react-i18next';

class Models extends Component {
    constructor(props) {
        super(props);
        this.props.hideModelForms();
        this.props.resetModelBlockInputs();
        this.props.resetModuleInputs();
    }

    async componentDidMount() {

        await this.checkAuthAndRouteAccess();

        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });

        this.props.getModelList('settings-models');
    }

    async checkAuthAndRouteAccess() {
        // call API to check if the token is valid
        await this.props.getAuthUser(this.props.history);

        // check if have route access
        const action = this.props.auth.acl.models !== undefined ? this.props.auth.acl.models.list : false;
        this.props.checkRouteAccess(this.props.history, action, 'model settings');

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
                            <TabContentModels />
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


const mapStateToProps = state => ({
    navigation: state.navigation,
    auth: state.auth,
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    handleWindowResize,
    getModelList,
    hideModelForms,
    resetModelBlockInputs,
    resetModuleInputs,
})(withTranslation()(Models));
