import React from 'react';
import { connect } from 'react-redux';
import './popup.css';
import successIcon from './Images/at2_success_icon.svg';
import { withTranslation } from "react-i18next";

const NotificationPopup = props => {
    const { t } = props;
    const notificationPopupClass = props.popup.showNotificationPopup === true ? 'show' : 'hide';
    const message = props.popup.notificationMessage;

    return (
        <div id="at2_notification_popup" className={notificationPopupClass}>
            <div className="notification_wrap">
                {props.popup.showNotificationPopup &&
                    <img src={successIcon} />} {Boolean(message) ? t(message) + '!' : ''}
            </div>
        </div>
    );
}

const mapStateToProps = state => (
    {
        popup: state.popup,
    }
);

export default connect(mapStateToProps)(withTranslation()(NotificationPopup));
