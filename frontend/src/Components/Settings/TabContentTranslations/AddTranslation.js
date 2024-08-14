import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import SubmitButton from "../../Inputs/SubmitButton";

import {
    hideTranslationForms, saveTranslation
} from "../../../Store/Actions/TranslationsActions";


class AddTranslation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            key: '',
            text: {},
            errors: {}
        }
    }


    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;

        const { errors, text } = this.state;

        if (name === 'key') {
            if (!Boolean(value.trim()))
                errors[name] = 'field is required';
            else
                delete errors[name];

            this.setState({
                [name]: value,
                errors: errors,
            });
        } else {

            text[name] = value;

            if (!Boolean(value.trim()) && (name === this.props.languages.find(x => x.default == true)?.code))
                errors[name] = 'field is required';
            else
                delete errors[name];

            this.setState({
                text: text,
                errors: errors,
            });
        }

    }

    saveHandler(e) {

        e.preventDefault();

        const { key, text, errors } = this.state;
        let error = false;
        if (key.trim() === '') {
            errors.key = 'field is required';
            error = true;
            this.setState({ errors: errors })

        }

        const defaultCode = this.props.languages.find(x => x.default == true)?.code;
        if (!(defaultCode in text) || !Boolean(text[defaultCode].trim())) {
            errors[defaultCode] = 'field is required';
            error = true;
            this.setState({ errors: errors })

        }
        if (error)
            return false;


        this.setState({ isSubmitted: true })

        const data = {
            key: key,
            text: text
        };
        this.props.saveTranslation(data).then(response => {
            this.setState({
                isSubmitted: false,
                key: '',
                text: {},
                errors: {}
            });
        }).catch(error => {
            console.log(error)
            errors.key = error?.data?.key[0];
            this.setState({
                isSubmitted: false,
                errors: errors
            });
        })

    }

    cancelHandler() {
        this.props.hideTranslationForms();
    }



    render() {
        const errorMessage = this.state.hasFieldError === true ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        const { errors } = this.state;

        return (
            <div className="edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading="Add new translation"
                            tabSubHeading="" />
                    </div>

                    <div className="col-lg-12">
                        <div className="card block-card">

                            <form onSubmit={e => this.saveHandler(e)}>
                                <div className="form-row">

                                    <div className="col">
                                        <InputText
                                            fieldName="key"
                                            fieldClass="trans_key"
                                            fieldID="trans_key"
                                            fieldPlaceholder="Key"
                                            fieldValue={this.state.key}
                                            isFieldEmpty={this.state.isKeyFieldEmpty}
                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                        {'key' in errors && <p className="at2_error_text">{errors.key}</p>}
                                    </div>

                                    {
                                        this.props.languages.map((lang, i) => {
                                            const placeholder = lang.name + (lang.default == true ? ' (Default)' : '');
                                            return (
                                                <>
                                                    <div className="col" key={lang.code}>
                                                        <InputText
                                                            fieldName={lang.code}
                                                            fieldClass="lang"
                                                            fieldID={lang.code}
                                                            fieldPlaceholder={placeholder}
                                                            fieldValue={lang.code in this.state.text ? this.state.text[lang.code] : ''}
                                                            fieldOnChange={this.onChangeHandler.bind(this)} />
                                                        {lang.code in errors && <p className="at2_error_text w-100">{errors[lang.code]}</p>}
                                                    </div>

                                                </>
                                            );
                                        })
                                    }

                                    <div className="col-3 text-right add_trans_actions">


                                        <SubmitButton
                                            buttonDisabled={this.state.isSubmitted}
                                            btnText="Save" />

                                        <SaveButton
                                            onClickHandler={this.cancelHandler.bind(this)}
                                            name="Cancel"
                                        />
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
    auth: state.auth,
    page: state.page,
    languages: state.translations.languages
});


export default connect(mapStateToProps, {
    hideTranslationForms,
    saveTranslation
})(AddTranslation);

