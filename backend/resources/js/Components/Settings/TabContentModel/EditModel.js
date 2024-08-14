import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import CancelButton from "../../Inputs/CancelButton";

import {
    hideModelForms,
    setModelInputs,
    setModelInputEmptyErrors,
    resetModelInputEmptyErrors,
    setModelInputErrorMessage,
    updateModel,
} from "../../../Store/Actions/ModelActions";
import InputTextarea from '../../Inputs/InputTextarea';
import { Editor } from '@tinymce/tinymce-react';


class EditModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            isFieldEmpty: false,
            errorMessage: null,
        }
    }

    componentDidMount() {
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;

        this.props.resetModelInputEmptyErrors();
        this.props.setModelInputEmptyErrors('');

        if (name === 'name') {
            this.props.setModelInputs({ name: value });
        }

        if (name === 'details') {
            this.props.setModelInputs({ details: value });
        }


    }

    onEditorChangeHandler(content, editor) {

        this.props.setModelInputs({ details: content });
    }

    async updateModelHandler() {

        this.props.resetModelInputEmptyErrors();
        this.props.setModelInputErrorMessage('');

        const { name, slug } = this.props.inputs;

        let fieldEmpty = false;

        if (name === '') {
            fieldEmpty = true;
            this.props.setModelInputEmptyErrors('isNameFieldEmpty');
        }

        if (fieldEmpty) {
            this.props.setModelInputErrorMessage('Field should not be empty');
            return false;
        }

        // proceed to model update API
        this.props.updateModel(this.props.inputs)

    }

    cancelHandler() {
        this.props.hideModelForms();
    }


    render() {
        const { t } = this.props;
        const errorMessage = this.props.inputErrors !== '' ?
            <p className="at2_error_text">{this.props.inputErrors}</p> : '';

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={t('edit') + ' ' + t('model')}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                        <CancelButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                        <SaveButton
                            onClickHandler={this.updateModelHandler.bind(this)}
                            name={t('update')}
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <div className="col-lg-12">
                                <div className="card block-card">
                                    <form>
                                        <div className="form-row">
                                            <div className="col-lg-2">
                                                <label className="col-form-label" htmlFor="model_name">
                                                    {t('model_name')}
                                                </label>
                                            </div>
                                            <div className="col-lg-10">
                                                <InputText
                                                    fieldName="name"
                                                    fieldClass="model_name"
                                                    fieldID="model_name"
                                                    fieldPlaceholder=""
                                                    fieldValue={this.props.inputs.name}
                                                    isFieldEmpty={this.props.emptyFields.isNameFieldEmpty}
                                                    fieldOnChange={this.onChangeHandler.bind(this)} />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="col-lg-2">
                                                <label className="col-form-label" htmlFor="role_slug">
                                                    {t('model_slug')}
                                                </label>
                                            </div>
                                            <div className="col-lg-10">
                                                <InputText
                                                    isDisable="true"
                                                    fieldName="slug"
                                                    fieldClass="role_slug"
                                                    fieldID="role_slug"
                                                    fieldPlaceholder=""
                                                    fieldValue={this.props.inputs.slug}
                                                    isFieldEmpty={this.props.emptyFields.isSlugFieldEmpty}
                                                    fieldOnChange={this.onChangeHandler.bind(this)} />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="col-lg-2">
                                                <label className="col-form-label" htmlFor="role_slug">
                                                    About {this.props.inputs.name} Model
                                                </label>
                                            </div>
                                            <div className="col-lg-10">


                                                <Editor
                                                    value={this.props.inputs.details || ''}
                                                    init={{
                                                        height: 300,
                                                        menubar: false,
                                                        plugins: ["image"],
                                                        toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
                                                        toolbar2: "image | media | cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor code | insertdatetime preview | forecolor backcolor",
                                                        images_upload_url: '/api/tool/upload',
                                                        convert_urls: false,
                                                        file_picker_type: 'image',
                                                        automatic_uploads: true,
                                                        file_picker_callback: function (cb, value, meta) {
                                                            const input = document.createElement('input');
                                                            input.setAttribute('type', 'file');
                                                            input.setAttribute('accept', 'image/*');
                                                            input.onchange = function () {
                                                                var file = this.files[0];
                                                                var reader = new FileReader();
                                                                reader.readAsDataURL(file);
                                                                reader.onload = function () {
                                                                    var id = 'blobid' + (new Date()).getTime();
                                                                    var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                                                    var base64 = reader.result.split(',')[1];
                                                                    var blobInfo = blobCache.create(id, file, base64);
                                                                    blobCache.add(blobInfo);

                                                                    /* call the callback and populate the Title field with the file name */
                                                                    cb(blobInfo.blobUri(), { title: file.name });
                                                                }
                                                            }
                                                            input.click();
                                                        }

                                                    }}
                                                    onEditorChange={this.onEditorChangeHandler.bind(this)}
                                                />

                                            </div>
                                        </div>


                                        {errorMessage}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    inputs: state.modelSettings.inputs,
    emptyFields: state.modelSettings.emptyFields,
    inputErrors: state.modelSettings.inputErrors,
});

export default connect(mapStateToProps, {
    hideModelForms,
    setModelInputs,
    setModelInputEmptyErrors,
    setModelInputErrorMessage,
    resetModelInputEmptyErrors,
    updateModel,
})(EditModel);

