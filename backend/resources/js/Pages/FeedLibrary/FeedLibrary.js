import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import {
    clearFeedLibraryFormsData,
    showAddFeedLibraryForm,
    hideFeedLibraryForms,
    fetchFeedLibrary,
    fetchFeedLibraryFormFields,
    fetchFeedCustomFields,
} from "../../Store/Actions/FeedLibraryActions";
import AddButton from "../../Components/Inputs/AddButton";
import { connect } from "react-redux";
import './FeedLibrary.css';
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import NavService from "../../Services/NavServices";
import FeedList from "../../Components/FeedLibrary/FeedList";
import LinkButton from "../../Components/Inputs/LinkButton";
import CancelButton from "../../Components/Inputs/CancelButton";
import AddFeedLibrary from "../../Components/FeedLibrary/AddFeedLibrary";
import EditFeedLibrary from "../../Components/FeedLibrary/EditFeedLibrary";
import { withTranslation } from 'react-i18next';


class FeedLibrary extends Component {
    constructor(props) {
        super(props);
        this.props.hideFeedLibraryForms();
    }

    async componentDidMount() {
        await this.checkAuthAndRouteAccess();

        const currentCompanyID = this.props.auth.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });

        await this.props.clearFeedLibraryFormsData();
        await this.props.fetchFeedLibraryFormFields('Feed library form fields');
        await this.props.fetchFeedLibraryFormFields('Feed cost type listing');
        await this.props.fetchFeedLibrary(undefined, 'feedLibrary');
    }

    async checkAuthAndRouteAccess() {
        this.props.getAuthUser(this.props.history);
        // check if have route access
        const currentRoute = this.props.location.pathname.split('/').pop();

        this.props.handleWindowResize();
        window.addEventListener('resize', () => {
            this.props.handleWindowResize()
        });
    }

    async addFeedHandler() {
        this.props.showAddFeedLibraryForm();
        await this.props.clearFeedLibraryFormsData();
        await this.props.fetchFeedLibraryFormFields('Feed library form fields');
        await this.props.fetchFeedLibraryFormFields('Feed cost type listing');
        await this.props.fetchFeedCustomFields({
            company_id: this.props.auth.data.user.company_id,
            type: 'feed_library',
        });
    }

    cancelHandler() {
        this.props.hideFeedLibraryForms();
    }

    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const currentRoute = this.props.location.pathname.split('/').pop();


        const showAddFeedLibrary = this.props.addFeedLibrary === undefined || this.props.addFeedLibrary === false ? false : this.props.addFeedLibrary;
        const showEditFeedLibrary = this.props.editFeedLibrary === undefined || this.props.editFeedLibrary === false ? false : this.props.editFeedLibrary;
        const showAddButton = showAddFeedLibrary === false && showEditFeedLibrary === false;
        const showCancelButton = showAddFeedLibrary === true || showEditFeedLibrary === true;

        return (
            <div className="row mt-3" id="feed_library">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('feed_library')} />
                                <div className="add_button_block">
                                    <span className="mr-2">
                                        <LinkButton url="/admin/models/kn_for" btnText={"< " + t('back_to_feed_model')} />
                                    </span>
                                    {showCancelButton && <CancelButton
                                        name={t('cancel')}
                                        onClickHandler={this.cancelHandler.bind(this)} />}
                                    {showAddButton && <AddButton
                                        onClickHandler={this.addFeedHandler.bind(this)}
                                        name={t('add') + ' ' + t('feed')} />}
                                </div>
                            </div>
                            <NotificationPopup />
                            {showAddFeedLibrary && <AddFeedLibrary />}
                            {showEditFeedLibrary && <EditFeedLibrary />}
                            <FeedList />
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
    addFeedLibrary: state.feedLibrary.addFeedLibrary,
    editFeedLibrary: state.feedLibrary.editFeedLibrary,
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    handleWindowResize,
    setCurrentRoute,
    fetchFeedLibrary,
    showAddFeedLibraryForm,
    hideFeedLibraryForms,
    fetchFeedLibraryFormFields,
    clearFeedLibraryFormsData,
    fetchFeedCustomFields,
})(withTranslation()(FeedLibrary));
