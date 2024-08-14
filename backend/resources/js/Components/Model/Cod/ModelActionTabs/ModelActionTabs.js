import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ModelActionTabs.css';
import ActionButton from "../../../ActionButton/ActionButton";
import {
    addModelScreenNewCase,
    changeModelOutputView,
    removeModelScreenCase,
    setModelScreenInputs,
    changeOutputColumns,
} from "../../../../Store/Actions/MTBActions";

import { setCodModelResult } from "../../../../Store/Actions/CodModelActions";
import { withTranslation } from 'react-i18next';
import ModelResetToDefault from "../../../IconButton/ModelResetToDefault";

class ModelActionTabs extends Component {

    constructor(props) {
        super(props);
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
                    {this.props.screenSize >= 768 && <span><img src="images/graph_view_icon.svg" />{t('graph_view')}</span>}
                    {this.props.screenSize < 768 && <img src="images/graph_view_icon.svg" />}
                </ActionButton>
                <ActionButton
                    onClickHandler={this.changeModelOutputToTableView.bind(this)}
                    btnClass={tableViewBtnClass}>
                    {this.props.screenSize >= 768 &&
                        <span><span className="table-view-wrapper"><img src="images/table_view_icon.svg" /></span>{t('table_view')}</span>}
                    {this.props.screenSize < 768 &&
                        <span className="table-view-wrapper"><img src="images/table_view_icon.svg" /></span>}
                </ActionButton>
                <ModelResetToDefault />
                <div className="float-right mt-0 mt-xl-0 mt-lg-2 mt-md-2">

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
});

export default connect(mapStateToProps, {
    addModelScreenNewCase,
    removeModelScreenCase,
    setModelScreenInputs,
    changeModelOutputView,
    setCodModelResult,
    changeOutputColumns,
})(withTranslation()(ModelActionTabs));

