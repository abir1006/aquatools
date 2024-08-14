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
import {setOptModelResult} from "../../../../Store/Actions/OptModelActions";
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
import ValidationPopup from '../../../Popups/ValidationPopup';
import {withTranslation} from 'react-i18next';

class BlocksInputs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blockInputSpinner: false,
            blockInputPanelHeight: '',
            releaseMoment: moment(),
            harvestMoment: moment(),
            outOfRangErrors: {},
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
                    'optimalisering_grunnforutsetninger_nedklassing_prod_case1': [
                        'optimalisering_grunnforutsetninger_redusert_pris_prod_per_kg',
                        'optimalisering_effekter_forbedring_produksjon_reduksjon_prodkost_per_kg',
                        'optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng'
                    ],
                    'optimalisering_grunnforutsetninger_ord_case1': [
                        'optimalisering_grunnforutsetninger_redusert_pris_ord_per_kg',
                        'optimalisering_effekter_forbedring_produksjon_redusert_pris_ord_per_kg'
                    ],
                    'optimalisering_grunnforutsetninger_ddelighet_case1': [
                        'optimalisering_grunnforutsetninger_snittvekt_ddfisk_kg',
                        'optimalisering_grunnforutsetninger_kostnad_ddfisk_kr_per_kg'
                    ]
                }
            }
        }

        this.validationPopupNoHandler = this.validationPopupNoHandler.bind(this);
        this.validationPopupYesHandler = this.validationPopupYesHandler.bind(this);
    }

    //validation popup

    validationPopupNoHandler() {
        const {vPopup} = this.state;

        this.props.setModelScreenInputs({
            [vPopup.currentField]: vPopup.lastValue[vPopup.currentField] || '0'
        });

        const element = document.getElementsByName(vPopup.currentField)[0];
        this.hideValidationPopup(element);

        // update timeline, graph output as soon as input changed
        setTimeout(() => {
            this.props.setOptModelResult(this.props.inputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);
        }, 500);


    }

    validationPopupYesHandler() {
        const {vPopup} = this.state;
        const {oldValues} = vPopup;
        let el;
        let id;
        let values = oldValues;

        if (vPopup.text !== "vaccination_bcr_is_negative") {
            const dependents = vPopup.dependentsFields[vPopup.currentField];

            dependents.forEach((field, i) => {

                this.props.caseNumbers.forEach((inputCaseNo, i) => {
                    id = field + '_case' + inputCaseNo;

                    //store old values
                    values = {...values, [id]: this.props.inputs[id]}

                    //reset dependants fields to 0;
                    this.props.setModelScreenInputs({
                        [id]: 0
                    });
                });
            });

            //update old values state
            vPopup.oldValues = values;
            this.setState({vPopup: vPopup});
            vPopup.fields.push(vPopup.currentField);
        }

        vPopup.show = false;
        if (vPopup.text === "vaccination_bcr_is_negative") {
            this.props.caseNumbers.slice(1, this.props.caseNumbers.length).map(caseNo => {
                const bcrValue = parseFloat(this.props.graphOutput.nytteKostRatio2['Case' + caseNo]);
                let index = vPopup.fields.indexOf('bcr_graph_case' + caseNo);
                if (bcrValue < 0 && index === -1) {
                    vPopup.fields.push("bcr_graph_case" + caseNo);
                }
            });

        }
        vPopup.currentField = '';
        this.setState({vPopup: vPopup});
    }

    getElementPosition(el) {

        const bodyRect = document.body.getBoundingClientRect();
        const elemRect = el.getBoundingClientRect();
        const x = elemRect.top - bodyRect.top;
        const y = elemRect.top;
        return {x: x, y: y}
    }

    showValidationPopup(text, e) {

        const {vPopup} = this.state;

        vPopup.show = false;
        vPopup.text = text;
        vPopup.currentField = e.name;
        const {x, y} = this.getElementPosition(e);
        vPopup.xPosition = x;
        vPopup.yPosition = y;
        vPopup.error = {...vPopup.error, [e.name]: text};
        this.setState({vPopup: vPopup})
    }

    hideValidationPopup(e) {

        const {vPopup} = this.state;
        const {error} = vPopup;
        delete error[e?.name];

        vPopup.show = false;
        vPopup.text = "";
        vPopup.error = error;
        this.setState({vPopup: vPopup})

    }

    restoreOldValues(name) {
        const {vPopup} = this.state;
        let id;

        // if (name in vPopup.dependentsFields) {

        //     const fields = vPopup.dependentsFields[name];

        //     fields.forEach((field, i) => {

        //         this.props.caseNumbers.forEach((inputCaseNo, i) => {

        //             id = field + '_case' + inputCaseNo;

        //             if (typeof vPopup.oldValues[id] != 'undefined') {
        //                 this.props.setModelScreenInputs({
        //                     [id]: vPopup.oldValues[id]
        //                 });
        //             }

        //         });
        //     });
        // }

    }

    setDefaultValuesToParentFields() {

        //store default values to validations popup parent fields
        const {vPopup} = this.state;
        const {lastValue} = vPopup;
        let values = lastValue;
        Object.keys(vPopup.dependentsFields).map((key, i) => {

            if (!(key in vPopup.lastValue)) {
                values = {...values, [key]: this.props.inputs[key] || '0'}
            }
        });
        vPopup.lastValue = values;
        this.setState({vPopup: vPopup});
    }

    addBlurEvents() {

        var self = this;
        const {vPopup} = this.state;

        Object.keys(vPopup.dependentsFields).map((name, i) => {
            const element = document.getElementsByName(name)[0];
            element.addEventListener('blur', (e) => self.onBlurHandler(e));
        });

    }

    onBlurHandler(e) {

        const {vPopup} = this.state;
        if (Boolean(vPopup.currentField) && Object.keys(vPopup.error).length !== 0) {
            vPopup.show = true;
            this.setState({vPopup: vPopup});
        }
    }

    // end of validation code

    addPriceModule() {
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
        await this.props.setOptModelResult(this.props.inputs, this.props.caseNumbers, 'optimalisering');
        this.props.hideModelOutputSpinner();

        await this.setState({
            ...this.state,
            blockInputSpinner: false
        });

        //validation popup
        this.setDefaultValuesToParentFields();
        this.addBlurEvents();

    }

    componentDidUpdate(prevProps, prevState) {
        // Check if template list changed & bcr negative found
        if (prevProps?.template?.selectedTemplate !== this.props?.template?.selectedTemplate) {
            setTimeout(() => {
                // this.checkBCR()
            }, 500)
        }
    }

    blockExpandCollapseHandler(blockSlug) {
        this.props.toggleModelScreenBlockExpand(blockSlug);
    }

    forbedringBlockExpandCollapse(blockCase) {
        this.setState({
            ...this.state,
            [blockCase]: !(this.state[blockCase] === undefined || this.state[blockCase] === true)
        })
    }

    inputRangeChangeHandler(name) {
        return function (value) {
            const dividedBy = name.split(',')[1];
            const fieldName = name.split(',')[0];
            const inputCaseNo = fieldName.substr(fieldName.length - 1);

            // sync nedklassing_prod % and kvalitet prod %
            if ('optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng_case' === fieldName.slice(0, -1)) {
                this.props.setModelScreenInputs({
                    ['optimalisering_kvalitet_prod_case' + inputCaseNo]: value / dividedBy
                });
            }
            this.props.setModelScreenInputs({
                [fieldName]: value / dividedBy
            });
        }.bind(this)
    }

    rangeChangeCompleteHandler(name) {
        return async function (value) {
            // Freeze input if popup shows
            if (this.state.vPopup.show) {
                return false;
            }
            const originalFieldName = name.split(',')[0]
            await this.props.setOptModelResult(this.props.inputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);
            // this.checkBCR(originalFieldName, value)

        }.bind(this)
    }

    async modelScreenInputChangeHandler(inputTarget) {

        // Freeze input if popup shows
        if (this.state.vPopup.show) {
            return false;
        }

        const {name, value} = inputTarget;

        // Store last value for validation popup
        this.storeFieldLastValueForPopup(name, this.props.inputs[name])

        const {t} = this.props;

        const inputCaseNo = name.substr(name.length - 1);

        this.setState({
            ...this.state,
            outOfRangErrors: {}
        })

        //validation popup
        const {vPopup} = this.state;
        const element = document.getElementsByName(name)[0];
        //nedclassing %
        if (name === 'optimalisering_grunnforutsetninger_nedklassing_prod_case1') {
            if (!Boolean(parseFloat(value))) {
                const text = 'if_downgrading_prod_is_set_zero';
                this.showValidationPopup(text, element);
            } else {

                // store last value
                vPopup.lastValue[name] = value
                this.setState({vPopup: vPopup});

                this.hideValidationPopup(element);
                //restore oldvalue if any
                this.restoreOldValues(element.name);

            }

        }

        //ord %
        if (name === 'optimalisering_grunnforutsetninger_ord_case1') {

            if (!Boolean(parseFloat(value))) {
                const text = 'if_ord_percentage_is_set_zero';
                this.showValidationPopup(text, element);
            } else {

                // store last value
                vPopup.lastValue[name] = value
                this.setState({vPopup: vPopup});

                this.hideValidationPopup(element);
                //restore oldvalue if any
                this.restoreOldValues(element.name);

            }

        }
        //Dødelighet %
        if (name === 'optimalisering_grunnforutsetninger_ddelighet_case1') {

            if (!Boolean(parseFloat(value))) {
                const text = 'if_dead_percentage_is_set_zero';
                this.showValidationPopup(text, element);
            } else {

                // store last value
                vPopup.lastValue[name] = value
                this.setState({vPopup: vPopup});

                this.hideValidationPopup(element);
                //restore oldvalue if any
                this.restoreOldValues(element.name);

            }

        }

        // Sync prodkost per kg
        if ('optimalisering_grunnforutsetninger_redusert_pris_prod_per_kg_case' === name.slice(0, -1)) {
            this.props.caseNumbers.slice(0, this.props.caseNumbers.length).map(async caseNo => {
                await this.props.setModelScreenInputs({
                    ['optimalisering_effekter_forbedring_produksjon_reduksjon_prodkost_per_kg_case' + caseNo]: value
                });
            })
        }

        // Sync ordinary kost per kg
        if ('optimalisering_grunnforutsetninger_redusert_pris_ord_per_kg_case' === name.slice(0, -1)) {
            this.props.caseNumbers.slice(0, this.props.caseNumbers.length).map(async caseNo => {
                await this.props.setModelScreenInputs({
                    ['optimalisering_effekter_forbedring_produksjon_redusert_pris_ord_per_kg_case' + caseNo]: value
                });
            })
        }

        // sync nedklassing_prod % and kvalitet prod %
        if ('optimalisering_grunnforutsetninger_nedklassing_prod_case' === name.slice(0, -1)) {
            await this.props.setModelScreenInputs({
                ['optimalisering_kvalitet_prod_case' + inputCaseNo]: value
            });
        }

        // sync nedklassing_prod % and kvalitet prod %
        if ('optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng_case' === name.slice(0, -1)) {
            await this.props.setModelScreenInputs({
                ['optimalisering_kvalitet_prod_case' + inputCaseNo]: value
            });
        }

        // sync nedklassing_prod % and kvalitet prod %
        if ('optimalisering_kvalitet_prod_case' === name.slice(0, -1)) {

            if (parseInt(inputCaseNo) === 1) {
                await this.props.setModelScreenInputs({
                    ['optimalisering_grunnforutsetninger_nedklassing_prod_case' + inputCaseNo]: value
                });
            }

            if (parseInt(inputCaseNo) > 1) {
                await this.props.setModelScreenInputs({
                    ['optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng_case' + inputCaseNo]: value
                });
            }
        }

        await this.props.setModelScreenInputs({
            [name]: value
        });

        // update timeline, graph output as soon as input changed
        await this.props.setOptModelResult(this.props.inputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);

        // Render a validation popup if BCR goes to negative
        // this.checkBCR(name, value)

    }

    storeFieldLastValueForPopup(name, value) {
        const {vPopup} = this.state;
        vPopup.lastValue[name] = this.props.inputs[name]
        this.setState({vPopup: vPopup});
    }

    checkBCR(fieldName, value) {
        const {vPopup} = this.state;
        this.props.caseNumbers.slice(1, this.props.caseNumbers.length).map(caseNo => {
            const bcrValue = parseFloat(this.props.graphOutput.nytteKostRatio2['Case' + caseNo]);
            if (!vPopup.fields.includes('bcr_graph_case' + caseNo) && bcrValue < 0) {
                vPopup.show = true;
                vPopup.text = "vaccination_bcr_is_negative";
                vPopup.currentField = fieldName;
                vPopup.xPosition = 100;
                vPopup.yPosition = 500;
                this.setState({vPopup: vPopup})
                return false;
            }

            if (bcrValue >= 0) {
                let index = vPopup.fields.indexOf('bcr_graph_case' + caseNo);
                if (index !== -1) {
                    vPopup.fields.splice(index, 1);
                    this.setState({vPopup: vPopup})
                }
            }
        })
    }

    caseNameChangeHandler(inputTarget) {
        const {name, value} = inputTarget;
        this.props.setModelScreenInputs({
            [name]: value
        });
    }

    budgetNameChangeHandler(inputTarget) {
        const {name, value} = inputTarget;
        this.props.setModelScreenInputs({
            [name]: value
        });
    }

    viewHelpTextHandler(e, helpText) {
        const infoText = helpText === null || helpText === undefined || helpText === '' ? 'Help text not found' : helpText;
        const selectedHelpTextIconBtnYPosition = document.getElementById(e.target.id).getBoundingClientRect().top;
        this.props.showInfoPopup(infoText, e.pageX, selectedHelpTextIconBtnYPosition);
    }

    render() {
        const {t} = this.props;

        const reduceValueInputs = [
            'optimalisering_effekter_forbedring_produksjon_redusert_bfcr_enhet',
            'optimalisering_effekter_forbedring_produksjon_redusert_dde_prosentpoeng',
            'optimalisering_effekter_forbedring_produksjon_redusert_dde_vekt_kg',
            'optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng',
            'optimalisering_effekter_forbedring_produksjon_redusert_ord',
        ];

        const relatedCase1Inputs = {
            [reduceValueInputs[0]]: 'optimalisering_grunnforutsetninger_bfcr',
            [reduceValueInputs[1]]: 'optimalisering_grunnforutsetninger_ddelighet',
            [reduceValueInputs[2]]: 'optimalisering_grunnforutsetninger_snittvekt_ddfisk_kg',
            [reduceValueInputs[3]]: 'optimalisering_grunnforutsetninger_nedklassing_prod',
            [reduceValueInputs[4]]: 'optimalisering_grunnforutsetninger_ord',
        }

        let outOfRangeErrors = {};
        let kvalitetErrors = [];

        const blockStatus = this.props.blockStatus;
        const blockExpand = this.props.blockExpand;

        let inputCount = 0;
        let kvalitetInputCount = 0;
        let inputCaseCount = 0;
        let blockCount = 0;
        let helpTextIcon = 0;

        const blockInputPanelHeight = this.props.screenSize >= 768 ? this.props.blockScrollHeight + 'px' : '100%';

        let blocks = this.props.blockData;


        // Tiltak calculation

        let tiltalOutput = {}

        if (this.props.caseNumbers !== undefined) {
            this.props.caseNumbers.map(caseNo => {
                const investeringskostNOK1000 = !Boolean(this.props.inputs['optimalisering_tiltak_investeringskost_nok_1000_case' + caseNo]) ? 0 : parseFloat(this.props.inputs['optimalisering_tiltak_investeringskost_nok_1000_case' + caseNo]);
                const tiltakAvskrivingstidAr = !Boolean(this.props.inputs['optimalisering_tiltak_avskrivingstid_ar_case' + caseNo]) ? 0 : this.props.inputs['optimalisering_tiltak_avskrivingstid_ar_case' + caseNo];
                const avskrivingstidAr = parseFloat(tiltakAvskrivingstidAr);
                const tiltak_restverdi = !Boolean(this.props.inputs['optimalisering_tiltak_restverdi_case' + caseNo]) ? 0 : this.props.inputs['optimalisering_tiltak_restverdi_case' + caseNo];
                const restverdiNOK1000 = investeringskostNOK1000 * (parseFloat(tiltak_restverdi) / 100);
                const avskrivingPerAr = parseFloat(avskrivingstidAr) === 0.0 ? 0 : (investeringskostNOK1000 - restverdiNOK1000) / avskrivingstidAr;
                const kapitalgrunnlag = (investeringskostNOK1000 + restverdiNOK1000) / 2;
                const tiltakRente = !Boolean(this.props.inputs['optimalisering_tiltak_rente_case' + caseNo]) ? 0 : this.props.inputs['optimalisering_tiltak_rente_case' + caseNo];
                const rentePerAr = kapitalgrunnlag * (parseFloat(tiltakRente) / 100);
                const sumInvesteringPerAr = avskrivingPerAr + rentePerAr;
                tiltalOutput['case' + caseNo] = {
                    avskrivingPerAr: avskrivingPerAr,
                    kapitalgrunnlag: kapitalgrunnlag,
                    rentePerAr: rentePerAr,
                    restverdi: restverdiNOK1000,
                    sumInvesteringPerAr: sumInvesteringPerAr,

                }
            })
        }

        return (
            <div className="block-input-wrapper" id="model_block_inputs" style={{height: blockInputPanelHeight}}>
                {this.state.blockInputSpinner && <div className="spinner_wrap">
                    <ButtonSpinner showSpinner={this.state.blockInputSpinner}/>
                </div>}
                <ValidationPopup
                    {...this.state.vPopup}
                    yesHandler={this.validationPopupYesHandler}
                    noHandler={this.validationPopupNoHandler}
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

                    if (block.slug === 'optimalisering_effekter_forbedring_produksjon') {
                        const optimiseCaseNumbers = this.props.caseNumbers === undefined ? [1, 2] : this.props.caseNumbers;
                        return (
                            <div>
                                {
                                    optimiseCaseNumbers.slice(1, optimiseCaseNumbers.length).map(caseNo => {
                                        let caseStr = this.props.inputs['name_case' + caseNo];
                                        caseStr = caseStr === 'Case ' + caseNo ? t(caseStr.replace(' ', '').toLowerCase()) : caseStr;
                                        let defaultCaseName = 'Case' + caseNo;
                                        let forbedringBlock = this.state['forbedringCase' + caseNo] === undefined || this.state['forbedringCase' + caseNo] === true;
                                        return (
                                            <div>
                                                {
                                                    <div className="section-block">
                                                        <div className="content-block p-2">
                                                            <div
                                                                className="screen-block-label"
                                                                onClick={() => this.forbedringBlockExpandCollapse('forbedringCase' + caseNo)}>{t(block.name)}
                                                                {blockExpand[block.slug + '_expand'] &&
                                                                <i className="fa fa-angle-up"></i>}
                                                                {blockExpand[block.slug + '_expand'] === false &&
                                                                <i className="fa fa-angle-down"></i>}
                                                            </div>
                                                            {forbedringBlock &&
                                                            <div className="screen-block-inputs">
                                                                <div className="card block-card">
                                                                    <form>
                                                                        <div className="row mb-2">
                                                                            <div
                                                                                className="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                                                                <div
                                                                                    className="model-screen-field-label">
                                                                                    {t('grunnlag')}
                                                                                </div>
                                                                            </div>
                                                                            <div
                                                                                className="col-8 col-xl-7 col-lg-7 col-md-7 col-sm-7 pl-0 pr-0">
                                                                                <InputText
                                                                                    fieldName={'name_case' + caseNo}
                                                                                    fieldID={'name_case' + caseNo}
                                                                                    fieldOnChange={this.caseNameChangeHandler.bind(this)}
                                                                                    fieldValue={caseStr}/>
                                                                            </div>
                                                                        </div>

                                                                        {
                                                                            block.block_inputs.map(input => {
                                                                                inputCount++;
                                                                                blockInputCount++;
                                                                                let inputMaxValue = parseFloat(input.max_value);
                                                                                let inputValue = parseFloat(this.props.inputs[input.slug + '_case' + caseNo]) * input.divided_by;
                                                                                let sliderValue = inputValue > inputMaxValue ? inputMaxValue : inputValue;
                                                                                let numberFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNo] : '';
                                                                                numberFieldValue = numberFieldValue === null ? '' : numberFieldValue;

                                                                                let fieldValueType = undefined;
                                                                                let sliderMaxValue = input.max_value;

                                                                                let overRangError = false;

                                                                                // Set ranger max value according to case1 reduce inputs
                                                                                if (reduceValueInputs.includes(input.slug)) {
                                                                                    fieldValueType = 'negative';
                                                                                    sliderMaxValue = Math.abs(this.props.inputs[relatedCase1Inputs[input.slug] + '_case1'] * input.divided_by);
                                                                                    sliderValue = inputValue > sliderMaxValue ? sliderMaxValue : inputValue;

                                                                                    // show red order when input value is out of range compare to case1
                                                                                    if (Math.abs(numberFieldValue) > this.props.inputs[relatedCase1Inputs[input.slug] + '_case1']) {
                                                                                        outOfRangeErrors[input.slug] = t(input.name) + ' ( ' + numberFieldValue + ' ) ' + t('is_not_a_valid_input_comparing_to') + ' ' + t('basic_preconditions') + ' ' + t(input.name).replace(t('reduced'), '') + ': ' + this.props.inputs[relatedCase1Inputs[input.slug] + '_case1'];
                                                                                        overRangError = true;
                                                                                    }
                                                                                }


                                                                                return (
                                                                                    <div className="row mb-2">
                                                                                        <div
                                                                                            className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                                            <div
                                                                                                className="model-screen-field-label">
                                                                                                {t(input.name)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                                            <Slider
                                                                                                draggableTrack
                                                                                                onChangeComplete={this.rangeChangeCompleteHandler(input.slug + '_case' + caseNo + ',' + input.divided_by)}
                                                                                                id={input.slug}
                                                                                                color="#102640"
                                                                                                min={parseFloat(input.min_value)}
                                                                                                max={parseFloat(sliderMaxValue)}
                                                                                                value={sliderValue}
                                                                                                onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNo + ',' + input.divided_by)}/>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                            <InputNumber
                                                                                                isFieldEmpty={overRangError}
                                                                                                fieldValueType={fieldValueType}
                                                                                                fieldName={input.slug + '_case' + caseNo}
                                                                                                fieldID={input.slug + '_case' + caseNo}
                                                                                                fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                fieldValue={numberFieldValue}/>
                                                                                        </div>
                                                                                        <div
                                                                                            className="col-2 col-xl-1 col-lg-2 col-md-1 col-sm-1 pl-0">
                                                                                            {input.help_text !== null &&
                                                                                            <button
                                                                                                type="button"
                                                                                                id={'help-text-id-' + (++helpTextIcon)}
                                                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                                i
                                                                                            </button>}
                                                                                        </div>
                                                                                        {input.line_divider === 1 &&
                                                                                        <div className="col-12">
                                                                                            <div
                                                                                                className="input_divider"></div>
                                                                                        </div>}
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                        {
                                                                            Object.keys(outOfRangeErrors).map((key, keyNumber) => {
                                                                                return (
                                                                                    <div key={keyNumber}
                                                                                         className="w-100"
                                                                                         style={{clear: 'both'}}>
                                                                                        <p className="at2_error_text">{outOfRangeErrors[key]}</p>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </form>
                                                                </div>
                                                            </div>
                                                            }
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        );
                    }

                    let case1Str = this.props.inputs['name_case1'];
                    case1Str = case1Str === 'Case 1' ? t(case1Str.replace(' ', '').toLowerCase()) : case1Str;

                    let case2Str = this.props.inputs['name_case2'];
                    case2Str = case2Str === 'Case 2' ? t(case2Str.replace(' ', '').toLowerCase()) : case2Str;

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
                                            {block.column_no === 2 && <form>
                                                {
                                                    block.slug === 'optimalisering_grunnforutsetninger' &&
                                                    <div className="row mb-2">
                                                        <div
                                                            className="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                                            <div className="model-screen-field-label">
                                                                {t('simulation')}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="col-8 col-xl-8 col-lg-8 col-md-8 col-sm-8 pl-4 pr-4">
                                                            <InputText
                                                                fieldName="name_case1"
                                                                fieldID="name_case1"
                                                                fieldOnChange={this.budgetNameChangeHandler.bind(this)}
                                                                fieldValue={case1Str}/>
                                                        </div>
                                                    </div>
                                                }
                                                {
                                                    block.block_inputs.map(input => {
                                                        inputCount++;
                                                        blockInputCount++;
                                                        return (
                                                            <div>
                                                                <div key={inputCount} className="block_with_2_columns">
                                                                    {block.case_type === 'Row' && caseNumbers.map(caseNumber => {
                                                                            inputCaseCount++;
                                                                            let numberFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';
                                                                            numberFieldValue = numberFieldValue === null ? '' : numberFieldValue;
                                                                            return (
                                                                                <div key={inputCaseCount}
                                                                                     className="row mb-2">
                                                                                    <div
                                                                                        className="col-7 col-xl-7 col-lg-7 col-md-7 col-sm-8">
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
                                                                                    <div className="help_text_block">
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
                                                                    )}
                                                                </div>
                                                                {input.line_divider === 1 &&
                                                                <div className="input_divider"></div>}
                                                            </div>
                                                        )
                                                    })
                                                }

                                                {
                                                    Object.keys(this.state.vPopup.error).map((key, i) => {
                                                        return (
                                                            <div key={i} className="w-100 at2_harvest_date_text"
                                                                 style={{clear: 'both'}}>
                                                                * {t(this.state.vPopup.error[key])}
                                                            </div>
                                                        )
                                                    })

                                                }

                                            </form>}
                                            {block.column_no === 1 && <form>
                                                {
                                                    block.slug === 'optimalisering_effekter_forbedring_produksjon' &&
                                                    <div className="row mb-2">
                                                        <div
                                                            className="col-4 col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                                            <div className="model-screen-field-label">
                                                                Grunnlag
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="col-8 col-xl-7 col-lg-7 col-md-7 col-sm-7 pl-0 pr-0">
                                                            <InputText
                                                                fieldName="case2_name"
                                                                fieldID="case2_name"
                                                                fieldOnChange={this.diseaseNameChangeHandler.bind(this)}
                                                                fieldValue={case2Str}/>
                                                        </div>
                                                    </div>
                                                }
                                                {block.block_inputs.map(input => {
                                                    inputCount++;
                                                    blockInputCount++;

                                                    // making kuality block read only
                                                    if (block.slug === 'optimalisering_kvalitet') {
                                                        kvalitetInputCount++;
                                                        return (<>
                                                                <div key={inputCount}>
                                                                    {kvalitetInputCount === 1 &&
                                                                    <div className="row mb-2">
                                                                        <div
                                                                            className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1"></div>
                                                                        <div
                                                                            className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                            {
                                                                                caseNumbers.map(caseNumber => {
                                                                                    let caseStr = this.props.inputs['name_case' + caseNumber];
                                                                                    caseStr = caseStr === 'Case ' + caseNumber ? t(caseStr.replace(' ', '').toLowerCase()) : caseStr;
                                                                                    return (
                                                                                        <div key={caseNumber} style={{
                                                                                            paddingLeft: '7.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'center'
                                                                                        }}>
                                                                                            <b>{caseStr}</b>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
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
                                                                                caseNumbers.map(caseNo => {
                                                                                    if (input.slug === 'optimalisering_kvalitet_ord') {
                                                                                        let ordValue = caseNo === 1 ?
                                                                                            this.props.inputs['optimalisering_grunnforutsetninger_ord_case1'] :
                                                                                            this.props.inputs['optimalisering_effekter_forbedring_produksjon_redusert_ord_case' + caseNo];

                                                                                        return (
                                                                                            <div
                                                                                                style={{
                                                                                                    padding: '9px 20.5px',
                                                                                                    width: divWidth + '%',
                                                                                                    float: 'left'
                                                                                                }}>
                                                                                                {ordValue || ''}
                                                                                            </div>
                                                                                        )
                                                                                    }

                                                                                    if (input.slug === 'optimalisering_kvalitet_prod') {
                                                                                        let prodValue = caseNo === 1 ?
                                                                                            this.props.inputs['optimalisering_grunnforutsetninger_nedklassing_prod_case1'] :
                                                                                            this.props.inputs['optimalisering_effekter_forbedring_produksjon_redusert_nedklassing_prod_prosentpoeng_case' + caseNo];

                                                                                        return (
                                                                                            <div
                                                                                                style={{
                                                                                                    padding: '9px 20.5px',
                                                                                                    width: divWidth + '%',
                                                                                                    float: 'left'
                                                                                                }}>
                                                                                                {prodValue || ''}
                                                                                            </div>
                                                                                        )
                                                                                    }

                                                                                    if (input.slug === 'optimalisering_kvalitet_utkast') {
                                                                                        let hasInputError = false;
                                                                                        const utkastFieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNo] : '';
                                                                                        let fieldValueType = caseNo === 1 ? undefined : 'negative';
                                                                                        if (caseNo > 1 && Math.abs(utkastFieldValue) > this.props.inputs[input.slug + '_case1']) {
                                                                                            hasInputError = true;
                                                                                            kvalitetErrors[caseNo] = t(input.name) + ' ' + t('case' + caseNo) + ' ' + t('value') + ' ( ' + utkastFieldValue + ' ) ' + t('is_not_a_valid_input_comparing_to') + ' ' + t(input.name) + ' ' + t('case1') + ' ' + t('value') + ': ' + this.props.inputs[input.slug + '_case1'];
                                                                                        }
                                                                                        return (
                                                                                            <div key={inputCaseCount}
                                                                                                 style={{
                                                                                                     paddingLeft: '7.5px',
                                                                                                     width: divWidth + '%',
                                                                                                     float: 'left'
                                                                                                 }}>

                                                                                                <InputNumber
                                                                                                    isFieldEmpty={hasInputError}
                                                                                                    fieldValueType={fieldValueType}
                                                                                                    fieldName={input.slug + '_case' + caseNo}
                                                                                                    fieldID={input.slug + '_case' + caseNo}
                                                                                                    fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                                    fieldValue={utkastFieldValue || ''}/>
                                                                                            </div>
                                                                                        )
                                                                                    }

                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    kvalitetErrors.map((error, keyNumber) => {
                                                                        return (
                                                                            <div key={keyNumber}
                                                                                 className="w-100"
                                                                                 style={{clear: 'both'}}>
                                                                                <p className="at2_error_text">{error}</p>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </>
                                                        )
                                                    } else
                                                        return (
                                                            <div key={inputCount}>
                                                                {block.case_type === 'Column' &&
                                                                <div>
                                                                    {blockInputCount === 1 && <div className="row mb-2">
                                                                        <div
                                                                            className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                            {block.slug === 'optimalisering_tiltak' &&
                                                                            <b>{t('investment_costs')}</b>}
                                                                        </div>
                                                                        <div
                                                                            className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                            {
                                                                                caseNumbers.map(caseNumber => {
                                                                                    let caseStr = this.props.inputs['name_case' + caseNumber];
                                                                                    caseStr = caseStr === 'Case ' + caseNumber ? t(caseStr.replace(' ', '').toLowerCase()) : caseStr;
                                                                                    return (
                                                                                        <div key={caseNumber} style={{
                                                                                            paddingLeft: '7.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'center'
                                                                                        }}>
                                                                                            <b>{caseStr}</b>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    }
                                                                    {block.slug === 'optimalisering_tiltak' && blockInputCount === 3 &&
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
                                                                                caseNumbers.map(caseNo => {
                                                                                    return (
                                                                                        <div key={caseNo} style={{
                                                                                            padding: '9px 20.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'left'
                                                                                        }}>
                                                                                            {tiltalOutput['case' + caseNo]['avskrivingPerAr'] === 0 && '-'}
                                                                                            {tiltalOutput['case' + caseNo]['avskrivingPerAr'] !== 0 && number_format(tiltalOutput['case' + caseNo]['avskrivingPerAr'].toFixed(2), 2, '.', ' ')}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>}
                                                                    {block.slug === 'optimalisering_tiltak' && blockInputCount === 4 &&
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
                                                                                caseNumbers.map(caseNo => {
                                                                                    return (
                                                                                        <div key={caseNo} style={{
                                                                                            padding: '9px 20.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'left'
                                                                                        }}>
                                                                                            {tiltalOutput['case' + caseNo].restverdi === 0 && '-'}
                                                                                            {tiltalOutput['case' + caseNo].restverdi !== 0 && number_format(tiltalOutput['case' + caseNo].restverdi.toFixed(2), 2, '.', ' ')}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>}
                                                                    {block.slug === 'optimalisering_tiltak' && blockInputCount === 4 &&
                                                                    <div className="row mb-2">
                                                                        <div
                                                                            className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                            <div className="model-screen-field-label">
                                                                                {t('capital_base_nok_1000')}
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                            {
                                                                                caseNumbers.map(caseNo => {
                                                                                    return (
                                                                                        <div key={caseNo} style={{
                                                                                            padding: '9px 20.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'left'
                                                                                        }}>
                                                                                            {tiltalOutput['case' + caseNo].kapitalgrunnlag === 0 && '-'}
                                                                                            {tiltalOutput['case' + caseNo].kapitalgrunnlag !== 0 && number_format(tiltalOutput['case' + caseNo].kapitalgrunnlag.toFixed(2), 2, '.', ' ')}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>}
                                                                    {block.slug === 'optimalisering_tiltak' && blockInputCount === 5 &&
                                                                    <div className="row mb-2">
                                                                        <div
                                                                            className="col-4 col-xl-5 col-lg-5 col-md-4 col-sm-4 pr-xl-1">
                                                                            <div className="model-screen-field-label">
                                                                                {t('interest_per_year_nok_1000')}
                                                                            </div>
                                                                        </div>
                                                                        <div
                                                                            className="col-7 col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                                                            {
                                                                                caseNumbers.map(caseNo => {
                                                                                    return (
                                                                                        <div key={caseNo} style={{
                                                                                            padding: '9px 20.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'left'
                                                                                        }}>
                                                                                            {tiltalOutput['case' + caseNo].rentePerAr === 0 && '-'}
                                                                                            {tiltalOutput['case' + caseNo].rentePerAr !== 0 && number_format(tiltalOutput['case' + caseNo].rentePerAr.toFixed(2), 2, '.', ' ')}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>}
                                                                    {block.slug === 'optimalisering_tiltak' && blockInputCount === 5 &&
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
                                                                                caseNumbers.map(caseNo => {
                                                                                    return (
                                                                                        <div key={caseNo} style={{
                                                                                            padding: '9px 20.5px',
                                                                                            width: divWidth + '%',
                                                                                            float: 'left',
                                                                                            textAlign: 'left'
                                                                                        }}>
                                                                                            {tiltalOutput['case' + caseNo].sumInvesteringPerAr === 0 && '-'}
                                                                                            {tiltalOutput['case' + caseNo].sumInvesteringPerAr !== 0 &&
                                                                                            <b>{number_format(tiltalOutput['case' + caseNo].sumInvesteringPerAr.toFixed(2), 2, '.', ' ')}</b>}
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>}
                                                                    {block.slug === 'optimalisering_tiltak' && blockInputCount === 5 &&
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
                                                                                    const fieldValue = this.props.inputs !== undefined ? this.props.inputs[input.slug + '_case' + caseNumber] : '';

                                                                                    // set empty for first case
                                                                                    if (block.slug === 'optimalisering_tiltak' && input.slug === 'optimalisering_tiltak_merpris_for_nok_kg' && caseNumber === 1) {

                                                                                        return (
                                                                                            <div
                                                                                                style={{
                                                                                                    padding: '9px 20.5px',
                                                                                                    width: divWidth + '%',
                                                                                                    float: 'left'
                                                                                                }}>

                                                                                            </div>
                                                                                        )

                                                                                    }

                                                                                    if (caseNumber === 1) {
                                                                                        return (
                                                                                            <div key={inputCaseCount}
                                                                                                 style={{
                                                                                                     padding: '9px 20.5px',
                                                                                                     width: divWidth + '%',
                                                                                                     float: 'left'
                                                                                                 }}>
                                                                                                {fieldValue || ''}
                                                                                            </div>)
                                                                                    }

                                                                                    return (
                                                                                        <div key={inputCaseCount}
                                                                                             style={{
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
                                                                        {input.line_divider === 1 &&
                                                                        <div className="col-12">
                                                                            <div className="input_divider"></div>
                                                                        </div>}
                                                                    </div>
                                                                    {input.line_divider === 1 &&
                                                                    <div className="col-12">
                                                                        <div className="input_divider"></div>
                                                                    </div>}
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
                                                                            if (block.slug === 'optimalisering_produksjonsmodell' && input.slug === 'optimalisering_produksjonsmodell_antall_smolt') {
                                                                                if (this.props.inputs[input.slug + '_case' + caseNumber].toString().split(' ').length > 0) {
                                                                                    inputValue = parseFloat(this.props.inputs[input.slug + '_case' + caseNumber].toString().split(' ').join('')) * input.divided_by;
                                                                                }
                                                                                allowThousandSep = true;
                                                                                numberFieldValue = number_format(numberFieldValue, 0, '.', ' ');
                                                                            }
                                                                            /* --End-- */

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
                                                                                            onChange={this.inputRangeChangeHandler(input.slug + '_case' + caseNumber + ',' + input.divided_by)}/>
                                                                                    </div>
                                                                                    <div
                                                                                        className="col-4 col-xl-2 col-lg-2 col-md-3 col-sm-2 pl-xl-1 pr-xl-1 pl-lg-1 pr-lg-1 pl-md-1 pr-md-1">
                                                                                        <InputNumber
                                                                                            allowThousandSep={allowThousandSep}
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
                                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                    {input.line_divider === 1 &&
                                                                                    <div className="col-12">
                                                                                        <div
                                                                                            className="input_divider"></div>
                                                                                    </div>}
                                                                                </div>
                                                                            )
                                                                        } else {

                                                                            if (block.slug === 'optimalisering_general') {
                                                                                if (input.slug === 'optimalisering_general_navn') {
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
                                                                                                fieldValue={numberFieldValue}/>
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
                                                                                        {input.line_divider === 1 &&
                                                                                        <div className="col-12">
                                                                                            <div
                                                                                                className="input_divider"></div>
                                                                                        </div>}
                                                                                    </div>
                                                                                );
                                                                            }


                                                                            if (block.slug === 'optimalisering_produksjonsmodell' && input.slug === 'optimalisering_produksjonsmodell_laksepris') {
                                                                                const laksePrisCases = this.props.caseNumbers;
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
                                                                                                        let caseStr = this.props.inputs['name_case' + caseNumber];
                                                                                                        caseStr = caseStr === 'Case ' + caseNumber ? t(caseStr.replace(' ', '').toLowerCase()) : caseStr;
                                                                                                        return (
                                                                                                            <div
                                                                                                                className="lakse_price_case_heading"
                                                                                                                key={caseNumber}
                                                                                                                style={{
                                                                                                                    width: lakseDivWidth + '%',
                                                                                                                }}>
                                                                                                                <b>{caseStr}</b>
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
                                                                                            <div
                                                                                                className="help_text_block">
                                                                                                {input.help_text !== null &&
                                                                                                <button
                                                                                                    type="button"
                                                                                                    id={'help-text-id-' + (++helpTextIcon)}
                                                                                                    className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                                    onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                                    i
                                                                                                </button>}
                                                                                            </div>
                                                                                            {input.line_divider === 1 &&
                                                                                            <div className="col-12">
                                                                                                <div
                                                                                                    className="input_divider"></div>
                                                                                            </div>}
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
                                                                                            fieldID={input.slug}
                                                                                            fieldOnChange={this.modelScreenInputChangeHandler.bind(this)}
                                                                                            fieldValue={numberFieldValue}/>
                                                                                    </div>
                                                                                    <div className="help_text_block">
                                                                                        {input.help_text !== null && <button
                                                                                            type="button"
                                                                                            id={'help-text-id-' + (++helpTextIcon)}
                                                                                            className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                                                            onClick={e => this.viewHelpTextHandler(e, t(input.help_text))}>
                                                                                            i
                                                                                        </button>}
                                                                                    </div>
                                                                                    {input.line_divider === 1 &&
                                                                                    <div className="col-12">
                                                                                        <div
                                                                                            className="input_divider"></div>
                                                                                    </div>}
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
    cvFrom: state.priceModule.cvFrom,
    snittvektFrom: state.priceModule.snittvektFrom,
    blockScrollHeight: state.modelScreen.blockScrollHeight,
    template: state.template,
})

export default connect(mapStateToProps, {
    toggleModelScreenBlockExpand,
    setModelScreenInputs,
    setOptModelResult,
    templateList,
    mtbBlockList,
    showInfoPopup,
    showPriceModulePopup,
    setPriceModuleDefaultInputs,
    setPriceModuleInputs,
    hideModelOutputSpinner,
    takePriceModuleCVFrom,
    takePriceModuleSnittvektFrom,
    setGraphHelpText,
})(withTranslation()(BlocksInputs));
