import React, { Component } from 'react';
import './Reports.css';
import { connect } from "react-redux";

import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import {
    setNavCollapse,
    setNavExpand
} from "../../Store/Actions/NavigationActions";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import ReportList from "../../Components/Report/ReportList";
import { withTranslation } from 'react-i18next';


class Reports extends Component {
    constructor(props) {
        super(props);
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
        const currentRoute = this.props.location.pathname.split('/').pop();
        const action = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].list : false;
        await this.props.checkRouteAccess(this.props.history, action, currentRoute);

        this.props.handleWindowResize();
        if (this.props.page.screenSize <= 767) {
            this.props.setNavExpand();
        }
        window.addEventListener('resize', () => {
            this.props.handleWindowResize();
            if (this.props.page.screenSize <= 767) {
                this.props.setNavExpand();
            }
        });
    }


    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const currentRoute = this.props.location.pathname.split('/').pop();


        return (
            <div className="row mt-3" id="report_page">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('reports') || ''}
                                    iconClass="report-icon" />

                            </div>
                        </div>
                        <NotificationPopup />
                        <ReportList t={t} />
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
    getAuthUser,
    checkRouteAccess,
    handleWindowResize,
    setCurrentRoute,
    setNavCollapse,
    setNavExpand
})(withTranslation()(Reports));
