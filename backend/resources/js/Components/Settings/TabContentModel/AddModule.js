import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';

import InputText from "../../Inputs/InputText";
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";
import InputService from "../../../Services/InputServices";

import {
    saveModule,
    setModuleInputs,
    setModuleInputEmptyErrors,
    resetModuleInputEmptyErrors,
    setModuleInputErrorMessage,
} from "../../../Store/Actions/ModuleActions";
import { withTranslation } from 'react-i18next';


class AddModule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            isFieldEmpty: false,
            errorMessage: null,
        }
    }

    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;

        this.props.resetModuleInputEmptyErrors();
        this.props.setModuleInputErrorMessage('');

        if (name === 'name') {
            this.props.setModuleInputs({ name: value });
            this.props.setModuleInputs({ slug: InputService.slug(value) });
        }
        if (name === 'slug') {
            this.props.setModuleInputs({ slug: '' });
        }

        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }

    saveModuleHandler() {

        const { name, slug } = this.props.inputs;

        this.props.resetModuleInputEmptyErrors();
        this.props.setModuleInputErrorMessage('');

        let fieldEmpty = false;

        if (name === '') {
            fieldEmpty = true;
            this.props.setModuleInputEmptyErrors('isNameFieldEmpty');
        }

        if (slug === '') {
            fieldEmpty = true;
            this.props.setModuleInputEmptyErrors('isSlugFieldEmpty');
        }

        if (fieldEmpty) {
            this.props.setModuleInputErrorMessage('Name field should not be empty');
            return false;
        }

        let moduleData = this.props.inputs;
        moduleData.tool_id = this.props.selectedModelId;
        this.props.saveModule(moduleData);

    }

    render() {

        const { t } = this.props;

        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';

        return (
            <div className="content-block-grey no-radius model_blocks">
                <div className="section-block">
                    <p><strong>{t('add_new_module')}</strong></p>
                    <form className="pl-0 pr-0">
                        <div className="form-row">
                            <div className="col-lg-2">
                                <label className="col-form-label" htmlFor="module_name">
                                    {t('name')}
                                </label>
                            </div>
                            <div className="col-lg-10">
                                <InputText
                                    fieldName="name"
                                    fieldClass="module_name"
                                    fieldID="module_name"
                                    fieldPlaceholder=""
                                    fieldValue={this.props.inputs.name}
                                    isFieldEmpty={this.props.emptyFields.isNameFieldEmpty}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-lg-2">
                                <label className="col-form-label" htmlFor="role_slug">
                                    {t('slug')}
                                </label>
                            </div>
                            <div className="col-lg-10">
                                <InputText
                                    fieldName="slug"
                                    fieldClass="module_slug"
                                    fieldID="module_slug"
                                    fieldPlaceholder=""
                                    isDisable="true"
                                    fieldValue={this.props.inputs.slug}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />
                            </div>
                        </div>
                        {errorMessage}
                        <div className="text-right mt-2">
                            <SaveButtonSmall
                                onClickHandler={this.saveModuleHandler.bind(this)}
                                name={t('save')} />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    inputs: state.module.inputs,
    selectedModelId: state.modelSettings.inputs.id,
    inputErrors: state.module.inputErrors,
    emptyFields: state.module.emptyFields,
});


export default connect(mapStateToProps, {
    saveModule,
    setModuleInputs,
    setModuleInputEmptyErrors,
    resetModuleInputEmptyErrors,
    setModuleInputErrorMessage,
})(withTranslation()(AddModule));

