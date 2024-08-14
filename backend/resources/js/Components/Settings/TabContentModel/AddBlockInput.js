import React, {Component} from 'react';
import '../Settings.css';
import {connect} from 'react-redux';
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";
import InputText from "../../Inputs/InputText";
import axios from "axios";
import TokenService from "../../../Services/TokenServices";

import ButtonSpinner from "../../Spinners/ButtonSpinner";
import InputService from "../../../Services/InputServices";

import {Multiselect} from 'multiselect-react-dropdown';
import CheckBox from "../../Inputs/CheckBox";
import InputNumber from "../../Inputs/InputNumber";


class AddBlockInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                name: '',
                slug: '',
                help_text: '',
                default_data: '',
                min_value: '',
                max_value: '',
                divided_by: '',
                company_id: [],
                selectedCompanies: [],
                range_slider: true,
                line_divider: false,
            },
            buttonDisabled: false,
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
            errorMessage: '',
            showBlockSettings: false,
            showSpinner: false,
        }
    }

    setRangeSlider() {
        const rangeSlider = this.props.blockData.range_slider === 0;
        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                range_slider: this.state.inputs.range_slider === null ? rangeSlider : this.state.inputs.range_slider !== true,
            }
        })
    }

    setLineDivider() {
        const lineDivider = this.props.blockData.line_divider === 1;
        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                line_divider: this.state.inputs.line_divider === null ? lineDivider : this.state.inputs.line_divider !== true,
            }
        })
    }

    onChangeHandler(inputTargets) {

        const {name, value} = inputTargets;

        if (name === 'slug') {
            this.setState({
                ...this.state,
                errorMessage: '',
                isNameFieldEmpty: false,
                isSlugFieldEmpty: false,
                isDefaultDataFieldEmpty: false,
                inputs: {
                    ...this.state.inputs,
                    slug: ''
                }
            });
        } else if (name === 'name') {
            this.setState({
                ...this.state,
                isNameFieldEmpty: false,
                isSlugFieldEmpty: false,
                isDefaultDataFieldEmpty: false,
                errorMessage: '',
                inputs: {
                    ...this.state.inputs,
                    name: value,
                    slug: value === '' ? '' : this.props.blockData.slug+'_'+InputService.slug(value)
                }
            });
        } else {
            this.setState({
                ...this.state,
                isDefaultDataFieldEmpty: false,
                isSlugFieldEmpty: false,
                errorMessage: '',
                inputs: {
                    ...this.state.inputs,
                    [name]: value
                }
            });
        }
    }

    async addBlockInputs() {
        const {name, slug} = this.state.inputs;

        let fieldEmpty = false;

        if (name === '') {
            fieldEmpty = true;
            await this.setState({
                ...this.state,
                isNameFieldEmpty: true,
            })
        }

        if (slug === '') {
            fieldEmpty = true;
            await this.setState({
                ...this.state,
                isSlugFieldEmpty: true,
            })
        }

        if (fieldEmpty) {
            await this.setState({
                ...this.state,
                errorMessage: 'Field should not be empty',
            });
            return false;
        }

        const blockInputData = {
            name: this.state.inputs.name,
            slug: this.state.inputs.slug,
            block_id: this.props.blockData.id,
            help_text: this.state.inputs.help_text,
            default_data: this.state.inputs.default_data,
            range_slider: this.state.inputs.range_slider,
            line_divider: this.state.inputs.line_divider,
            min_value: this.state.inputs.min_value === '' ? null : this.state.inputs.min_value,
            max_value: this.state.inputs.max_value === '' ? null : this.state.inputs.max_value,
            divided_by: this.state.inputs.divided_by === '' ? null : this.state.inputs.divided_by,
            company_id: this.state.inputs.company_id,
        }

        // set spinner
        await this.setState({
            ...this.state,
            showSpinner: true,
        });

        try {
            const blockInputResponse = await axios.post(
                'api/block_input/save',
                blockInputData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                });

            // response
            await this.setState({
                ...this.state,
                showSpinner: false,
                inputs: {
                    name: '',
                    slug: '',
                    help_text: '',
                    default_data: '',
                    company_id: [],
                    selectedCompanies: [],
                    range_slider: true,
                    line_divider: false,
                    min_value: '',
                    max_value: '',
                    divided_by: '',
                },
            });

            // send new input data to parent component to update local state.

            this.props.addBlockInputsData(blockInputResponse.data.data);


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

            if (Object.keys(errorsObj)[0] === 'slug') {
                await this.setState({
                    ...this.state,
                    isSlugFieldEmpty: true,
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
            isNameFieldEmpty: false,
            isSlugFieldEmpty: false,
            inputs: {
                ...this.state.inputs,
                company_id: companyIds,
                selectedCompanies: selectedList,
            }
        })
    }

    cancelHandler() {
        this.props.hideModelBlockForms();
    }


    render() {

        const errorMessage = this.state.errorMessage !== '' ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        const companyList = this.props.companies;

        return (
            <div className="section-block">
                <p className="mt-3"><strong>Add new input field</strong></p>
                <form className="pl-0 pr-0">
                    <div className="form-row">
                        <div className="col- col-xl-8 col-lg-8 col-md-7 col-sm-6">
                            <InputText
                                fieldName="name"
                                fieldClass="block_input_name"
                                fieldID="block_input_name"
                                fieldPlaceholder="Field name *"
                                fieldValue={this.state.inputs.name}
                                isFieldEmpty={this.state.isNameFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-5 col-sm-6">
                            <CheckBox
                                checkUncheckHandler={this.setRangeSlider.bind(this)}
                                fieldValue={this.state.inputs.range_slider}
                                fieldName="range_slider"
                                text="Include Range Slider?" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col- col-xl-8 col-lg-8 col-md-7 col-sm-6">
                            <InputText
                                isDisable="true"
                                fieldName="slug"
                                fieldClass="block_input_slug"
                                fieldID="block_input_slug"
                                fieldPlaceholder="Field slug"
                                fieldValue={this.state.inputs.slug}
                                isFieldEmpty={this.state.isSlugFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-5 col-sm-6">
                            <CheckBox
                                checkUncheckHandler={this.setLineDivider.bind(this)}
                                fieldValue={this.state.inputs.line_divider}
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
                                fieldValue={this.state.inputs.min_value}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-4">
                            <InputNumber
                                fieldName="max_value"
                                fieldClass="block_max_value"
                                fieldID="block_max_value"
                                fieldPlaceholder="Max value"
                                fieldValue={this.state.inputs.max_value}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                        <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-4">
                            <InputNumber
                                fieldName="divided_by"
                                fieldClass="block_divided_by"
                                fieldID="block_divided_by"
                                fieldPlaceholder="Divided by"
                                fieldValue={this.state.inputs.divided_by}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-lg-12">
                            <InputText
                                fieldName="help_text"
                                fieldClass="block_input_help_text"
                                fieldID="block_input_help_text"
                                fieldPlaceholder="Help text"
                                fieldValue={this.state.inputs.help_text}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="col-lg-12">
                            <InputText
                                fieldName="default_data"
                                fieldClass="block_input_default_data"
                                fieldID="block_input_default_data"
                                fieldPlaceholder="Default value"
                                fieldValue={this.state.inputs.default_data}
                                isFieldEmpty={this.state.isDefaultDataFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                    </div>

                    <Multiselect
                        options={companyList}
                        placeholder="Select Companies"
                        selectedValues={this.state.inputs.selectedCompanies}
                        onSelect={this.companySelectHandler.bind(this)}
                        displayValue="name"
                    />

                    {errorMessage}
                    <div className="text-right">
                        <ButtonSpinner showSpinner={this.state.showSpinner}/>
                        <SaveButtonSmall
                            buttonDisabled={this.state.showSpinner}
                            onClickHandler={this.addBlockInputs.bind(this)}
                            name="Save"/>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    selectedModel: state.modelSettings.inputs,
    companies: state.company.data,
})

export default connect(mapStateToProps)(AddBlockInput);

