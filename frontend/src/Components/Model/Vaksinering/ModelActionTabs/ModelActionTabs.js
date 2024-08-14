import React, {Component} from 'react';
import {connect} from 'react-redux';
import './ModelActionTabs.css';
import ActionButton from "../../../ActionButton/ActionButton";
import {
    addModelScreenNewCase,
    changeModelOutputView,
    removeModelScreenCase,
    setModelScreenInputs,
    changeOutputColumns,
} from "../../../../Store/Actions/MTBActions";

import {setVaccineModelResult} from "../../../../Store/Actions/VaccineModelActions";

import {addVaccineNames, removeVaccineNames} from "../../../../Store/Actions/VaccineModelActions";

import {setPriceModuleInputs} from "../../../../Store/Actions/PriceModuleActions";
import {withTranslation} from 'react-i18next';
import ModelResetToDefault from "../../../IconButton/ModelResetToDefault";

class ModelActionTabs extends Component {

    constructor(props) {
        super(props);
    }

    async addNewCaseHandler() {
        await this.props.addModelScreenNewCase();
        await this.props.addVaccineNames();
        this.props.blocks.map(async block => {
            block.block_inputs.map(async input => {
                await this.props.setModelScreenInputs({
                    [input.slug + '_case' + this.props.caseNumbers.length]: this.props.inputs[input.slug + '_case1']
                });
            })
        });

        await this.props.setVaccineModelResult(this.props.inputs, this.props.caseNumbers);

        if (this.props.screenSize >= 1367) {

            if (this.props.caseNumbers.length > 4 && this.props.outputColumns === 3) {
                this.props.changeOutputColumns();
            }

            if (this.props.caseNumbers.length <= 4 && this.props.outputColumns === 2) {
                this.props.changeOutputColumns();
            }
        }

    }

    removeCaseHandler() {
        this.props.removeModelScreenCase();
        this.props.removeVaccineNames();
        //console.log(this.props.inputs);
        this.props.setVaccineModelResult(this.props.inputs, this.props.caseNumbers);
    }

    // reset all inputs to Case1
    resetToCase1Handler() {

        // Reset price module inputs
        let priceModuleResetInputs = {};
        let priceModelDataInputs = ['lakse_pris_percentage_case', 'price_module_cv_case', 'price_module_snittvekt_case']

        const priceModuleInputs = {...this.props.priceModuleInputs};

        for (let pmIndex in priceModuleInputs) {
            const tmpFieldName = pmIndex.slice(0, -1);
            if (priceModelDataInputs.includes(tmpFieldName)) {
                priceModuleResetInputs[pmIndex] = priceModuleInputs[tmpFieldName + '1'];
                this.props.setPriceModuleInputs({
                    [pmIndex]: priceModuleInputs[tmpFieldName + '1']
                })
            }
        }

        // Reset model inputs

        let resetInputs = {}
        for (let index in this.props.inputs) {
            if (index !== 'block_sjukdom_name') {
                const tmpFieldName = index.slice(0, -1);
                resetInputs[index] = this.props.inputs[tmpFieldName + '1'];
                this.props.setModelScreenInputs({
                    [index]: this.props.inputs[tmpFieldName + '1']
                })
            }
        }

        // set case 1 to excel API
        this.props.setVaccineModelResult(resetInputs, this.props.caseNumbers);
    }

    changeModelOutputToGraphView() {
        this.props.changeModelOutputView('graph');
    }

    changeModelOutputToTableView() {
        this.props.changeModelOutputView('table');
    }

    columnChangeHandler() {
        this.props.changeOutputColumns();
    }

    render() {

        const {t} = this.props;

        const engAlpha = ['A', 'A', 'A', 'B', 'C', 'D', 'E']
        const addCaseNumber = this.props.caseNumbers.length + 1;
        const currentCaseCount = this.props.caseNumbers.length;
        const currentVaccineName = engAlpha[currentCaseCount - 1];
        const nextVaccineName = engAlpha[currentCaseCount];
        const graphViewBtnClass = this.props.outputView === 'graph' ? 'btn-active' : '';
        const tableViewBtnClass = this.props.outputView === 'table' ? 'btn-active' : '';
        const outputColumns = this.props.outputColumns === 3 ? 2 : 3;
        const currentVaccineCount = this.props.vaccineNames === undefined ? 1 : this.props.vaccineNames.length;

        return (
            <div className="section-block model-action-tabs">
                <ActionButton
                    onClickHandler={this.changeModelOutputToGraphView.bind(this)}
                    btnClass={graphViewBtnClass}>
                    {this.props.screenSize >= 768 &&
                    <span><img src="images/graph_view_icon.svg"/>{t('graph_view')}</span>}
                    {this.props.screenSize < 768 && <img src="images/graph_view_icon.svg"/>}
                </ActionButton>
                <ActionButton
                    onClickHandler={this.changeModelOutputToTableView.bind(this)}
                    btnClass={tableViewBtnClass}>
                    {this.props.screenSize >= 768 &&
                    <span><span className="table-view-wrapper"><img
                        src="images/table_view_icon.svg"/></span>{t('table_view')}</span>}
                    {this.props.screenSize < 768 &&
                    <span className="table-view-wrapper"><img src="images/table_view_icon.svg"/></span>}
                </ActionButton>
                <ModelResetToDefault/>
                <div className="float-right mt-0 mt-xl-0 mt-lg-2 mt-md-2">
                    <ActionButton
                        onClickHandler={this.resetToCase1Handler.bind(this)}>
                        {t('reset')} {this.props.screenSize >= 768 && (t('to') + ' ' + t('vacc') + ' A')}
                    </ActionButton>
                    <ActionButton
                        btnDisabled={currentVaccineCount >= 3}
                        onClickHandler={this.addNewCaseHandler.bind(this)}>
                        + {this.props.screenSize >= 768 && (t('vacc') + ' ')} {nextVaccineName}
                    </ActionButton>
                    {this.props.caseNumbers.length > 1 && <ActionButton
                        btnDisabled={currentVaccineCount < 2}
                        onClickHandler={this.removeCaseHandler.bind(this)}>
                        - {this.props.screenSize >= 768 && (t('vacc') + ' ')} {currentVaccineName}
                    </ActionButton>}
                    {this.props.screenSize >= 768 && <ActionButton
                        btnDisabled={currentVaccineCount >= 3 || this.props.screenSize < 1367}
                        onClickHandler={this.columnChangeHandler.bind(this)}>
                        {outputColumns} {t('cols')}
                    </ActionButton>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    screenSize: state.page.screenSize,
    blocks: state.modelScreen.blockData,
    caseNumbers: state.modelScreen.caseNumbers,
    vaccineNames: state.vaccineModelScreen.vaccineNames,
    inputs: state.modelScreen.inputs,
    outputView: state.modelScreen.outputView,
    outputColumns: state.modelScreen.outputColumns,
    priceModuleInputs: state.priceModule.inputs,
});

export default connect(mapStateToProps, {
    addModelScreenNewCase,
    removeModelScreenCase,
    setModelScreenInputs,
    changeModelOutputView,
    setVaccineModelResult,
    changeOutputColumns,
    addVaccineNames,
    removeVaccineNames,
    setPriceModuleInputs,
})(withTranslation()(ModelActionTabs));

