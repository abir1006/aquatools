import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import InputService from "../../../Services/InputServices";

import {
    addFeedFormFieldSettingsList,
    hideFeedFieldsSettingsForm,
    setFeedFormSettingsInputs,
    updateFeedFormFieldSettingsList,
    resetFeedFieldSettings,
    removeFeedFormFieldSettings,
    updateFeedFormFieldsSettings,
    showFeedSettingsCancelIcon,
    hideFeedSettingsCancelIcon,
} from "../../../Store/Actions/FeedSettingsActions";
import { withTranslation } from 'react-i18next';

class ChangeFeedSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fieldEditMode: false,
            hasError: false,
            errorMessage: '',
        }
    }

    componentDidMount() {
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    onFieldNameChangeHandler(inputTargets) {
        this.setState({
            ...this.state,
            hasError: false,
            errorMessage: '',
        });
        const { name, value } = inputTargets;
        if (value === '') {
            this.props.hideFeedSettingsCancelIcon();
        }
        if (value !== '') {
            this.props.showFeedSettingsCancelIcon();
        }
        this.props.setFeedFormSettingsInputs({
            [name]: value
        });
        this.props.setFeedFormSettingsInputs({
            feed_settings_field_name: this.state.fieldEditMode === false ? InputService.slug(value) : this.props.inputs.feed_settings_field_name
        });
    }

    async addFeedLibraryFormField() {

        const inputFeedSettingsFieldLabel = this.props.inputs === undefined ? '' : this.props.inputs.feed_settings_field_label;
        const inputFeedSettingsFieldName = this.props.inputs === undefined ? '' : this.props.inputs.feed_settings_field_name;

        if (inputFeedSettingsFieldLabel === '' || inputFeedSettingsFieldName === '') {
            return false;
        }

        if (this.state.fieldEditMode === true) {
            const isFieldExist = this.props.feedFormSettingsFieldList.find(field => field.fieldLabel === inputFeedSettingsFieldLabel);
            if (isFieldExist !== undefined) {
                this.setState({
                    ...this.state,
                    hasError: true,
                    errorMessage: 'Field already exist',
                })

                return false;
            }
            this.props.updateFeedFormFieldSettingsList(this.props.inputs);
            this.props.setFeedFormSettingsInputs({ feed_settings_field_label: '' });
            this.props.setFeedFormSettingsInputs({ feed_settings_field_name: '' });
            await this.setState({
                ...this.state,
                fieldEditMode: false
            })
        } else {
            const isFieldExist = this.props.feedFormSettingsFieldList.find(field => field.fieldLabel === inputFeedSettingsFieldLabel || field.fieldName === inputFeedSettingsFieldName);
            if (isFieldExist !== undefined) {
                this.setState({
                    ...this.state,
                    hasError: true,
                    errorMessage: 'Field already exist',
                })

                return false;
            }

            this.props.addFeedFormFieldSettingsList({
                fieldLabel: this.props.inputs.feed_settings_field_label,
                fieldName: this.props.inputs.feed_settings_field_name
            });

            this.props.setFeedFormSettingsInputs({ feed_settings_field_label: '' });
            this.props.setFeedFormSettingsInputs({ feed_settings_field_name: '' });
        }
    }

    fieldSettingsRemoveHandler(fieldName) {
        this.props.removeFeedFormFieldSettings(fieldName);
        this.props.setFeedFormSettingsInputs({ feed_settings_field_label: '' });
        this.props.setFeedFormSettingsInputs({ feed_settings_field_name: '' });
        this.setState({
            ...this.state,
            fieldEditMode: false,
        })
    }

    saveFeedLibraryFormFieldSettings() {
        if (this.props.feedFormSettingsFieldList.length === 0) {
            return false;
        }
        let updatedData = {};
        updatedData.fields_data = this.props.feedFormSettingsFieldList;
        updatedData.id = this.props.settingsID;
        this.props.updateFeedFormFieldsSettings(updatedData);
    }

    cancelHandler() {
        this.props.hideFeedFieldsSettingsForm();
    }

    fieldSettingsEditHandler(fieldName) {
        this.props.showFeedSettingsCancelIcon();
        const selectedField = this.props.feedFormSettingsFieldList.find(field => field.fieldName === fieldName);
        this.setState({
            ...this.state,
            fieldEditMode: true,
        });

        this.props.setFeedFormSettingsInputs({ feed_settings_field_label: selectedField.fieldLabel });
        this.props.setFeedFormSettingsInputs({ feed_settings_field_name: selectedField.fieldName });
    }

    dragOverHandler(e) {
        e.preventDefault();
        console.log('Over');
    }

    dragStartHandler(e) {
        console.log(e.target);
    }

    dragEndHandler(e) {
        console.log(e.target);
    }

    cancelFormFieldEditing() {
        this.props.setFeedFormSettingsInputs({ feed_settings_field_label: '' });
        this.props.setFeedFormSettingsInputs({ feed_settings_field_name: '' });
        this.setState({
            ...this.state,
            fieldEditMode: false,
            hasError: false,
            errorMessage: '',
        });
        this.props.hideFeedSettingsCancelIcon();
    }

    render() {

        const { t } = this.props;

        const errorMessage = this.state.hasError === true ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        const selectedFeedSettingsData = this.props.feedSettingsData === undefined ? [] : this.props.feedSettingsData.find(settingsData => settingsData.id === this.props.settingsID);
        const settingsName = selectedFeedSettingsData === undefined || selectedFeedSettingsData.name === undefined ? '' : selectedFeedSettingsData.name;
        const tabHeading = t('add') + '/' + t('edit') + ' ' + settingsName + ' ' + t('fields');
        const inputFeedSettingsFieldLabel = this.props.inputs === undefined ? '' : this.props.inputs.feed_settings_field_label;
        const inputFeedSettingsFieldName = this.props.inputs === undefined ? '' : this.props.inputs.feed_settings_field_name;
        const feedFormSettingsFieldList = this.props.feedFormSettingsFieldList === undefined ? [] : this.props.feedFormSettingsFieldList;
        let fieldListCount = 0;
        const showFeedSettingsSpinner = this.props.feedSettingsSpinner === undefined ? false : this.props.feedSettingsSpinner;
        const showFeedSettingsCancelIcon = this.props.feedSettingsCancelIcon === undefined ? false : this.props.feedSettingsCancelIcon;

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={tabHeading}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                        <SaveButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                        <SaveButton
                            buttonDisabled={showFeedSettingsSpinner}
                            onClickHandler={this.saveFeedLibraryFormFieldSettings.bind(this)}
                            name={t('save')}
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>
                                <div className="form-row">
                                    <div className="col-6 col-xl-4">
                                        <InputText
                                            fieldName="feed_settings_field_label"
                                            fieldClass="feed_settings_field_label"
                                            fieldID="feed_settings_field_label"
                                            fieldPlaceholder={t('field_label') + ' *'}
                                            fieldValue={inputFeedSettingsFieldLabel}
                                            isFieldEmpty={this.state.hasError}
                                            fieldOnChange={this.onFieldNameChangeHandler.bind(this)} />
                                    </div>
                                    <div className="col-6 col-xl-4">
                                        <InputText
                                            isDisable="true"
                                            fieldName="feed_settings_field_name"
                                            fieldClass="feed_settings_field_name"
                                            fieldID="feed_settings_field_name"
                                            fieldPlaceholder={t('field_name')}
                                            fieldValue={inputFeedSettingsFieldName}
                                            fieldOnChange={this.onFieldNameChangeHandler.bind(this)} />
                                    </div>
                                    <div className="col-12 col-xl-4">
                                        <i onClick={e => this.addFeedLibraryFormField()}
                                            className="fa fa-check grey-stroke add_feed_field_list mr-2"></i>
                                        {showFeedSettingsCancelIcon === true &&
                                            <i onClick={e => this.cancelFormFieldEditing()}
                                                className="fa fa-times grey-stroke"></i>}
                                    </div>
                                    {errorMessage}
                                    {feedFormSettingsFieldList.length > 0 &&
                                        <ul id="feed_library_field_list">
                                            {
                                                feedFormSettingsFieldList.map(field => {
                                                    fieldListCount++;
                                                    return <li key={fieldListCount}>{field.fieldLabel} <i
                                                        onClick={e => this.fieldSettingsEditHandler(field.fieldName)}
                                                        className="fa fa-pencil ml-3"></i> <i
                                                            onClick={e => this.fieldSettingsRemoveHandler(field.fieldName)}
                                                            className="fa fa-times"></i></li>
                                                })
                                            }
                                        </ul>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    inputs: state.feedSettings.inputs,
    feedSettingsData: state.feedSettings.feedSettingsData,
    feedFormSettingsFieldList: state.feedSettings.feedFormSettingsFieldList,
    feedSettingsSpinner: state.feedSettings.feedSettingsSpinner,
    feedSettingsCancelIcon: state.feedSettings.feedSettingsCancelIcon,
});

export default connect(mapStateToProps, {
    addFeedFormFieldSettingsList,
    hideFeedFieldsSettingsForm,
    setFeedFormSettingsInputs,
    updateFeedFormFieldSettingsList,
    resetFeedFieldSettings,
    removeFeedFormFieldSettings,
    updateFeedFormFieldsSettings,
    showFeedSettingsCancelIcon,
    hideFeedSettingsCancelIcon,
})(withTranslation()(ChangeFeedSettings));

