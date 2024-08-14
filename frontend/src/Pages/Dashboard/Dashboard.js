import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import WelcomeBlock from "../../Components/WelcomeBlock/WelcomeBlock";
import FavouriteBlock from "../../Components/FavouriteBlock/FavouriteBlock";
import { connect } from "react-redux";

import { getAuthUser } from "../../Store/Actions/authActions";

import { handleWindowResize } from "../../Store/Actions/pageActions";
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import StatisticsWidget from "../../Components/Dashboard/StatisticsWidget/StatisticsWidget";
import ActivityBlock from "../../Components/Dashboard/ActivityBlock/ActivityBlock";

import {
    setNavCollapse,
    setNavExpand
} from "../../Store/Actions/NavigationActions";
import TokenService from "../../Services/TokenServices";
import NotificationBlock from "../../Components/Dashboard/NotificationBlock/NotificationBlock";
import ModelPopup from '../../Components/FavouriteBlock/ModelPopup';


class Dashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPopup: false,
            info: ""
        }

        this.showPopUp = this.showPopUp.bind(this);

    }

    async componentDidMount() {
        this.checkAuthAndRouteAccess();
        const currentCompanyID = this.props?.auth?.data?.user?.company_id || '';
        // Communicate with pusher channel if user has model permission
        window.Echo.connector.options.auth.headers['Authorization'] = `Bearer ${TokenService.getToken()}`;
        window.Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            await this.checkAuthAndRouteAccess();
        });
    }

    async checkAuthAndRouteAccess() {
        // call API to check if the token is valid

        await this.props.getAuthUser(this.props.history);

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

    showPopUp(e, text) {
        this.setState({ showPopup: true, info: text });
    }

    closePopUp() {
        this.setState({ showPopup: false, info: '' });
    }

    render() {

        const firstName = this.props.auth.data.length === 0 ? '' : this.props.auth.data.user.first_name;
        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const welcomeText = "Welcome to AquaTools – the strategic decision-support tool for optimizing production biology and production economy.";


        return (

            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div
                            className="col- col-xl-9 col-lg-9 col-md-8 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0 pr-xl-0 pr-lg-0 pr-md-0">
                            <WelcomeBlock text={welcomeText} title={firstName} />
                            <NotificationPopup />
                            <StatisticsWidget />
                            {/*<NotificationBlocks />*/}
                            <div className="pull-left w-100">
                                <div className="row">
                                    <div className="col- col-xl-6 col-lg-6">
                                        <ActivityBlock />
                                    </div>
                                    <div className="col- col-xl-6 col-lg-6">
                                        <NotificationBlock />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col- col-xl-3 col-lg-3 col-md-4 col-sm-12">
                            <FavouriteBlock popupHandler={this.showPopUp} />
                        </div>
                    </div>
                </div>



                {this.state.showPopup && <ModelPopup closeHandler={this.closePopUp.bind(this)} info={this.state.info} />}

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
    handleWindowResize,
    setNavCollapse,
    setNavExpand
})(Dashboard);
