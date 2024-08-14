import React, { Component } from 'react';
import axios from 'axios';
import './login.css';
import InputEmail from "../Inputs/InputEmail";
import InputPassword from "../Inputs/Password/InputPassword";
import ResetButton from "../Inputs/ResetButton";
import EmailInputScreen from "./EmailInputScreen";
import TokenResendScreen from "./TokenResendScreen";
import PasswordInputScreen from "./PasswordInputScreen";
import TokenInputScreen from "./TokenInputScreen";

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

class ForgotPass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            resendMsg: ''
        }

        this.setSuccess = this.setSuccess.bind(this);
        this.setResendMsg = this.setResendMsg.bind(this);
    }


    componentDidMount() {
        console.log(this.props.history);
    }
    setSuccess() {

        this.setState({ success: true });
    }

    setResendMsg(msg) {

        this.setState({ resendMsg: msg });
    }

    render() {

        const { t } = this.props;

        const emailInputScreen = this.props.emailInputScreen;
        const tokenInputScreen = this.props.tokenInputScreen;
        const passwordInputScreen = this.props.passwordInputScreen;
        const tokenResendScreen = this.props.tokenResendScreen;



        return (

            <div className="container-fluid h-100">
                <div className="row h-100">
                    <div className="col-lg-3 col-md-4 mx-auto align-self-center">
                        <div className="card rounded-lg-8 at2_login_card">
                            <div className="login_logo_panel">
                                <img src="/images/at2_logo.svg" alt="AquaTools2.0" className="logo login_page" />
                            </div>


                            <br />

                            {emailInputScreen && <EmailInputScreen setResendMsg={this.setResendMsg} />}
                            {/* {tokenResendScreen && <TokenResendScreen />} */}
                            {tokenInputScreen && <TokenInputScreen resentMsg={this.state.resendMsg} />}
                            {passwordInputScreen && <PasswordInputScreen history={this.props.history} />}


                        </div>
                    </div>
                </div>
            </div>
        );


    }
}



const mapStateToProps = state => (
    {
        auth: state.auth,
        emailInputScreen: state.forgotPassword.emailInputScreen,
        tokenInputScreen: state.forgotPassword.tokenInputScreen,
        passwordInputScreen: state.forgotPassword.passwordInputScreen,
        tokenResendScreen: state.forgotPassword.tokenResendScreen
    }
)

export default connect(mapStateToProps, {

})(withTranslation()(ForgotPass));
