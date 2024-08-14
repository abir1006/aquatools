import React, {Component} from 'react';
import {connect} from "react-redux";
import InputText from "../Inputs/InputText";
import SubmitButton from "../Inputs/SubmitButton";
import ListAutoComplete from "../Inputs/ListAutoComplete/ListAutoComplete";
import {companyList} from "../../Store/Actions/companyActions";
import {
    updateUser,
    setUserInputs,
    resetUserInputs,
    setUserInputsErrors,
    resetUserFieldsEmptyErrors,
    setUserFieldsEmptyErrors,
} from "../../Store/Actions/userActions";


class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFieldEmpty: false,
        }
        this.props.resetUserFieldsEmptyErrors();
        this.props.setUserInputsErrors('');
    }

    componentDidMount() {
        if (this.props.currentUserRole !== 'super_admin') {
            this.props.setUserInputs({company_id: this.props.currentUserCompany.id});
            this.props.setUserInputs({role_id: this.props.inputs.roles[0].id});
        }
    }

    onChangeHandler(inputTarget) {
        this.props.setUserInputsErrors('');
        const {name, value} = inputTarget;
        this.props.setUserInputs({[name]: value});
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

        delete this.props.inputs['password'];
        delete this.props.inputs['password_confirmation'];

        if (this.props.inputs.company_id === '' || this.props.inputs.company_id === null) {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isCompanyFieldEmpty');
        }

        if (this.props.inputs.role_id === '' || this.props.inputs.role_id === null) {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isRoleFieldEmpty');
        }

        if (this.props.inputs.first_name === '' || this.props.inputs.first_name === null) {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isFirstNameFieldEmpty');
        }

        if (this.props.inputs.last_name === '' || this.props.inputs.last_name === null) {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isLastNameFieldEmpty');
        }

        if (this.props.inputs.email === '' || this.props.inputs.email === null) {
            fieldEmpty = true;
            this.props.setUserFieldsEmptyErrors('isEmailFieldEmpty');
        }

        if (fieldEmpty) {
            this.props.setUserInputsErrors('Fields should not be empty');
            return false;
        }

        this.props.updateUser(this.props.inputs);

        return false;
    }

    companySelectHandler(name, id) {
        this.props.setUserInputs({company_id: id});
        this.props.setUserInputsErrors('');
        this.props.resetUserFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }

    roleSelectHandler(name, id) {
        this.props.setUserInputs({role_id: id});
        this.props.setUserInputsErrors('');
        this.props.resetUserFieldsEmptyErrors();
        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }


    render() {

        const {t} = this.props;

        let roles = this.props.allRoles;
        let companyList = this.props.allCompanies;
        let searchFieldDisabled = false;
        if (this.props.currentUserRole !== 'super_admin') {
            searchFieldDisabled = true;
            companyList = [{id: this.props.currentUserCompany.id, name: this.props.currentUserCompany.name}]
        }

        if (this.props.currentUserCompany.email === this.props.inputs.email) {
            searchFieldDisabled = true;
        }

        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';

        const companyId = this.props.inputs.company_id;
        const showSaveSpinner = this.props.showSaveSpinner === undefined ? false : this.props.showSaveSpinner;

        return (
            <div className="content-block mb-3">
                <form onSubmit={e => this.userSubmitHandler(e)} autoComplete="no">
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className="content-block-grey">
                                <div className="form_sub_heading">{t('edit') + ' ' + t('user')}</div>
                                <ListAutoComplete
                                    fieldDisabled={searchFieldDisabled}
                                    fieldId="company_id"
                                    fieldName="company_id"
                                    fieldPlaceHolder={t('select_company')}
                                    fieldOnClick={this.companySelectHandler.bind(this)}
                                    isFieldEmpty={this.props.emptyErrors.isCompanyFieldEmpty}
                                    selectedItemId={companyId}
                                    listData={companyList}/>

                                <ListAutoComplete
                                    fieldDisabled={searchFieldDisabled}
                                    fieldId="role_id"
                                    fieldName="role_id"
                                    fieldPlaceHolder={t('select_role')}
                                    fieldOnClick={this.roleSelectHandler.bind(this)}
                                    isFieldEmpty={this.props.emptyErrors.isRoleFieldEmpty}
                                    selectedItemId={this.props.inputs.roles[0].id}
                                    listData={roles}/>
                                <InputText
                                    fieldName="first_name"
                                    fieldClass="first_name"
                                    fieldID="first_name"
                                    fieldPlaceholder={t('first_name') + ' *'}
                                    fieldValue={this.props.inputs.first_name || ''}
                                    isFieldEmpty={this.props.emptyErrors.isFirstNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>
                                <InputText
                                    fieldName="last_name"
                                    fieldClass="last_name"
                                    fieldID="last_name"
                                    fieldPlaceholder={t('last_name') + ' *'}
                                    fieldValue={this.props.inputs.last_name || ''}
                                    isFieldEmpty={this.props.emptyErrors.isLastNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>

                                <InputText
                                    isDisable="true"
                                    fieldName="email"
                                    fieldClass="user_email"
                                    fieldID="user_email"
                                    fieldPlaceholder={t('email') + ' *'}
                                    fieldValue={this.props.inputs.email}
                                    isFieldEmpty={this.props.emptyErrors.isEmailFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)}/>

                            </div>
                            {errorMessage}
                            <div className="btn_wrapper">
                                <SubmitButton
                                    buttonDisabled={showSaveSpinner}
                                    btnText={t('update') + ' ' + t('user')}/>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    allCompanies: state.company.data,
    allRoles: state.role.data,
    inputErrors: state.user.inputErrors,
    emptyErrors: state.user.emptyErrors,
    inputs: state.user.inputs,
    currentUserRole: state.auth.data.user.roles[0].slug,
    currentUserRoleId: state.auth.data.user.roles[0].id,
    currentUserCompany: state.auth.data.user.company,
    showSaveSpinner: state.user.userSaveSpinner,
});


export default connect(mapStateToProps, {
    updateUser,
    companyList,
    setUserInputs,
    resetUserInputs,
    setUserInputsErrors,
    resetUserFieldsEmptyErrors,
    setUserFieldsEmptyErrors,
})(EditUser);
