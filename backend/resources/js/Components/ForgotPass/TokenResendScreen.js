import React, { Component } from 'react';
import axios from 'axios';
import './login.css';
import InputEmail from "../Inputs/InputEmail";
import ResetButton from "../Inputs/ResetButton";
import { connect } from 'react-redux';
import { sendForgotPassRequest } from "../../Store/Actions/ForgotPasswordActions"
class TokenResendScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            isEmailFieldEmpty: false,
            buttonDisabled: false
        }
    }

    componentDidMount() {

    }

    async submitHandler(e) {
        e.preventDefault();


        const userData = {
            email: this.state.email,

        };
        this.props.sendForgotPassRequest(userData);

        return false;
    }



    onChangeHandler(inputFieldTexts) {
        const { name, value } = inputFieldTexts;
        this.setState({
            ...this.state,
            [name]: value

        })
    }



    render() {

        let buttonName = this.props.tokenResend === false || this.props.tokenResend === undefined ? 'Submit' : 'Resend Verification Code';

        let errorMessage = '';
        /*
        let errorMessage = this.state.isLoginFailed.status === true ?
            <p className="at2_error_text">{this.state.isLoginFailed.message}</p> : ''; */

        //const buttonDisabledAttr = this.state.buttonDisabled === true ? 'disabled="true"' : "";

        return (

            <div>
                <div><span className="reset-password">An unverified code has been found for the E-mail Address.
                Please click resend verification code button to continue resetting password</span></div>

                <form className="form-signin" onSubmit={e => this.submitHandler(e)}>




                    {errorMessage}

                    <ResetButton buttonName="Resend Verification Code" buttonDisabled={this.state.buttonDisabled} />

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

    }
)

export default connect(mapStateToProps, {
    sendForgotPassRequest

})(TokenResendScreen);
