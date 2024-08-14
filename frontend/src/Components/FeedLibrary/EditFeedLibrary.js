import React, { Component } from 'react';
import { connect } from "react-redux";
import InputText from "../Inputs/InputText";
import SubmitButton from "../Inputs/SubmitButton";

import {
    updateFeedLibrary,
    setFeedLibraryInputs,
    setFeedCostInputs,
    setFeedLibraryFieldsEmptyErrors,
    resetFeedLibraryInputs,
    resetFeedLibraryFieldsEmptyErrors,
    setFeedLibraryInputsErrors,
    feedStaticData,
} from "../../Store/Actions/FeedLibraryActions";
import InputNumber from "../Inputs/InputNumber";
import ButtonSpinner from "../Spinners/ButtonSpinner";
import DynamicTextField from "../Inputs/DynamicTextField/DynamicTextField";
import ListAutoComplete from "../Inputs/ListAutoComplete/ListAutoComplete";
import InputNumberFloatingLabel from "../Inputs/InputNumberFloatingLabel/InputNumberFloatingLabel";
import InputTextFloatingLabel from "../Inputs/InputTextFloatingLabel/InputTextFloatingLabel";
import { withTranslation } from 'react-i18next';

class EditFeedLibrary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFieldEmpty: false,
            customNewFields: [],
            feedCostTypesFields: [],
            errorMessage: '',
            isFeedProducerEmpty: false,
            isFeedTypeEmpty: false,
            isFeedNameEmpty: false,
            isMinWeightEmpty: false,
            isMaxWeightEmpty: false,
            isVf3Empty: false,
            isBfcrEmpty: false,
        }
    }

    componentDidMount() {
        // set feed static data (Producer and types)
        this.props.feedStaticData();
    }

    onChangeHandler(inputTarget) {
        this.props.setFeedLibraryInputsErrors('');
        const { name, value } = inputTarget;
        this.props.setFeedLibraryInputs({ [name]: value });
        this.props.resetFeedLibraryFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
            isFeedProducerEmpty: false,
            isFeedTypeEmpty: false,
            isFeedNameEmpty: false,
            isMinWeightEmpty: false,
            isMaxWeightEmpty: false,
            isVf3Empty: false,
            isBfcrEmpty: false,
            errorMessage: '',
        })
    }

    feedCostOnChangeHandler(inputTarget) {
        this.props.setFeedLibraryInputsErrors('');
        const { name, value } = inputTarget;
        this.props.setFeedCostInputs({ [name]: value });
        this.props.resetFeedLibraryFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
            isFeedProducerEmpty: false,
            isFeedTypeEmpty: false,
            isFeedNameEmpty: false,
            isMinWeightEmpty: false,
            isMaxWeightEmpty: false,
            isVf3Empty: false,
            isBfcrEmpty: false,
            errorMessage: '',
        })
    }

    producerSelectHandler(name) {
        this.props.setFeedLibraryInputsErrors('');
        this.props.setFeedLibraryInputs({ feed_producer: name });
        this.props.resetFeedLibraryFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
            isFeedProducerEmpty: false,
            isFeedTypeEmpty: false,
            isFeedNameEmpty: false,
            isMinWeightEmpty: false,
            isMaxWeightEmpty: false,
            isVf3Empty: false,
            isBfcrEmpty: false,
            errorMessage: '',
        })
    }

    typeSelectHandler(name) {
        this.props.setFeedLibraryInputsErrors('');
        this.props.setFeedLibraryInputs({ feed_type: name });
        this.props.resetFeedLibraryFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
            isFeedProducerEmpty: false,
            isFeedTypeEmpty: false,
            isFeedNameEmpty: false,
            isMinWeightEmpty: false,
            isMaxWeightEmpty: false,
            isVf3Empty: false,
            isBfcrEmpty: false,
            errorMessage: '',
        })
    }

    async feedUpdateHandler(e) {
        e.preventDefault();
        let updatedData = {};
        const defaultFields = this.props.inputs;
        const feedFormSettings = this.props.feedLibraryFormSettingsData[0]['Feed library form fields'];

        let feedFieldsData = [];
        let countField = 0;

        const { t } = this.props;
        const errorMsg = t('fields_empty_message');

        if (this.props.inputs === undefined || Object.keys(defaultFields).length === 0) {
            await this.setState({
                ...this.state,
                isFeedNameEmpty: true,
                isFeedTypeEmpty: true,
                isMinWeightEmpty: true,
                isMaxWeightEmpty: true,
                errorMessage: errorMsg
            });

            return false;
        }

        if (this.props.inputs.feed_producer === undefined || this.props.inputs.feed_producer === '') {
            await this.setState({
                ...this.state,
                isFeedProducerEmpty: true,
                errorMessage: errorMsg
            });

            return false;
        }

        if (this.props.inputs.feed_name === undefined || this.props.inputs.feed_name === '') {
            await this.setState({
                ...this.state,
                isFeedNameEmpty: true,
                errorMessage: errorMsg
            });

            return false;
        }

        if (this.props.inputs.feed_min_weight === undefined || this.props.inputs.feed_min_weight === '') {
            await this.setState({
                ...this.state,
                isMinWeightEmpty: true,
                errorMessage: errorMsg
            });

            return false;
        }

        if (this.props.inputs.feed_max_weight === undefined || this.props.inputs.feed_max_weight === '') {
            await this.setState({
                ...this.state,
                isMaxWeightEmpty: true,
                errorMessage: errorMsg
            });

            return false;
        }

        if (this.props.inputs.feed_type === undefined || this.props.inputs.feed_type === '') {
            await this.setState({
                ...this.state,
                isFeedTypeEmpty: true,
                errorMessage: errorMsg
            });

            return false;
        }

        // check feed already exist or not
        if (this.props.inputs.feed_name !== undefined && this.props.inputs.feed_name !== '') {
            const findData = this.props.feedData.find(data => data.id !== this.props.inputs.id && data.feed_type === this.props.inputs.feed_type && data.feed_name === this.props.inputs.feed_name);
            if (findData !== undefined) {
                await this.setState({
                    ...this.state,
                    isFeedNameEmpty: true,
                    errorMessage: t('feed_name_already_exist_for_this_feed_type')
                });
                return false;
            }

        }

        const selectedFeedID = this.props.inputs.id;

        // check if at least one feed cost value is set

        let hasFeedCostValue = false;
        let feedCostInputs = [];
        let countCostInput = 0;
        if (this.props.costInputs !== undefined && this.props.companyFeedCustomFields.costCustomFields !== undefined && Object.keys(this.props.costInputs).length > 0) {
            Object.keys(this.props.costInputs).map(key => {
                if (this.props.costInputs[key] !== '') {
                    const tmpCostObj = this.props.companyFeedCustomFields.costCustomFields.find(field => field.fieldName === key);
                    feedCostInputs[countCostInput] = {
                        fieldLabel: tmpCostObj['fieldLabel'],
                        fieldName: key,
                        fieldValue: this.props.costInputs[key],
                    }
                    hasFeedCostValue = true;
                    countCostInput++;
                }
            });
        }



        delete defaultFields['id'];


        // process input field default fields and value
        Object.keys(defaultFields).map(key => {
            const settingsFieldObj = feedFormSettings.find(field => field.fieldName === key);
            if (settingsFieldObj !== undefined) {
                feedFieldsData[countField] = {
                    fieldLabel: settingsFieldObj.fieldLabel,
                    fieldName: key,
                    fieldValue: defaultFields[key]
                }

                countField++;
            }

            if (this.props.companyFeedCustomFields !== undefined && this.props.companyFeedCustomFields.defaultCustomFields !== undefined) {
                const companyFieldObj = this.props.companyFeedCustomFields.defaultCustomFields.find(field => field.fieldName === key)
                if (companyFieldObj !== undefined) {
                    feedFieldsData[countField] = {
                        fieldLabel: companyFieldObj.fieldLabel,
                        fieldName: key,
                        fieldValue: defaultFields[key]
                    }
                    countField++;
                }
            }
        });

        // Process custom new fields
        let companyCustomFields = [];
        let prevDefaultCustomFields = this.props.companyFeedCustomFields === undefined || this.props.companyFeedCustomFields.defaultCustomFields === undefined ? [] : this.props.companyFeedCustomFields.defaultCustomFields;
        if (this.state.customNewFields.length > 0) {
            let customNewFields = [];
            let countCustomField = 0;

            // remove ID properties
            this.state.customNewFields.map(newField => {
                customNewFields[countCustomField] = {
                    fieldLabel: newField.fieldLabel,
                    fieldName: newField.fieldName,
                    fieldValue: newField.fieldValue
                }

                companyCustomFields[countCustomField] = {
                    fieldLabel: newField.fieldLabel,
                    fieldName: newField.fieldName,
                }

                countCustomField++;
            });

            feedFieldsData = feedFieldsData.concat(customNewFields);
        }

        companyCustomFields = prevDefaultCustomFields.concat(companyCustomFields);

        // Process cost types ...
        let feedLibraryFieldsData = {};
        feedLibraryFieldsData.feedFieldsData = feedFieldsData;
        let companyCostTypeFields = [];
        let prevCostCustomFields = this.props.companyFeedCustomFields === undefined || this.props.companyFeedCustomFields.costCustomFields === undefined ? [] : this.props.companyFeedCustomFields.costCustomFields;
        let countCostType = 0;
        if (this.state.feedCostTypesFields.length > 0) {
            feedLibraryFieldsData.feedCostTypes = this.state.feedCostTypesFields;
            this.state.feedCostTypesFields.map(item => {
                companyCostTypeFields[countCostType] = {
                    fieldLabel: item.fieldLabel,
                    fieldName: item.fieldName,
                }
                countCostType++;
            });
        }

        // previous
        companyCostTypeFields = companyCostTypeFields.concat(prevCostCustomFields);

        if (feedLibraryFieldsData.feedCostTypes === undefined && feedCostInputs.length > 0) {
            feedLibraryFieldsData.feedCostTypes = feedCostInputs;
        } else if (feedLibraryFieldsData.feedCostTypes !== undefined && feedCostInputs.length > 0) {
            feedLibraryFieldsData.feedCostTypes = feedLibraryFieldsData.feedCostTypes.concat(feedCostInputs);
        }

        updatedData.id = selectedFeedID;
        updatedData.feed_fields = feedLibraryFieldsData;

        updatedData.companyCustomFields = {};
        updatedData.companyCustomFields.fields = {};
        let countCompanyCustomField = 0;

        if (companyCustomFields.length === 0 && this.props.companyFeedCustomFields.defaultCustomFields !== undefined) {
            updatedData.companyCustomFields.fields.defaultCustomFields = this.props.companyFeedCustomFields.defaultCustomFields;
        }

        if (companyCostTypeFields.length === 0 && this.props.companyFeedCustomFields.costCustomFields !== undefined) {
            updatedData.companyCustomFields.fields.costCustomFields = this.props.companyFeedCustomFields.costCustomFields
        }

        if (companyCustomFields.length > 0) {
            updatedData.companyCustomFields.fields.defaultCustomFields = companyCustomFields
        }

        if (companyCostTypeFields.length > 0) {
            updatedData.companyCustomFields.fields.costCustomFields = companyCostTypeFields
        }

        if (updatedData.companyCustomFields.fields.defaultCustomFields !== undefined || updatedData.companyCustomFields.fields.costCustomFields !== undefined) {
            updatedData.companyCustomFields.type = 'feed_library';
            updatedData.companyCustomFields.company_id = this.props.auth.data.user.company_id;
        }

        //console.log(companyCustomFields);
        //console.log(updatedData);
        const currentPage = this.props.paginationData === undefined ? 1 : this.props.paginationData.currentPage;
        this.props.updateFeedLibrary(updatedData, currentPage);
        return false;
    }

    feedFormDynamicFieldSaveHandler(callBackNewFields) {
        this.setState({
            ...this.state,
            customNewFields: callBackNewFields
        })
    }

    feedCostTypesFieldSaveHandler(feedCostTypesFields) {
        this.setState({
            ...this.state,
            errorMessage: '',
            feedCostTypesFields: feedCostTypesFields
        });
    }

    render() {

        const { t } = this.props;

        const errorMessage = this.state.errorMessage !== undefined && this.state.errorMessage !== '' ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        const allFieldsData = this.props.feedLibraryFormSettingsData === undefined || this.props.feedLibraryFormSettingsData[0] === undefined ? [] : this.props.feedLibraryFormSettingsData[0]['Feed library form fields'];
        const costTypesList = this.props.feedLibraryFormSettingsData === undefined || this.props.feedLibraryFormSettingsData[1] === undefined ? [] : this.props.feedLibraryFormSettingsData[1]['Feed cost type listing'];

        const defaultCustomFields = this.props.companyFeedCustomFields === undefined || this.props.companyFeedCustomFields.defaultCustomFields === undefined ? [] : this.props.companyFeedCustomFields.defaultCustomFields;
        let countAllFields = allFieldsData.length + this.state.customNewFields.length;

        if (defaultCustomFields.length > 0) {
            countAllFields = countAllFields + defaultCustomFields.length;
        }

        const countPerColumn = Math.round(countAllFields / 2);
        const countRestFields = countAllFields - countPerColumn;
        const showFeedLibraryFormSpinner = this.props.feedLibraryFormSpinner === undefined ? false : this.props.feedLibraryFormSpinner;
        let countColFields = 0;
        let countCostFields = 0;
        const showFeedLibraryButtonSpinner = this.props.feedLibraryButtonSpinner === undefined ? false : this.props.feedLibraryButtonSpinner;
        const feedProducerList = this.props.feedProducerList === undefined ? [] : this.props.feedProducerList;
        const feedTypesList = this.props.feedTypesList === undefined ? [] : this.props.feedTypesList;
        const costCustomFields = this.props.companyFeedCustomFields === undefined || this.props.companyFeedCustomFields.costCustomFields === undefined ? [] : this.props.companyFeedCustomFields.costCustomFields;

        let allExcludeFields = [];

        allExcludeFields = allExcludeFields.concat(allFieldsData);
        allExcludeFields = allExcludeFields.concat(costCustomFields);
        allExcludeFields = allExcludeFields.concat(defaultCustomFields);

        const isMobileView = this.props.screenSize <= 767;

        return (
            <div className="content-block mb-3">
                {showFeedLibraryFormSpinner && <div className="spinner_wrap">
                    <ButtonSpinner showSpinner={showFeedLibraryFormSpinner} />
                </div>}
                {showFeedLibraryFormSpinner === false &&
                    <form onSubmit={e => this.feedUpdateHandler(e)} autoComplete="no" id="add_feed_library">
                        <div className="form-row">
                            <div key={1} className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                <div className="content-block-grey">
                                    <div className="form_sub_heading">{t('edit') + ' ' + t('feed')}</div>
                                    {
                                        allFieldsData.length > 0 && allFieldsData.slice(0, countPerColumn).map(field => {
                                            countColFields++;

                                            if (field.fieldName === 'feed_producer') {
                                                let producerName = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                const selectedProducer = feedProducerList.find(producer => producer.name === producerName);
                                                const selectedProducerID = selectedProducer === undefined ? '' : selectedProducer.id;
                                                return (
                                                    <div key={countColFields}>
                                                        <ListAutoComplete
                                                            fieldOnClick={this.producerSelectHandler.bind(this)}
                                                            selectedItemId={selectedProducerID}
                                                            fieldPlaceHolder={t('select_producer')}
                                                            listData={feedProducerList} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'feed_type') {
                                                let typeName = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                const selectedType = feedTypesList.find(type => type.name === typeName);
                                                const selectedFeedTypeID = selectedType === undefined ? '' : selectedType.id;
                                                return (
                                                    <div key={countColFields}>
                                                        <ListAutoComplete
                                                            isFieldEmpty={this.state.isFeedTypeEmpty}
                                                            fieldOnClick={this.typeSelectHandler.bind(this)}
                                                            fieldPlaceHolder={t('select_feed_type')}
                                                            selectedItemId={selectedFeedTypeID}
                                                            listData={feedTypesList} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'customer_name') {
                                                const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                return (
                                                    <div key={countColFields}>
                                                        <InputTextFloatingLabel
                                                            fieldName={field.fieldName}
                                                            fieldClass={field.fieldName}
                                                            fieldID={field.fieldName}
                                                            fieldPlaceholder={t(field.fieldLabel)}
                                                            fieldValue={fieldValue}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'feed_name') {
                                                const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                return (
                                                    <div key={countColFields}>
                                                        <InputTextFloatingLabel
                                                            isFieldEmpty={this.state.isFeedNameEmpty}
                                                            fieldName={field.fieldName}
                                                            fieldClass={field.fieldName}
                                                            fieldID={field.fieldName}
                                                            fieldPlaceholder={t(field.fieldLabel)}
                                                            fieldValue={fieldValue}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'feed_min_weight') {
                                                const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                return (
                                                    <div key={countColFields}>
                                                        <InputNumberFloatingLabel
                                                            isFieldEmpty={this.state.isMinWeightEmpty}
                                                            fieldName={field.fieldName}
                                                            fieldClass={field.fieldName}
                                                            fieldID={field.fieldName}
                                                            fieldPlaceholder={t(field.fieldLabel)}
                                                            fieldValue={fieldValue}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'feed_max_weight') {
                                                const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                return (
                                                    <div key={countColFields}>
                                                        <InputNumberFloatingLabel
                                                            isFieldEmpty={this.state.isMaxWeightEmpty}
                                                            fieldName={field.fieldName}
                                                            fieldClass={field.fieldName}
                                                            fieldID={field.fieldName}
                                                            fieldPlaceholder={t(field.fieldLabel)}
                                                            fieldValue={fieldValue}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'vf3') {
                                                const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                return (
                                                    <div key={countColFields}>
                                                        <InputNumberFloatingLabel
                                                            isFieldEmpty={this.state.isVf3Empty}
                                                            fieldName={field.fieldName}
                                                            fieldClass={field.fieldName}
                                                            fieldID={field.fieldName}
                                                            fieldPlaceholder={t(field.fieldLabel)}
                                                            fieldValue={fieldValue}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                    </div>
                                                )
                                            }
                                            if (field.fieldName === 'bfcr') {
                                                const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                                return (
                                                    <div key={countColFields}>
                                                        <InputNumberFloatingLabel
                                                            isFieldEmpty={this.state.isBfcrEmpty}
                                                            fieldName={field.fieldName}
                                                            fieldClass={field.fieldName}
                                                            fieldID={field.fieldName}
                                                            fieldPlaceholder={t(field.fieldLabel)}
                                                            fieldValue={fieldValue}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                    </div>
                                                )
                                            }
                                            const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                            return (
                                                <div key={countColFields}>
                                                    <InputNumberFloatingLabel
                                                        fieldName={field.fieldName}
                                                        fieldClass={field.fieldName}
                                                        fieldID={field.fieldName}
                                                        fieldPlaceholder={t(field.fieldLabel)}
                                                        fieldValue={fieldValue}
                                                        fieldOnChange={this.onChangeHandler.bind(this)} />
                                                </div>
                                            )
                                        })
                                    }

                                </div>
                                {!isMobileView && errorMessage}
                                {!isMobileView && <div className="btn_wrapper">
                                    <SubmitButton
                                        buttonDisabled={showFeedLibraryButtonSpinner}
                                        btnText={t('update')} />
                                </div>}
                            </div>
                            <div key={2} className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                <div className="content-block-grey">
                                    {
                                        allFieldsData.slice(countPerColumn, countAllFields).map(field => {
                                            countColFields++;
                                            const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                            return (
                                                <div key={countColFields}>
                                                    <InputNumberFloatingLabel
                                                        fieldName={field.fieldName}
                                                        fieldClass={field.fieldName}
                                                        fieldID={field.fieldName}
                                                        fieldPlaceholder={t(field.fieldLabel)}
                                                        fieldValue={fieldValue}
                                                        fieldOnChange={this.onChangeHandler.bind(this)} />
                                                </div>
                                            )
                                        })
                                    }

                                    {
                                        defaultCustomFields.map(field => {
                                            const fieldValue = this.props.inputs === undefined || this.props.inputs[field.fieldName] === undefined ? '' : this.props.inputs[field.fieldName];
                                            return (
                                                <div key={countColFields}>
                                                    <InputNumberFloatingLabel
                                                        fieldName={field.fieldName}
                                                        fieldClass={field.fieldName}
                                                        fieldID={field.fieldName}
                                                        fieldPlaceholder={t(field.fieldLabel)}
                                                        fieldValue={fieldValue}
                                                        fieldOnChange={this.onChangeHandler.bind(this)} />
                                                </div>
                                            )
                                        })
                                    }

                                    <DynamicTextField
                                        excludeFields={allExcludeFields}
                                        fieldSaveCallback={this.feedFormDynamicFieldSaveHandler.bind(this)}
                                    />

                                </div>
                            </div>
                            <div key={3} className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                <div className="content-block-grey">
                                    <div className="form_sub_heading">{t('feed_cost_per_kg')}</div>
                                    {
                                        costCustomFields.map(field => {
                                            countCostFields++;
                                            const fieldValue = this.props.costInputs === undefined || this.props.costInputs[field.fieldName] === undefined ? '' : this.props.costInputs[field.fieldName];
                                            return (
                                                <div key={countCostFields}>
                                                    <InputNumberFloatingLabel
                                                        fieldName={field.fieldName}
                                                        fieldClass={field.fieldName}
                                                        fieldID={field.fieldName}
                                                        fieldPlaceholder={t(field.fieldName)}
                                                        fieldValue={fieldValue}
                                                        fieldOnChange={this.feedCostOnChangeHandler.bind(this)} />
                                                </div>
                                            )
                                        })
                                    }
                                    <DynamicTextField
                                        excludeFields={allExcludeFields}
                                        customFieldSettingsList={costTypesList}
                                        fieldSaveCallback={this.feedCostTypesFieldSaveHandler.bind(this)} />
                                </div>
                            </div>
                            {isMobileView && errorMessage}
                            {isMobileView && <div className="btn_wrapper">
                                <SubmitButton
                                    buttonDisabled={showFeedLibraryButtonSpinner}
                                    btnText={t('update')} />
                            </div>}
                        </div>
                    </form>}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
    inputErrors: state.feedLibrary.inputErrors,
    emptyErrors: state.feedLibrary.emptyErrors,
    inputs: state.feedLibrary.inputs,
    costInputs: state.feedLibrary.costInputs,
    feedLibraryFormSettingsData: state.feedLibrary.formSettingsData,
    userID: state.auth.data.user.id,
    feedLibraryFormSpinner: state.feedLibrary.feedLibraryFormSpinner,
    feedLibraryButtonSpinner: state.feedLibrary.feedLibraryButtonSpinner,
    feedProducerList: state.feedLibrary.feedProducer,
    feedTypesList: state.feedLibrary.feedTypes,
    companyFeedCustomFields: state.feedLibrary.companyFeedCustomFields,
    feedData: state.feedLibrary.data,
    selectedFeedData: state.feedLibrary.selectedFeedData,
    paginationData: state.feedLibrary.paginationData,
    screenSize: state.page.screenSize,
});


export default connect(mapStateToProps, {
    updateFeedLibrary,
    setFeedLibraryInputs,
    setFeedCostInputs,
    setFeedLibraryFieldsEmptyErrors,
    resetFeedLibraryInputs,
    resetFeedLibraryFieldsEmptyErrors,
    setFeedLibraryInputsErrors,
    feedStaticData,
})(withTranslation()(EditFeedLibrary));
