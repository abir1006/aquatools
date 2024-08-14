import React, { Component } from 'react';
import './Settings.css';
import { connect } from 'react-redux';
import TabHeading from "./TabHeading";
import InputText from "../Inputs/InputText";
import SaveButton from "../Inputs/SaveButton";
import { showSuccessMessage } from "../../Store/Actions/popupActions";
import axios from "axios";
import TokenServices from "../../Services/TokenServices";
import ListAutoComplete from "../Inputs/ListAutoComplete/ListAutoComplete";
import { getAuthUser } from "../../Store/Actions/authActions";

import {
    setUserProfileInfo,
    resetUserProfileFieldsEmptyErrors,
    setUserProfileFieldsEmptyErrors,
    showProfileSaveSpinner,
    hideProfileSaveSpinner

} from '../../Store/Actions/userProfileActions';
import { withTranslation } from 'react-i18next';
import ActivityBlock from '../Dashboard/ActivityBlock/ActivityBlock';
import NotificationBlock from '../Dashboard/NotificationBlock/NotificationBlock';

//import {setCompanyFieldsEmptyErrors} from "../../../Store/Actions/companyActions";

class EditProfileInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            isFieldEmpty: false,
            hasFieldError: false,
            errorMessage: null,
            hasFormChange: false,
            userProfileInput:
            {
                id: '',
                company_id: '',
                first_name: '',
                last_name: '',
                email: '',

            }

        }
    }

    async componentDidMount() {

        const UserProfileInfoResponse = await axios.get(
            'api/user/profile',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            });
        this.setState({ userProfileInput: UserProfileInfoResponse.data.data });
        this.props.setUserProfileInfo(UserProfileInfoResponse.data.data);

    }


    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;
        this.setState(prevState => ({
            userProfileInput: {
                ...prevState.userProfileInput,
                [name]: value
            }
        }));
        this.setState({ hasFormChange: true });


    }

    companySelectHandler(name, id) {

        var userProfileInputModifier = { ...this.state.userProfileInput }
        userProfileInputModifier.company_id = id;
        this.setState({ userProfileInputModifier });


    }


    saveProfileHandler() {


        const userData = {
            id: this.state.userProfileInput.id,
            company_id: this.state.userProfileInput.company_id,
            first_name: this.state.userProfileInput.first_name,
            last_name: this.state.userProfileInput.last_name,
            email: this.state.userProfileInput.email,

        };

        const { id, company_id, first_name, last_name, email } = this.state.userProfileInput;

        this.props.resetUserProfileFieldsEmptyErrors();

        let fieldEmpty = false;

        if (this.state.userProfileInput.first_name === '') {
            fieldEmpty = true;
            this.props.setUserProfileFieldsEmptyErrors('isFirstNameFieldEmpty');
        }

        if (this.state.userProfileInput.last_name === '') {
            fieldEmpty = true;
            this.props.setUserProfileFieldsEmptyErrors('isLastNameFieldEmpty');
        }


        if (fieldEmpty) {
            this.setState({
                ...this.state,
                isFieldEmpty: true,
            })
            return false;
        } else {
            this.setState({
                ...this.state,
                isFieldEmpty: false,
            })

        }


        this.props.showProfileSaveSpinner();
        axios.put('api/user/profile/update', userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            }).then(() => {
                this.props.showSuccessMessage('successfully_updated');
                this.props.hideProfileSaveSpinner();
                this.setState({ hasFormChange: false });
                this.props.getAuthUser();
            }).catch(() => {


                /*this.setState({
                    ...this.state,
                    hasFieldError: true,
                    errorMessage: error.response.data.errors.name !== undefined ? error.response.data.errors.name : '' +
                    error.response.data.errors.slug !== undefined ? error.response.data.errors.slug : ''
                })*/
            });


    }


    render() {

        const { t } = this.props;

        const companyId = this.state.userProfileInput.company_id;
        //let companyList = this.props.allCompanies;

        let companyList = [];

        if (this.props.auth.data.user.company !== undefined) {
            companyList = [{ id: this.props.auth.data.user.company.id, name: this.props.auth.data.user.company.name }]
        }

        let showSaveSpinner = this.props.showSaveSpinner === undefined ? false : this.props.showSaveSpinner;


        let hasFormChangeVal = this.state.hasFormChange;


        const errorMessage = this.state.isFieldEmpty === true ?
            <p className="at2_error_text">{t('fields_empty_message')}</p> : '';

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={t('edit_profile_info')}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">

                        <SaveButton
                            onClickHandler={this.saveProfileHandler.bind(this)}
                            name={t('save')} buttonDisabled={showSaveSpinner}
                            hasFormChange={hasFormChangeVal}
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="company_id">
                                            {t('company_name')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        {<ListAutoComplete
                                            fieldDisabled="disabled"
                                            fieldId="company_id"
                                            fieldName="company_id"
                                            fieldPlaceHolder={t('company_name')}
                                            fieldOnClick={this.companySelectHandler.bind(this)}
                                            isFieldEmpty={this.props.emptyProfileInfoFields.isCompanyFieldEmpty}
                                            selectedItemId={companyId}
                                            listData={companyList} />}
                                    </div>
                                </div>


                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="first_name">
                                            {t('first_name')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="first_name"
                                            fieldClass="first_name"
                                            fieldID="first_name"
                                            fieldPlaceholder=""
                                            fieldValue={this.state.userProfileInput.first_name}
                                            isFieldEmpty={this.props.emptyProfileInfoFields.isFirstNameFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="last_name">
                                            {t('last_name')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="last_name"
                                            fieldClass="last_name"
                                            fieldID="last_name"
                                            fieldPlaceholder=""
                                            fieldValue={this.state.userProfileInput.last_name}
                                            isFieldEmpty={this.props.emptyProfileInfoFields.isLastNameFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="email">
                                            {t('email')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            isDisable="true"
                                            fieldName="email"
                                            fieldClass="email"
                                            fieldID="email"
                                            fieldPlaceholder=""
                                            fieldValue={this.state.userProfileInput.email}
                                            isFieldEmpty={this.props.emptyProfileInfoFields.isEmailFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                {errorMessage}
                            </form>
                        </div>
                    </div>
                </div>

                <br />
                <div className="pull-left w-100 p-4" style={{ backgroundColor: '#F6F6F6' }}>
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6">
                            <ActivityBlock />
                        </div>
                        <div className="col- col-xl-6 col-lg-6">
                            <NotificationBlock />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}


const mapStateToProps = state => ({
    data: state.userProfile.data,
    emptyProfileInfoFields: state.userProfile.emptyProfileInfoFields,
    inputs: state.userProfile.userProfileInputs,
    auth: state.auth,
    showSaveSpinner: state.userProfile.userProfileSpinner,
});


export default connect(mapStateToProps,
    {
        showSuccessMessage,
        resetUserProfileFieldsEmptyErrors,
        setUserProfileFieldsEmptyErrors,
        setUserProfileInfo,
        showProfileSaveSpinner,
        hideProfileSaveSpinner,
        getAuthUser
    })(withTranslation()(EditProfileInfo));

