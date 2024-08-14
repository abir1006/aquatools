import React, {Component} from 'react';
import {connect} from "react-redux";
import InputText from "../Inputs/InputText";
import CheckBox from "../Inputs/CheckBox";
import InputPassword from "../Inputs/Password/InputPassword";
import moment from 'moment';
import {
    setCompanyByID,
    updateCompany,
    setCompanyInputs,
    setUserAsCompanyAdmin,
    resetCompanyInputs,
    searchInvoiceSettings,
    setCompanyInputsErrors,
    setCompanyFieldsEmptyErrors,
    resetCompanyFieldsEmptyErrors,
} from "../../Store/Actions/companyActions";
import FileUpload from "../Inputs/FileUpload/FileUpload";
import SubmitButton from "../Inputs/SubmitButton";
import PermissionModelFields from "./PermissionModelFields";
import PermissionAddonsFields from "./PermissionAddonsFields";
import NumberOfUserFields from "./NumberOfUsersFields";
import InvoicePlanFields from "./InvoicePlanFields";
import PermissionAtMaterialsFields from "./PermissionAtMaterialsFields";
import AgreementPeriodField from "./AgreementPeriodField";
import TotalPriceSummery from "./TotalPriceSummery";
import axios from "axios";
import TokenService from "../../Services/TokenServices";
import LocationSearch from "../Inputs/LocationSearch/LocationSearch";
import FormSpinner from "../Spinners/FormSpinner";


