import React from 'react';
import { connect } from 'react-redux';
import DropdownList from "../Inputs/DropdownList/DropdownList";
import {
    setCompanyInputs,
    searchInvoiceSettings,
    allDuration
} from "../../Store/Actions/companyActions";

const InvoicePlanFields = props => {

    const { t } = props;

    const allCurrency = props.allCurrencyList;
    const allDuration = props.allDurationList;

    const currencyChangeHandler = currency => {
        props.allDuration(currency, props.inputs.number_of_user);
        props.setCompanyInputs({ currency: currency });
    }

    const durationChangeHandler = duration => {
        props.setCompanyInputs({ type: duration });
        const changedPlan = {
            currency: props.inputs.currency,
            type: duration === 'Yearly' ? 2 : 1,
        }
        props.searchInvoiceSettings(changedPlan, props.inputs.number_of_user);
    }

    return (
        <div className="content-block-grey">
            <div className="form_sub_heading pb-0">{t('invoice_plan')}</div>
            <div className="row">
                <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <DropdownList
                        fieldName="company_invoice_currency"
                        fieldID="company_invoice_currency"
                        data={allCurrency}
                        selectedData={props.inputs.currency}
                        listChangeHandler={currencyChangeHandler}
                    />
                </div>

                <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                    <DropdownList
                        fieldName="company_invoice_duration"
                        fieldID="company_invoice_duration"
                        data={allDuration}
                        selectedData={props.inputs.type}
                        listChangeHandler={durationChangeHandler}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    inputs: state.company.inputs,
    allCurrencyList: state.company.allCurrency,
    allDurationList: state.company.allDuration,
})


export default connect(mapStateToProps, {
    searchInvoiceSettings,
    setCompanyInputs,
    allDuration,
})(InvoicePlanFields);
