import React, {Component} from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import {connect} from "react-redux";
import UserProfileInfo from "../../Components/Profiles/EditProfileInfo";
import UserPasswordChange from "../../Components/Profiles/UserPasswordChange";
import EditUserPicture from "../../Components/Profiles/EditUserPicture";
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import PageTitle from "../../Components/PageTitle/PageTitle";
import {getAuthUser, checkRouteAccess} from "../../Store/Actions/authActions";
import {handleWindowResize, setCurrentRoute} from "../../Store/Actions/pageActions";
import {setRolesData} from "../../Store/Actions/UserRolesActions";
import NavService from "../../Services/NavServices";
import '../../Components/Profiles/Settings.css';
import {withTranslation} from 'react-i18next';
import SaveButton from "../../Components/Inputs/SaveButton";
import {showAccountDeleteConfirmPopup, setConfirmAccountDelete} from "../../Store/Actions/popupActions";
import {removeUserAccount} from "../../Store/Actions/userActions";
import RemoveButton from "../../Components/Inputs/RemoveButton";

const UserProfileTab = ({tabIndexKey}) => {
    //  let tabIndexKey = this.state.tabIndexKey;
    if (tabIndexKey == 0) {
        return <UserProfileInfo/>;
    } else if (tabIndexKey == 1) {
        return <EditUserPicture/>;
    } else {
        return <UserPasswordChange/>;
    }
}

class UserProfiles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRouteName: null,
            tabIndexKey: 0
        }
    }


    // call API to check if the token is valid
    async componentDidMount() {
        await this.props.getAuthUser(this.props.history);
        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.props.getAuthUser(this.props.history);
        });
    }

    componentDidUpdate() {

        // call user account delete api after confirm yes
        if( Boolean(this.props.popup.confirmAccountDelete)) {
            const deleteData = {
                id: this.props.auth.data.user.id,
                page: 'Profile',
                company_id: this.props.auth.data.user.company_id,
                type: 'Account Deleted'
            }
            this.props.removeUserAccount(deleteData, this.props.history);
            this.props.setConfirmAccountDelete(undefined);
        }
    }


    getActiveTab(tabIndex) {
        let tabIndexKey = this.state.tabIndexKey;
        if (tabIndexKey === tabIndex) {
            return 'active';
        } else {
            return '';
        }

    }

    removeAccountHandler(userID) {
        const {t} = this.props;
        const confirmMessage = t('account_remove_confirm_message');
        this.props.showAccountDeleteConfirmPopup(confirmMessage);
    }

    render() {

        const {t} = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const currentRoute = NavService.getCurrentRoute();
        const showRemoveButtonSpinner = Boolean(this.props.removeAccountSpinner)
        return (
            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <MainNavigation/>
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('profile_account')}
                                    iconClass="user-icon"/>
                            </div>
                            <NotificationPopup/>
                            <div className="settings_tabs">
                                <ul>

                                    <li className={this.getActiveTab(0)}
                                        onClick={() => this.setState({tabIndexKey: 0})}>
                                        <a>{t('profile_info')} </a>
                                    </li>
                                    <li className={this.getActiveTab(1)}
                                        onClick={() => this.setState({tabIndexKey: 1})}>
                                        <a>{t('change_avatar')}</a>

                                    </li>
                                    <li className={this.getActiveTab(2)}
                                        onClick={() => this.setState({tabIndexKey: 2})}>
                                        <a>{t('change_password')}</a>
                                    </li>

                                </ul>
                            </div>


                            <UserProfileTab tabIndexKey={this.state.tabIndexKey}/>

                            <div className="pull-left w-100 alert alert-danger mb-4 text-right">
                                <RemoveButton
                                    buttonDisabled={showRemoveButtonSpinner}
                                    onClickHandler={this.removeAccountHandler.bind(this)}
                                    name={t('remove_account')}/>
                            </div>

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
    popup: state.popup,
    removeAccountSpinner: state.spinner.removeAccountSpinner,
});

export default connect(mapStateToProps, {
    handleWindowResize,
    checkRouteAccess,
    getAuthUser,
    setCurrentRoute,
    setRolesData,
    showAccountDeleteConfirmPopup,
    setConfirmAccountDelete,
    removeUserAccount
})(withTranslation()(UserProfiles));
