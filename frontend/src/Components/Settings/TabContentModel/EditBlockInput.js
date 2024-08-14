import React, { Component } from 'react';
import { connect } from "react-redux";
import '../Settings.css';
import InputText from "../../Inputs/InputText";
import ButtonSpinner from "../../Spinners/ButtonSpinner";
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";
import axios from "axios";
import TokenService from "../../../Services/TokenServices";
import { Multiselect } from "multiselect-react-dropdown";
import CheckBox from "../../Inputs/CheckBox";
import InputNumber from "../../Inputs/InputNumber";
import { withTranslation } from 'react-i18next';

class EditBlockInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                name: false,
                slug: '',
                help_text: false,
                default_data: false,
                company_id: [],
                selectedCompanies: [],
                line_divider: null,
                range_slider: null,
                min_value: false,
                max_value: false,
                divided_by: false,
            },
            companySelected: false,
            buttonDisabled: false,
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
            isDefaultDataFieldEmpty: false,
            errorMessage: '',
            showBlockSettings: false,
            showSpinner: false,
            helpText: {},
            translations: []
        }
    }

    async componentDidMount() {
        const { t, i18n } = this.props;
        const { helpText, translations, inputs } = this.state;
        const key = this.getHelpFieldKey();

        this.props.languages.forEach(({ name, code }) => {
            translations[code] = i18n.getDataByLanguage(code)?.translations;
            helpText[code] = translations[code][key];
        });

        inputs.help_text = key;

        await this.setState({
            helpText: helpText,
            inputs: inputs,
            translations: translations
        });
    }

    async setRangeSlider() {
        const rangeSlider = this.props.blockInput.range_slider === 0;
        await this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                range_slider: this.state.inputs.range_slider === null ? rangeSlider : this.state.inputs.range_slider !== true,
            }
        })
    }

    async setLineDivider() {
        const lineDivider = this.props.blockInput.line_divider === 0;
        await this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                line_divider: this.state.inputs.line_divider === null ? lineDivider : this.state.inputs.line_divider !== true,
            }
        })
    }

    async onChangeHandler(inputTargets) {

        const { name, value } = inputTargets;

        if (name === 'slug') {
            await this.setState({
                ...this.state,
                isSlugFieldEmpty: false,
                errorMessage: '',
                inputs: {
                    ...this.state.inputs,
                    slug: ''
                }
            });
        } else if (name === 'name') {
            await this.setState({
                ...this.state,
                errorMessage: '',
                isNameFieldEmpty: false,
                inputs: {
                    ...this.state.inputs,
                    name: value,
                }
            });
        } else {
            await this.setState({
                ...this.state,
                errorMessage: '',
                isSlugFieldEmpty: false,
                isNameFieldEmpty: false,
                isDefaultDataFieldEmpty: false,
                inputs: {
                    ...this.state.inputs,
                    [name]: value
                }
            });
        }
    }

    async updateBlockInput() {

        const fieldName = this.state.inputs.name === false || this.state.inputs.name === undefined ? this.props.blockInput.name : this.state.inputs.name;
        const rangeSlider = this.state.inputs.range_slider === null || this.state.inputs.range_slider === undefined ? this.props.blockInput.range_slider : this.state.inputs.range_slider;
        const lineDivider = this.state.inputs.line_divider === null || this.state.inputs.line_divider === undefined ? this.props.blockInput.line_divider : this.state.inputs.line_divider;
        const fieldSlug = this.props.blockInput.slug;
        const fieldDefaultData = this.state.inputs.default_data === false || this.state.inputs.default_data === undefined ? this.props.blockInput.default_data : this.state.inputs.default_data;
        const fieldHelpText = this.state.inputs.help_text === false || this.state.inputs.help_text === undefined ? this.props.blockInput.help_text : this.state.inputs.help_text;
        const fieldMinValue = this.state.inputs.min_value === false || this.state.inputs.min_value === undefined ? this.props.blockInput.min_value : this.state.inputs.min_value;
        const fieldMaxValue = this.state.inputs.max_value === false || this.state.inputs.max_value === undefined ? this.props.blockInput.max_value : this.state.inputs.max_value;
        const dividedBy = this.state.inputs.divided_by === false || this.state.inputs.divided_by === undefined ? this.props.blockInput.divided_by : this.state.inputs.divided_by;
        const companyIDs = this.state.companySelected === true ? this.state.inputs.company_id : this.props.blockInput.company_id;


        if (fieldName === '') {
            await this.setState({
                ...this.state,
                isNameFieldEmpty: true,
                errorMessage: 'Field should not be empty',
            });
            return false;
        }

        const updatedBlockInputData = {
            id: this.props.blockInput.id,
            name: fieldName,
            slug: fieldSlug,
            default_data: fieldDefaultData,
            help_text: this.state.inputs.help_text,
            range_slider: rangeSlider,
            min_value: fieldMinValue,
            max_value: fieldMaxValue,
            divided_by: dividedBy,
            company_id: companyIDs,
            line_divider: lineDivider,
            helpText: this.state.helpText,
        }

        await this.setState({
            ...this.state,
            showSpinner: true,
        })

        try {
            const inputUpdateResponse = await axios.put(
                'api/block_input/update',
                updatedBlockInputData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                });

            // response
            // send updated data to parent component
            this.props.updateBlockInput(inputUpdateResponse.data.data);
            await this.setState({
                ...this.state,
                showSpinner: false,
                isNameFieldEmpty: false,
                isSlugFieldEmpty: false,
                isDefaultDataFieldEmpty: false,
            });


        } catch (error) {
            await this.setState({
                ...this.state,
                showSpinner: false,
            });
            const errorsObj = error.response.data.errors;
            const errorMessage = errorsObj[Object.keys(errorsObj)[0]];

            if (Object.keys(errorsObj)[0] === 'name') {
                await this.setState({
                    ...this.state,
                    isNameFieldEmpty: true,
                    errorMessage: errorMessage
                })
            }

            if (Object.keys(errorsObj)[0] === 'default_data') {
                await this.setState({
                    ...this.state,
                    isDefaultDataFieldEmpty: true,
                    errorMessage: errorMessage
                })
            }
        }

    }

    async companySelectHandler(selectedList, selectedItem) {
        const companyIds = [];
        Object.keys(selectedList).map(key => {
            companyIds.push(selectedList[key].id)
        });
        await this.setState({
            ...this.state,
            errorMessage: '',
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
            isDefaultDataFieldEmpty: false,
            companySelected: true,
            inputs: {
                ...this.state.inputs,
                company_id: companyIds,
                selectedCompanies: selectedList,
            }
        })
    }

    async companyRemoveHandler(selectedList, removedItem) {
        const companyIds = [];
        Object.keys(selectedList).map(key => {
            companyIds.push(selectedList[key].id)
        });
        await this.setState({
            ...this.state,
            errorMessage: '',
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
            isDefaultDataFieldEmpty: false,
            companySelected: true,
            inputs: {
                ...this.state.inputs,
                company_id: companyIds,
                selectedCompanies: selectedList,
            }
        })
    }

    async onChangHelpText(inputTargets) {
        const { name, value, id } = inputTargets;
        const { helpText } = this.state;
        helpText[id] = value;
        await this.setState({
            helpText: helpText
        });
    }

    getHelpFieldKey() {

        const { name, help_text } = this.props.blockInput;

        return 'help_' + name;

    }
    renderHelpFields() {

        let { helpText } = this.state;

        const key = this.getHelpFieldKey();
        return this.props.languages.map(lang => {

            const { name, code } = lang;

            return (
                <div className="d-flex justify-context-center align-items-center">
                    <div className="mr-2 mb-2" style={{ minWidth: '50px' }}>{name}</div>
                    <div className="flex-fill">
                        <InputText
                            key={code}
                            fieldName={key}
                            fieldClass="help_text"
                            fieldID={code}
                            fieldPlaceholder="Help Text"
                            fieldValue={helpText[code]}
                            fieldOnChange={this.onChangHelpText.bind(this)} />
                    </div>
                </div>
            )
        });
    }
    render() {

        const { t, i18n } = this.props;

        const errorMessage = this.state.errorMessage !== '' ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        const fieldName = this.state.inputs.name === false ? this.props.blockInput.name : this.state.inputs.name;
        const fieldRangeSlider = this.state.inputs.range_slider === null || this.state.inputs.range_slider === undefined ? this.props.blockInput.range_slider === 1 : this.state.inputs.range_slider;
        const fieldLineDivider = this.state.inputs.line_divider === null || this.state.inputs.line_divider === undefined ? this.props.blockInput.line_divider === 1 : this.state.inputs.line_divider;
        const fieldMinValue = this.state.inputs.min_value === false || this.state.inputs.min_value === undefined ? this.props.blockInput.min_value : this.state.inputs.min_value;
        const fieldMaxValue = this.state.inputs.max_value === false || this.state.inputs.max_value === undefined ? this.props.blockInput.max_value : this.state.inputs.max_value;
        const dividedBy = this.state.inputs.divided_by === false || this.state.inputs.divided_by === undefined ? this.props.blockInput.divided_by : this.state.inputs.divided_by;
        const fieldDefaultData = this.state.inputs.default_data === false ? this.props.blockInput.default_data : this.state.inputs.default_data;
        const fieldHelpText = this.state.inputs.help_text === false ? this.props.blockInput.help_text : this.state.inputs.help_text;
        const companyList = this.props.companies;
        const fieldCompanyID = this.props.blockInput.company_id;

        let countKey = 0;

        let inputFieldCompanies = [];

        if (fieldCompanyID !== null) {
            companyList.map(company => {
                if (fieldCompanyID[countKey] === company.id) {
                    inputFieldCompanies[countKey] = { id: company.id, name: company.name }
                    countKey++;
                }
            })
        }

        const selectedCompanyList = this.state.companySelected === true ? this.state.inputs.selectedCompanies : inputFieldCompanies;


        return (
            <div className="section-block">
                <form className="pl-0 pr-0">
                    <div className="form-row">
                        <div className="col- col-xl-8 col-lg-8 col-md-7 col-sm-6">
                            <InputText
                                fieldName="name"
                                fieldClass="block_name"
                                fieldID="block_name"
                                fieldPlaceholder="Field Name"
                                fieldValue={fieldName}
                                isFieldEmpty={this.state.isNameFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-5 col-sm-6">
                            <CheckBox
                                checkUncheckHandler={this.setRangeSlider.bind(this)}
                                fieldValue={fieldRangeSlider}
                                fieldName="range_slider"
                                text="Include Range Slider?" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col- col-xl-8 col-lg-8 col-md-7 col-sm-6">
                            <InputText
                                isDisable="true"
                                fieldName="slug"
                                fieldClass="block_slug"
                                fieldID="block_slug"
                                fieldPlaceholder=""
                                fieldValue={this.props.blockInput.slug}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-5 col-sm-6">
                            <CheckBox
                                checkUncheckHandler={this.setLineDivider.bind(this)}
                                fieldValue={fieldLineDivider}
                                fieldName="line_divider"
                                text="Add line divider?" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-4">
                            <InputNumber
                                fieldName="min_value"
                                fieldClass="block_min_value"
                                fieldID="block_min_value"
                                fieldPlaceholder="Min value"
                                fieldValue={fieldMinValue}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-4">
                            <InputNumber
                                fieldName="max_value"
                                fieldClass="block_max_value"
                                fieldID="block_max_value"
                                fieldPlaceholder="Max value"
                                fieldValue={fieldMaxValue}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-4">
                            <InputNumber
                                fieldName="divided_by"
                                fieldClass="block_divided_by"
                                fieldID="block_divided_by"
                                fieldPlaceholder="Divided by"
                                fieldValue={dividedBy}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-lg-12">

                            {this.renderHelpFields()}
                            {!Boolean(this.props.blockInput.help_text) && Boolean(i18n.exists(this.getHelpFieldKey())) && <p class="at2_harvest_date_text mb-3" style={{ marginLeft: '60px' }}>Need to click update button to apply this help text</p>}
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-lg-12">
                            <InputText
                                fieldName="default_data"
                                fieldClass="default_data"
                                fieldID="default_data"
                                fieldPlaceholder="Default Value"
                                fieldValue={fieldDefaultData}
                                isFieldEmpty={this.state.isDefaultDataFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)} />
                        </div>
                    </div>
                    <Multiselect
                        options={companyList}
                        placeholder="Select Companies"
                        selectedValues={selectedCompanyList}
                        onSelect={this.companySelectHandler.bind(this)}
                        onRemove={this.companyRemoveHandler.bind(this)}
                        displayValue="name"
                    />
                    {errorMessage}
                    <div className="text-right mt-2">
                        <ButtonSpinner showSpinner={this.state.showSpinner} />
                        <SaveButtonSmall
                            buttonDisabled={this.state.showSpinner}
                            onClickHandler={this.updateBlockInput.bind(this)}
                            name="Update" />
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    companies: state.company.data,
    languages: state.translations.languages,
})


export default connect(mapStateToProps)(withTranslation()(EditBlockInput));
