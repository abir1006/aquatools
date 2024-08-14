import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import { Redirect } from "react-router-dom";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import {
    showAddCompanyForm,
    showEditCompanyForm,
    hideCompanyForm,
    resetCompanyInputs,
    loadCompanyInputs,
    allDuration,
    allCurrency,
    searchInvoiceSettings,
    getAllTools,
    getAllAddons,
    setDefaultCompanyInputs,
} from "../../Store/Actions/companyActions";
import AddButton from "../../Components/Inputs/AddButton";
import { connect } from "react-redux";
import CompanyList from "../../Components/Company/CompanyList";
import AddCompany from "../../Components/Company/AddCompany";
import './Company.css';
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import EditCompany from "../../Components/Company/EditCompany";
import NavService from "../../Services/NavServices";
import { withTranslation } from 'react-i18next';

class Companies extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authentication: true
        }
        this.props.hideCompanyForm();
        this.props.resetCompanyInputs();
    }

    // call API to check if the token is valid
    async componentDidMount() {
        this.checkAuthAndRouteAccess();
        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });
        // actions to fetch company related data
        this.props.allCurrency();
        this.props.allDuration('NOK');
        this.props.searchInvoiceSettings({ type: 2, currency: 'NOK' });
        this.props.getAllTools();
        this.props.getAllAddons();
    }

    async checkAuthAndRouteAccess() {
        await this.props.getAuthUser();

        // check if have route access
        const currentRoute = this.props.location.pathname.split('/').pop();
        const action = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].list : false;
        await this.props.checkRouteAccess(this.props.history, action, currentRoute);

        this.props.handleWindowResize();
        window.addEventListener('resize', () => {
            this.props.handleWindowResize()
        });
    }

    addCompanyHandler() {
        this.props.resetCompanyInputs();
        this.props.searchInvoiceSettings({ type: 2, currency: 'NOK' });
        this.props.showAddCompanyForm();
        this.props.loadCompanyInputs();
        this.props.setDefaultCompanyInputs();
    }

    cancelHandler() {
        this.props.hideCompanyForm();
    }

    render() {

        const { t } = this.props;

        if (this.props.auth.authenticated === false) {
            return (
                <Redirect to="/admin/login" />
            )
        }

        const currentRoute = this.props.location.pathname.split('/').pop();

        // set acl permission for company add
        const hasAddPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].save : false;

        const authData = this.props.auth.data;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';

        const showAddCompanyForm = this.props.addCompany;
        const showEditCompanyForm = this.props.editCompany;
        let showAddButton = showAddCompanyForm === false && showEditCompanyForm === false && hasAddPermission === true;

        const showCancelButton = showAddCompanyForm === true || showEditCompanyForm === true;

        return (
            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <MainNavigation data={authData} />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('companies') || ''}
                                    iconClass="company-icon" />
                                <div className="add_button_block">
                                    {showCancelButton && <AddButton
                                        name={t('cancel')}
                                        onClickHandler={this.cancelHandler.bind(this)} />}
                                    {showAddButton && <AddButton
                                        onClickHandler={this.addCompanyHandler.bind(this)}
                                        name={t('add') + ' ' + t('new') + ' ' + t('company')} />}
                                </div>
                            </div>
                            <NotificationPopup />
                            {showAddCompanyForm && <AddCompany t={t} />}
                            {showEditCompanyForm && <EditCompany t={t} />}
                            <CompanyList t={t} />
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
    addCompany: state.company.addCompany,
    editCompany: state.company.editCompany,
    data: state.company.data
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    handleWindowResize,
    setCurrentRoute,
    showAddCompanyForm,
    showEditCompanyForm,
    hideCompanyForm,
    loadCompanyInputs,
    allDuration,
    allCurrency,
    searchInvoiceSettings,
    getAllTools,
    resetCompanyInputs,
    getAllAddons,
    setDefaultCompanyInputs,
})(withTranslation()(Companies));
