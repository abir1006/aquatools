import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import {
    setInvoiceSettingsInputs,
    hideInvoiceSettingsForms,
    showEditInvoiceSettingsForm,
    getInvoiceSettingsInputs,
    setCurrencyData,
    setInvoiceDurationData,
    updateInvoiceSettingsData,
    setInvoiceSettingsInputsErrors,
} from '../../../Store/Actions/invoiceSettingsActions';
import { showSuccessMessage } from "../../../Store/Actions/popupActions";
import { withTranslation } from 'react-i18next';

class EditInvoiceSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isGeneticsPriceFieldEmpty: false,
            isOptimaliseringPriceFieldEmpty: false,
            isCoDPriceFieldEmpty: false,
            isVakPriceFieldEmpty: false,
            isMtbPriceFieldEmpty: false,
            isKnPriceFieldEmpty: false,
            isSlaktPriceFieldEmpty: false,
            isCustomReportPriceFieldEmpty: false,
            isSaveTemplatePriceFieldEmpty: false,
            isDownloadTemplatePriceFieldEmpty: false,
            isShareTemplatePriceFieldEmpty: false,
            isSaveCodPricePriceFieldEmpty: false,
            isPricePerUserFieldEmpty: false,
            isFieldEmpty: false,
        }
    }

    componentDidMount() {
        this.props.setCurrencyData();
        this.props.setInvoiceDurationData();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;
        this.props.setInvoiceSettingsInputs({ [name]: value });
        this.setState({
            isGeneticsPriceFieldEmpty: false,
            isOptimaliseringPriceFieldEmpty: false,
            isCoDPriceFieldEmpty: false,
            isVakPriceFieldEmpty: false,
            isMtbPriceFieldEmpty: false,
            isKnPriceFieldEmpty: false,
            isSlaktPriceFieldEmpty: false,
            isCustomReportPriceFieldEmpty: false,
            isSaveTemplatePriceFieldEmpty: false,
            isDownloadTemplate_pricePriceFieldEmpty: false,
            isShareTemplatePriceFieldEmpty: false,
            isSaveCodPriceFieldEmpty: false,
            isPricePerUserFieldEmpty: false,
            isFieldEmpty: false,
        });
    }

    async updateInvoiceSettingsHandler() {
        this.props.setInvoiceSettingsInputsErrors('');
        const {
            id,
            type,
            genetics_price,
            optimalisering_price,
            cost_of_disease_price,
            vaksinering_price,
            mtb_price,
            kn_for_price,
            slaktmodel_price,
            custom_report_price,
            save_template_price,
            download_template_price,
            share_template_price,
            save_cod_price,
            price_per_user,
        } = this.props.inputs;

        let hasErrors = false;

        if (id === '') {
            console.log('Invalid request, ID not found...');
            return false;
        }

        if (genetics_price === '') {
            await this.setState({ ...this.state, isGeneticsPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (optimalisering_price === '') {
            await this.setState({ ...this.state, isOptimaliseringPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (cost_of_disease_price === '') {
            await this.setState({ ...this.state, isCoDPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (vaksinering_price === '') {
            await this.setState({ ...this.state, isVakPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (mtb_price === '') {
            await this.setState({ ...this.state, isMtbPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (kn_for_price === '') {
            await this.setState({ ...this.state, isKnPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (slaktmodel_price === '') {
            await this.setState({ ...this.state, isSlaktPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (custom_report_price === '') {
            await this.setState({ ...this.state, isCustomReportPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (save_template_price === '') {
            await this.setState({ ...this.state, isSaveTemplatePriceFieldEmpty: true });
            hasErrors = true;
        }

        if (download_template_price === '') {
            await this.setState({ ...this.state, isDownloadTemplatePriceFieldEmpty: true });
            hasErrors = true;
        }

        if (share_template_price === '') {
            await this.setState({ ...this.state, isShareTemplatePriceFieldEmpty: true });
            hasErrors = true;
        }

        if (save_cod_price === '') {
            await this.setState({ ...this.state, isSaveCodPriceFieldEmpty: true });
            hasErrors = true;
        }

        if (price_per_user === '') {
            await this.setState({ ...this.state, isPricePerUserFieldEmpty: true });
            hasErrors = true;
        }

        if (hasErrors === true) {
            await this.setState({ ...this.state, isFieldEmpty: true });
            window.scrollTo(0, document.body.scrollHeight);
            return false;
        }

        const updatedSettingsData = this.props.inputs;

        this.props.updateInvoiceSettingsData(updatedSettingsData);

        console.log(this.props.inputs);
    }

    cancelHandler() {
        this.props.hideInvoiceSettingsForms();
    }


    render() {

        const { t } = this.props;

        const tabHeadingText = 'Edit invoice settings ';
        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';

        const emptyMessage = this.state.isFieldEmpty === true ?
            <p className="at2_error_text">{t('fields_empty_message')}</p> : '';

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={tabHeadingText}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                        <SaveButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                        <SaveButton
                            onClickHandler={this.updateInvoiceSettingsHandler.bind(this)}
                            name={t('update')}
                        />
                    </div>

                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('currency')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <p className="pt-2"><strong>{this.props.inputs.currency}</strong></p>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('duration')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <p className="pt-2"><strong>{this.props.inputs.type}</strong></p>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col- col-xl-12">
                                        <div className="form_sub_heading">{t('models_price')}</div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_genetics')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="genetics_price"
                                            fieldClass="genetics_price"
                                            fieldID="genetics_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.genetics_price}
                                            isFieldEmpty={this.state.isGeneticsPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_optimization')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="optimalisering_price"
                                            fieldClass="optimalisering_price"
                                            fieldID="optimalisering_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.optimalisering_price}
                                            isFieldEmpty={this.state.isOptimaliseringPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_cod')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="cost_of_disease_price"
                                            fieldClass="cod_price"
                                            fieldID="cod_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.cost_of_disease_price}
                                            isFieldEmpty={this.state.isCoDPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_vaccination')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="vaksinering_price"
                                            fieldClass="vaksinering_price"
                                            fieldID="vaksinering_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.vaksinering_price}
                                            isFieldEmpty={this.state.isVakPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_mtb')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="mtb_price"
                                            fieldClass="mtb_price"
                                            fieldID="mtb_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.mtb_price}
                                            isFieldEmpty={this.state.isMtbPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_harvest')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="slaktmodel_price"
                                            fieldClass="slaktmodel_price"
                                            fieldID="slaktmodel_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.slaktmodel_price}
                                            isFieldEmpty={this.state.isSlaktPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>


                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('model_feed')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="kn_for_price"
                                            fieldClass="kn_for_price"
                                            fieldID="kn_for_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.kn_for_price}
                                            isFieldEmpty={this.state.isKnPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>


                                <div className="form-row">
                                    <div className="col- col-xl-12">
                                        <div className="form_sub_heading">{t('addons_price')}</div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('custom_report')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="custom_report_price"
                                            fieldClass="custom_report_price"
                                            fieldID="custom_report_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.custom_report_price}
                                            isFieldEmpty={this.state.isCustomReportPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('share_template')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="share_template_price"
                                            fieldClass="share_template_price"
                                            fieldID="share_template_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.share_template_price}
                                            isFieldEmpty={this.state.isShareTemplatePriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('download_template')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="download_template_price"
                                            fieldClass="download_template_price"
                                            fieldID="download_template_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.download_template_price}
                                            isFieldEmpty={this.state.isDownloadTemplatePriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('save_template')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="save_template_price"
                                            fieldClass="save_template_price"
                                            fieldID="save_template_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.save_template_price}
                                            isFieldEmpty={this.state.isSaveTemplatePriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('save_disease_cod')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="save_cod_price"
                                            fieldClass="save_cod_price"
                                            fieldID="save_cod_price"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.save_cod_price}
                                            isFieldEmpty={this.state.isSaveCodPriceFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col- col-xl-12">
                                        <div className="form_sub_heading">{t('users_price')}</div>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            {t('price_per_user')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="price_per_user"
                                            fieldClass="price_per_user"
                                            fieldID="price_per_user"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.price_per_user}
                                            isFieldEmpty={this.state.isPricePerUserFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>


                                {errorMessage}
                                {emptyMessage}

                            </form>
                        </div>
                    </div>

                    <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pb-lg-2 mt-3 text-right">
                        <SaveButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                        <SaveButton
                            onClickHandler={this.updateInvoiceSettingsHandler.bind(this)}
                            name={t('update')}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    data: state.invoiceSettings.data,
    inputs: state.invoiceSettings.inputs,
    currencyList: state.invoiceSettings.currencyList,
    durationTypes: state.invoiceSettings.durationTypes,
    inputErrors: state.invoiceSettings.inputErrors,
    selectedInvoiceSettingsID: state.invoiceSettings.selectedInvoiceSettingsId,
});

export default connect(mapStateToProps, {
    showSuccessMessage,
    hideInvoiceSettingsForms,
    showEditInvoiceSettingsForm,
    setInvoiceSettingsInputs,
    getInvoiceSettingsInputs,
    setCurrencyData,
    setInvoiceDurationData,
    updateInvoiceSettingsData,
    setInvoiceSettingsInputsErrors,
})(withTranslation()(EditInvoiceSettings));

