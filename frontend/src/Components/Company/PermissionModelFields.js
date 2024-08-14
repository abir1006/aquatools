import React, {useState} from 'react';
import {connect} from 'react-redux';
import {
    resetCompanyFieldsEmptyErrors,
    setCompanyInputs,
    setModelTotalPrice,
    setModelTrialErrors,
} from "../../Store/Actions/companyActions";
import CheckBox from "../Inputs/CheckBox";
import EditableField from "../Inputs/EditableField/EditableField";
import DiscountField from "../Inputs/DiscountField/DiscountField";
import ModelsPriceSummery from "./ModelsPriceSummery";
import InputNumber from "../Inputs/InputNumber";
import InputText from "../Inputs/InputText";
import ModelTrialPeriod from "./ModelTrialPeriod/ModelTrialPeriod";
import moment from "moment";

const PermissionModelFields = props => {

    const {t} = props;

    // Model permission and price change handler

    const modelPermissionCheckUncheck = (permission, fieldName) => {

        props.resetCompanyFieldsEmptyErrors();

        if (fieldName === 'permission_genetics') {
            props.setCompanyInputs({genetics_permission: permission});
        }

        if (fieldName === 'permission_cost_of_disease') {
            props.setCompanyInputs({cost_of_disease_permission: permission});
        }

        if (fieldName === 'permission_slaktmodel') {
            props.setCompanyInputs({slaktmodel_permission: permission});
        }

        if (fieldName === 'permission_vaksinering') {
            props.setCompanyInputs({vaksinering_permission: permission});
        }

        if (fieldName === 'permission_optimalisering') {
            props.setCompanyInputs({optimalisering_permission: permission});
        }

        if (fieldName === 'permission_mtb') {
            props.setCompanyInputs({mtb_permission: permission});
        }

        if (fieldName === 'permission_kn_for') {
            props.setCompanyInputs({kn_for_permission: permission});
        }

        if (permission === false) {
            let trialErrors = {...props.modelTrialErrors};
            const modelSlug = fieldName.replace('permission_', '');
            if (Boolean(trialErrors[modelSlug])) {
                delete trialErrors[modelSlug];
            }
            if (Object.keys(trialErrors).length === 0) {
                trialErrors = undefined;
            }
            props.setModelTrialErrors(trialErrors);
        }
    }

    const modelDiscountChangeHandler = (discount, fieldName) => {
        if (fieldName === 'discount_genetics') {
            props.setCompanyInputs({genetics_discount: discount === '' ? 0 : discount});
        }

        if (fieldName === 'discount_cost_of_disease') {
            props.setCompanyInputs({cost_of_disease_discount: discount === '' ? 0 : discount});
        }

        if (fieldName === 'discount_slaktmodel') {
            props.setCompanyInputs({slaktmodel_discount: discount === '' ? 0 : discount});
        }

        if (fieldName === 'discount_vaksinering') {
            props.setCompanyInputs({vaksinering_discount: discount === '' ? 0 : discount});
        }

        if (fieldName === 'discount_optimalisering') {
            props.setCompanyInputs({optimalisering_discount: discount === '' ? 0 : discount});
        }

        if (fieldName === 'discount_mtb') {
            props.setCompanyInputs({mtb_discount: discount === '' ? 0 : discount});
        }

        if (fieldName === 'discount_kn_for') {
            props.setCompanyInputs({kn_for_discount: discount === '' ? 0 : discount});
        }
    }

    const modelTrialOnChangeHandler = (trialDuration, modelSlug) => {

        if ((Boolean(props.modelTrialErrors) && Boolean(props.modelTrialErrors[modelSlug]))) {
            delete props.modelTrialErrors[modelSlug];
            props.setModelTrialErrors(props.modelTrialErrors);
        }

        let duration = trialDuration;

        props.setCompanyInputs({
            [modelSlug + '_trial']: duration
        })

        let trialStartDate = (trialDuration === 0 || trialDuration === '') ? null : moment().format('DD/MM/YYYY');

        // If company edit screen
        if (Boolean(props.editCompany)) {
            trialStartDate = props.inputs[modelSlug + '_trial_start'];
        }

        props.setCompanyInputs({
            [modelSlug + '_trial_start']: trialStartDate
        })

        let modelTrialEndDate = (trialDuration === 0 || trialDuration === '') ? null : moment().add(trialDuration, 'days').format('DD/MM/YYYY');

        let modelTrialEndDateTimestamp = moment(modelTrialEndDate + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss').valueOf();
        let companyAgreementEndDateTimestamp = moment(props.inputs.agreement_end_date + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss').valueOf();

        if (modelTrialEndDateTimestamp > companyAgreementEndDateTimestamp) {
            let errorMessage = !Boolean(props.modelTrialErrors) ? {} : props.modelTrialErrors;
            const selectedModel = props.allModels.find(model => model.slug === modelSlug);
            errorMessage[modelSlug] = selectedModel['name'] + ' model trial period end date can not be set over company agreement end date';
            props.setModelTrialErrors(errorMessage);
        }

        props.setCompanyInputs({
            [modelSlug + '_trial_end']: modelTrialEndDate
        })
    }

    const currencySymbolBefore = props.currencySymbols[props.inputs.currency];

    let trialPeriod = Boolean(props.inputs.trial_period);

    if (props.inputs.is_trial_used === 1) {
        trialPeriod = false;
    }

    return (
        <div className="content-block-grey">
            <div className="row">
                <div className="col-9 col-xl-10 col-lg-9 col-md-10 col-sm-9">
                    <div className="form_sub_heading pb-0">{t('permissions_models')}</div>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            {
                                props.allModels.map(model => {
                                    const showModelTrialOption = !trialPeriod && props.inputs[model.slug + '_permission'] && parseInt(props.inputs[model.slug + '_price']) === 0;
                                    const modelInputBlockClass = !Boolean(props.inputs[model.slug + '_is_sent']) ? 'input-block' : 'input-block input-disable';
                                    return (
                                        <div className={modelInputBlockClass}>
                                            <CheckBox
                                                checkUncheckHandler={modelPermissionCheckUncheck}
                                                fieldName={'permission_' + model.slug}
                                                fieldValue={props.inputs[model.slug + '_permission']}
                                                text={model.name}/>
                                            <span className="each_model_price">
                                                {!trialPeriod && <div className="editableWrapper">
                                                    <span className="currency">(+{currencySymbolBefore}</span>
                                                    <EditableField
                                                        fieldValue={props.inputs[model.slug + '_price']}
                                                        fieldName={model.slug + '_price'}
                                                        inputSize="25"/>
                                                    <span>)</span>
                                                </div>}
                                                {!trialPeriod && <DiscountField
                                                    fieldValue="0"
                                                    fieldName={'discount_' + model.slug}
                                                    fieldOnChange={modelDiscountChangeHandler}
                                                    inputSize="23"/>}
                                            </span>
                                            {showModelTrialOption && <ModelTrialPeriod
                                                fieldValue={props.inputs[model.slug + '_trial']}
                                                modelSlug={model.slug}
                                                editCompany={props.editCompany}
                                                modelTrialEnd={props.inputs[model.slug + '_trial_end']}
                                                fieldOnChange={modelTrialOnChangeHandler}/>}
                                        </div>
                                    )
                                })
                            }
                            <div className="pull-left mt-2">
                                {
                                    (Boolean(props.modelTrialErrors) && Object.keys(props.modelTrialErrors).length > 0) && Object.keys(props.modelTrialErrors).map(key => {
                                        return <p className="at2_error_text">{props.modelTrialErrors[key]}</p>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3 col-xl-2 col-lg-3 col-md-2 col-sm-3">
                    <ModelsPriceSummery/>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    inputs: state.company.inputs,
    editCompany: state.company.editCompany,
    modelsTotalPrice: state.company.modelsTotalPrice,
    currencySymbols: state.company.currencySymbols,
    invoiceSettingsData: state.company.invoiceSettingsData,
    allModels: state.company.toolsData,
    modelTrialErrors: state.company.modelTrialErrors,
})

export default connect(mapStateToProps, {
    setCompanyInputs,
    setModelTotalPrice,
    setModelTrialErrors,
    resetCompanyFieldsEmptyErrors,
})(PermissionModelFields);
