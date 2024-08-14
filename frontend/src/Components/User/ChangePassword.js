import React, { Component } from 'react';
import { connect } from "react-redux";
import InputPassword from "../Inputs/Password/InputPassword";
import SubmitButton from "../Inputs/SubmitButton";
import { companyList } from "../../Store/Actions/companyActions";
import {
    saveUser,
    setUserInputs,
    resetUserInputs,
    setUserInputsErrors,
    resetUserFieldsEmptyErrors,
    setUserFieldsEmptyErrors,
    changePassword,
} from "../../Store/Actions/userActions";
import InputText from "../Inputs/InputText";


class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFieldEmpty: false,
        }
        this.props.resetUserFieldsEmptyErrors();
        this.props.setUserInputsErrors('');
    }

    componentDidMount() {
    }

    onChangeHandler(inputTarget) {
        this.props.setUserInputsErrors('');
        const { name, value } = inputTarget;
        this.props.setUserInputs({ [name]: value });
        this.props.resetUserFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }

    async submitChangePasswordHandler(e) {
        e.preventDefault();
        let fieldEmpty = false;

        this.props.setUserInputsErrors('');

        if (this.props.inputs.new_password === undefined || this.props.inputs.new_password === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isNewPasswordFieldEmpty');
        }

        if (this.props.inputs.confirm_new_password === undefined || this.props.inputs.confirm_new_password === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isConfirmNewPasswordFieldEmpty');
        }

        if (fieldEmpty) {
            await this.setState({
                ...this.state,
                isFieldEmpty: true,
            })
            return false;
        }

        const changePasswordData = {
            id: this.props.inputs.id,
            first_name: this.props.inputs.first_name,
            password: this.props.inputs.new_password,
            password_confirmation: this.props.inputs.confirm_new_password
        }

        this.props.changePassword(changePasswordData);

        return false;
    }


    render() {

        const { t } = this.props;

        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';
        const emptyMessage = this.state.isFieldEmpty === true ?
            <p className="at2_error_text">{t('fields_empty_message')}</p> : '';

        const inputNewPassword = this.props.inputs.new_password === undefined ? '' : this.props.inputs.new_password;
        const inputConfirmNewPassword = this.props.inputs.confirm_new_password === undefined ? '' : this.props.inputs.confirm_new_password;
        const isNewPasswordFieldEmpty = this.props.emptyErrors.isNewPasswordFieldEmpty === undefined || this.props.emptyErrors.isNewPasswordFieldEmpty === false ? false : this.props.emptyErrors.isNewPasswordFieldEmpty;
        const isConfirmNewPasswordFieldEmpty = this.props.emptyErrors.isConfirmNewPasswordFieldEmpty === undefined ? false : this.props.emptyErrors.isConfirmNewPasswordFieldEmpty;

        const userFirstName = this.props.inputs.first_name === undefined || this.props.inputs.first_name === null ? '' : this.props.inputs.first_name;
        const userLastName = this.props.inputs.last_name === undefined || this.props.inputs.last_name === null ? '' : this.props.inputs.last_name;
        const userFullName = userFirstName + ' ' + userLastName;

        const changePasswordSpinner = this.props.changePasswordSpinner === undefined ? false : this.props.changePasswordSpinner;

        return (
            <div className="content-block mb-3">
                <form onSubmit={e => this.submitChangePasswordHandler(e)} autoComplete="no">
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="content-block-grey">
                                <div className="form_sub_heading">{t('change_password')}</div>

                                <InputText
                                    isDisable="true"
                                    fieldValue={userFullName.trim() || ''} />

                                <InputText
                                    isDisable="true"
                                    fieldValue={this.props.inputs.email} />

                                <InputPassword
                                    fieldName="new_password"
                                    fieldPlaceholder={t('new_password') + ' *'}
                                    fieldValue={inputNewPassword}
                                    isFieldEmpty={isNewPasswordFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />

                                <InputPassword
                                    fieldName="confirm_new_password"
                                    fieldPlaceholder={t('confirm_new_password') + ' *'}
                                    fieldValue={inputConfirmNewPassword}
                                    isFieldEmpty={isConfirmNewPasswordFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />

                            </div>
                            {errorMessage}
                            {emptyMessage}
                            <div className="btn_wrapper">
                                <SubmitButton
                                    buttonDisabled={changePasswordSpinner}
                                    btnText={t('update_password')} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    inputErrors: state.user.inputErrors,
    emptyErrors: state.user.emptyErrors,
    inputs: state.user.inputs,
    changePasswordSpinner: state.user.changePasswordSpinner,
});


export default connect(mapStateToProps, {
    saveUser,
    companyList,
    setUserInputs,
    resetUserInputs,
    setUserInputsErrors,
    resetUserFieldsEmptyErrors,
    setUserFieldsEmptyErrors,
    changePassword,
})(ChangePassword);
