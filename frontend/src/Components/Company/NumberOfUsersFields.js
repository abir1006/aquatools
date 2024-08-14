import React from 'react';
import { connect } from 'react-redux';
import { setCompanyInputs } from "../../Store/Actions/companyActions";
import UsersPriceSummery from "./UsersPriceSummery";
import InputText from "../Inputs/InputText";

const NumberOfUserFields = props => {
    const { t } = props;

    let numberOfUsers = {};
    for (let u = 0; u <= 5; u++) {
        numberOfUsers[u] = u.toString();
    }

    const userNumberChangeHandler = inputTarget => {
        const { name, value } = inputTarget;
        let fieldValue = value.replace(/[^\d]+/g, '');
        const pricePerUser = props.invoiceSettingsData['price_per_user'];
        const usersPrice = fieldValue * pricePerUser;

        // Trial period and ended
        const isTrialUsed = Boolean(props.inputs.is_trial_used) && props.inputs.is_trial_used === 1;
        const trialPeriod = Boolean(props.inputs.trial_period);

        props.setCompanyInputs({ number_of_user: fieldValue });
        props.setCompanyInputs({ users_price: trialPeriod ? 0 : usersPrice });
    }
    return (
        <div className="content-block-grey">
            <div className="row">
                <div className="col-9 col-xl-10 col-lg-9 col-md-10 col-sm-9">
                    <div className="form_sub_heading pb-0">{t('number_of_additional_users')}</div>
                    <p className="mb-1">{t('more_users_can_be_added_later_if_needed')}</p>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <InputText
                                fieldName="number_of_user"
                                fieldID="number_of_user"
                                fieldPlaceholder={t('0_1_2_etc')}
                                fieldValue={props.inputs.number_of_user}
                                fieldOnChange={userNumberChangeHandler}
                            />
                        </div>
                    </div>
                </div>


                <div className="col-3 col-xl-2 col-lg-3 col-md-2 col-sm-3">
                    <UsersPriceSummery />
                </div>

            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    inputs: state.company.inputs,
    currencySymbols: state.company.currencySymbols,
    invoiceSettingsData: state.company.invoiceSettingsData,
})

export default connect(mapStateToProps, { setCompanyInputs })(NumberOfUserFields);
