import React, {Component} from 'react';
import {connect} from 'react-redux';
import './ModelActionTabs.css';
import ActionButton from "../../../ActionButton/ActionButton";
import {
    addModelScreenNewCase,
    changeModelOutputView,
    removeModelScreenCase,
    setModelScreenInputs,
    setModelResult,
    changeOutputColumns,
} from "../../../../Store/Actions/MTBActions";

import {showTemperatureModulePopup, showFeedTablePopup} from "../../../../Store/Actions/popupActions";
import {fetchFeedLibrary, resetFeedTable} from "../../../../Store/Actions/FeedLibraryActions";
import {setFeedTableCaseNo} from "../../../../Store/Actions/FeedModelActions";
import LinkButton from "../../../Inputs/LinkButton";
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

        await this.props.setModelResult(this.props.inputs, this.props.caseNumbers);
    }

    removeCaseHandler() {
        this.props.removeModelScreenCase();
        this.props.setModelResult(this.props.inputs, this.props.caseNumbers);
    }

    goFeedLibrary() {
        window.location.href = "/admin/feedLibrary";
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

    showTemperatureModule() {
        this.props.showTemperatureModulePopup()
    }

    showFeedTable() {
        this.props.resetFeedTable();
        let currentCaseNo = this.props.feedTimeline === undefined ? 1 : this.props.caseNumbers.length + 1;
        if (this.props.feedTimeline !== undefined) {
            this.props.addModelScreenNewCase();
        }
        //caseNo = caseNo === 2 ? 3 : caseNo;
        this.props.setFeedTableCaseNo(currentCaseNo);

        this.props.fetchFeedLibrary();
        this.props.showFeedTablePopup();
    }

    render() {
        const {t} = this.props;
        const addCaseNumber = this.props.caseNumbers.length + 1;
        const currentCaseCount = this.props.caseNumbers.length;
        const graphViewBtnClass = this.props.outputView === 'graph' ? 'btn-active' : '';
        const tableViewBtnClass = this.props.outputView === 'table' ? 'btn-active' : '';
        const outputColumns = this.props.outputColumns === 3 ? 2 : 3;

        const showResetButton = Boolean(this.props.tableViewData);

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
                {showResetButton && <ModelResetToDefault/>}
                <div className="float-right mt-0 mt-xl-0 mt-lg-2 mt-md-2">
                    <ActionButton
                        onClickHandler={this.showTemperatureModule.bind(this)}>
                        + {t('temperature')}
                    </ActionButton>
                    <ActionButton
                        btnDisabled={currentCaseCount > 4}
                        onClickHandler={this.showFeedTable.bind(this)}>
                        + {t('feed')}
                    </ActionButton>
                    <LinkButton url="/admin/feedLibrary" btnText={t('feed_library')}/>
                    {this.props.screenSize >= 768 && <ActionButton
                        btnDisabled={currentCaseCount > 3 || this.props.screenSize < 1367}
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
    currentCaseNo: state.feedModelScreen.currentCaseNo,
    feedTimeline: state.feedModelScreen.feedTimeline,
    tableViewData: state.modelScreen.pdfOutput,
});

export default connect(mapStateToProps, {
    addModelScreenNewCase,
    removeModelScreenCase,
    setModelScreenInputs,
    changeModelOutputView,
    setModelResult,
    changeOutputColumns,
    showTemperatureModulePopup,
    showFeedTablePopup,
    fetchFeedLibrary,
    setFeedTableCaseNo,
    resetFeedTable,
})(withTranslation()(ModelActionTabs));

