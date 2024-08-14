import React from 'react';
import { withTranslation } from 'react-i18next';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const LoginButton = props => {
    const { t } = props;

    return (
        <button
            className="btn btn-primary default-btn-atv2 at2-login-btn"
            type="submit" disabled={props.buttonDisabled}>
            <ButtonSpinner showSpinner={props.buttonDisabled} />
            {t('sign_in')}
        </button>
    );
}

export default withTranslation()(LoginButton);

