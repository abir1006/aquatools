import React, { Component } from 'react';
import { connect } from "react-redux";
import InputText from "../Inputs/InputText";
import InputPassword from "../Inputs/Password/InputPassword";
import SubmitButton from "../Inputs/SubmitButton";
import ListAutoComplete from "../Inputs/ListAutoComplete/ListAutoComplete";
import { companyList } from "../../Store/Actions/companyActions";
import {
    saveUser,
    setUserInputs,
    resetUserInputs,
    setUserInputsErrors,
    resetUserFieldsEmptyErrors,
    setUserFieldsEmptyErrors,
} from "../../Store/Actions/userActions";


class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFieldEmpty: false,
        }
        this.props.resetUserInputs();
        this.props.resetUserFieldsEmptyErrors();
        this.props.setUserInputsErrors('');
    }

    componentDidMount() {
        if (this.props.currentUserRole !== 'super_admin') {
            this.props.setUserInputs({ company_id: this.props.currentUserCompany.id });
            const companyUser = this.props.roles.filter(role => role.name === 'Company User')
            this.props.setUserInputs({ role_id: companyUser[0].id });
        }
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

    async userSubmitHandler(e) {
        e.preventDefault();
        let fieldEmpty = false;

        this.props.setUserInputsErrors('');

        if (this.props.inputs.company_id === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isCompanyFieldEmpty');
        }

        if (this.props.inputs.role_id === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isRoleFieldEmpty');
        }

        if (this.props.inputs.first_name === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isFirstNameFieldEmpty');
        }

        if (this.props.inputs.last_name === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isLastNameFieldEmpty');
        }

        if (this.props.inputs.email === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isEmailFieldEmpty');
        }

        if (this.props.inputs.password === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isPasswordFieldEmpty');
        }

        if (this.props.inputs.password_confirmation === '') {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isConfirmPasswordFieldEmpty');
        }

        if (fieldEmpty) {
            await this.setState({
                ...this.state,
                isFieldEmpty: true,
            })
            return false;
        }

        this.props.saveUser(this.props.inputs);

        return false;
    }

    companySelectHandler(name, id) {
        this.props.setUserInputs({ company_id: id });
        this.props.setUserInputsErrors('');
        this.props.resetUserFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }

    roleSelectHandler(name, id) {
        this.props.setUserInputs({ role_id: id });
        this.props.setUserInputsErrors('');
        this.props.resetUserFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }


    render() {

        const { t } = this.props;

        let roles = this.props.roles;
        let companyList = this.props.companies;
        let searchFieldDisabled = false;
        if (this.props.currentUserRole !== 'super_admin') {
            searchFieldDisabled = true;
            companyList = [{ id: this.props.currentUserCompany.id, name: this.props.currentUserCompany.name }]
            roles = roles.filter(role => role.name === 'Company User');
        }

        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';
        const emptyMessage = this.state.isFieldEmpty === true ?
            <p className="at2_error_text">{t('fields_empty_message')}</p> : '';

        const companyId = this.props.currentUserRole === 'super_admin' ? '' : this.props.inputs.company_id;
        const selectedRoleId = this.props.currentUserRole === 'super_admin' ? '' : roles[0].id;

        const showSaveSpinner = this.props.showSaveSpinner === undefined ? false : this.props.showSaveSpinner;

        return (
            <div className="content-block mb-3">
                <form onSubmit={e => this.userSubmitHandler(e)} autoComplete="no">
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="content-block-grey">
                                <div className="form_sub_heading">{t('add') + ' ' + t('user')}</div>
                                <ListAutoComplete
                                    fieldDisabled={searchFieldDisabled}
                                    fieldId="company_id"
                                    fieldName="company_id"
                                    fieldPlaceHolder={t('select_company')}
                                    fieldOnClick={this.companySelectHandler.bind(this)}
                                    isFieldEmpty={this.props.emptyErrors.isCompanyFieldEmpty}
                                    selectedItemId={companyId}
                                    listData={companyList} />

                                <ListAutoComplete
                                    fieldDisabled={searchFieldDisabled}
                                    fieldId="role_id"
                                    fieldName="role_id"
                                    fieldPlaceHolder={t('select_role')}
                                    fieldOnClick={this.roleSelectHandler.bind(this)}
                                    isFieldEmpty={this.props.emptyErrors.isRoleFieldEmpty}
                                    selectedItemId={selectedRoleId}
                                    listData={roles} />
                                <InputText
                                    fieldName="first_name"
                                    fieldClass="first_name"
                                    fieldID="first_name"
                                    fieldPlaceholder={t('first_name') + ' *'}
                                    fieldValue={this.props.inputs.first_name}
                                    isFieldEmpty={this.props.emptyErrors.isFirstNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />
                                <InputText
                                    fieldName="last_name"
                                    fieldClass="last_name"
                                    fieldID="last_name"
                                    fieldPlaceholder={t('last_name') + ' *'}
                                    fieldValue={this.props.inputs.last_name}
                                    isFieldEmpty={this.props.emptyErrors.isLastNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />

                                <InputText
                                    fieldName="email"
                                    fieldClass="user_email"
                                    fieldID="user_email"
                                    fieldPlaceholder={t('email') + ' *'}
                                    fieldValue={this.props.inputs.email}
                                    isFieldEmpty={this.props.emptyErrors.isEmailFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />

                                <InputPassword
                                    fieldName="password"
                                    fieldPlaceholder={t('password') + ' *'}
                                    fieldValue={this.props.inputs.password}
                                    isFieldEmpty={this.props.emptyErrors.isPasswordFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />

                                <InputPassword
                                    fieldName="password_confirmation"
                                    fieldPlaceholder={t('confirmed_password') + ' *'}
                                    fieldValue={this.props.inputs.password_confirmation}
                                    isFieldEmpty={this.props.emptyErrors.isConfirmPasswordFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />

                            </div>
                            {errorMessage}
                            {emptyMessage}
                            <div className="btn_wrapper">
                                <SubmitButton
                                    buttonDisabled={showSaveSpinner}
                                    btnText={t('save') + ' ' + t('user')} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    companies: state.company.data,
    roles: state.role.data,
    inputErrors: state.user.inputErrors,
    emptyErrors: state.user.emptyErrors,
    inputs: state.user.inputs,
    currentUserRole: state.auth.data.user.roles[0].slug,
    currentUserRoleId: state.auth.data.user.roles[0].id,
    currentUserCompany: state.auth.data.user.company,
    showSaveSpinner: state.user.userSaveSpinner,
});


export default connect(mapStateToProps, {
    saveUser,
    companyList,
    setUserInputs,
    resetUserInputs,
    setUserInputsErrors,
    resetUserFieldsEmptyErrors,
    setUserFieldsEmptyErrors,
})(AddUser);
