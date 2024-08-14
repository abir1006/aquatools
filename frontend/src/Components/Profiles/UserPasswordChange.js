import React, { Component } from 'react';
import './Settings.css';
import { connect } from 'react-redux';
import TabHeading from "./TabHeading";
import InputPassword from "../Inputs/Password/InputPassword";
import SaveButton from "../Inputs/SaveButton";
import { showSuccessMessage } from "../../Store/Actions/popupActions";
import axios from "axios";
import TokenServices from "../../Services/TokenServices";
import {
    setUserPasswordFieldsEmptyErrors,
    resetUserPasswordFieldsEmptyErrors,
    showProfileSaveSpinner, hideProfileSaveSpinner
} from '../../Store/Actions/userProfileActions';
import { withTranslation } from 'react-i18next';

class UserPasswordChange extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFieldEmpty: false,
            hasFieldError: false,
            errorMessage: null,
            oldPasswordMatchError: null,
            hasFormChange: false,
            userPasswordInput:
            {
                password: '',
                new_password: '',
                new_password_confirmation: ''

            }

        }
    }

    componentDidMount() {

    }


    onChangeHandler(inputTargets) {


        const { name, value } = inputTargets;

        let userPasswordInput = this.state.userPasswordInput;
        this.setState(prevState => ({
            userPasswordInput: {
                ...prevState.userPasswordInput,
                [name]: value
            }
        }));
        this.setState({ hasFormChange: true });


    }


    updatePasswordHandler() {

        const { password, new_password, new_password_confirmation } = this.state.userPasswordInput;

        const id = this.props.auth.data.user.id;

        let fieldEmpty = false;


        this.props.resetUserPasswordFieldsEmptyErrors();

        if (this.state.userPasswordInput.password === '') {
            fieldEmpty = true;
            this.props.setUserPasswordFieldsEmptyErrors('isOldPasswordFieldEmpty');
        }

        if (this.state.userPasswordInput.new_password === '') {
            fieldEmpty = true;
            this.props.setUserPasswordFieldsEmptyErrors('isNewPasswordFieldEmpty');
        }

        if (this.state.userPasswordInput.new_password_confirmation === '') {
            fieldEmpty = true;
            this.props.setUserPasswordFieldsEmptyErrors('isNewPasswordConfirmationFieldEmpty');
        }

        if (fieldEmpty) {
            this.setState({
                ...this.state,
                isFieldEmpty: true,
            })
            return false;
        }

        this.props.showProfileSaveSpinner();

        this.setState({
            ...this.state,
            errorMessage: null,
            oldPasswordMatchError: null
        });

        axios.put('api/user/password/update', {
            id, password, new_password, new_password_confirmation
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            }).then(response => {

                this.props.hideProfileSaveSpinner();
                this.props.showSuccessMessage('successfully_updated');

            }).catch(error => {
                this.setState({
                    ...this.state,
                    hasFieldError: true,
                    errorMessage: error.response.data.errors !== undefined ? error.response.data.errors : null,
                    oldPasswordMatchError: error.response.data.msg !== undefined ? error.response.data.msg : null
                });
                console.log(error.response.data.errors);
                this.props.hideProfileSaveSpinner();


            });



    }


    render() {

        const { t } = this.props;

        const fieldErrorMessage = this.state.isFieldEmpty === true ?
            <p className="at2_error_text">{t('fields_empty_message')}</p> : '';




        let showSaveSpinner = this.props.showSaveSpinner === undefined ? false : this.props.showSaveSpinner;

        let hasFormChangeVal = this.state.hasFormChange;

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={t('change_your_password')}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">

                        <SaveButton
                            onClickHandler={this.updatePasswordHandler.bind(this)}
                            name={t('save')} buttonDisabled={showSaveSpinner}
                            hasFormChange={hasFormChangeVal}

                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>


                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="old_password">
                                            {t('password_current')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputPassword
                                            fieldName="password"

                                            fieldID="password"
                                            fieldPlaceholder=""
                                            fieldValue={this.state.userPasswordInput.password}
                                            isFieldEmpty={this.props.emptyPasswordFields.isOldPasswordFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="new_password">
                                            {t('new_password')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputPassword
                                            fieldName="new_password"
                                            fieldID="new_password"
                                            fieldPlaceholder=""
                                            fieldValue={this.state.userPasswordInput.new_password}
                                            isFieldEmpty={this.props.emptyPasswordFields.isNewPasswordFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="new_password_confirmation">
                                            {t('confirm_new_password')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputPassword

                                            fieldName="new_password_confirmation"
                                            fieldID="new_password_confirmation"
                                            fieldPlaceholder=""
                                            fieldValue={this.state.userPasswordInput.new_password_confirmation}
                                            isFieldEmpty={this.props.emptyPasswordFields.isNewPasswordConfirmationFieldEmpty}
                                            errorMessage fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>

                                {fieldErrorMessage}


                                {<DisplayValidationError errors={this.state.errorMessage} />}
                                {<DisplayPasswordMatchError oldPasswordMatchError={this.state.oldPasswordMatchError} />}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

function DisplayPasswordMatchError(props) {


    let oldPasswordMatchError = props.oldPasswordMatchError;
    if (oldPasswordMatchError) {
        return <li className="at2_error_text" >{oldPasswordMatchError}</li>;
    }
    else {
        return '';
    }

}


function DisplayValidationError(props) {
    let errorsList = props.errors;
    if (errorsList) {
        for (const key in errorsList) {

            return errorsList[key].map(function (value, index) {
                return <li className="at2_error_text" key={index}>{value}</li>;
            });
        }
    }

    else {
        return '';
    }



}





const mapStateToProps = state => ({
    emptyPasswordFields: state.userProfile.emptyPasswordFields,
    auth: state.auth,
    showSaveSpinner: state.userProfile.userProfileSpinner,
});


export default connect(mapStateToProps,
    {
        showSuccessMessage,
        setUserPasswordFieldsEmptyErrors,
        resetUserPasswordFieldsEmptyErrors,
        showProfileSaveSpinner,
        hideProfileSaveSpinner
    })(withTranslation()(UserPasswordChange));

