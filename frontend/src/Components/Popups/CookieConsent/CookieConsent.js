import React, {useState} from 'react';
import {connect} from 'react-redux';

import {withTranslation} from "react-i18next";

import {updateCookieConsent} from "../../../Store/Actions/userActions";

const CookieConsent = props => {

    if (!Boolean(props.auth.data.user) || !Boolean(props.auth.data.user.id)) {
        return null;
    }

    const {t} = props;
    //const [acceptCookie, setAcceptCookie] = useState(false);
    const currentUserID = props.auth.data.user.id;

    const handleConfirm = () => {
        const updateData = {
            id: props.auth.data.user.id,
            field_name: 'accept_cookie',
            field_value: true,
        }
        props.updateCookieConsent(updateData)
    }

    const userAcceptedCookie = props.auth.cookieAccepted;

    if (userAcceptedCookie) {
        return null;
    }

    return (
        <div id="at2_popup">
            <div className="popup_box confirm_popup_box" style={{maxWidth: props.width + 'px'}}>
                <div>
                    <h3 className="text-left pl-3 pr-3">{t('cookie_heading')}</h3>
                    <p className="text-left pl-3 pr-3">{t('cookie_consent_text')}</p>
                    <button
                        onClick={handleConfirm}
                        className="btn btn-primary default-btn-atv2">
                        {t('accept')}
                    </button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => (
    {
        auth: state.auth,
        showCookieContentPopup: state.popup.showInfoPopup,
    }
);

export default connect(mapStateToProps, {
    updateCookieConsent
})(withTranslation()(CookieConsent));
