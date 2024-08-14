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

import {setGeneticsModelResult} from "../../../../Store/Actions/GeneticsModelActions";

import {setPriceModuleInputs} from "../../../../Store/Actions/PriceModuleActions";
import {withTranslation} from "react-i18next";
import ModelResetToDefault from "../../../IconButton/ModelResetToDefault";

class ModelActionTabs extends Component {

    constructor(props) {
        super(props);
    }

    async addNewCaseHandler() {
        await this.props.addModelScreenNewCase();
        this.props.blocks.map(async block => {
            block.block_inputs.map(async input => {
                await this.props.setModelScreenInputs({
                    [input.slug + '_case' + this.props.caseNumbers.length]: this.props.inputs[input.slug + '_case1']
                });
            })
        });

        await this.props.setModelScreenInputs({
            ['name_case' + this.props.caseNumbers.length]: 'Case ' + this.props.caseNumbers.length
        });

        await this.props.setGeneticsModelResult(this.props.inputs, this.props.caseNumbers);

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
        this.props.setGeneticsModelResult(this.props.inputs, this.props.caseNumbers);
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
            const tmpFieldName = index.slice(0, -1);
            if (tmpFieldName !== 'name_case') {
                resetInputs[index] = this.props.inputs[tmpFieldName + '1'];
                this.props.setModelScreenInputs({
                    [index]: this.props.inputs[tmpFieldName + '1']
                })
            }
        }

        // set case 1 to excel API
        this.props.setGeneticsModelResult(resetInputs, this.props.caseNumbers);
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
        const { t } = this.props;
        const addCaseNumber = this.props.caseNumbers.length + 1;
        const currentCaseCount = this.props.caseNumbers.length;
        const graphViewBtnClass = this.props.outputView === 'graph' ? 'btn-active' : '';
        const tableViewBtnClass = this.props.outputView === 'table' ? 'btn-active' : '';
        const outputColumns = this.props.outputColumns === 3 ? 2 : 3;

        return (
            <div className="section-block model-action-tabs">
                <ActionButton
                    onClickHandler={this.changeModelOutputToGraphView.bind(this)}
                    btnClass={graphViewBtnClass}>
                    {this.props.screenSize >= 768 && <span><img src="images/graph_view_icon.svg"/>{t('graph_view')}</span>}
                    {this.props.screenSize < 768 && <img src="images/graph_view_icon.svg"/>}
                </ActionButton>
                <ActionButton
                    onClickHandler={this.changeModelOutputToTableView.bind(this)}
                    btnClass={tableViewBtnClass}>
                    {this.props.screenSize >= 768 &&
                    <span><span className="table-view-wrapper"><img src="images/table_view_icon.svg"/></span>{t('table_view')}</span>}
                    {this.props.screenSize < 768 &&
                    <span className="table-view-wrapper"><img src="images/table_view_icon.svg"/></span>}
                </ActionButton>
                <ModelResetToDefault/>
                <div className="float-right mt-0 mt-xl-0 mt-lg-2 mt-md-2">
                    <ActionButton
                        onClickHandler={this.resetToCase1Handler.bind(this)}>
                        {t('reset')}
                        {/*{this.props.screenSize >= 768 && 'to Case 1'}*/}
                    </ActionButton>
                    <ActionButton
                        btnDisabled={currentCaseCount > 4}
                        onClickHandler={this.addNewCaseHandler.bind(this)}>
                        + {this.props.screenSize >= 768 && t('case')+' '} {addCaseNumber}
                    </ActionButton>
                    {this.props.caseNumbers.length > 1 && <ActionButton
                        onClickHandler={this.removeCaseHandler.bind(this)}>
                        - {this.props.screenSize >= 768 && t('case')+' '} {currentCaseCount}
                    </ActionButton>}
                    {this.props.screenSize >= 768 && <ActionButton
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
    setGeneticsModelResult,
    changeOutputColumns,
    setPriceModuleInputs,
})(withTranslation()(ModelActionTabs));

