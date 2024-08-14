import React, { Component } from 'react';
import axios from 'axios';
import './login.css';
import InputText from "../Inputs/InputText";
import ResetButton from "../Inputs/ResetButton";
import { connect } from 'react-redux';
import { sendTokenVerificationRequest, sendResendCodeRequest } from "../../Store/Actions/ForgotPasswordActions"
import SaveButton from '../Inputs/SaveButton';
import { withTranslation } from 'react-i18next';
class TokenInputScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token_input: '',
            isTokenFieldEmpty: false,
            isSubmitted: false,
            errorMsg: '',
            resendSentMsg: ''
        }
        //this.reSendCode = this.reSendCode.bind(this);
    }

    componentDidMount() {

    }

    async reSendCode() {

        const userData = {
            email: this.props.email,
        };


        this.props.sendResendCodeRequest(userData)
            .then((response) => {
                console.log(response);
                this.setState({ resendSentMsg: response.data.message });
            })
            .catch((err) => {
                console.log(err);
            });

    }

    async submitHandler(e) {
        e.preventDefault();

        this.setState({ isSubmitted: true, errorMsg: '' });

        if (this.state.token_input === '') {

            this.setState({
                ...this.state,
                isTokenFieldEmpty: true,
            })

            return false;
        }


        const userData = {
            email: this.props.email,
            verification_code: this.state.token_input

        };

        this.props.sendTokenVerificationRequest(userData)
            .then(() => {
                this.setState({ isSubmitted: false });
            })
            .catch((err) => {
                this.setState({ isSubmitted: false, errorMsg: err.data.message });
            });


    }



    onChangeHandler(inputFieldTexts) {

        const { name, value } = inputFieldTexts;
        const isEmpty = Boolean(value) ? false : true;

        this.setState({
            ...this.state,
            [name]: value,
            isTokenFieldEmpty: isEmpty

        })
    }



    render() {

        const { t } = this.props;

        return (
            <div>

                {this.state.resendSentMsg && <div className="at2_harvest_date_text">
                    {/* {this.state.resendSentMsg} */}
                    {t('forgot_password_unused_code_message')}
                    <br /><br /></div>}

                {this.props.resentMsg && !this.state.resendSentMsg && <div className="at2_harvest_date_text">
                    {/* {this.props.resentMsg} */}
                    {t('forgot_password_unused_code_message')}
                    {/* <button className="btn" onClick={e => this.reSendCode(e)}>Resent</button> */}
                    <SaveButton name={t('resend')} onClickHandler={this.reSendCode.bind(this)} buttonDisabled={this.state.isSubmitted} />
                    <br /><br /></div>}


                {this.props.message && <div className="at2_harvest_date_text">
                    {/* {this.props.message}  */}
                    {t('forgot_password_email_request_success')}
                    <br /><br /></div>}

                <div><span className="reset-password">{t('enter_code')}</span></div>

                <form className="form-signin" onSubmit={e => this.submitHandler(e)}>

                    <div className="form-row">

                        <div className="col-12 col-lg-12">
                            <InputText
                                fieldName="token_input"
                                fieldClass="token_input"
                                fieldID="token_input"
                                fieldPlaceholder=""
                                fieldValue={this.state.token_input}
                                isFieldEmpty={this.state.isTokenFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                    </div>


                    {this.state.errorMsg && <p className="at2_error_text">{this.state.errorMsg} <br /></p>}

                    <ResetButton buttonName={t('verify')} buttonDisabled={this.state.isSubmitted} />

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
    sendTokenVerificationRequest,
    sendResendCodeRequest

})(withTranslation()(TokenInputScreen));
