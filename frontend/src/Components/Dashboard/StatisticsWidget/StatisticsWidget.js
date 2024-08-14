import React, { Component } from 'react';
import { connect } from 'react-redux';
import './StatisticsWidget.css';

import LastLogin from "./LastLogin";
import StatsWidget from "./StatsWidget";
import axios from "axios";
import TokenService from "../../../Services/TokenServices";
import { withTranslation } from 'react-i18next';

class StatisticsWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statistics: null
        }
    }

    async componentDidMount() {
        try {
            const statisticsResponse = await axios.post(
                'api/dashboard/statistics', {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                });

            // response
            this.setState({
                ...this.state,
                statistics: statisticsResponse.data.data
            })

        } catch (error) {
            console.log(error?.data?.response);
        }
    }

    render() {

        const { t } = this.props;

        const loginTime = this.state.statistics === null ? '' : this.state.statistics.lastLogin;
        const numberOfCompanies = this.state.statistics === null ? 0 : this.state.statistics.numberOfCompanies;
        const numberOfAdmins = this.state.statistics === null ? 0 : this.state.statistics.numberOfAdmins;
        const numberOfUsers = this.state.statistics === null ? 0 : this.state.statistics.numberOfUsers;
        const numberOfTemplates = this.state.statistics === null ? 0 : this.state.statistics.numberOfTemplates;
        const numberOfReports = this.state.statistics === null ? 0 : this.state.statistics.numberOfReports;
        const currentUserRole = this.props.auth.data.user?.roles === undefined ? '' : this.props.auth.data.user.roles[0].slug;

        return (
            <div className="statistics_widgets_block">
                <LastLogin
                    color="#1573c3"
                    label={t('last_login')}
                    loginTime={loginTime} />
                {currentUserRole === 'super_admin' && <StatsWidget
                    color="#1b7881"
                    label={t('companies')}
                    count={numberOfCompanies} />}
                {currentUserRole === 'super_admin' && <StatsWidget
                    color="#76af1b"
                    label={t('admins')}
                    count={numberOfAdmins} />}
                <StatsWidget
                    color="#989319"
                    label={t('users')}
                    count={numberOfUsers} />
                <StatsWidget
                    color="#1573c3"
                    label={t('templates')}
                    count={numberOfTemplates} />
                <StatsWidget
                    color="#1b7881"
                    label={t('reports')}
                    count={numberOfReports} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withTranslation()(StatisticsWidget));

