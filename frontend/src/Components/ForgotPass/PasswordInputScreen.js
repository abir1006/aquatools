import React, { Component } from 'react';
import axios from 'axios';
import './login.css';
import InputPassword from "../Inputs/Password/InputPassword";
import ResetButton from "../Inputs/ResetButton";
import { connect } from 'react-redux';
import { sendPasswordChangeRequest } from "../../Store/Actions/ForgotPasswordActions"
import { BrowserRouter, Link, Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
class PasswordInputScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitted: false,
            errorMsg: '',
            errors: [],
            new_password: '',
            new_password_confirmation: '',
            isNewPasswordFieldEmpty: false,
            isNewPasswordConfirmationFieldEmpty: false,
            success: false
        }

    }

    componentDidMount() {

    }

    async submitHandler(e) {

        e.preventDefault();

        this.setState({ isSubmitted: true, errorMsgs: '' })


        if (this.state.new === '' || this.state.new_password_confirmation === '') {

            this.setState({
                ...this.state,
                isNewPasswordFieldEmpty: !Boolean(this.state.new_password),
                isNewPasswordConfirmationFieldEmpty: !Boolean(this.state.new_password_confirmation)
            })

            return false;

        }

        const userData = {
            email: this.props.email,
            password: this.state.new_password,
            password_confirmation: this.state.new_password_confirmation

        };

        this.props.sendPasswordChangeRequest(userData)
            .then((response) => {
                this.setState({ success: true, isSubmitted: false })
                this.props.history.push({
                    pathname: '/admin/login',
                    search: '?success=true'
                });
            })
            .catch((err) => {

                this.setState({ success: false, errorMsg: err.data.message, errors: err.data.errors, isSubmitted: false });
            });

    }


    onChangeHandler(inputFieldTexts) {
        const { name, value } = inputFieldTexts;

        this.setState({
            ...this.state,
            [name]: value,
        }, () => {
            this.setState({
                isNewPasswordFieldEmpty: !Boolean(this.state.new_password),
                isNewPasswordConfirmationFieldEmpty: !Boolean(this.state.new_password_confirmation) || (this.state.new_password !== this.state.new_password_confirmation)
            });
        })
    }



    render() {

        const { t } = this.props;

        const { errors, isNewPasswordConfirmationFieldEmpty, isNewPasswordFieldEmpty } = this.state;

        return (

            <div>

                {this.props.message && !this.state.success && <div className="at2_harvest_date_text">
                    {/* {this.props.message} */}
                    {t('varification_code_match_success')}
                </div>}


                <form className="form-signin" onSubmit={e => this.submitHandler(e)}>

                    <div className="form-row">
                        <div className="col-12 col-lg-12">
                            <label className="col-form-label" htmlFor="new_password">
                                {t('new_password')}
                            </label>
                        </div>
                        <div className="col-12 col-lg-12">
                            <InputPassword
                                fieldName="new_password"
                                fieldID="new_password"
                                fieldPlaceholder=""
                                fieldValue={this.state.new_password}
                                isFieldEmpty={this.state.isNewPasswordFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-12 col-lg-12">
                            <label className="col-form-label" htmlFor="new_password_confirmation">
                                {t('confirm_new_password')}
                            </label>
                        </div>
                        <div className="col-12 col-lg-12">
                            <InputPassword

                                fieldName="new_password_confirmation"
                                fieldID="new_password_confirmation"
                                fieldPlaceholder=""
                                fieldValue={this.state.new_password_confirmation}
                                isFieldEmpty={this.state.isNewPasswordConfirmationFieldEmpty}
                                errorMessage fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                    </div>


                    {this.state.errorMsg && <div className="at2_error_text">

                        <ul>
                            {
                                Object.keys(errors).map(k => errors[k].map(x => <li>{x}</li>))
                            }
                        </ul>
                    </div>}

                    {!isNewPasswordConfirmationFieldEmpty && !isNewPasswordFieldEmpty &&
                        <ResetButton buttonName={t('change_password')} buttonDisabled={this.state.isSubmitted} />}

                </form>

                <div className="lost-password-panel">

                </div>

            </div>
        );
    }
}



const mapStateToProps = state => (
    {
        auth: state.auth,
        email: state.forgotPassword.inputEmail,
        message: state.forgotPassword.message
    }
)

export default connect(mapStateToProps, {
    sendPasswordChangeRequest

})(withTranslation()(PasswordInputScreen));
