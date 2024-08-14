import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';

import InputText from "../../Inputs/InputText";
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";
import InputService from "../../../Services/InputServices";
import { numberList, textToNumber, caseTypes, numberToText } from "../../../Services/NumberServices";

import {
    saveModelBlock,
    setModelBlockInputs,
    setModelBlockInputEmptyErrors,
    resetModelBlockInputEmptyErrors,
    setModelBlockInputErrorMessage,
} from "../../../Store/Actions/ModelBlockActions";
import CheckBox from "../../Inputs/CheckBox";
import DropdownList from "../../Inputs/DropdownList/DropdownList";
import ButtonSpinner from "../../Spinners/ButtonSpinner";


class AddBlock extends Component {
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

        this.props.resetModelBlockInputEmptyErrors();
        this.props.setModelBlockInputErrorMessage('');

        if (name === 'name') {
            this.props.setModelBlockInputs({ name: value });
            this.props.setModelBlockInputs({ slug: value === '' ? '' : this.props.selectedModel.slug + '_' + InputService.slug(value) });
        }
        if (name === 'slug') {
            this.props.setModelBlockInputs({ slug: '' });
        }

        this.setState({
            ...this.state,
            isFieldEmpty: false,
        })
    }

    setAsDefaultBlock() {
        this.props.setModelBlockInputs({
            is_default: this.props.inputs.is_default !== true
        });
    }

    hasInputsCases() {
        this.props.setModelBlockInputs({
            has_cases: this.props.inputs.has_cases !== true
        });
    }

    saveBlockHandler() {

        const { name, slug, is_default } = this.props.inputs;

        this.props.resetModelBlockInputEmptyErrors();
        this.props.setModelBlockInputErrorMessage('');

        let fieldEmpty = false;

        if (name === '') {
            fieldEmpty = true;
            this.props.setModelBlockInputEmptyErrors('isNameFieldEmpty');
        }

        if (slug === '') {
            fieldEmpty = true;
            this.props.setModelBlockInputEmptyErrors('isSlugFieldEmpty');
        }

        if (fieldEmpty) {
            this.props.setModelBlockInputErrorMessage('Name field should not be empty');
            return false;
        }

        let blockInputData = {
            name,
            slug,
            is_default,
            case_type: this.props.inputs.case_type,
            has_cases: this.props.inputs.has_cases,
            column_no: this.props.inputs.column_no,
        };
        blockInputData.is_default = is_default === '' || is_default === false ? 0 : 1;
        blockInputData.tool_id = this.props.selectedModelId;
        this.props.saveModelBlock(blockInputData);

    }

    typeChangeHandler(selectedValue) {
        this.props.setModelBlockInputs({ case_type: selectedValue });
    }

    columnChangeHandler(selectedValue) {
        this.props.setModelBlockInputs({ column_no: textToNumber[selectedValue] });
    }

    render() {
        const { t } = this.props;

        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';

        return (
            <div className="content-block-grey no-radius model_blocks">
                <div className="section-block">
                    <p><strong>{t('add_new_block')}</strong></p>
                    <form className="pl-0 pr-0">
                        <div className="form-row">
                            <div className="col-lg-2">
                                <label className="col-form-label" htmlFor="model_name">
                                    {t('name')}
                                </label>
                            </div>
                            <div className="col-lg-10">
                                <InputText
                                    fieldName="name"
                                    fieldClass="block_name"
                                    fieldID="block_name"
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
                                    fieldClass="block_slug"
                                    fieldID="block_slug"
                                    fieldPlaceholder=""
                                    isDisable="true"
                                    fieldValue={this.props.inputs.slug}
                                    fieldOnChange={this.onChangeHandler.bind(this)} />
                            </div>
                        </div>
                        <div className="row dd-no-margin">
                            <div className="col- col-xl-3">
                                <div className="form-row">
                                    <CheckBox
                                        checkUncheckHandler={this.setAsDefaultBlock.bind(this)}
                                        fieldValue={this.props.inputs.is_default}
                                        fieldName="is_default"
                                        text={t('set_as_default_block')} />
                                </div>
                            </div>
                            <div className="col- col-xl-3">
                                <div className="form-row">
                                    <CheckBox
                                        checkUncheckHandler={this.hasInputsCases.bind(this)}
                                        fieldValue={this.props.inputs.has_cases}
                                        fieldName="has_cases"
                                        text={t('has_different_cases')} />
                                </div>
                            </div>
                            <div className="col- col-xl-3">
                                <div className="form-row">
                                    <div className="col- col-xl-4 col-lg-4 col-md-5 col-sm-5">
                                        <label className="col-form-label mt-2" htmlFor="role_slug">
                                            {t('case_view')}
                                        </label>
                                    </div>
                                    <div className="col- col-xl-8 col-lg-8 col-md-7 col-sm-7">
                                        <DropdownList
                                            fieldName="case_type"
                                            data={caseTypes}
                                            selectedData={this.props.inputs.case_type}
                                            listChangeHandler={this.typeChangeHandler.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3">
                                <div className="form-row">
                                    <div className="col- col-xl-6 col-lg-6 col-md-7 col-sm-7">
                                        <label className="col-form-label mt-2" htmlFor="role_slug">
                                            {t('number_of_column')}
                                        </label>
                                    </div>
                                    <div className="col- col-xl-6 col-lg-6 col-md-5 col-sm-5">
                                        <DropdownList
                                            fieldName="number_of_column"
                                            data={numberList}
                                            selectedData={numberToText[this.props.inputs.column_no]}
                                            listChangeHandler={this.columnChangeHandler.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {errorMessage}

                        <div className="text-right mt-2 float-right">
                            <ButtonSpinner showSpinner={this.props.showSpinner} />
                            <SaveButtonSmall
                                buttonDisabled={this.props.showSpinner}
                                onClickHandler={this.saveBlockHandler.bind(this)}
                                name={t('save')} />
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    inputs: state.modelBlock.inputs,
    selectedModel: state.modelSettings.inputs,
    selectedModelId: state.modelSettings.inputs.id,
    inputErrors: state.modelBlock.inputErrors,
    emptyFields: state.modelBlock.emptyFields,
    showSpinner: state.modelBlock.showBlockSaveSpinner,
    allModels: state.modelSettings.data,
});


export default connect(mapStateToProps, {
    saveModelBlock,
    setModelBlockInputs,
    setModelBlockInputEmptyErrors,
    resetModelBlockInputEmptyErrors,
    setModelBlockInputErrorMessage,
})(AddBlock);

