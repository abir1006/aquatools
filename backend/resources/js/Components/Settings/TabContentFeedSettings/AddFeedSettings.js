import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";

import {
    setFeedSettingsFieldError,
    hideFeedFieldsSettingsForm,
    clearFeedSettingsFieldError,
    saveFeedSettings,
    setFeedSettingsName,
} from "../../../Store/Actions/FeedSettingsActions";
import { withTranslation } from 'react-i18next';

class AddFeedSettings extends Component {
    constructor(props) {
        super(props);
        this.props.clearFeedSettingsFieldError();
    }

    componentDidMount() {
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    onChangeHandler(inputTargets) {
        this.props.clearFeedSettingsFieldError();
        const { name, value } = inputTargets;
        this.props.setFeedSettingsName(value);
    }

    addFeedSettingsHandler() {
        if (this.props.feedSettingsName === undefined || this.props.feedSettingsName === '') {
            this.props.setFeedSettingsFieldError('Fields should not be empty');
            return false;
        }

        const data = {
            name: this.props.feedSettingsName
        }

        this.props.saveFeedSettings(data);
    }

    cancelHandler() {
        this.props.hideFeedFieldsSettingsForm();
    }


    render() {

        const { t } = this.props;

        const hasFieldsError = this.props.hasFeedSettingsFieldError === undefined ? false : this.props.hasFeedSettingsFieldError;
        const inputFeedSettingsName = this.props.feedSettingsName === undefined ? '' : this.props.feedSettingsName;
        const errorMessage = this.props.feedSettingsErrorMessage === undefined || this.props.feedSettingsErrorMessage === '' ? '' :
            <p className="at2_error_text">{this.props.feedSettingsErrorMessage}</p>;

        const showFeedSettingsSpinner = this.props.feedSettingsSpinner === undefined ? false : this.props.feedSettingsSpinner;


        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={t('add_new_feed_settings')}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                        <SaveButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                        <SaveButton
                            buttonDisabled={showFeedSettingsSpinner}
                            onClickHandler={this.addFeedSettingsHandler.bind(this)}
                            name={t('save')}
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>
                                <div className="form-row">
                                    <div className="col-lg-2">
                                        <label className="col-form-label" htmlFor="settings_name">
                                            {t('settings_name')}
                                        </label>
                                    </div>
                                    <div className="col-lg-10">
                                        <InputText
                                            fieldName="settings_name"
                                            fieldClass="settings_name"
                                            fieldID="settings_name"
                                            fieldPlaceholder=""
                                            fieldValue={inputFeedSettingsName}
                                            isFieldEmpty={hasFieldsError}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>
                                {errorMessage}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    feedSettingsSpinner: state.feedSettings.feedSettingsSpinner,
    hasFeedSettingsFieldError: state.feedSettings.hasFeedSettingsFieldError,
    feedSettingsErrorMessage: state.feedSettings.feedSettingsErrorMessage,
    feedSettingsName: state.feedSettings.feedSettingsName,
});

export default connect(mapStateToProps, {
    setFeedSettingsFieldError,
    setFeedSettingsName,
    saveFeedSettings,
    hideFeedFieldsSettingsForm,
    clearFeedSettingsFieldError,
})(withTranslation()(AddFeedSettings));

