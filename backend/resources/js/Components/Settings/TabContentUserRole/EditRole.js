import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import axios from "axios";
import TokenServices from "../../../Services/TokenServices";
import { withTranslation } from 'react-i18next';

class EditRole extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
            buttonDisabled: false,
            hasFieldError: false,
            errorMessage: null,
        }
    }

    componentDidMount() {
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;

        if (name === 'name') {
            this.props.setEditedRoleData({
                name: value,
                slug: value.toLowerCase().split(' ').join('_')
            })
        } else {
            this.props.setEditedRoleData({
                name: this.props.inputs.name,
                slug: value,
            });
        }


        this.setState({
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
        });
    }

    saveRoleHandler() {

        const { name, slug } = this.props.inputs;

        if (name === '' || name === undefined) {
            this.setState({ ...this.state, isNameFieldEmpty: true });
            return false;
        }

        if (slug === '' || slug === undefined) {
            this.setState({ ...this.state, isSlugFieldEmpty: true });
            return false;
        }

        axios.post('api/role/update', {
            id: this.props.selectedRoleId,
            name,
            slug
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            }).then(response => {
                this.props.updateRoleData(response.data.data);
                this.setState({
                    ...this.state,
                    name: '',
                    slug: '',
                });
                this.props.showSuccessMessage('successfully_updated');
                this.props.hideRoleForms();
            }).catch(error => {
                this.setState({
                    ...this.state,
                    hasFieldError: true,
                    errorMessage: error.response.data.errors.name !== undefined ? error.response.data.errors.name : '' +
                        error.response.data.errors.slug !== undefined ? error.response.data.errors.slug : ''
                })
            });
    }

    cancelHandler() {
        this.props.hideRoleForms();
    }


    render() {

        const { t } = this.props;

        const errorMessage = this.state.hasFieldError === true ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={t('edit') + ' ' + t('role')}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                        <SaveButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                        <SaveButton
                            onClickHandler={this.saveRoleHandler.bind(this)}
                            name={t('save')}
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="role_name">
                                            {t('role_name')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="name"
                                            fieldClass="role_name"
                                            fieldID="role_name"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.name}
                                            isFieldEmpty={this.state.isNameFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="role_slug">
                                            {t('role_slug')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <InputText
                                            fieldName="slug"
                                            fieldClass="role_slug"
                                            fieldID="role_slug"
                                            fieldPlaceholder=""
                                            fieldValue={this.props.inputs.slug}
                                            isFieldEmpty={this.state.isSlugFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                    </div>
                                </div>
                                {errorMessage}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    data: state.role.data,
    selectedRoleId: state.role.selectedRoleId,
    inputs: state.role.inputs,
});

const mapDispatchToProps = dispatch => {
    return {
        updateRoleData: updatedRole => {
            dispatch({ type: 'UPDATE_ROLE_DATA', payload: updatedRole })
        },
        showSuccessMessage: message => {
            dispatch({ type: 'SHOW_NOTIFICATION_POPUP', payload: message });
            setTimeout(() => {
                dispatch({ type: 'HIDE_NOTIFICATION_POPUP' })
            }, 3000);
        },
        hideRoleForms: () => {
            dispatch({ type: 'HIDE_ADD_EDIT_ROLE' })
        },
        setEditedRoleData: selectedRole => {
            dispatch({ type: 'SET_ROLE_DATA', payload: selectedRole })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(EditRole));

