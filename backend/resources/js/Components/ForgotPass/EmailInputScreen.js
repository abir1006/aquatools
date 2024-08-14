import React, { Component } from 'react';
import axios from 'axios';
import './login.css';
import InputEmail from "../Inputs/InputEmail";
import ResetButton from "../Inputs/ResetButton";
import { connect } from 'react-redux';
import { sendForgotPassRequest } from "../../Store/Actions/ForgotPasswordActions"
import { Link, Redirect } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class EmailInputScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isEmailFieldEmpty: false,
            errorMsg: '',
            isSubmitted: false
        }
    }

    async emailSubmitHandler(e) {
        e.preventDefault();

        this.setState({ errorMsg: '', isSubmitted: true })

        if (this.state.email === '') {

            this.setState({
                ...this.state,
                isEmailFieldEmpty: true,
            })

            return false;
        }

        const userData = {
            email: this.state.email,

        };

        this.props.sendForgotPassRequest(userData)
            .then((response) => {
                this.setState({ isSubmitted: false })
            })
            .catch((err) => {
                if (err.data.data?.resend) {
                    this.props.setResendMsg(err.data.message);
                }
                this.setState({ errorMsg: err.data.message, isSubmitted: false })
            });

    }



    onChangeHandler(inputFieldTexts) {
        const { name, value } = inputFieldTexts;

        const isEmpty = Boolean(value) ? false : true;

        this.setState({
            ...this.state,
            [name]: value,
            isEmailFieldEmpty: isEmpty
        })

    }



    render() {

        const { t } = this.props;

        return (
            <div>

                <div><span className="reset-password">{t('enter_email_to_reset_password')}</span></div>

                <form className="form-signin" onSubmit={e => this.emailSubmitHandler(e)}>
                    <InputEmail
                        fieldName="email"
                        fieldPlaceholder={t('email_address')}
                        fieldValue={this.state.email}
                        isFieldEmpty={this.state.isEmailFieldEmpty}
                        fieldOnChange={this.onChangeHandler.bind(this)}
                    />

                    {this.state.errorMsg && <p className="at2_error_text">{this.state.errorMsg}</p>}

                    <ResetButton buttonName={t('submit')} buttonDisabled={this.state.isSubmitted} />

                </form>
                <div className="lost-password-panel">
                    <Link to="/admin/login">{t('login')}</Link>
                </div>
            </div>

        );
    }
}



const mapStateToProps = state => (
    {
        auth: state.auth,
        tokenResend: state.forgotPassword.tokenResend,
        message: state.forgotPassword.message
    }
)

export default connect(mapStateToProps, {
    sendForgotPassRequest

})(withTranslation()(EmailInputScreen));
