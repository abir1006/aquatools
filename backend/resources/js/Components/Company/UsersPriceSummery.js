import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";


const UsersPriceSummery = props => {

    let usersPrice = parseFloat(props.inputs.users_price);

    usersPrice = Number.isInteger(usersPrice) ? usersPrice : usersPrice.toFixed(2);

    if (Boolean(props.inputs.trial_period) || !Boolean(props.inputs.number_of_user)) {
        usersPrice = 0;
    }

    if (props.inputs.currency === 'NOK') {
        usersPrice = usersPrice.toString().replace('.', ',');
    }

    const currencySymbolBefore = <span>{props.currencySymbols[props.inputs.currency]}</span>;

    const { t } = props;

    return (
        <div className="price_summery pt-2 pb-2">
            <p className="label">{t('summary')}</p>
            <p className="price">{currencySymbolBefore}{usersPrice}</p>
        </div>
    )
}


const mapStateToProps = state => ({
    currencySymbols: state.company.currencySymbols,
    inputs: state.company.inputs,
    invoiceSettingsData: state.company.invoiceSettingsData,
});

export default connect(mapStateToProps)(withTranslation()(UsersPriceSummery));
