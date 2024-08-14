import React, { Component } from 'react';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';
import './login.css';
import InputEmail from "../Inputs/InputEmail";
import InputPassword from "../Inputs/Password/InputPassword";
import TokenServices from "../../Services/TokenServices";
import LoginButton from "../Inputs/LoginButton";
import { connect } from 'react-redux';
import { getAuthUser, loginSucceeded, logLogout } from "../../Store/Actions/authActions";
import { setConfirmNavigationSwitch } from "../../Store/Actions/popupActions";
import { withTranslation } from 'react-i18next';
import { withAuth0 } from '@auth0/auth0-react';
import ButtonSpinner from '../Spinners/ButtonSpinner';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isEmailFieldEmpty: false,
            isPasswordFieldEmpty: false,
            isLoginFailed: {
                status: false,
                message: ''
            },
            buttonDisabled: false
        }
    }

    componentDidUpdate() {
        if (this.props.popup.confirmNavigationSwitch === false) {
            const currentRouteName = this.props.modelID;
            this.props.logLogout(currentRouteName);
            this.props.setConfirmNavigationSwitch(undefined);
        }
    }



    async formSubmitHandler(e) {
        e.preventDefault();
        const { email, password } = this.state;

        if (email === '') {
            this.setState({ ...this.state, isEmailFieldEmpty: true });
            return false;
        }

        if (password === '') {
            this.setState({ ...this.state, isPasswordFieldEmpty: true });
            return false;
        }

        this.setState({ ...this.state, buttonDisabled: true });

        try {
            const loginResponse = await axios.post('api/login', {
                email,
                password
            })


            TokenServices.saveToken(loginResponse.data.token);
            await this.props.getAuthUser(this.props.history);
            await this.props.loginSucceeded();

            this.setState({
                ...this.state,
                buttonDisabled: false
            });
            this.props.history.push({
                pathname: '/admin/dashboard',
                state: { from: 'login' }
            });

        } catch (error) {
            const errorMessage = error.response.data.error === "Unauthorized" ? 'email or password is wrong!' : error.response.data.error
            this.setState({
                ...this.state,
                buttonDisabled: false,
                isLoginFailed: {
                    status: true,
                    message: 'Error: ' + errorMessage
                }
            })
        }
    }

    onChangeHandler(inputFieldTexts) {
        const { name, value } = inputFieldTexts;
        this.setState({
            ...this.state,
            [name]: value,
            isEmailFieldEmpty: false,
            isPasswordFieldEmpty: false,
            isLoginFailed: {
                status: false,
                message: ''
            }
        })
    }

    lostPasswordHandler(e) {
        e.preventDefault();
        alert("lost Password Clicked");
        this.props.history.push('/admin/forgotPassword');
    }

    render() {

        const { user, isLoading, isAuthenticated } = this.props.auth0;

        if (isAuthenticated) {
            return <Redirect to="/admin/dashboard" />
        }

        return (
            <div className="d-flex justify-content-center mt-2">
                <ButtonSpinner showSpinner={true} />
            </div>);

        const { t } = this.props;

        let errorMessage = this.state.isLoginFailed.status === true ?
            <p className="at2_error_text">{this.state.isLoginFailed.message}</p> : '';

        //const buttonDisabledAttr = this.state.buttonDisabled === true ? 'disabled="true"' : "";
        const search = this.props.location.search;
        const success = new URLSearchParams(search).get('success');

        const removeAccountSuccess = this.props.spinner.removeAccountSpinner !== undefined && this.props.spinner.removeAccountSpinner === false;

        return (


            <div className="row h-100">
                <div className="col-lg-3 col-md-4 mx-auto align-self-center">
                    <div className="card rounded-lg-8 at2_login_card">
                        <div className="login_logo_panel">
                            <img src="/images/at2_logo.svg" alt="AquaTools2.0" className="logo login_page" />
                        </div>

                        {success && <div className="at2_harvest_date_text">
                            {t('forgot_password_success_message')}
                        </div>}

                        <form className="form-signin" onSubmit={e => this.formSubmitHandler(e)}>
                            <InputEmail
                                fieldName="email"
                                fieldPlaceholder={t('your_email_address')}
                                fieldValue={this.state.email}
                                isFieldEmpty={this.state.isEmailFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)}
                            />

                            <InputPassword
                                fieldName="password"
                                fieldPlaceholder={t('password')}
                                fieldValue={this.state.password}
                                isFieldEmpty={this.state.isPasswordFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)}
                            />

                            {errorMessage}
                            {removeAccountSuccess && <p className="at2_harvest_date_text">{t('account_successfully_removed')}</p>}

                            <LoginButton buttonDisabled={this.state.buttonDisabled} />
                        </form>
                        <div className="lost-password-panel">
                            <Link to="/admin/forgotPassword" className="nav-link menu-logout-icon"
                            >
                                {t('lost_password')}
                            </Link>

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
        popup: state.popup,
        page: state.page,
        modelID: state.modelScreen.tool_id,
        spinner: state.spinner,
    }
)

export default connect(mapStateToProps, {
    getAuthUser,
    loginSucceeded,
    setConfirmNavigationSwitch,
    logLogout,
})(withTranslation()(withAuth0(Login)));
