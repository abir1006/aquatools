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
import {setVaccineModelResult, setVaccineCaseLabels} from "../../../../Store/Actions/VaccineModelActions";
import {templateList} from "../../../../Store/Actions/TemplateActions";
import {showInfoPopup, showPriceModulePopup} from "../../../../Store/Actions/popupActions";
import {
    setPriceModuleDefaultInputs,
    setPriceModuleInputs,
    takePriceModuleCVFrom,
    takePriceModuleSnittvektFrom,
} from "../../../../Store/Actions/PriceModuleActions";
import {Slider} from 'material-ui-slider';
import InputNumber from "../../../Inputs/InputNumber";
import NavService from "../../../../Services/NavServices";
import ButtonSpinner from "../../../Spinners/ButtonSpinner";
import SaveButtonSmall from "../../../Inputs/SaveButtonSmall";
import moment from "moment";
import InputText from "../../../Inputs/InputText";
import {number_format} from "../../../../Services/NumberServices";
import {withTranslation} from 'react-i18next';
import ValidationPopup from '../../../Popups/ValidationPopup';

class BlocksInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blockInputSpinner: false,
            blockInputPanelHeight: '',
            releaseMoment: moment(),
            harvestMoment: moment(),
            vPopup: {
                lastValue: {},
                text: "",
                show: false,
                xPosition: 300,
                yPosition: 500,
                currentField: "",
                fields: [],
                error: {},
                oldValues: {},
                dependentsFields: {
                    'vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1': [
                    ]
                }
            }
        }

        this.validationPopupNoHanlder = this.validationPopupNoHanlder.bind(this);
        this.validationPopupYesHanlder = this.validationPopupYesHanlder.bind(this);

    }

    //validation popup

    validationPopupNoHanlder() {
        const { vPopup } = this.state;

        this.props.setModelScreenInputs({
            [vPopup.currentField]: vPopup.lastValue[vPopup.currentField] || '0'
        });

        const element = document.getElementsByName(vPopup.currentField)[0];
        this.hideValidationPopup(element);

        // update timeline, graph output as soon as input changed
        setTimeout(() => {
            this.props.setVaccineModelResult(this.props.inputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);
        }, 500);


    }

    validationPopupYesHanlder() {

        const { vPopup } = this.state;
        const { oldValues } = vPopup;
        let el;
        let id;
        let values = oldValues;

        const dependents = vPopup.dependentsFields[vPopup.currentField];

        dependents.forEach((field, i) => {

            this.props.caseNumbers.forEach((inputCaseNo, i) => {

                id = field + '_case' + inputCaseNo;

                //store old values
                values = { ...values, [id]: this.props.inputs[id] }

                //reset dependants fields to 0;
                this.props.setModelScreenInputs({
                    [id]: 0
                });
            });
        });

        //update old values state
        vPopup.oldValues = values;
        this.setState({ vPopup: vPopup });


        vPopup.show = false;
        vPopup.fields.push(vPopup.currentField);
        vPopup.currentField = '';
        this.setState({ vPopup: vPopup });
    }

    getElementPosition(el) {

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = el.getBoundingClientRect();
        const x = elemRect.top - bodyRect.top;
        const y = elemRect.top;
        return { x: x, y: y }
    }

    showValidationPopup(text, e) {

        const { vPopup } = this.state;

        vPopup.show = false;
        vPopup.text = text;
        vPopup.currentField = e.name;
        const { x, y } = this.getElementPosition(e);
        vPopup.xPosition = x;
        vPopup.yPosition = y;
        vPopup.error = { ...vPopup.error, [e.name]: text };
        this.setState({ vPopup: vPopup })
    }

    hideValidationPopup(e) {

        const { vPopup } = this.state;
        const { error } = vPopup;
        delete error[e.name];

        vPopup.show = false;
        vPopup.text = "";
        vPopup.error = error;
        this.setState({ vPopup: vPopup })

    }

    restoreOldValues(name) {
        const { vPopup } = this.state;
        let id;

    }

    setDefaultValuesToParentFields() {

        //store default values to validations popup parent fields
        const { vPopup } = this.state;
        const { lastValue } = vPopup;
        let values = lastValue;
        Object.keys(vPopup.dependentsFields).map((key, i) => {

            if (!(key in vPopup.lastValue)) {
                values = { ...values, [key]: this.props.inputs[key] || '0' }
            }
        });
        vPopup.lastValue = values;
        this.setState({ vPopup: vPopup });
    }

    addBlurEvents() {

        var self = this;
        const { vPopup } = this.state;

        Object.keys(vPopup.dependentsFields).map((name, i) => {
            const element = document.getElementsByName(name)[0];
            element && element.addEventListener('blur', (e) => self.onBlurHandler(e));
        });

    }

    onBlurHandler(e) {


        const { vPopup } = this.state;

        if (Boolean(vPopup.currentField) && Object.keys(vPopup.error).length !== 0) {
            vPopup.show = true;
            this.setState({ vPopup: vPopup });
        }
    }

    checkforValidationPopup(name, value) {

        const { vPopup } = this.state;
        const element = document.getElementsByName(name)[0];

        if (!element)
            return;

        if (!Boolean(parseFloat(value))) {
            const text = 'if_sjukdom_sannsynlighet_is_set_zero';
            this.showValidationPopup(text, element);
        } else {

            // store last value
            vPopup.lastValue[name] = value
            this.setState({ vPopup: vPopup });

            this.hideValidationPopup(element);
            //restore oldvalue if any
            this.restoreOldValues(element.name);

        }
    }
    // end of validation code

    addPriceModule() {
        this.props.showPriceModulePopup();
    }

    componentDidUpdate(prevProps, prevState) {

        const fName = 'vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1';
        if (prevProps.inputs[fName] != this.props.inputs[fName]) {
            this.checkforValidationPopup(fName, this.props.inputs[fName]);
        }

    }

    async componentDidMount() {
        await this.props.setVaccineCaseLabels();
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

        let defaultCases = [1, 2, 3];

        // prepare default outputs and generate graphs
        await this.props.setVaccineModelResult(this.props.inputs, defaultCases, 'vaksinering');
        this.props.hideModelOutputSpinner();

        await this.setState({
            ...this.state,
            blockInputSpinner: false
        });

        //validation popup
        this.setDefaultValuesToParentFields();
        this.addBlurEvents();
        this.checkforValidationPopup('vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1', this.props.inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1']);

    }

    blockExpandCollapseHandler(blockSlug) {
        this.props.toggleModelScreenBlockExpand(blockSlug);
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

            this.props.setVaccineModelResult(this.props.inputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);

            //validation popup only for effect of disease block
            const fName = 'vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1';
            if (name.includes(fName)) {
                this.checkforValidationPopup(fName, value);
                const el = document.getElementsByName(fName)[0];
                this.onBlurHandler(el);
            } else if (name.includes('vaksinering_effekter_sjukdom_')) {
                const el = document.getElementsByName(name)[0];
                this.onBlurHandler(el);
            }

        }.bind(this)
    }

    async modelScreenInputChangeHandler(inputTarget) {
        const {name, value} = inputTarget;

        //validation popup
        //Probability for disease %
        if (name.includes('vaksinering_effekter_sjukdom_')) {
            const el = document.getElementsByName(name)[0];
            el.addEventListener('blur', (e) => this.onBlurHandler(e));
        }


        const inputCaseNo = name.substr(name.length - 1);

        if (
            'vaksinering_grunnforutsetninger_budsjett_cv_case' !== name.slice(0, -1) &&
            'vaksinering_effekter_sjukdom_kt_cv_case' !== name.slice(0, -1) &&
            'vaksinering_effekter_av_vaksine_cv_rpp_case' !== name.slice(0, -1) &&
            'vaksinering_effekter_av_vaksine_cv_bi_effekt_case' !== name.slice(0, -1)
        ) {
            await this.props.takePriceModuleSnittvektFrom('EM');
        }

        if (
            'vaksinering_grunnforutsetninger_budsjett_cv_case' === name.slice(0, -1) ||
            'vaksinering_effekter_sjukdom_kt_cv_case' === name.slice(0, -1) ||
            'vaksinering_effekter_av_vaksine_cv_rpp_case' === name.slice(0, -1) ||
            'vaksinering_effekter_av_vaksine_cv_bi_effekt_case' === name.slice(0, -1)
        ) {
            await this.props.takePriceModuleCVFrom('bPLM');
        }

        if (name === 'vaksinering_effekter_av_vaksine_tilvekst_kg_rpp_case' + inputCaseNo) {

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_ddelighet_poeng_rpp_case' + inputCaseNo]: value
            });

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_bfcr_enhet_rpp_case' + inputCaseNo]: value
            });

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_produksjon_poeng_rpp_case' + inputCaseNo]: value
            });

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_utkast_poeng_rpp_case' + inputCaseNo]: value
            });

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_ekstraordinre_kostnader_rpp_case' + inputCaseNo]: value
            });

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_behandling_rpp_case' + inputCaseNo]: value
            });

            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_forebygging_rpp_case' + inputCaseNo]: value
            });
            await this.props.setModelScreenInputs({
                ['vaksinering_effekter_av_vaksine_cv_rpp_case' + inputCaseNo]: value
            });
        }

        await this.props.setModelScreenInputs({
            [name]: value
        });

        // update timeline, graph output as soon as input changed
        this.props.setVaccineModelResult(this.props.inputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);

    }

    diseaseNameChangeHandler(inputTarget) {
        const {name, value} = inputTarget;
        this.props.setVaccineCaseLabels(this.props.inputs.budget_name, value);
        this.props.setModelScreenInputs({
            [name]: value
        });
    }

    budgetNameChangeHandler(inputTarget) {
        const {name, value} = inputTarget;
        this.props.setVaccineCaseLabels(value, this.props.inputs.block_sjukdom_name);
        this.props.setModelScreenInputs({
            [name]: value
        });
    }

    viewHelpTextHandler(e, helpText) {
        const {t} = this.props;
        const hardCodedKeys = ['rpp_effect'];
        const infoText = !Boolean(helpText) ? t('no_help_text_found') : (hardCodedKeys.includes(helpText) ? helpText : t(helpText));
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

        let vaksineInputLabelCount = 0;

        const blockInputPanelHeight = this.props.screenSize >= 768 ? this.props.blockScrollHeight + 'px' : '100%';

        let blocks = this.props.blockData;

        let vaccineNames = this.props.vaccineNames === undefined ? [{'name': 'A'}] : this.props.vaccineNames;
        let vaccineTotal = vaccineNames.length + 2;
        let vaccineCaseNo = 2;

        const labelTrans = ['budget', 'disease', 'vacc_a', 'vacc_b', 'vacc_c'];

        return (
            <div className="block-input-wrapper" id="model_block_inputs" style={{height: blockInputPanelHeight}}>
                {this.state.blockInputSpinner && <div className="spinner_wrap">
                    <ButtonSpinner showSpinner={this.state.blockInputSpinner}/>
                </div>}

                <ValidationPopup
                    {...this.state.vPopup}
                    yesHandler={this.validationPopupYesHanlder}
                    noHandler={this.validationPopupNoHanlder}
                    maxWidth={300}
                />


                {this.state.blockInputSpinner === false && blocks.length > 0 && blocks.map(block => {
                    let blockInputCount = 0;
                    blockCount++;
                    // set different cases
                    let caseNumbers = [1];
                    if (block.has_cases === 1) {
                        caseNumbers = this.props.caseNumbers;
                    }
                    const totalCaseCount = caseNumbers.length;
                    const divWidth = 100 / totalCaseCount;
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
                                            {block.column_no === 2 && <form id={block.slug}>
                                                {
                                                    block.slug === 'vaksinering_effekter_av_vaksine' && <div>
                                                        <div className="vaccine_left_block">
                                                            <div>
                                                                <div className="row">
                                                                    <div
                                                                        className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12  pr-1">
                                                                        <div className="model-screen-field-label">
                                                                            &nbsp;
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                block.block_inputs.map(input => {
                                                                    vaksineInputLabelCount++;
                                                                    return (
                                                                        <div>
                                                                            {vaksineInputLabelCount === 1 &&
                                                                            <div className="row mb-2">
                                                                                <div
                                                                                    className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12  pr-1">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        <b>{t('area')}</b>
                                                                                    </div>
                                                                                </div>
                                                                            </div>}
                                                                            {vaksineInputLabelCount % 2 !== 0 &&
                                                                            <div className="row mb-3">
                                                                                <div
                                                                                    className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 pr-1">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        {t(input.name)}
                                                                                    </div>
                                                                                </div>
                                                                            </div>}
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                        <div className="vaccine_right_block">
                                                            <div className="row">
                                                                {
                                                                    vaccineNames.map(vaccine => {
                                                                        let vaksineInputCount = 0;
                                                                        vaccineCaseNo++;
                                                                        const vaccineCountClass = 'vaccine_case' + vaccineTotal;
                                                                        return (
                                                                            <div className={vaccineCountClass}>
                                                                                <div key={inputCount}
                                                                                     className="vaccine_heading">
                                                                                    <div
                                                                                        className="model-screen-field-label text-center">
                                                                                        <b>{t('vaccine')} {vaccine.name}</b>
                                                                                    </div>
                                                                                </div>

                                                                                {
                                                                                    block.block_inputs.map((input) => {
                                                                                        inputCount++;
                                                                                        blockInputCount++;
                                                                                        vaksineInputCount++;
                                                                                        const vaksineBlockClass = vaksineInputCount % 2 === 0 ? 'vaccine_input_right' : 'vaccine_input_left';
                                                                                        const inputDivClass = vaksineInputCount % 2 === 0 ? 'col-10 col-xl-9 col-lg-9 col-md-10 col-sm-10' : 'col-6 col-xl-4 col-lg-4 col-md-4 col-sm-4';

                                                                                        inputCaseCount++;
                                                                                        let numberFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + vaccineCaseNo] : '';
                                                                                        numberFieldValue = numberFieldValue === null ? '' : numberFieldValue;

                                                                                        let vaksineLabel = t('rpp_percentage');
                                                                                        if (vaksineInputCount === 2) {
                                                                                            vaksineLabel = t('bi_effect');
                                                                                        }

                                                                                        // Set "Sannsynlighet for sjukdom %" input
                                                                                        if (input.slug === 'vaksinering_effekter_av_vaksine_sannsynlighet_for_sjukdom_rpp') {
                                                                                            numberFieldValue = this.props.inputs['vaksinering_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
                                                                                        }
                                                                                        let fieldValueType = undefined;
                                                                                        if (input.slug === 'vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt') {
                                                                                            fieldValueType = 'negative';
                                                                                        }

                                                                                        return (
                                                                                            <div key={inputCount}
                                                                                                 className="vaccine_input_cols">
                                                                                                {(vaksineInputCount === 1 || vaksineInputCount === 2) &&
                                                                                                <div
                                                                                                    className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2 pl-1 pr-1">
                                                                                                    <div
                                                                                                        className="model-screen-field-label text-center">{vaksineLabel}</div>
                                                                                                    <div
                                                                                                        className="help_text_block help_text_rpp_effect">
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                            onClick={e => this.viewHelpTextHandler(e, 'rpp_effect')}>
                                                                                                            i
                                                                                                        </button>
                                                                                                    </div>
                                                                                                </div>
                                                                                                }
                                                                                                <div
                                                                                                    className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-2 pl-1 pr-1">
                                                                                                    <InputNumber
                                                                                                        fieldValueType={fieldValueType}
                                                                                                        isDisable={input.default_data === null || input.slug === 'vaksinering_effekter_av_vaksine_sannsynlighet_for_sjukdom_rpp' ? "true" : "false"}
                                                                                                        fieldName={input.slug + '_case' + vaccineCaseNo}
                                                                                                        fieldID={input.slug}
                                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                        fieldValue={numberFieldValue}/>
                                                                                                </div>
                                                                                                <div
                                                                                                    className="help_text_block">
                                                                                                    {input.help_text !== null &&
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        id={'help-text-id-' + (++helpTextIcon)}
                                                                                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                        onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                                        i
                                                                                                    </button>}
                                                                                                </div>
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        )
                                                                    })
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    (block.slug !== 'vaksinering_effekter_av_vaksine' && block.slug === 'vaksinering_grunnforutsetninger_budsjett') &&
                                                    <div className="row mb-2" id="basic_block_row">
                                                        <div className="budget_block_name_label">
                                                            <div className="model-screen-field-label">
                                                                {t('simulation')}
                                                            </div>
                                                        </div>
                                                        <div className="budget_block_name_input">
                                                            <InputText
                                                                fieldName="budget_name"
                                                                fieldID="budget_name"
                                                                fieldOnChange={this.budgetNameChangeHandler.bind(this)}
                                                                fieldValue={this.props.inputs.budget_name || t('budget')}/>
                                                        </div>
                                                        <div className="help_text_block help_text_block_name">
                                                            <button
                                                                type="button"
                                                                id={'help-text-id-' + (++helpTextIcon)}
                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                onClick={e => this.viewHelpTextHandler(e, t('help_simulation'))}>
                                                                i
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    block.slug !== 'vaksinering_effekter_av_vaksine' && block.block_inputs.map(input => {
                                                        inputCount++;
                                                        blockInputCount++;
                                                        return (
                                                            <div key={inputCount} className="block_with_2_columns">
                                                                {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                        inputCaseCount++;
                                                                        let numberFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';
                                                                        numberFieldValue = numberFieldValue === null ? '' : numberFieldValue;

                                                                        return (
                                                                            <div key={inputCaseCount} className="row mb-2">
                                                                                <div
                                                                                    className="col-7 col-xl-7 col-lg-7 col-md-7 col-sm-7">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        {block.has_cases === 1 &&
                                                                                        <span
                                                                                            className="case_number">{caseNumber + '. '}</span>}
                                                                                        {t(input.name)}
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-2 col-xl-3 col-lg-3 col-md-3 col-sm-3 pr-xl-1">
                                                                                    <InputNumber
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={numberFieldValue}/>
                                                                                </div>
                                                                                <div className="help_text_block_for_2_cols">
                                                                                    {input.help_text !== null && <button
                                                                                        type="button"
                                                                                        id={'help-text-id-' + (++helpTextIcon)}
                                                                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                        onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                        i
                                                                                    </button>}
                                                                                </div>
                                                                            </div>
                                                                        )

                                                                    }
                                                                )}
                                                            </div>

                                                        )
                                                    })
                                                }


                                            </form>

                                            }

                                            {block.column_no === 1 && <form id={block.slug}>
                                                {
                                                    block.slug === 'vaksinering_effekter_sjukdom' &&
                                                    <div className="row mb-2">
                                                        <div
                                                            className="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                                            <div className="model-screen-field-label">
                                                                {t('disease')}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="col-7 col-xl-7 col-lg-7 col-md-7 col-sm-7 pl-0 pr-0">
                                                            <InputText
                                                                fieldName="block_sjukdom_name"
                                                                fieldID="block_sjukdom_name"
                                                                fieldOnChange={this.diseaseNameChangeHandler.bind(this)}
                                                                fieldValue={this.props.inputs.block_sjukdom_name || 'SAV3'}/>
                                                        </div>
                                                        <div className="help_text_block">
                                                            <button
                                                                type="button"
                                                                id={'help-text-id-' + (++helpTextIcon)}
                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                onClick={e => this.viewHelpTextHandler(e, 'help_disease')}>
                                                                i
                                                            </button>
                                                        </div>
                                                    </div>

                                                }
                                                {block.block_inputs.map(input => {
                                                    inputCount++;
                                                    blockInputCount++;
                                                    let fieldValueType = undefined;
                                                    if (input.slug === 'vaksinering_effekter_sjukdom_redusert_slaktevekt_kg') {
                                                        fieldValueType = 'negative';
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
                                                                            caseNumbers.map(caseNumber => {
                                                                                return (
                                                                                    <div key={caseNumber} style={{
                                                                                        paddingLeft: '7.5px',
                                                                                        width: divWidth + '%',
                                                                                        float: 'left',
                                                                                        textAlign: 'center'
                                                                                    }}>
                                                                                        <b>{t('case')} {caseNumber}</b>
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
                                                                            caseNumbers.map(caseNumber => {
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
                                                                    <div className="help_text_block">
                                                                        {input.help_text !== null && <button
                                                                            type="button"
                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                            onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                            i
                                                                        </button>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            }
                                                            {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                    inputCaseCount++;
                                                                    let numberFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';
                                                                    numberFieldValue = numberFieldValue === null ? '' : numberFieldValue;

                                                                    if (input.range_slider === 1) {
                                                                        let inputMaxValue = parseFloat(input.max_value);
                                                                        let inputValue = parseFloat(this.props.inputs[input.slug + '_case' + caseNumber]) * input.divided_by;

                                                                        /* -- handling thousand separator -- */
                                                                        let allowThousandSep = false;
                                                                        if (block.slug === 'vaksinering_produksjonsmodell' && input.slug === 'vaksinering_produksjonsmodell_antall_smolt') {
                                                                            if (this.props.inputs[input.slug + '_case' + caseNumber].toString().split(' ').length > 0) {
                                                                                inputValue = parseFloat(this.props.inputs[input.slug + '_case' + caseNumber].toString().split(' ').join('')) * input.divided_by;
                                                                            }
                                                                            allowThousandSep = true;
                                                                            numberFieldValue = number_format(numberFieldValue, 0, '.', ' ');
                                                                        }
                                                                        /* --End-- */

                                                                        let sliderValue = inputValue > inputMaxValue ? inputMaxValue : inputValue;


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
                                                                                        value={sliderValue}
                                                                                        onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)}/>
                                                                                </div>
                                                                                <div
                                                                                    className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                    <InputNumber
                                                                                        allowThousandSep={allowThousandSep}
                                                                                        fieldValueType={fieldValueType}
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug + '_case' + caseNumber}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={numberFieldValue}/>
                                                                                </div>
                                                                                <div className="help_text_block">
                                                                                    {input.help_text !== null && <button
                                                                                        type="button"
                                                                                        id={'help-text-id-' + (++helpTextIcon)}
                                                                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                        onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                        i
                                                                                    </button>}
                                                                            </div>

                                                                        </div>
                                                                    )
                                                                } else {

                                                                        if (block.slug === 'vaksinering_general') {
                                                                            if (input.slug === 'vaksinering_general_navn') {
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
                                                                                                fieldValue={numberFieldValue}/>
                                                                                        </div>
                                                                                        <div className="help_text_block">
                                                                                            {input.help_text !== null &&
                                                                                            <button
                                                                                                type="button"
                                                                                                id={'help-text-id-' + (++helpTextIcon)}
                                                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
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
                                                                                            fieldValue={numberFieldValue}/>
                                                                                    </div>
                                                                                    <div className="help_text_block">
                                                                                        {input.help_text !== null && <button
                                                                                            type="button"
                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                            onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        }

                                                                        if (block.slug === 'vaksinering_produksjonsmodell' && input.slug === 'vaksinering_produksjonsmodell_laksepris') {
                                                                            const vaccineCaseLabel = this.props.vaccineCaseLabels;
                                                                            const laksePrisCases = !Boolean(this.props.caseNumbers) || this.props.caseNumbers.length < 3 ? [1, 2, 3] : this.props.caseNumbers;
                                                                        const lakseDivWidth = 100 / laksePrisCases.length;
                                                                        return (
                                                                            <div>
                                                                                <div className="row mb-2">
                                                                                    <div
                                                                                        className="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1">
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-7 col-xl-7 col-lg-7 col-md-7 col-sm-7">
                                                                                        {
                                                                                            laksePrisCases.map(caseNumber => {
                                                                                                const caseLabel = vaccineCaseLabel[laksePrisCases.length]['Case' + caseNumber];
                                                                                                return (
                                                                                                    <div
                                                                                                        className="lakse_price_case_heading"
                                                                                                        key={caseNumber}
                                                                                                        style={{
                                                                                                            width: lakseDivWidth + '%',
                                                                                                        }}>
                                                                                                        <b>
                                                                                                            {labelTrans.includes(caseLabel) ? t(caseLabel) : caseLabel}
                                                                                                        </b>
                                                                                                    </div>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                <div key={inputCaseCount}
                                                                                    className="row mb-2">
                                                                                    <div
                                                                                        className="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1">
                                                                                        <div
                                                                                            className="model-screen-field-label">
                                                                                            {t(input.name)}
                                                                                            <span>
                                                                                                {
                                                                                                    this.props.screenSize >= 768 &&
                                                                                                    <SaveButtonSmall
                                                                                                        onClickHandler={this.addPriceModule.bind(this)}
                                                                                                        name={"+ " + t('add_price')}/>
                                                                                                }
                                                                                                    {
                                                                                                        this.props.screenSize < 768 &&
                                                                                                        <span
                                                                                                            className="add_price_module"><i
                                                                                                            className="fa fa-plus grey-stroke"
                                                                                                            onClick={e => this.addPriceModule(e)}></i></span>
                                                                                                    }
                                                                                            </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-7 col-xl-7 col-lg-7 col-md-7 col-sm-7">
                                                                                            {
                                                                                                laksePrisCases.map(caseNumber => {
                                                                                                    inputCaseCount++;
                                                                                                    const fieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';

                                                                                                    return (
                                                                                                        <div
                                                                                                            key={inputCaseCount}
                                                                                                            style={{
                                                                                                                paddingLeft: '7.5px',
                                                                                                                width: lakseDivWidth + '%',
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
                                                                                        <div className="help_text_block">
                                                                                            {input.help_text !== null &&
                                                                                            <button
                                                                                                type="button"
                                                                                                id={'help-text-id-' + (++helpTextIcon)}
                                                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                                i
                                                                                            </button>}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
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
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-4 col-xl-7 col-lg-7 col-md-4 col-sm-6 pr-xl-1">
                                                                                    <InputNumber
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={numberFieldValue}/>
                                                                                </div>
                                                                                <div className="help_text_block">
                                                                                    {input.help_text !== null && <button
                                                                                        type="button"
                                                                                        id={'help-text-id-' + (++helpTextIcon)}
                                                                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                        onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
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

                                                {block.slug == 'vaksinering_effekter_sjukdom' &&

                                                    Object.keys(this.state.vPopup.error).map((key, i) => {
                                                        return (
                                                            <div key={i} className="w-100 at2_harvest_date_text"
                                                                style={{ clear: 'both' }}>
                                                                * {t(this.state.vPopup.error[key])}
                                                            </div>
                                                        )
                                                    })

                                                }
                                            </form>}



                                        </div>
                                    </div>}
                                </div>
                            </div>}
                        </div>
                    )
                })}
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
    investeringOutput: state.modelScreen.investeringOutput,
    graphOutput: state.modelScreen.graphOutput,
    blockOutput: state.modelScreen.blockOutput,
    pdfOutput: state.modelScreen.pdfOutput,
    screenSize: state.page.screenSize,
    vaccineNames: state.vaccineModelScreen.vaccineNames,
    cvFrom: state.priceModule.cvFrom,
    snittvektFrom: state.priceModule.snittvektFrom,
    vaccineCaseLabels: state.vaccineModelScreen.vaccineCaseLabels,
    blockScrollHeight: state.modelScreen.blockScrollHeight,
})

export default connect(mapStateToProps, {
    toggleModelScreenBlockExpand,
    setModelScreenInputs,
    setVaccineModelResult,
    templateList,
    mtbBlockList,
    showInfoPopup,
    showPriceModulePopup,
    setPriceModuleDefaultInputs,
    setPriceModuleInputs,
    hideModelOutputSpinner,
    takePriceModuleCVFrom,
    takePriceModuleSnittvektFrom,
    setVaccineCaseLabels,
    setGraphHelpText,
})(withTranslation()(BlocksInputs));

