import React, { Component } from 'react';
import { connect } from "react-redux";
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import './Templates.css';
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import { companyListAll } from "../../Store/Actions/companyActions";
import NavService from "../../Services/NavServices";
import MyTemplateList from "../../Components/Templates/MyTemplateList";
import TemplateSharingScreen from "../../Components/Templates/TemplateSharingScreen";
import { hideTemplateSharingScreen } from "../../Store/Actions/TemplateActions";
import AllTemplateList from "../../Components/Templates/AllTemplateList";
import SharedByMeTemplateList from "../../Components/Templates/SharedByMeTemplateList";
import SharedWithMeTemplateList from "../../Components/Templates/SharedWithMeTemplateList";
import { withTranslation } from 'react-i18next';


class Templates extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authentication: true,
            data: {
                user: {
                    company: {}
                },
                company: {}
            }
        }
        this.props.hideTemplateSharingScreen();
    }

    async componentDidMount() {
        await this.checkAuthAndRouteAccess();
        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });

        //this.props.companyListAll();
    }

    async checkAuthAndRouteAccess() {
        await this.props.getAuthUser(this.props.history);
        // check if have route access
        const currentRoute = this.props.location.pathname.split('/').pop();
        const action = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].list : false;
        await this.props.checkRouteAccess(this.props.history, action, currentRoute);

        this.props.handleWindowResize();
        window.addEventListener('resize', () => {
            this.props.handleWindowResize()
        });
    }


    render() {
        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const currentRoute = this.props.location.pathname.split('/').pop();

        const showTemplateSharingScreen = this.props.templateSharingScreen;

        const showBackButton = showTemplateSharingScreen === true;

        const currentUserRole = this.props.auth.data.user === undefined || this.props.auth.data.user.roles === undefined ? '' : this.props.auth.data.user.roles[0].slug;

        return (
            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass} id="template_page">
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('templates') || ''}
                                    iconClass="template-icon" />

                            </div>
                            <NotificationPopup />
                            {showTemplateSharingScreen === false && currentUserRole !== 'company_user' && <AllTemplateList t={t} />}
                            {showTemplateSharingScreen === false && <MyTemplateList t={t} />}
                            {showTemplateSharingScreen === false && <SharedWithMeTemplateList t={t} />}
                            {showTemplateSharingScreen === false && <SharedByMeTemplateList t={t} />}
                            {showTemplateSharingScreen && <TemplateSharingScreen t={t} />}
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
    addUser: state.user.addUser,
    editUser: state.user.editUser,
    templateSharingScreen: state.template.templateSharingScreen,
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    companyListAll,
    handleWindowResize,
    setCurrentRoute,
    hideTemplateSharingScreen,
})(withTranslation()(Templates));
