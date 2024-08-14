import React, {Component} from 'react';
import {connect} from 'react-redux';
import './NotificationBlocks.css';
import {latestNotifications, deleteNotification} from "../../../Store/Actions/NotificationActions";
import NotificationText from "./NotificationText";
import DateTimeService from "../../../Services/DateTimeServices";
import {withTranslation} from 'react-i18next';

class NotificationBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstNotificationClass: ''
        }
    }

    componentDidMount() {
        this.props.latestNotifications();
        const currentUserID = this.props?.auth?.data?.user?.id || '';
        window.Echo.private(`notification.${currentUserID}`).listen('TemplateShared', (data) => {
            this.updateLatestNotification();
        }).listen('TemplateUpdated', (data) => {
            this.updateLatestNotification();
        });
    }

    async updateLatestNotification() {
        await this.props.latestNotifications();
        await this.setState({
            ...this.state,
            firstNotificationClass: 'fade_bordered'
        });
        await setTimeout(() => {
            this.setState({
                ...this.state,
                firstNotificationClass: ''
            })
        }, 2000);
    }

    notificationDeleteHandler(notificationID) {
        this.props.deleteNotification(notificationID);
    }

    render() {
        const {t, i18n} = this.props;

        const latestFiveNotifications = this.props.latestFiveNotifications;
        const noDataFound = Boolean(latestFiveNotifications) === false || latestFiveNotifications.length === 0;

        return (
            <div className="content-block notification_block">
                <h4>
                    <i className="fa fa-bell mr-2" aria-hidden="true"></i> {t('notifications')} </h4>
                {/*<Link to="">View all</Link>*/}
                {latestFiveNotifications !== undefined && <ul>
                    {
                        latestFiveNotifications.map((notification, keyNumber) => {
                            if (Boolean(notification.data.user) === false) {
                                return null;
                            }

                            const timeStrObj = DateTimeService.getTimeDifferent(notification.created_at).split(' ');
                            const notificationTime = timeStrObj[0] + ' ' + t(timeStrObj[1]) + ' ' + t('ago');

                            const firstNotificationClass = keyNumber === 0 ? this.state.firstNotificationClass : '';
                            return (
                                <li className={firstNotificationClass}>
                                    <NotificationText t={t} i18n={i18n} auth={this.props.auth} notification={notification}/>
                                    <br/>
                                    <span
                                        className="activity_date"> {notificationTime} </span>
                                    <i
                                        onClick={e => this.notificationDeleteHandler(notification.id)}
                                        className="fa fa-times grey-stroke"></i>
                                </li>
                            )
                        })
                    }
                </ul>}
                {noDataFound && <p className="text-center">{t('no_data_found')}</p>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    latestFiveNotifications: state.activity.latestNotifications,
});

export default connect(mapStateToProps, {
    latestNotifications,
    deleteNotification,
})(withTranslation()(NotificationBlock));

