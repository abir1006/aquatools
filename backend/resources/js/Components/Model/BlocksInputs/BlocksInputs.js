import React, { Component } from 'react';
import { connect } from 'react-redux';
import './BlocksInputs.css';
import {
    toggleModelScreenBlockExpand,
    setModelScreenInputs,
    setModelResult,
    mtbBlockList,
    setGraphHelpText,
} from "../../../Store/Actions/MTBActions";
import { templateList } from "../../../Store/Actions/TemplateActions";
import { showInfoPopup, showPriceModulePopup } from "../../../Store/Actions/popupActions";
import { setPriceModuleDefaultInputs } from "../../../Store/Actions/PriceModuleActions";
import { Slider } from 'material-ui-slider';
import InputNumber from "../../Inputs/InputNumber";
import NavService from "../../../Services/NavServices";
import ButtonSpinner from "../../Spinners/ButtonSpinner";
import KostNytte from "../ModelOutput/KostNytte/KostNytte";
import ActionButton from "../../ActionButton/ActionButton";
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";
import { number_format } from "../../../Services/NumberServices";
import { withTranslation } from 'react-i18next';

class BlocksInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blockInputSpinner: false,
            blockInputPanelHeight: '',
            biologiskBlockExpand: true
        }
    }

    biologiskBlockExpandHandler() {
        this.setState({
            ...this.state,
            biologiskBlockExpand: this.state.biologiskBlockExpand !== true
        })
    }

    addPriceModule() {
        //this.props.setPriceModuleDefaultInputs(this.props.caseNumbers);
        this.props.showPriceModulePopup();
    }

    async componentDidMount() {
        await this.setState({
            ...this.state,
            blockInputSpinner: true
        });
        // get all blocks and inputs
        const modelSlug = NavService.getCurrentRoute();
        const authCompanyId = this.props.auth.data.user.company_id;
        this.props.setGraphHelpText();
        // set blocks and inputs states
        await this.props.mtbBlockList(modelSlug, authCompanyId);
        // get all template list in this models
        const modelID = this.props.tool_id;
        const authUserId = this.props.auth.data.user.id;
        await this.props.templateList(modelID, authUserId);

        // set smoltpris_per_kg calculation with default value

        // const caseNumbers = this.props.caseNumbers;
        // caseNumbers.map(caseNo => {
        //     const smoltprisPerFisk = this.props.inputs['mtb_priser_smoltpris_per_fisk_case' + caseNo];
        //     const smoltvektGram = this.props.inputs['mtb_produksjon_smoltvekt_gram_case' + caseNo];
        //     this.props.inputs['mtb_priser_smoltpris_per_kg_case' + caseNo] = (smoltprisPerFisk * 1000) / smoltvektGram
        // });

        // prepare default outputs and generate graphs
        await this.props.setModelResult(this.props.inputs, this.props.caseNumbers, 'mtb');


        await this.setState({
            ...this.state,
            blockInputSpinner: false
        });

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

            this.props.setModelResult(this.props.inputs, this.props.caseNumbers);

        }.bind(this)
    }

    async modelScreenInputChangeHandler(inputTarget) {
        const { name, value } = inputTarget;

        // set auto calculated smoltpris_per_kg

        // const inputCaseNo = name.substr(name.length - 1);
        // let fieldValue = value;

        // if ('mtb_priser_smoltpris_per_fisk_case' === name.slice(0, -1) && fieldValue !== '-') {
        //     const smoltvektGram = this.props.inputs['mtb_produksjon_smoltvekt_gram_case' + inputCaseNo];
        //     await this.props.setModelScreenInputs({
        //         ['mtb_priser_smoltpris_per_kg_case' + inputCaseNo]: parseFloat(smoltvektGram) === 0.00 ? 0 : (fieldValue * 1000) / smoltvektGram
        //     });
        // }
        //
        // if ('mtb_produksjon_smoltvekt_gram_case' === name.slice(0, -1) && fieldValue !== '-') {
        //     const smoltprisPerFisk = this.props.inputs['mtb_priser_smoltpris_per_fisk_case' + inputCaseNo];
        //     await this.props.setModelScreenInputs({
        //         ['mtb_priser_smoltpris_per_kg_case' + inputCaseNo]: parseFloat(fieldValue) === 0.00 ? 0 : (smoltprisPerFisk * 1000) / fieldValue
        //     });
        // }

        await this.props.setModelScreenInputs({
            [name]: value
        });

        // update graph output as soon as input changed
        this.props.setModelResult(this.props.inputs, this.props.caseNumbers);

    }

    viewHelpTextHandler(e, helpText) {
        const { t } = this.props;
        const hardCodedKeys = ['rpp_effect'];

        const infoText = !Boolean(helpText) ? t('no_help_text_found') : (hardCodedKeys.includes(helpText) ? helpText : t(helpText));
        const selectedHelpTextIconBtnYPosition = document.getElementById(e.target.id).getBoundingClientRect().top;
        this.props.showInfoPopup(infoText, e.pageX, selectedHelpTextIconBtnYPosition);
    }

    render() {

        const { t } = this.props;

        const blockStatus = this.props.blockStatus;
        const blockExpand = this.props.blockExpand;

        let inputCount = 0;
        let inputCaseCount = 0;
        let blockCount = 0;
        let helpTextIcon = 0;

        let investCaseNumbers = [];

        if (this.props.investeringOutput !== undefined) {
            for (let caseNo = 0; caseNo < Object.keys(this.props.investeringOutput).length; caseNo++) {
                investCaseNumbers[caseNo] = caseNo;
            }
        }

        const blockInputPanelHeight = this.props.screenSize >= 768 ? this.props.blockScrollHeight + 'px' : '100%';

        let basicBlocks = [];
        let biologiskBlocks = [];
        let investeringBlock = [];

        // extract blocks

        if (this.props.blockData.length > 0) {
            basicBlocks[0] = this.props.blockData[0];
            basicBlocks[1] = this.props.blockData[1];
            biologiskBlocks[0] = this.props.blockData[2];
            biologiskBlocks[1] = this.props.blockData[3];
            biologiskBlocks[2] = this.props.blockData[4];
            investeringBlock[0] = this.props.blockData[5];
        }

        return (
            <div className="block-input-wrapper" id="model_block_inputs" style={{ height: blockInputPanelHeight }}>
                {this.state.blockInputSpinner && <div className="spinner_wrap">
                    <ButtonSpinner showSpinner={this.state.blockInputSpinner} />
                </div>}
                {this.state.blockInputSpinner === false && basicBlocks.length > 0 && basicBlocks.map(block => {
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
                                            {block.column_no === 1 && <form>
                                                {block.block_inputs.map(input => {

                                                    // hide field
                                                    if (input.slug === 'mtb_priser_variabel_drifstkost_per_kons_dag_nok') {
                                                        return null;
                                                    }

                                                    inputCount++;
                                                    blockInputCount++;
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
                                                                                {
                                                                                    // set add price modul button for lakes price
                                                                                    block.slug === 'mtb_priser' && input.slug === 'mtb_priser_laksepris' &&
                                                                                    <span>
                                                                                        {
                                                                                            this.props.screenSize >= 768 &&
                                                                                            <SaveButtonSmall
                                                                                                onClickHandler={this.addPriceModule.bind(this)}
                                                                                                name={"+ " + t('add_price')} />
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
                                                                            className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                            {
                                                                                caseNumbers.map(caseNumber => {
                                                                                    inputCaseCount++;

                                                                                    // set plain text in priser block > forpris field for case 2 3...
                                                                                    if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_forpris' && caseNumber > 1) {

                                                                                        let forpris = this.props.inputs[input.slug + '_case1'];

                                                                                        return (<div key={inputCaseCount}
                                                                                            style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left'
                                                                                            }}>
                                                                                            {forpris || ''}
                                                                                        </div>
                                                                                        )

                                                                                    }

                                                                                    // set plain text in priser block > forpris field for case 2 3...
                                                                                    if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_ddfisk_per_kg' && caseNumber > 1) {

                                                                                        let deadfishValue = this.props.inputs[input.slug + '_case1'];

                                                                                        return (<div key={inputCaseCount}
                                                                                            style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left'
                                                                                            }}>

                                                                                            {deadfishValue || ''}

                                                                                        </div>
                                                                                        )

                                                                                    }

                                                                                    // set auto calculated readonly in priser block > smoltpris_per_kg field
                                                                                    // if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_smoltpris_per_kg') {
                                                                                    //     let smoltvekt = this.props.inputs['mtb_produksjon_smoltvekt_gram_case' + caseNumber];
                                                                                    //     if (smoltvekt === '-') {
                                                                                    //         smoltvekt = -1;
                                                                                    //     }
                                                                                    //     let smoltprisPerFisk = this.props.inputs['mtb_priser_smoltpris_per_fisk_case' + caseNumber];
                                                                                    //     if (smoltprisPerFisk === '-') {
                                                                                    //         smoltprisPerFisk = -1;
                                                                                    //     }
                                                                                    //     let smoltPrisPerKg = parseFloat(smoltvekt) === 0.00 ? 0 : (smoltprisPerFisk * 1000 / smoltvekt).toFixed(2);
                                                                                    //
                                                                                    //
                                                                                    //     return (<div key={inputCaseCount}
                                                                                    //         style={{
                                                                                    //             padding: '9px 20.5px',
                                                                                    //             width: divWidth + '%',
                                                                                    //             float: 'left'
                                                                                    //         }}>
                                                                                    //
                                                                                    //         {smoltPrisPerKg || ''}
                                                                                    //
                                                                                    //     </div>
                                                                                    //     )
                                                                                    //
                                                                                    // }

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
                                                                                                fieldValue={this.props.inputs[input.slug + '_case' + caseNumber] || ''} />
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
                                                                                onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                i
                                                                        </button>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                            {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                inputCaseCount++;
                                                                if (input.range_slider === 1) {
                                                                    let inputMaxValue = parseFloat(input.max_value);
                                                                    let inputValue = parseFloat(this.props.inputs[input.slug + '_case' + caseNumber]) * input.divided_by;
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
                                                                                    onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)} />
                                                                            </div>
                                                                            <div
                                                                                className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                <InputNumber
                                                                                    fieldName={input.slug + '_case' + caseNumber}
                                                                                    fieldID={input.slug + '_case' + caseNumber}
                                                                                    fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                    fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                            </div>
                                                                            <div
                                                                                className="col-2 col-xl-1 col-lg-2 col-md-1 col-sm-1 pl-0">
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
                                                                    if (input.slug === 'mtb_selskap_mtb_per_kons') {
                                                                        const calcMTB = this.props.inputs['mtb_selskap_mtb_per_kons_case' + caseNumber] * this.props.inputs['mtb_selskap_antall_konsesjoner_case' + caseNumber];
                                                                        return (
                                                                            <div key={inputCaseCount}
                                                                                className="row mb-2">
                                                                                <div
                                                                                    className="col-3 col-xl-4 col-lg-4 col-md-3 col-sm-3">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        {block.has_cases === 1 &&
                                                                                            <span
                                                                                                className="case_number">{caseNumber + '. '}</span>}
                                                                                        {t(input.name)}
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-3 col-xl-4 col-lg-3 col-md-4 col-sm-4 pr-xl-1">
                                                                                    <InputNumber
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                                </div>

                                                                                <div id="mtb_total"
                                                                                    className="col-4 col-xl-3 col-lg-4 col-md-3 col-sm-3 pr-xl-1">
                                                                                    <p>MTB: <b>{number_format(calcMTB, 0, '.', ' ')}</b>
                                                                                    </p>
                                                                                </div>

                                                                                <div
                                                                                    className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
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
                                                                                    fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                            </div>
                                                                            <div
                                                                                className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
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
                                            </form>}
                                        </div>
                                    </div>}
                            </div>
                        </div>}
                    </div>
                    )
                })}
                <div className="section-block">
                    <div className="content-block p-2">
                        <div className="screen-block-label"
                            onClick={() => this.biologiskBlockExpandHandler()}>{t('biological_optimization')}
                            {this.state.biologiskBlockExpand && <i className="fa fa-angle-up"></i>}
                            {this.state.biologiskBlockExpand === false && <i className="fa fa-angle-down"></i>}
                        </div>
                        {this.state.biologiskBlockExpand && <div>
                            {this.state.blockInputSpinner === false && biologiskBlocks.length > 0 && biologiskBlocks.map(block => {
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
                                    {blockStatus[block.slug + '_show'] && <div className="section-block m-0">
                                        <div className="content-block p-2">
                                            <div
                                                className="screen-block-label"
                                                onClick={() => this.blockExpandCollapseHandler(block.slug)}>{t(block.name)}
                                                {blockExpand[block.slug + '_expand'] &&
                                                    <i className="fa fa-angle-up"></i>}
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
                                                                return (
                                                                    <div key={inputCount}>
                                                                        {block.case_type === 'Column' &&
                                                                            <div>
                                                                                {blockInputCount === 1 &&
                                                                                    <div className="row mb-2">
                                                                                        <div
                                                                                            className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                            {
                                                                                                caseNumbers.map(caseNumber => {
                                                                                                    return (
                                                                                                        <div key={caseNumber}
                                                                                                            style={{
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
                                                                                        <div
                                                                                            className="model-screen-field-label">
                                                                                            {t(input.name)}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                        {
                                                                                            caseNumbers.map(caseNumber => {
                                                                                                inputCaseCount++;

                                                                                                // set plain text in priser block > forpris field for case 2 3...
                                                                                                if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_forpris' && caseNumber > 1) {

                                                                                                    let forpris = this.props.inputs[input.slug + '_case1'];

                                                                                                    return (
                                                                                                        <div
                                                                                                            key={inputCaseCount}
                                                                                                            style={{
                                                                                                                padding: '9px 20.5px',
                                                                                                                width: divWidth + '%',
                                                                                                                float: 'left'
                                                                                                            }}>

                                                                                                            {forpris || ''}

                                                                                                        </div>
                                                                                                    )

                                                                                                }

                                                                                                // set plain text in priser block > forpris field for case 2 3...
                                                                                                if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_ddfisk_per_kg' && caseNumber > 1) {

                                                                                                    let deadfishValue = this.props.inputs[input.slug + '_case1'];

                                                                                                    return (
                                                                                                        <div
                                                                                                            key={inputCaseCount}
                                                                                                            style={{
                                                                                                                padding: '9px 20.5px',
                                                                                                                width: divWidth + '%',
                                                                                                                float: 'left'
                                                                                                            }}>

                                                                                                            {deadfishValue || ''}

                                                                                                        </div>
                                                                                                    )

                                                                                                }
                                                                                                return (
                                                                                                    <div
                                                                                                        key={inputCaseCount}
                                                                                                        style={{
                                                                                                            paddingLeft: '7.5px',
                                                                                                            width: divWidth + '%',
                                                                                                            float: 'left'
                                                                                                        }}>

                                                                                                        <InputNumber
                                                                                                            fieldName={input.slug + '_case' + caseNumber}
                                                                                                            fieldID={input.slug + '_case' + caseNumber}
                                                                                                            fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                            fieldValue={this.props.inputs[input.slug + '_case' + caseNumber || '']} />
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
                                                                                            onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                            i
                                                                                    </button>}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                        {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                            inputCaseCount++;
                                                                            if (input.range_slider === 1) {
                                                                                let inputMaxValue = parseFloat(input.max_value);
                                                                                let inputValue = parseFloat(this.props.inputs[input.slug + '_case' + caseNumber]) * input.divided_by;
                                                                                let sliderValue = inputValue > inputMaxValue ? inputMaxValue : inputValue;
                                                                                return (
                                                                                    <div key={inputCaseCount}
                                                                                        className="row mb-2">
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
                                                                                                onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)} />
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                            <InputNumber
                                                                                                fieldName={input.slug + '_case' + caseNumber}
                                                                                                fieldID={input.slug + '_case' + caseNumber}
                                                                                                fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-2 col-xl-1 col-lg-2 col-md-1 col-sm-1 pl-0">
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
                                                                            } else {
                                                                                if (input.slug === 'mtb_selskap_antall_konsesjoner') {
                                                                                    return (
                                                                                        <div key={inputCaseCount}
                                                                                            className="row mb-2">
                                                                                            <div
                                                                                                className="col-3 col-xl-4 col-lg-4 col-md-3 col-sm-3">
                                                                                                <div
                                                                                                    className="model-screen-field-label">
                                                                                                    {block.has_cases === 1 &&
                                                                                                        <span
                                                                                                            className="case_number">{caseNumber + '. '}</span>}
                                                                                                    {t(input.name)}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div
                                                                                                className="col-3 col-xl-4 col-lg-3 col-md-4 col-sm-4 pr-xl-1">
                                                                                                <InputNumber
                                                                                                    fieldName={input.slug + '_case' + caseNumber}
                                                                                                    fieldID={input.slug}
                                                                                                    fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                    fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                                            </div>

                                                                                            <div id="mtb_total"
                                                                                                className="col-4 col-xl-3 col-lg-4 col-md-3 col-sm-3 pr-xl-1">
                                                                                                <p>MTB: <b>{780 * this.props.inputs[input.slug + '_case' + caseNumber]}</b>
                                                                                                </p>
                                                                                            </div>

                                                                                            <div
                                                                                                className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
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
                                                                                    );
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
                                                                                            <InputNumber
                                                                                                fieldName={input.slug + '_case' + caseNumber}
                                                                                                fieldID={input.slug + '_case' + caseNumber}
                                                                                                fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
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
                        </div>}
                    </div>
                </div>
                {this.state.blockInputSpinner === false && investeringBlock.length > 0 && investeringBlock.map(block => {
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
                                            {block.column_no === 1 && <form>
                                                {block.block_inputs.map(input => {
                                                    inputCount++;
                                                    blockInputCount++;
                                                    return (
                                                        <div key={inputCount}>
                                                            {block.case_type === 'Column' &&
                                                                <div>
                                                                    {blockInputCount === 1 && <div className="row mb-2">
                                                                        <div
                                                                            className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                            {block.slug === 'mtb_investering' &&
                                                                                <b>{t('investment_costs')}</b>}
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
                                                                    {block.slug === 'mtb_investering' && blockInputCount === 3 &&
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                <div className="model-screen-field-label">
                                                                                    {t('depreciation_cost_per_year_nok_1000')}
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                {
                                                                                    investCaseNumbers.map(caseNumber => {
                                                                                        return (
                                                                                            <div key={caseNumber} style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left',
                                                                                                textAlign: 'left'
                                                                                            }}>
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].avskrivingPerAr === 0 && '-'}
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].avskrivingPerAr !== 0 && number_format(this.props.investeringOutput['case' + (caseNumber + 1)].avskrivingPerAr.toFixed(2), 2, '.', ' ')}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>}
                                                                    {block.slug === 'mtb_investering' && blockInputCount === 4 &&
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                <div className="model-screen-field-label">
                                                                                    {t('residual_value_nok_1000')}
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                {
                                                                                    investCaseNumbers.map(caseNumber => {
                                                                                        return (
                                                                                            <div key={caseNumber} style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left',
                                                                                                textAlign: 'left'
                                                                                            }}>
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].restverdi === 0 && '-'}
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].restverdi !== 0 && number_format(this.props.investeringOutput['case' + (caseNumber + 1)].restverdi.toFixed(2), 2, '.', ' ')}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>}
                                                                    {block.slug === 'mtb_investering' && blockInputCount === 4 &&
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                <div className="model-screen-field-label">
                                                                                    {t('capital_base')}
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                {
                                                                                    investCaseNumbers.map(caseNumber => {
                                                                                        return (
                                                                                            <div key={caseNumber} style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left',
                                                                                                textAlign: 'left'
                                                                                            }}>
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].kapitalgrunnlag === 0 && '-'}
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].kapitalgrunnlag !== 0 && number_format(this.props.investeringOutput['case' + (caseNumber + 1)].kapitalgrunnlag.toFixed(2), 2, '.', ' ')}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>}
                                                                    {block.slug === 'mtb_investering' && blockInputCount === 5 &&
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                <div className="model-screen-field-label">
                                                                                    {t('interest_nok_1000_per_year')}
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                {
                                                                                    investCaseNumbers.map(caseNumber => {
                                                                                        return (
                                                                                            <div key={caseNumber} style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left',
                                                                                                textAlign: 'left'
                                                                                            }}>
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].rentePerAr === 0 && '-'}
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].rentePerAr !== 0 && number_format(this.props.investeringOutput['case' + (caseNumber + 1)].rentePerAr.toFixed(2), 2, '.', ' ')}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>}
                                                                    {block.slug === 'mtb_investering' && blockInputCount === 5 &&
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                <div className="model-screen-field-label">
                                                                                    <b>{t('total_investment_cost_per_year_nok_1000')}</b>
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                                {
                                                                                    investCaseNumbers.map(caseNumber => {
                                                                                        return (
                                                                                            <div key={caseNumber} style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left',
                                                                                                textAlign: 'left'
                                                                                            }}>
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].sumInvesteringPerAr === 0 && '-'}
                                                                                                {this.props.investeringOutput['case' + (caseNumber + 1)].sumInvesteringPerAr !== 0 &&
                                                                                                    <b>{number_format(this.props.investeringOutput['case' + (caseNumber + 1)].sumInvesteringPerAr.toFixed(2), 2, '.', ' ')}</b>}
                                                                                            </div>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div>}
                                                                    {block.slug === 'mtb_investering' && blockInputCount === 5 &&
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                                <div className="model-screen-field-label">
                                                                                    <b>{t('annual_cost')}</b>
                                                                                </div>
                                                                            </div>
                                                                        </div>}
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

                                                                                    // set plain text in priser block > forpris field for case 2 3...
                                                                                    if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_forpris' && caseNumber > 1) {

                                                                                        let forpris = this.props.inputs[input.slug + '_case1'];

                                                                                        return (<div key={inputCaseCount}
                                                                                            style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left'
                                                                                            }}>

                                                                                            {forpris || ''}

                                                                                        </div>
                                                                                        )

                                                                                    }

                                                                                    // set plain text in priser block > forpris field for case 2 3...
                                                                                    if (block.slug === 'mtb_priser' && input.slug === 'mtb_priser_ddfisk_per_kg' && caseNumber > 1) {

                                                                                        let deadfishValue = this.props.inputs[input.slug + '_case1'];

                                                                                        return (<div key={inputCaseCount}
                                                                                            style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left'
                                                                                            }}>

                                                                                            {deadfishValue || ''}

                                                                                        </div>
                                                                                        )

                                                                                    }


                                                                                    // set plain text in priser block > forpris field for case 2 3...
                                                                                    if (block.slug === 'mtb_investering' && input.slug === 'mtb_investering_merpris_for_nok_kg' && caseNumber === 1) {

                                                                                        return (<div key={inputCaseCount}
                                                                                            style={{
                                                                                                padding: '9px 20.5px',
                                                                                                width: divWidth + '%',
                                                                                                float: 'left'
                                                                                            }}>


                                                                                        </div>
                                                                                        )

                                                                                    }

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
                                                                                                fieldValue={this.props.inputs[input.slug + '_case' + caseNumber || '']} />
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
                                                                                onClick={e => this.viewHelpTextHandler(e, input.help_text)}>
                                                                                i
                                                                        </button>}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                            {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                inputCaseCount++;
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
                                                                                    onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)} />
                                                                            </div>
                                                                            <div
                                                                                className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                <InputNumber
                                                                                    fieldName={input.slug + '_case' + caseNumber}
                                                                                    fieldID={input.slug + '_case' + caseNumber}
                                                                                    fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                    fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                            </div>
                                                                            <div
                                                                                className="col-2 col-xl-1 col-lg-2 col-md-1 col-sm-1 pl-0">
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
                                                                    if (input.slug === 'mtb_selskap_antall_konsesjoner') {
                                                                        return (
                                                                            <div key={inputCaseCount}
                                                                                className="row mb-2">
                                                                                <div
                                                                                    className="col-3 col-xl-4 col-lg-4 col-md-3 col-sm-3">
                                                                                    <div
                                                                                        className="model-screen-field-label">
                                                                                        {block.has_cases === 1 &&
                                                                                            <span
                                                                                                className="case_number">{caseNumber + '. '}</span>}
                                                                                        {t(input.name)}
                                                                                    </div>
                                                                                </div>
                                                                                <div
                                                                                    className="col-3 col-xl-4 col-lg-3 col-md-4 col-sm-4 pr-xl-1">
                                                                                    <InputNumber
                                                                                        fieldName={input.slug + '_case' + caseNumber}
                                                                                        fieldID={input.slug}
                                                                                        fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                        fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                                </div>

                                                                                <div id="mtb_total"
                                                                                    className="col-4 col-xl-3 col-lg-4 col-md-3 col-sm-3 pr-xl-1">
                                                                                    <p>{t('mtb')}: <b>{780 * this.props.inputs[input.slug + '_case' + caseNumber]}</b>
                                                                                    </p>
                                                                                </div>

                                                                                <div
                                                                                    className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
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
                                                                                    fieldID={input.slug + '_case' + caseNumber}
                                                                                    fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                    fieldValue={this.props.inputs[input.slug + '_case' + caseNumber]} />
                                                                            </div>
                                                                            <div
                                                                                className="col-2 col-xl-1 col-lg-1 col-md-2 col-sm-2 pl-0">
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
                                            </form>}
                                        </div>
                                    </div>}
                            </div>
                        </div>}
                    </div>
                    )
                })}

                {/*Kost-Nytte block*/}

                <div className="section-block">
                    <div className="content-block p-2">
                        <div className="screen-block-label"
                            onClick={e => this.blockExpandCollapseHandler('model_output_block')}>{t('cost_benefit')}
                            {blockExpand['model_output_block_expand'] && <i className="fa fa-angle-up"></i>}
                            {blockExpand['model_output_block_expand'] === false &&
                                <i className="fa fa-angle-down"></i>}
                        </div>
                        {blockExpand['model_output_block_expand'] && <div className="screen-block-inputs">
                            {this.props.outputSpinner === true && <div className="spinner_wrap">
                                <ButtonSpinner showSpinner={this.props.outputSpinner} />
                            </div>}
                            {this.props.outputSpinner === false && <KostNytte />}
                        </div>}
                    </div>
                </div>
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
    outputSpinner: state.modelScreen.outputSpinner,
    blockScrollHeight: state.modelScreen.blockScrollHeight,
})

export default connect(mapStateToProps, {
    toggleModelScreenBlockExpand,
    setModelScreenInputs,
    setModelResult,
    templateList,
    mtbBlockList,
    showInfoPopup,
    showPriceModulePopup,
    setPriceModuleDefaultInputs,
    setGraphHelpText,
})(withTranslation()(BlocksInputs));

