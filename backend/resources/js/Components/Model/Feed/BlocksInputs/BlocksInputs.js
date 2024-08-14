import React, {Component} from 'react';
import {connect} from 'react-redux';
import './BlocksInputs.css';
import {
    toggleModelScreenBlockExpand,
    setModelScreenInputs,
    mtbBlockList,
    hideModelOutputSpinner,
    setGraphHelpText,
} from "../../../../Store/Actions/MTBActions";
import {setFeedModelResult} from "../../../../Store/Actions/FeedModelActions";
import {templateList} from "../../../../Store/Actions/TemplateActions";
import {showInfoPopup, showPriceModulePopup} from "../../../../Store/Actions/popupActions";
import {setPriceModuleDefaultInputs, setPriceModuleInputs} from "../../../../Store/Actions/PriceModuleActions";
import {Slider} from 'material-ui-slider';
import InputNumber from "../../../Inputs/InputNumber";
import NavService from "../../../../Services/NavServices";
import ButtonSpinner from "../../../Spinners/ButtonSpinner";

import SaveButtonSmall from "../../../Inputs/SaveButtonSmall";
import ListAutoComplete from "../../../Inputs/ListAutoComplete/ListAutoComplete";

import moment from 'moment';
import 'rc-datetime-picker/dist/picker.min.css';
import {DatetimePickerTrigger} from 'rc-datetime-picker';
import InputText from "../../../Inputs/InputText";
import FeedTableInputBlock from "./FeedTableInputBlock";
import DropdownList from '../../../Inputs/DropdownList/DropdownList';

import {
    setTemperatureFromTemplateDropdown,
    resetTemperatureModule
} from "../../../../Store/Actions/TemperatureModuleActions";
import {listTemperatureTemplates} from "../../../../Store/Actions/TemperatureModuleActions";
import {number_format} from "../../../../Services/NumberServices";
import {withTranslation} from "react-i18next";


class BlocksInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blockInputSpinner: false,
            blockInputPanelHeight: '',
            releaseMoment: moment(),
            harvestMoment: moment(),
        }
    }

    addPriceModule() {
        this.props.caseNumbers.map(caseNo => {
            // this.props.setPriceModuleInputs({ ['price_module_snittvekt_case' + caseNo]: 4.74 });
            // this.props.setPriceModuleInputs({ ['price_module_cv_case' + caseNo]: 22 });
            // this.props.setPriceModuleInputs({ ['lakse_pris_percentage_case' + caseNo]: 100 });
        });
        this.props.showPriceModulePopup();
    }

    async componentDidMount() {

        //fetch temperature templates


        await this.setState({
            ...this.state,
            blockInputSpinner: true
        });
        // get all blocks and inputs
        const modelSlug = NavService.getCurrentRoute();
        const authCompanyId = this.props.auth.data.user.company_id;
        // set blocks and inputs states
        const firstName = this.props.auth.data.user.first_name;
        const lastName = this.props.auth.data.user.last_name === null ? '' : this.props.auth.data.user.last_name;
        const fullName = firstName + ' ' + lastName;
        this.props.setGraphHelpText();
        await this.props.mtbBlockList(modelSlug, authCompanyId, fullName);
        // get all template list in this models
        const modelID = this.props.tool_id;
        const authUserId = this.props.auth.data.user.id;
        await this.props.templateList(modelID, authUserId);

        // prepare default outputs and generate graphs
        //await this.props.setModelResult(this.props.inputs, this.props.caseNumbers);
        this.props.hideModelOutputSpinner();

        await this.setState({
            ...this.state,
            blockInputSpinner: false
        });

    }

    blockExpandCollapseHandler(blockSlug) {
        this.props.toggleModelScreenBlockExpand(blockSlug);
    }

    //update temperature from dropdown
    async temperatureTemplateSelectHandler(itemName, itemId) {

        await this.props.setTemperatureFromTemplateDropdown(itemId);

        this.setTemperatureAsModelInput();
        this.props.resetTemperatureModule();

    }

    async setTemperatureAsModelInput() {
        let temperatureModule = [];
        let count = 0;
        if (this.props.outputs !== undefined && this.props.outputs.temperature_data !== undefined) {

            const temperatureData = this.props.outputs.temperature_data;

            Object.keys(temperatureData).map(key => {

                let avgValue = temperatureData[key]['Avg.'];

                temperatureModule[count] = {'week': key, 'avgTmp': avgValue}
                count++;
            })


            //const caseNumbers = this.props.caseNumbers;
            let modelInputs = this.props.modelInputs;
            modelInputs.temperature_module = temperatureModule;
            this.props.setModelScreenInputs({
                temperature_module: temperatureModule
            });

            // update timeline, graph output as soon as input changed
            this.props.setFeedModelResult(modelInputs, this.props.caseNumbers);
        }
    }


    inputRangeChangeHandler(name) {
        return function (value) {
            const dividedBy = name.split(',')[1];
            const fieldName = name.split(',')[0];
            this.props.setModelScreenInputs({
                [fieldName]: value / dividedBy
            });
        }.bind(this)
    }

    rangeChangeCompleteHandler(name) {
        return function (value) {
            this.props.setModelResult(this.props.inputs, this.props.caseNumbers);
        }.bind(this)
    }

    async releaseDateChangeHandler(changedMoment) {
        const harvestDate = moment(changedMoment, "DD-MM-YYYY").add(399, 'days');
        await this.setState({
            releaseMoment: changedMoment,
            harvestMoment: harvestDate
        });

        await this.props.setModelScreenInputs({
            kn_for_grunnforutsetning_utsettsdato_case1: this.state.releaseMoment.format('DD/MM/YYYY')
        });

        await this.props.setModelScreenInputs({
            kn_for_grunnforutsetning_harvest_date_case1: harvestDate.format('DD/MM/YYYY')
        });

        // update timeline, graph output as soon as input changed
        this.props.setFeedModelResult(this.props.inputs, this.props.caseNumbers);
    }

    async harvestDateChangeHandler(changedMoment) {
        await this.setState({
            harvestMoment: changedMoment
        });

        await this.props.setModelScreenInputs({
            kn_for_grunnforutsetning_harvest_date_case1: this.state.harvestMoment.format('DD/MM/YYYY')
        });

        // update timeline, graph output as soon as input changed
        this.props.setFeedModelResult(this.props.inputs, this.props.caseNumbers);
    }

    async modelScreenInputChangeHandler(inputTarget) {
        const {name, value} = inputTarget;

        await this.props.setModelScreenInputs({
            [name]: value
        });

        // Adjust snittvekt and min weight in timeline
        if (name === 'kn_for_grunnforutsetning_snittvekt_case1') {
            this.props.caseNumbers.map(caseNo => {
                if (this.props.inputs['feed_table_case' + caseNo] !== undefined) {
                    this.props.inputs['feed_table_case' + caseNo][0].feed_min_weight = value
                }
            });
        }

        // update timeline, graph output as soon as input changed
        this.props.setFeedModelResult(this.props.inputs, this.props.caseNumbers);

    }

    viewHelpTextHandler(e, helpText) {
        const infoText = helpText === null || helpText === undefined || helpText === '' ? 'Help text not found' : helpText;
        const selectedHelpTextIconBtnYPosition = document.getElementById(e.target.id).getBoundingClientRect().top;
        this.props.showInfoPopup(infoText, e.pageX, selectedHelpTextIconBtnYPosition);
    }

    render() {

        const {t} = this.props;

        const blockStatus = this.props.blockStatus;
        const blockExpand = this.props.blockExpand;

        let inputCount = 0;
        let inputCaseCount = 0;
        let blockCount = 0;
        let helpTextIcon = 0;

        const blockInputPanelHeight = this.props.screenSize >= 768 ? this.props.blockScrollHeight + 'px' : '100%';

        let blocks = this.props.blockData;


        return (
            <div className="block-input-wrapper" id="model_block_inputs" style={{height: blockInputPanelHeight}}>
                {this.state.blockInputSpinner && <div className="spinner_wrap">
                    <ButtonSpinner showSpinner={this.state.blockInputSpinner}/>
                </div>}
                {this.state.blockInputSpinner === false && blocks.length > 0 && blocks.map(block => {
                    let skipFirstCase = 0;
                    let blockInputCount = 0;
                    blockCount++;
                    // set different cases
                    let caseNumbers = [1];
                    if (block.has_cases === 1) {
                        caseNumbers = this.props.caseNumbers;
                    }
                    const totalCaseCount = caseNumbers.length;
                    let divWidth = 100 / totalCaseCount;
                    return (<div key={blockCount}>
                            {blockStatus[block.slug + '_show'] && <div className="section-block">
                                <div className="content-block p-2">
                                    <div
                                        className="screen-block-label"
                                        onClick={() => this.blockExpandCollapseHandler(block.slug)}>{t(block.name)}
                                        {blockExpand[block.slug + '_expand'] && <i className="fa fa-angle-up"></i>}
                                        {blockExpand[block.slug + '_expand'] === false &&
                                        <i className="fa fa-angle-down"></i>}
                                    </div>
                                    {blockExpand[block.slug + '_expand'] &&
                                    <div className="screen-block-inputs">
                                        <div className="card block-card">
                                            {block.column_no === 1 && <form>
                                                {block.block_inputs.map(input => {
                                                    inputCount++;
                                                    blockInputCount++;
                                                    if (block.case_type === 'Column' && block.slug === 'kn_for_forbedring') {
                                                        skipFirstCase = 1;
                                                        divWidth = 100 / (totalCaseCount - skipFirstCase);
                                                    }
                                                    return (
                                                        <div key={inputCount}>
                                                            {block.case_type === 'Column' &&
                                                            <div>
                                                                {blockInputCount === 1 && <div className="row mb-2">
                                                                    <div
                                                                        className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                    </div>
                                                                    <div
                                                                        className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                        {
                                                                            caseNumbers.slice(skipFirstCase, caseNumbers.length).map(caseNumber => {
                                                                                return (
                                                                                    <div key={caseNumber} style={{
                                                                                        paddingLeft: '7.5px',
                                                                                        width: divWidth + '%',
                                                                                        float: 'left',
                                                                                        textAlign: 'center'
                                                                                    }}>
                                                                                        <b>{t('case' + caseNumber)}</b>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </div>
                                                                }
                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t(input.name)}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                        {
                                                                            caseNumbers.slice(skipFirstCase, caseNumbers.length).map(caseNumber => {
                                                                                inputCaseCount++;
                                                                                const fieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';

                                                                                return (
                                                                                    <div key={inputCaseCount} style={{
                                                                                        paddingLeft: '7.5px',
                                                                                        width: divWidth + '%',
                                                                                        float: 'left'
                                                                                    }}>

                                                                                        <InputNumber
                                                                                            fieldName={input.slug + '_case' + caseNumber}
                                                                                            fieldID={input.slug + '_case' + caseNumber}
                                                                                            fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                            fieldValue={fieldValue || ''}/>
                                                                                    </div>)
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className="col-1 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                        {input.help_text !== null && <button
                                                                            type="button"
                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                            i
                                                                        </button>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            }
                                                            {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                    inputCaseCount++;
                                                                    let numberFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';
                                                                    if (input.range_slider === 1) {
                                                                        return (
                                                                            <div key={inputCaseCount} className="row mb-2">
                                                                                <div
                                                                                    className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        {block.has_cases === 1 &&
                                                                                        <span
                                                                                            className="case_number">{caseNumber + '. '}</span>}
                                                                                        {t(input.name)}
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                                    <Slider
                                                                                        onChangeComplete={this.rangeChangeCompleteHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)}
                                                                                        id={input.slug}
                                                                                        color="#102640"
                                                                                        min={parseFloat(input.min_value)}
                                                                                        max={parseFloat(input.max_value)}
                                                                                        value={parseFloat(this.props.inputs[input.slug + '_case' + caseNumber]) * input.divided_by}
                                                                                        onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)}/>
                                                                                </div>
                                                                                <div
                                                                                    className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                    <InputNumber
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug + '_case' + caseNumber}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={numberFieldValue || ''}/>
                                                                                </div>
                                                                                <div
                                                                                    className="col-2 col-xl-1 col-lg-2 col-md-1 col-sm-1 pl-0">
                                                                                    {input.help_text !== null && <button
                                                                                        type="button"
                                                                                        id={'help-text-id-' + (++helpTextIcon)}
                                                                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                        onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                        i
                                                                                    </button>}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    } else {

                                                                        if (block.slug === 'kn_for_generell') {
                                                                            if (input.slug === 'kn_for_generell_navn') {
                                                                                return (
                                                                                    <div key={inputCaseCount}
                                                                                         className="row mb-2">
                                                                                        <div
                                                                                            className="col-6 col-xl-4 col-lg-4 col-md-6 col-sm-3">
                                                                                            <div
                                                                                                className="model-screen-field-label">
                                                                                                {t(input.name)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                            <InputText
                                                                                                fieldName={input.slug + '_case' + caseNumber}
                                                                                                fieldID={input.slug}
                                                                                                fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                fieldValue={numberFieldValue || ''}/>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                                            {input.help_text !== null &&
                                                                                            <button
                                                                                                type="button"
                                                                                                id={'help-text-id-' + (++helpTextIcon)}
                                                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                                i
                                                                                            </button>}
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                            return (
                                                                                <div key={inputCaseCount}
                                                                                     className="row mb-2">
                                                                                    <div
                                                                                        className="col-6 col-xl-4 col-lg-4 col-md-6 col-sm-3">
                                                                                        <div
                                                                                            className="model-screen-field-label">
                                                                                            {t(input.name)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                        <InputText
                                                                                            fieldName={input.slug + '_case' + caseNumber}
                                                                                            fieldID={input.slug}
                                                                                            fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                            fieldValue={numberFieldValue || ''}/>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                                        {input.help_text !== null && <button
                                                                                            type="button"
                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }

                                                                        // harvest datepicker
                                                                        if (block.slug === 'kn_for_grunnforutsetning' && input.slug === 'kn_for_grunnforutsetning_utsettsdato') {

                                                                            return (
                                                                                <div key={inputCaseCount}
                                                                                     className="row mb-2">
                                                                                    <div
                                                                                        className="col-6 col-xl-4 col-lg-4 col-md-6 col-sm-3">
                                                                                        <div
                                                                                            className="model-screen-field-label">
                                                                                            {block.has_cases === 1 &&
                                                                                            <span
                                                                                                className="case_number">{caseNumber + '. '}</span>}
                                                                                            {t(input.name)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                        <DatetimePickerTrigger
                                                                                            closeOnSelectDay={true}
                                                                                            moment={this.state.releaseMoment}
                                                                                            onChange={e => this.releaseDateChangeHandler(e)}>
                                                                                            <input
                                                                                                name={input.slug + '_case' + caseNumber}
                                                                                                id={input.slug + '_case' + caseNumber}
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                placeholder={t('select_a_date')}
                                                                                                value={this.props.inputs[input.slug + '_case' + caseNumber]}
                                                                                            />
                                                                                        </DatetimePickerTrigger>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                                        {input.help_text !== null && <button
                                                                                            type="button"
                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }
                                                                        if (block.slug === 'kn_for_grunnforutsetning' && input.slug === 'kn_for_grunnforutsetning_harvest_date') {

                                                                            return (
                                                                                <div key={inputCaseCount}
                                                                                     className="row mb-2">
                                                                                    <div
                                                                                        className="col-6 col-xl-4 col-lg-4 col-md-6 col-sm-3">
                                                                                        <div
                                                                                            className="model-screen-field-label">
                                                                                            {block.has_cases === 1 &&
                                                                                            <span
                                                                                                className="case_number">{caseNumber + '. '}</span>}
                                                                                            {t(input.name)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                        <DatetimePickerTrigger
                                                                                            closeOnSelectDay={true}
                                                                                            moment={this.state.harvestMoment}
                                                                                            onChange={e => this.harvestDateChangeHandler(e)}>
                                                                                            <input
                                                                                                name={input.slug + '_case' + caseNumber}
                                                                                                className="form-control"
                                                                                                type="text"
                                                                                                placeholder={t('select_a_date')}
                                                                                                value={this.props.inputs[input.slug + '_case' + caseNumber]}
                                                                                            />
                                                                                        </DatetimePickerTrigger>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                                        {input.help_text !== null && <button
                                                                                            type="button"
                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }

                                                                        if (block.slug === 'kn_for_grunnforutsetning' && input.slug === 'kn_for_grunnforutsetning_temperaturmodell') {

                                                                            //for temperature templates
                                                                            if (this.props.temperatureTemplates === undefined) {
                                                                                this.props.listTemperatureTemplates();
                                                                            }

                                                                            const temperatureTemplates = [];
                                                                            let countTemplates = 0;
                                                                            if (this.props.temperatureTemplates !== undefined) {
                                                                                Object.keys(this.props.temperatureTemplates).map(key => {
                                                                                    temperatureTemplates[countTemplates] = {
                                                                                        id: this.props.temperatureTemplates[key].id,
                                                                                        name: this.props.temperatureTemplates[key].name
                                                                                    }
                                                                                    countTemplates++;
                                                                                });
                                                                            }

                                                                            return (
                                                                                <div key={inputCaseCount}
                                                                                     className="row mb-2">
                                                                                    <div
                                                                                        className="col-6 col-xl-4 col-lg-4 col-md-6 col-sm-3">
                                                                                        <div
                                                                                            className="model-screen-field-label">
                                                                                            {block.has_cases === 1 &&
                                                                                            <span
                                                                                                className="case_number">{caseNumber + '. '}</span>}
                                                                                            {t(input.name)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                        <ListAutoComplete

                                                                                            fieldName={input.slug + '_case' + caseNumber}
                                                                                            fieldPlaceHolder={t('select_temperature_module')}
                                                                                            fieldOnClick={this.temperatureTemplateSelectHandler.bind(this)}
                                                                                            listData={temperatureTemplates}/>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                                        {input.help_text !== null && <button
                                                                                            type="button"
                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }

                                                                        let allowThousandSep = false;
                                                                        if (block.slug === 'kn_for_grunnforutsetning' && input.slug === 'kn_for_grunnforutsetning_antall_utsatt') {
                                                                            allowThousandSep = true;
                                                                            numberFieldValue = number_format(numberFieldValue, 0, '.', ' ');
                                                                        }


                                                                        return (
                                                                            <div key={inputCaseCount} className="row mb-2">
                                                                                <div
                                                                                    className="col-6 col-xl-4 col-lg-4 col-md-6 col-sm-3">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        {block.has_cases === 1 &&
                                                                                        <span
                                                                                            className="case_number">{caseNumber + '. '}</span>}
                                                                                        {t(input.name)}
                                                                                        {
                                                                                            // set add price modul button for lakes price
                                                                                            block.slug === 'kn_for_konomi' && input.slug === 'kn_for_konomi_laksepris' &&
                                                                                            <span>
                                                                                            {
                                                                                                this.props.screenSize >= 768 &&
                                                                                                <SaveButtonSmall
                                                                                                    onClickHandler={this.addPriceModule.bind(this)}
                                                                                                    name={'+ ' + t('add_price')}/>
                                                                                            }
                                                                                                {
                                                                                                    this.props.screenSize < 768 &&
                                                                                                    <span
                                                                                                        className="add_price_module"><i
                                                                                                        className="fa fa-plus grey-stroke"
                                                                                                        onClick={e => this.addPriceModule(e)}></i></span>
                                                                                                }
                                                                                        </span>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                    <InputNumber
                                                                                        allowThousandSep={allowThousandSep}
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={numberFieldValue || ''}/>
                                                                                </div>
                                                                                <div
                                                                                    className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
                                                                                    {input.help_text !== null && <button
                                                                                        type="button"
                                                                                        id={'help-text-id-' + (++helpTextIcon)}
                                                                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                        onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                        i
                                                                                    </button>}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                }
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </form>}
                                        </div>
                                    </div>}
                                </div>
                            </div>}
                        </div>
                    )
                })}
                <FeedTableInputBlock/>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    tool_id: state.modelScreen.tool_id,
    inputs: state.modelScreen.inputs,
    blockData: state.modelScreen.blockData,
    blockStatus: state.modelScreen.blockStatus,
    blockExpand: state.modelScreen.blockExpand,
    caseNumbers: state.modelScreen.caseNumbers,
    graphOutput: state.modelScreen.graphOutput,
    blockOutput: state.modelScreen.blockOutput,
    pdfOutput: state.modelScreen.pdfOutput,
    screenSize: state.page.screenSize,
    temperatureTemplates: state.temperatureModule.temperatureTemplates,
    outputs: state.temperatureModule.outputs,
    modelInputs: state.modelScreen.inputs,
    blockScrollHeight: state.modelScreen.blockScrollHeight,
})

export default connect(mapStateToProps, {
    toggleModelScreenBlockExpand,
    setModelScreenInputs,
    setFeedModelResult,
    templateList,
    mtbBlockList,
    showInfoPopup,
    showPriceModulePopup,
    setPriceModuleDefaultInputs,
    setPriceModuleInputs,
    hideModelOutputSpinner,
    setTemperatureFromTemplateDropdown,
    resetTemperatureModule,
    listTemperatureTemplates,
    setGraphHelpText,
})(withTranslation()(BlocksInputs));

