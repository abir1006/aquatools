import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import AddButton from "../../Components/Inputs/AddButton";
import { connect } from "react-redux";

import './Users.css';
import NotificationPopup from "../../Components/Popups/NotificationPopup";

import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import AddUser from "../../Components/User/AddUser";
import UserList from "../../Components/User/UserList";
import {
    hideUserForms,
    showAddUserForm,
    showEditUserForm,
} from "../../Store/Actions/userActions";
import { companyListAll } from "../../Store/Actions/companyActions";
import { roleListAll } from "../../Store/Actions/roleActions";
import EditUser from "../../Components/User/EditUser";
import NavService from "../../Services/NavServices";
import ChangePassword from "../../Components/User/ChangePassword";
import { withTranslation } from 'react-i18next';


class Users extends Component {
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
        this.props.hideUserForms();
    }

    async componentDidMount() {
        this.checkAuthAndRouteAccess();
        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });
        this.props.companyListAll();
        this.props.roleListAll();
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

    addUserHandler() {
        this.props.showAddUserForm();
    }

    cancelHandler() {
        this.props.hideUserForms();
    }

    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const currentRoute = this.props.location.pathname.split('/').pop();

        // set acl permission for user add
        const hasAddPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].save : false;
        const showAddUserForm = this.props.addUser;
        const showEditUserForm = this.props.editUser;
        const showChangePasswordForm = this.props.changePassword === undefined ? false : this.props.changePassword;
        const showAddButton = showChangePasswordForm === false && showAddUserForm === false && showEditUserForm === false && hasAddPermission === true;
        const showCancelButton = showAddUserForm === true || showEditUserForm === true || showChangePasswordForm === true;



        return (
            <div className="row mt-3" id="users_page">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('users') || ''}
                                    iconClass="user-icon" />
                                {/*<div className="add_button_block">*/}
                                {/*    {showCancelButton && <AddButton*/}
                                {/*        name={t('cancel')}*/}
                                {/*        onClickHandler={this.cancelHandler.bind(this)} />}*/}
                                {/*    {showAddButton && <AddButton*/}
                                {/*        onClickHandler={this.addUserHandler.bind(this)}*/}
                                {/*        name={t('add') + ' ' + t('new') + ' ' + t('user')} />}*/}
                                {/*</div>*/}
                            </div>
                            <NotificationPopup />
                            {/*{showAddUserForm && <AddUser t={t} />}*/}
                            {/*{showEditUserForm && <EditUser t={t} />}*/}
                            {/*{showChangePasswordForm && <ChangePassword t={t} />}*/}
                            <UserList t={t} />
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
    changePassword: state.user.changePassword,
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    companyListAll,
    roleListAll,
    handleWindowResize,
    setCurrentRoute,
    showEditUserForm,
    hideUserForms,
    showAddUserForm,
})(withTranslation()(Users));
