import React, { Component } from 'react';
import InputText from "../Inputs/InputText";
import {
    setCompanyInputs,
    resetCompanyInputs,
    setModelTrialErrors,
} from "../../Store/Actions/companyActions";
import { connect } from 'react-redux';
import moment from 'moment';
import 'rc-datetime-picker/dist/picker.min.css';
import { DatetimePickerTrigger } from 'rc-datetime-picker';
import CheckBox from "../Inputs/CheckBox";


class AgreementPeriodField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moment: moment()
        };
    }

    componentDidMount() {
        // this.props.setCompanyInputs({agreement_start_date: this.state.moment.format('DD/MM/YYYY')});
        // const dateMoment = moment(this.state.moment.format('YYYY-MM-DD'));
        // const endDate = dateMoment.add(this.props.inputs.agreement_period, 'year').format('DD/MM/YYYY');
        // this.props.setCompanyInputs({agreement_start_date: this.state.moment.format('DD/MM/YYYY')});
        // this.props.setCompanyInputs({agreement_end_date: this.props.inputs.agreement_period === '' ? '' : endDate});
    }

    async startDateChangeHandler(changedMoment) {
        await this.setState({
            moment: changedMoment
        });

        const dateMoment1 = moment(this.state.moment.format('YYYY-MM-DD'));
        let endDate = dateMoment1.add(this.props.inputs.agreement_period, 'year').format('DD/MM/YYYY');
        if (Boolean(this.props.inputs.trial_period)) {
            const dateMoment2 = moment(this.state.moment.format('YYYY-MM-DD'));
            endDate = dateMoment2.add(this.props.inputs.agreement_period, 'days').format('DD/MM/YYYY');
        }
        await this.props.setCompanyInputs({ agreement_start_date: this.state.moment.format('DD/MM/YYYY') });
        await this.props.setCompanyInputs({ agreement_end_date: this.props.inputs.agreement_period === '' ? '' : endDate });
        this.checkModelTrialPeriodEndDate();
    }

    async agreementChangeHandler(inputTarget) {
        const { name, value } = inputTarget;
        let fieldValue = value.replace(/[^\d^.\d]+/g, '');
        let dateMoment1 = moment(this.state.moment.format('YYYY-MM-DD'));

        // If company edit screen
        if (Boolean(this.props.editCompany)) {
            dateMoment1 = moment(this.props.inputs.agreement_start_date, 'DD-MM-YYYY');
        }

        let endDate = dateMoment1.add(fieldValue, 'year').format('DD/MM/YYYY');

        if (Boolean(this.props.inputs.trial_period)) {
            let dateMoment2 = moment(this.state.moment.format('YYYY-MM-DD'));

            // If company edit screen
            if (Boolean(this.props.editCompany)) {
                dateMoment2 = moment(this.props.inputs.agreement_start_date, 'DD-MM-YYYY');
            }

            endDate = dateMoment2.add(fieldValue, 'days').format('DD/MM/YYYY');
        }

        await this.props.setCompanyInputs({ [name]: fieldValue });
        await this.props.setCompanyInputs({ agreement_end_date: fieldValue === '' ? '' : endDate });
        this.checkModelTrialPeriodEndDate();
    }

    trialPeriodCheckUncheck(status) {
        this.props.setModelTrialErrors(undefined);
        this.props.setCompanyInputs({ trial_period: status });
        this.props.setCompanyInputs({ agreement_period: 1 });
        const dateMoment1 = moment(this.props.inputs.agreement_start_date, 'DD-MM-YYYY');
        let endDate = dateMoment1.add(1, 'year').format('DD/MM/YYYY');
        const dateMoment2 = moment(this.props.inputs.agreement_start_date, 'DD-MM-YYYY');

        if (status) {
            this.props.setCompanyInputs({ agreement_period: 7 });
            endDate = dateMoment2.add(7, 'days').format('DD/MM/YYYY');
        }

        this.props.setCompanyInputs({ agreement_end_date: this.props.inputs.agreement_period === '' ? '' : endDate });

        this.props.allModels.map(model => {
            this.props.setCompanyInputs({ [model.slug + '_price']: status ? 0 : this.props.invoiceSettings[model.slug + '_price'] });
        });

        this.props.setCompanyInputs({ users_price: status ? 0 : this.props.invoiceSettings.price_per_user });

    }

    checkModelTrialPeriodEndDate() {
        const companyAgreementEndDate = moment(this.props.inputs.agreement_end_date + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss').valueOf();
        this.props.allModels.map(model => {
            if (Boolean(this.props.inputs[model.slug + '_trial_end'])) {
                const modelTrialPeriodEndDate = moment(this.props.inputs[model.slug + '_trial_end'] + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss').valueOf();
                if (modelTrialPeriodEndDate > companyAgreementEndDate) {
                    let errorMessage = !Boolean(this.props.modelTrialErrors) ? {} : this.props.modelTrialErrors;
                    errorMessage[model.slug] = model.name + ' model trial period end date can not be set over company agreement end date';
                    this.props.setModelTrialErrors(errorMessage);
                } else {
                    let trialErrors = { ...this.props.modelTrialErrors };
                    if (Boolean(trialErrors[model.slug])) {
                        delete trialErrors[model.slug];
                    }
                    if (Object.keys(trialErrors).length === 0) {
                        trialErrors = undefined;
                    }
                    this.props.setModelTrialErrors(trialErrors);
                }
            }
        })
    }

    render() {

        const { t } = this.props;

        const isDisableAgreementPeriod = Boolean(this.props.inputs.trial_period) ? "true" : "false";
        let trialPeriod = Boolean(this.props.inputs.trial_period);
        let isTrialUsed = Boolean(this.props.inputs.is_trial_used) && this.props.inputs.is_trial_used === 1;
        // if (this.props.inputs.trial_period === false && this.props.inputs.is_trial_used === 0) {
        //     isTrialUsed = true;
        // }
        const agreementPeriodText = trialPeriod === true ? t('number_of_days') : t('number_of_years');
        const agreementInputLabel = trialPeriod === true ? t('days') : t('years');
        const disableTrialPeriodCheckbox = isTrialUsed === true ? 'input-disable' : '';
        return (
            <div className="content-block-grey">
                <div className="form_sub_heading">{t('agreement_period')}</div>
                <div className="row">
                    <div className="col- col-xl-3 col-lg-12 col-md-3">
                        <div className="w-50 pull-left">
                            <InputText
                                fieldName="agreement_period"
                                fieldID="invoice_agreement_period"
                                fieldValue={this.props.inputs.agreement_period}
                                fieldOnChange={e => this.agreementChangeHandler(e)}
                            />
                        </div>
                        <div className="w-50 pull-left">
                            <label className="col-form-label pl-2">{agreementInputLabel}</label>
                        </div>
                    </div>
                    <div className="col- col-xl-1 col-lg-2 col-md-1">
                        <label className="col-form-label">{t('start')}:</label>
                    </div>
                    <div className="col- col-xl-3 col-lg-4 col-md-3">
                        <DatetimePickerTrigger
                            closeOnSelectDay={true}
                            moment={this.state.moment}
                            onChange={e => this.startDateChangeHandler(e)}>
                            <input
                                className="form-control"
                                type="text"
                                placeholder={t('agreement_start_date')}
                                value={this.props.inputs.agreement_start_date}
                            />
                        </DatetimePickerTrigger>
                    </div>
                    <div className="col- col-xl-1 col-lg-2 col-md-1">
                        <label className="col-form-label">{t('end')}:</label>
                    </div>
                    <div className="col- col-xl-3 col-lg-4 col-md-3">
                        <input
                            className="form-control"
                            type="text"
                            value={this.props.inputs.agreement_end_date}
                            readOnly
                        />
                    </div>
                    <div className="col- col-xl-12">
                        <div className={disableTrialPeriodCheckbox}>
                            <CheckBox
                                checkUncheckHandler={this.trialPeriodCheckUncheck.bind(this)}
                                fieldName="trial_period"
                                fieldValue={trialPeriod}
                                text={t('agreement_as_trial_period')} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    inputs: state.company.inputs,
    allModels: state.company.toolsData,
    invoiceSettings: state.company.invoiceSettingsData,
    editCompany: state.company.editCompany,
    modelTrialErrors: state.company.modelTrialErrors,
})


export default connect(mapStateToProps, {
    setCompanyInputs,
    resetCompanyInputs,
    setModelTrialErrors,
})(AgreementPeriodField);