class EditCompany extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUpload: false,
            isFieldEmpty: false,
            screenWidth: window.innerWidth,
        }
        this.props.resetCompanyFieldsEmptyErrors();
    }

    onChangeHandler(inputTarget) {
        this.props.setCompanyInputsErrors('');
        const {name, value} = inputTarget;
        if (name === 'company_name') {
            this.props.setCompanyInputs({name: value});
        } else if (name === 'company_email') {
            this.props.setCompanyInputs({email: value});
        } else if (name === 'address_line_1') {
            this.props.setCompanyInputs({address_line_1: value});
        } else {
            this.props.setCompanyInputs({[name]: value});
        }

        this.props.resetCompanyFieldsEmptyErrors();

        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }

    emailOnChangeHandler(inputTarget) {
        const {name, value} = inputTarget;
        this.props.setCompanyInputsErrors('');
        this.props.resetCompanyFieldsEmptyErrors();
        this.props.setCompanyInputs({email: value});

        if (this.props.inputs.previous_email !== value) {
            this.props.setCompanyInputs({show_password_field_checkbox: true});
        } else {
            this.props.setCompanyInputs({show_password_field_checkbox: false});
        }
    }

    setUnsetAdminUserHandler(status) {
        this.props.setCompanyInputsErrors('');
        this.props.resetCompanyFieldsEmptyErrors();

        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })

        if (status === false) {
            this.props.setCompanyInputs({
                password: ''
            });
            this.props.setCompanyInputs({
                password_confirmation: ''
            });
        }

        this.props.setCompanyInputs({
            show_password_field: status
        });
    }

    viewInvoiceAfterSaveHandler() {
        this.props.setCompanyInputs({
            view_invoice: this.props.inputs.view_invoice === false
        });
    }

    async logoUploadHandler(file) {
        await this.setState({
            ...this.state,
            imageUpload: true
        });
        //this.props.setCompanyInputs({company_logo: file});
        const formData = new FormData();
        formData.append('logo', file, file.name);
        try {
            const logoUploadResponse = await axios.post('api/company/upload_logo',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                });

            await this.setState({
                ...this.state,
                imageUpload: false
            });

            this.props.setCompanyInputs(logoUploadResponse.data.data);

        } catch (error) {
        }
    }

    async companySubmitHandler(e) {
        e.preventDefault();
        let fieldEmpty = false;

        this.props.setCompanyInputsErrors('');

        if (this.props.inputs.name === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isNameFieldEmpty');
        }

        if (this.props.inputs.contact_person === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isContactPersonFieldEmpty');
        }

        if (this.props.inputs.contact_person_last_name === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isContactPersonLastNameFieldEmpty');
        }

        if (this.props.inputs.contact_number === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isPhoneFieldEmpty');
        }

        if (this.props.inputs.email === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isEmailFieldEmpty');
        }

        if (this.props.inputs.address_line_1 === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isAddressFieldEmpty');
        }

        if (this.props.inputs.country === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isCountryFieldEmpty');
        }

        if (this.props.inputs.city === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isCityFieldEmpty');
        }

        if (this.props.inputs.state === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isStateFieldEmpty');
        }

        if (this.props.inputs.zip_code === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isZipFieldEmpty');
        }

        if (this.props.inputs.number_of_licence === '') {
            this.props.setCompanyFieldsEmptyErrors('isNumberOfLicenceFieldEmpty');
        }

        if (this.props.inputs.show_password_field === true && this.props.inputs.password === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isPasswordFieldEmpty');

        }

        if (this.props.inputs.show_password_field === true && this.props.inputs.password_confirmation === '') {
            fieldEmpty = true;
            this.props.setCompanyFieldsEmptyErrors('isPasswordConfirmFieldEmpty');
        }

        if (fieldEmpty) {
            await this.setState({
                ...this.state,
                isFieldEmpty: true,
            })
            return false;
        }

        // If model permission settings wrong
        if (Boolean(this.props.modelTrialErrors) && Object.keys(this.props.modelTrialErrors).length > 0) {
            return false;
        }

        const companyData = {
            id: this.props.inputs.id,
            name: this.props.inputs.name,
            email: this.props.inputs.email,
            logo: this.props.inputs.logo,
            contact_person: this.props.inputs.contact_person,
            contact_person_last_name: this.props.inputs.contact_person_last_name,
            contact_number: this.props.inputs.contact_number,
            address_line_1: this.props.inputs.address_line_1,
            country: this.props.inputs.country,
            state: this.props.inputs.state,
            city: this.props.inputs.city,
            zip_code: this.props.inputs.zip_code,
            currency: this.props.inputs.currency,
            type: this.props.inputs.type,
            number_of_licence: this.props.inputs.number_of_licence,
            agreement_end: this.props.inputs.agreement_end,
        };

        if (this.props.inputs.show_password_field_checkbox === true && this.props.inputs.show_password_field === true) {
            companyData.user_create = 1;
            companyData.password = this.props.inputs.password;
            companyData.password_confirmation = this.props.inputs.password_confirmation;
        }

        if (this.props.inputs.show_password_field_checkbox === true && this.props.inputs.show_password_field === false) {
            companyData.user_create = 0;
        }

        companyData.company_tools = [];
        companyData.company_addons = [];
        companyData.company_materials = [];
        companyData.invoices = {};
        companyData.invoice_details = [];

        let hasItems = false;
        let countTools = 0;
        let invoiceCount = 0;

        // iterate and update company tools permission data and update the invoice and invoice details
        this.props.toolsData.map(model => {
            const trialStart = !Boolean(this.props.inputs[model.slug + '_trial_start']) ? '' : moment(this.props.inputs[model.slug + '_trial_start'], 'DD/MM/YYYY').format('YYYY-MM-DD');
            const trialEnd = !Boolean(this.props.inputs[model.slug + '_trial_end']) ? '' : moment(this.props.inputs[model.slug + '_trial_end'], 'DD/MM/YYYY').format('YYYY-MM-DD');
            if ((this.props.inputs[model.slug + '_is_sent'] === undefined || this.props.inputs[model.slug + '_is_sent'] === false) && this.props.inputs[model.slug + '_permission'] === true) {
                hasItems = true;
                companyData.company_tools[countTools] = {
                    tool_id: model.id
                };

                companyData.invoice_details[invoiceCount] = {
                    item_name: model.name,
                    item_slug: model.slug,
                    quantity: 1,
                    unit_price: this.props.inputs[model.slug + '_price'],
                    discount_price: this.props.inputs[model.slug + '_discount'],
                    trial: this.props.inputs[model.slug + '_trial'],
                    trial_start: trialStart,
                    trial_end: trialEnd,
                }

                countTools = countTools + 1;
                invoiceCount = invoiceCount + 1;
            }
        });


        let countAddons = 0;

        if ((this.props.inputs.custom_report_is_sent === undefined || this.props.inputs.custom_report_is_sent === false) && this.props.inputs.custom_report_permission === true) {
            hasItems = true;
            companyData.company_addons[countAddons] = {
                addon_id: this.props.addonsData[0].id
            };
            companyData.invoice_details[invoiceCount] = {
                item_name: this.props.addonsData[0].name,
                item_slug: this.props.addonsData[0].slug,
                quantity: 1,
                unit_price: this.props.inputs.custom_report_price,
                discount_price: this.props.inputs.custom_report_discount
            };
            countAddons = countAddons + 1;
            invoiceCount = invoiceCount + 1;
        }

        if ((this.props.inputs.save_template_is_sent === undefined || this.props.inputs.save_template_is_sent === false) && this.props.inputs.save_template_permission === true) {
            hasItems = true;
            companyData.company_addons[countAddons] = {
                addon_id: this.props.addonsData[1].id
            };
            companyData.invoice_details[invoiceCount] = {
                item_name: this.props.addonsData[1].name,
                item_slug: this.props.addonsData[1].slug,
                quantity: 1,
                unit_price: this.props.inputs.save_template_price,
                discount_price: this.props.inputs.save_template_discount
            };
            countAddons = countAddons + 1;
            invoiceCount = invoiceCount + 1;
        }

        if ((this.props.inputs.download_template_is_sent === undefined || this.props.inputs.download_template_is_sent === false) && this.props.inputs.download_template_permission === true) {
            hasItems = true;
            companyData.company_addons[countAddons] = {
                addon_id: this.props.addonsData[2].id
            };
            companyData.invoice_details[invoiceCount] = {
                item_name: this.props.addonsData[2].name,
                item_slug: this.props.addonsData[2].slug,
                quantity: 1,
                unit_price: this.props.inputs.download_template_price,
                discount_price: this.props.inputs.download_template_discount
            };
            countAddons = countAddons + 1;
            invoiceCount = invoiceCount + 1;
        }

        if ((this.props.inputs.share_template_is_sent === undefined || this.props.inputs.share_template_is_sent === false) && this.props.inputs.share_template_permission === true) {
            hasItems = true;
            companyData.company_addons[countAddons] = {
                addon_id: this.props.addonsData[3].id
            };
            companyData.invoice_details[invoiceCount] = {
                item_name: this.props.addonsData[3].name,
                item_slug: this.props.addonsData[3].slug,
                quantity: 1,
                unit_price: this.props.inputs.share_template_price,
                discount_price: this.props.inputs.share_template_discount
            };
            countAddons = countAddons + 1;
            invoiceCount = invoiceCount + 1;
        }

        if ((this.props.inputs.save_cod_is_sent === undefined || this.props.inputs.save_cod_is_sent === false) && this.props.inputs.save_cod_permission === true) {
            hasItems = true;
            companyData.company_addons[countAddons] = {
                addon_id: this.props.addonsData[4].id
            };
            companyData.invoice_details[invoiceCount] = {
                item_name: this.props.addonsData[4].name,
                item_slug: this.props.addonsData[4].slug,
                quantity: 1,
                unit_price: this.props.inputs.save_cod_price,
                discount_price: this.props.inputs.save_cod_discount
            };
            invoiceCount = invoiceCount + 1;
        }

        if (this.props.inputs.users_price > 0 && Boolean(this.props.inputs.number_of_user)) {
            hasItems = true;
            companyData.invoice_details[invoiceCount] = {
                item_name: this.props.inputs.number_of_user + ' Users',
                item_slug: 'users_' + this.props.inputs.number_of_user.replace('-', '_') + '_price',
                quantity: 1,
                unit_price: this.props.inputs.users_price,
            };
        }

        if (hasItems === true) {
            companyData.invoices = {
                id: this.props.inputs.invoice_id,
                agreement_start_date: moment(this.props.inputs.agreement_start_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                agreement_end_date: moment(this.props.inputs.agreement_end_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                number_of_user: this.props.inputs.number_of_user,
                agreement_period: this.props.inputs.agreement_period,
                trial_period: this.props.inputs.trial_period,
            };
            if (this.props.inputs.invoice_id !== undefined) {
                companyData.invoices.id = this.props.inputs.invoice_id;
            }
        }

        if (Object.keys(companyData.invoices).length === 0 && Boolean(this.props.inputs.invoice_id)) {
            companyData.invoices = {
                id: this.props.inputs.invoice_id
            }
        }

        if (companyData.company_tools.length === 0) {
            this.props.setCompanyFieldsEmptyErrors('isModelPermissionFieldEmpty');
            return false;
        }

        this.props.updateCompany(companyData);

        return false;
    }


    render() {
        const {t} = this.props;

        const isMobileView = this.state.screenWidth <= 767;
        const showPasswordFieldCheckbox = this.props.inputs.show_password_field_checkbox;
        const showPasswordField = this.props.inputs.show_password_field;
        const showUploadSpinner = this.state.imageUpload;

        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';
        let emptyMessage = this.state.isFieldEmpty === true ?
            <p className="at2_error_text">{t('fields_empty_message')}</p> : '';
        let modelEmptyMessage = Boolean(this.props.emptyFields.isModelPermissionFieldEmpty) ?
            <p className="at2_error_text">{t('you_did_not_select_any_model_in_current_agreement')}</p> : '';

        const companyLogo = this.props?.inputs?.logo && process.env.MIX_TOOLBOX_MEDIA_URL + '/company_logo/' + this.props.inputs.logo || '';

        const showSaveSpinner = this.props.showSaveSpinner === undefined ? false : this.props.showSaveSpinner;

        return (
            <div className="content-block mb-3">
                <form className="position-relative" onSubmit={e => this.companySubmitHandler(e)} autoComplete="no">
                    <FormSpinner/>
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <div className="content-block-grey">
                                <div className="form_sub_heading">{t('edit') + ' ' + t('company')}</div>
                                <InputText
                                    fieldName="company_name"
                                    fieldClass="company_name"
                                    fieldID="company_name"
                                    fieldPlaceholder={t('company_name') + ' *'}
                                    fieldValue={this.props.inputs.name}
                                    isFieldEmpty={this.props.emptyFields.isNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>
                                <InputText
                                    fieldName="contact_person"
                                    fieldClass="company_contact_person"
                                    fieldID="company_contact_person"
                                    fieldPlaceholder={t('contact_person_name') + ' *'}
                                    fieldValue={this.props.inputs.contact_person}
                                    isFieldEmpty={this.props.emptyFields.isContactPersonFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>
                                <InputText
                                    fieldName="contact_person_last_name"
                                    fieldClass="company_contact_person"
                                    fieldID="company_contact_person_last_name"
                                    fieldPlaceholder={t('contact_person_last_name') + ' *'}
                                    fieldValue={this.props.inputs.contact_person_last_name}
                                    isFieldEmpty={this.props.emptyFields.isContactPersonLastNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>

                                <InputText
                                    fieldName="contact_number"
                                    fieldClass="company_phone_number"
                                    fieldID="company_phone_number"
                                    fieldPlaceholder={t('phone') + ' *'}
                                    fieldValue={this.props.inputs.contact_number}
                                    isFieldEmpty={this.props.emptyFields.isPhoneFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>

                                <InputText
                                    fieldName="company_email"
                                    fieldClass="company_email"
                                    fieldID="company_email"
                                    fieldPlaceholder={t('email') + ' *'}
                                    fieldValue={this.props.inputs.email}
                                    isFieldEmpty={this.props.emptyFields.isEmailFieldEmpty}
                                    fieldOnChange={this.emailOnChangeHandler.bind(this)}/>

                                <div className="row">
                                    <div className="col- col-xl-8 col-lg-8 col-md-8 col-sm-12">
                                        <LocationSearch
                                            isFieldEmpty={this.props.emptyFields.isAddressFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>
                                    <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                        <InputText
                                            fieldName="city"
                                            fieldID="company_city"
                                            fieldPlaceholder={t('city') + ' *'}
                                            fieldValue={this.props.inputs.city}
                                            isFieldEmpty={this.props.emptyFields.isCityFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                        <InputText
                                            fieldName="country"
                                            fieldID="company_country"
                                            fieldPlaceholder={t('city') + ' *'}
                                            fieldValue={this.props.inputs.country}
                                            isFieldEmpty={this.props.emptyFields.isCountryFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>
                                    <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                        <InputText
                                            fieldName="state"
                                            fieldID="company_state"
                                            fieldPlaceholder={t('state') + ' *'}
                                            fieldValue={this.props.inputs.state}
                                            isFieldEmpty={this.props.emptyFields.isStateFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>
                                    <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                        <InputText
                                            fieldName="zip_code"
                                            fieldID="zip_code"
                                            fieldPlaceholder={t('zip_code') + ' *'}
                                            fieldValue={this.props.inputs.zip_code}
                                            isFieldEmpty={this.props.emptyFields.isZipFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)}/>
                                    </div>

                                </div>


                                <InputText
                                    fieldName="number_of_licence"
                                    fieldID="number_of_licence"
                                    fieldPlaceholder={t('no_of_license') + ' *'}
                                    fieldValue={this.props.inputs.number_of_licence}
                                    isFieldEmpty={this.props.emptyFields.isNumberOfLicenceFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>

                                {showPasswordFieldCheckbox && <CheckBox
                                    checkUncheckHandler={this.setUnsetAdminUserHandler.bind(this)}
                                    fieldValue={this.props.inputs.show_password_field}
                                    fieldName="user_add_as_company_admin"
                                    text={t('add_this_person_as_company_admin')}/>}

                                {showPasswordField && <div className="company_form_password">
                                    <div className="row">
                                        <div className="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                            <InputPassword
                                                fieldName="password"
                                                fieldPlaceholder={t('password') + ' *'}
                                                fieldValue={this.props.inputs.password}
                                                isFieldEmpty={this.props.emptyFields.isPasswordFieldEmpty}
                                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                                        </div>
                                        <div className="col-6 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                            <InputPassword
                                                fieldName="password_confirmation"
                                                fieldPlaceholder={t('confirmed_password') + ' *'}
                                                fieldValue={this.props.inputs.password_confirmation}
                                                isFieldEmpty={this.props.emptyFields.isPasswordConfirmFieldEmpty}
                                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                                        </div>
                                    </div>
                                </div>
                                }


                                <FileUpload
                                    fieldValue={companyLogo}
                                    btnText={t('change_logo')}
                                    size="170x120"
                                    showSpinner={showUploadSpinner}
                                    fileOnChangeHandler={e => this.logoUploadHandler(e)}
                                />

                                <CheckBox
                                    checkUncheckHandler={e => this.viewInvoiceAfterSaveHandler(e)}
                                    fieldValue={this.props.inputs.view_invoice}
                                    fieldName="view_invoice_after_save"
                                    text={t('view_invoice_after_update')}/>


                            </div>
                            <InvoicePlanFields t={t}/>
                            {Boolean(this.props.inputErrors) && this.props.inputErrors.map((error, sn) => {
                                const serial = this.props.inputErrors.length > 1 ? (sn + 1) + '. ' : '';
                                return <p className="at2_error_text">{serial + t(error)}</p>
                            })}
                            {emptyMessage}
                            {modelEmptyMessage}
                            {!isMobileView && <div className="btn_wrapper">
                                <SubmitButton
                                    buttonDisabled={showSaveSpinner}
                                    btnText={t('update') + ' ' + t('company')}/>
                            </div>}
                        </div>
                        <div className="col- col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <PermissionModelFields t={t}/>
                            <NumberOfUserFields t={t}/>
                            <PermissionAtMaterialsFields t={t}/>
                            <AgreementPeriodField t={t}/>
                            <TotalPriceSummery t={t}/>
                        </div>
                    </div>
                    {isMobileView && <div className="btn_wrapper mt-2">
                        <SubmitButton
                            buttonDisabled={showSaveSpinner}
                            btnText={t('update') + ' ' + t('company')}/>
                    </div>}
                </form>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    inputs: state.company.inputs,
    inputErrors: state.company.inputErrors,
    emptyFields: state.company.emptyFields,
    toolsData: state.company.toolsData,
    addonsData: state.company.addonsData,
    invoiceSettingsData: state.company.invoiceSettingsData,
    showSaveSpinner: state.company.companySaveSpinner,
    modelTrialErrors: state.company.modelTrialErrors,
});


export default connect(mapStateToProps, {
    updateCompany,
    setCompanyByID,
    setUserAsCompanyAdmin,
    resetCompanyInputs,
    setCompanyInputs,
    searchInvoiceSettings,
    setCompanyInputsErrors,
    setCompanyFieldsEmptyErrors,
    resetCompanyFieldsEmptyErrors,
})(EditCompany);
