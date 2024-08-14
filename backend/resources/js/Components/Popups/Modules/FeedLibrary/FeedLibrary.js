import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../popup.css';
import './FeedLibrary.css';
import {
    hideFeedLibraryPopup,
    showFeedTablePopup
} from "../../../../Store/Actions/popupActions";
import {
    fetchFeedLibrary,
    feedSearch,
    addFeedToList,
    resetFeedSearch,
    setFeedLibraryPagination,
} from "../../../../Store/Actions/FeedLibraryActions";

import { setFeedModelError } from "../../../../Store/Actions/FeedModelActions";

import { setFeedModelPreview, resetFeedModelError } from "../../../../Store/Actions/FeedModelActions";

import NavService from "../../../../Services/NavServices";
import SaveButton from "../../../Inputs/SaveButton";
import CheckBox from "../../../Inputs/CheckBox";
import InputText from "../../../Inputs/InputText";
import Pagination from "../../../Pagination/Pagination";
import { withTranslation } from "react-i18next";

class FeedLibrary extends Component {

    constructor(props) {
        super(props);
        this.props.resetFeedSearch();
        this.state = {
            modulePopupHeight: 0,
            currentModel: '',
            inputFeeds: [],
            selectedFeeds: [],
            feedSearch: '',
            errorMessage: '',
            selectedCosts: [],
            defaultCostType: 'quarterly',
            costErrors: [],
        }
    }

    componentDidMount() {
        this.props.fetchFeedLibrary();
        this.setState({
            ...this.state,
            currentModel: NavService.getCurrentRoute(),
            modulePopupHeight: document.getElementById('at2_feed_library_popup').offsetHeight
        });
    }

    paginationChangeHandler(pageNumber) {
        this.props.setFeedLibraryPagination(pageNumber, this.props.listFeedLibrary.length);
    }

    feedSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        });

        this.props.feedSearch(value, this.props.listFeedLibrary);
    }

    selectFeedHandler(tickStatus, fieldName, feedID) {

        this.state.inputFeeds[feedID] = tickStatus;

        let selectedFeed = this.props.listFeedLibrary.filter(feed => feed.id === feedID);
        selectedFeed = selectedFeed[0];

        if (this.state.selectedCosts.length > 0) {
            let cost = this.state.selectedCosts.filter(item => item.feedID === selectedFeed.id);
            if (cost !== undefined && cost.length > 0) {
                selectedFeed.cost_per_kg = cost[0].value;
            }
        }


        if (tickStatus === true) {
            this.setState({
                ...this.state,
                errorMessage: '',
                inputFeeds: this.state.inputFeeds,
                selectedFeeds: [...this.state.selectedFeeds, selectedFeed]
            });
        } else {
            this.setState({
                ...this.state,
                errorMessage: '',
                inputFeeds: this.state.inputFeeds,
                selectedFeeds: this.state.selectedFeeds.filter(feed => feed.id !== feedID)
            })
        }
    }

    addFeedToTable() {
        const { t } = this.props;

        if (this.state.selectedFeeds.length === 0) {
            this.setState({
                ...this.state,
                errorMessage: t('no_feed_selected'),
            });
            return false;
        }

        let costErrors = [];
        let countCostError = 0;
        this.state.selectedFeeds.map(feed => {
            let hasCost = this.state.selectedCosts.find(cost => cost.feedID === feed.id);
            if (hasCost === undefined) {
                costErrors[countCostError] = { feedID: feed.id };
                countCostError++;
            }
        });

        let selectedFeedInput = [];
        let countFeedInput = 0;

        //let feedsAfterWeightAdjusted = [];
        let selectedFeeds = [];
        let feedList = [];

        if (this.props.feedList !== undefined && this.props.feedList.length > 0) {
            feedList = this.props.feedList;
        }

        const existFeedListLength = feedList.length;

        selectedFeeds = [...feedList, ...this.state.selectedFeeds];

        const inputSnittvekt = this.props.inputs.kn_for_grunnforutsetning_snittvekt_case1;

        selectedFeeds.map((selectedFeed, keyNumber) => {

            // always take first feed's min weight from input Snittvekt field
            let minWeight = keyNumber === 0 ? inputSnittvekt : selectedFeed.feed_min_weight;
            let maxWeight = selectedFeed.feed_max_weight;
            if (keyNumber > 0) {
                minWeight = parseInt(selectedFeeds[keyNumber - 1].feed_max_weight) + 1;
                selectedFeeds[keyNumber].feed_max_weight = maxWeight = minWeight >= maxWeight ? minWeight + 2000 : maxWeight;
            }

            const feedsAfterWeightAdjusted = {
                id: selectedFeed.id,
                feed_producer: selectedFeed.feed_producer,
                feed_name: selectedFeed.feed_name,
                feed_min_weight: minWeight,
                feed_max_weight: maxWeight,
                bfcr: selectedFeed.bfcr,
                vf3: selectedFeed.vf3,
                cost_per_kg: selectedFeed.cost_per_kg,
                row_id: keyNumber + 1,
            };

            selectedFeedInput[countFeedInput] = {
                feed_id: selectedFeed.id,
                feed_producer: selectedFeed.feed_producer,
                feed_name: selectedFeed.feed_name,
                feed_min_weight: minWeight,
                feed_max_weight: maxWeight,
                bfcr: selectedFeed.bfcr,
                vf3: selectedFeed.vf3,
                feed_cost: selectedFeed.cost_per_kg,
            };

            // Only new selected feed should be added in feed list object
            if (keyNumber > (existFeedListLength - 1)) {
                this.props.addFeedToList(feedsAfterWeightAdjusted);
            }

            countFeedInput++;
        });

        let feedInputs = this.props.inputs;

        feedInputs['feed_table_case1'] = selectedFeedInput;

        // Show error message if no feed cost added
        if (costErrors.length > 0) {
            this.props.setFeedModelError('no_feed_cost_added');
        }

        // block feed model calculation API if feed code not added
        if (costErrors.length === 0) {
            this.props.setFeedModelPreview(feedInputs, [1]);
        }

        this.props.hideFeedLibraryPopup();
        this.props.showFeedTablePopup();
    }

    async costSelectHandler(e, feedRowID) {

        const { name, value } = e.target;

        if (value === '') {
            const updated = this.state.selectedCosts.filter(item => item.feedID !== feedRowID);

            await this.setState({
                ...this.state,
                errorMessage: '',
                selectedCosts: updated
            });

            return false;
        }

        //added for default value setting
        let feedValueObj = { feedID: feedRowID, value: value };
        const foundIndex = this.state.selectedCosts.findIndex(x => x.feedID == feedRowID);
        if (foundIndex !== -1) {
            this.state.selectedCosts.splice(foundIndex, 1);
        }


        await this.setState({
            ...this.state,
            errorMessage: '',
            costErrors: this.state.costErrors.filter(item => item.feedID !== feedRowID),
            selectedCosts: [...this.state.selectedCosts, feedValueObj]
        });

        if (this.state.selectedFeeds.length > 0) {

            const selectedFeeds = this.state.selectedFeeds.map(feed => feed.id === feedRowID ? {
                ...feed,
                cost_per_kg: value
            } : feed);

            await this.setState({
                ...this.state,
                selectedFeeds: selectedFeeds,
                errorMessage: '',
            })
        }
    }

    popupCloseHandler() {
        this.props.hideFeedLibraryPopup();
        this.props.showFeedTablePopup();
    }

    render() {

        const { t } = this.props;

        const popupTopMargin = this.state.modulePopupHeight / 2;

        let feedLibrary = this.props.listFeedLibrary === undefined ? [] : this.props.listFeedLibrary;

        if (this.props.feedSearchList !== undefined) {
            feedLibrary = this.props.feedSearchList;
        }

        const totalRecord = this.props.paginationData === undefined ? 1 : this.props.paginationData.totalRecord;
        const paginationPerPage = 5;

        const totalPage = Math.ceil(totalRecord / paginationPerPage);
        const currentPage = this.props.paginationData === undefined ? 1 : this.props.paginationData.currentPage;

        let startRecord = paginationPerPage * (currentPage - 1);
        let showRecord = startRecord + paginationPerPage;

        const errorMessage = this.state.errorMessage !== '' ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        return (
            <div id="at2_popup">
                <div id="at2_feed_library_popup" className="popup_box feed_library_popup"
                    style={{ marginTop: -popupTopMargin + 'px' }}>
                    <i
                        onClick={e => this.popupCloseHandler()}
                        className="fa fa-times feed_library_popup_close"></i>

                    <h1>{t('feed_library')}</h1>
                    <div className="form-row">
                        <div className="col- col-xl-5 p-0">
                            <div className="content-block-grey p-1">
                                <InputText
                                    fieldName="feedSearch"
                                    fieldClass="feed_search"
                                    fieldID="feed_search"
                                    fieldPlaceholder={t('search_feed')}
                                    fieldValue={this.state.feedSearch}
                                    fieldOnChange={this.feedSearchHandler.bind(this)} />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        {feedLibrary.length > 0 && <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>{t('id').toUpperCase()}</th>
                                    <th>{t('producer')}</th>
                                    <th>{t('type')}</th>
                                    <th>{t('name')}</th>
                                    <th>{t('min_weight')}</th>
                                    <th>{t('max_weight')}</th>
                                    <th>{t('vf3')}</th>
                                    <th>{t('bfcr')}</th>
                                    <th>{t('feed_costs')}</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    feedLibrary.slice(startRecord, showRecord).map(feedLib => {
                                        let selectedFeed = [];
                                        selectedFeed = this.props.feedList === undefined ? [] : this.props.feedList.filter(feedL => feedL.id === feedLib.id);
                                        const feedAlreadyAdded = selectedFeed.length > 0;
                                        let fieldValue = this.state.inputFeeds[feedLib.id] === undefined ? '' : this.state.inputFeeds[feedLib.id];
                                        //fieldValue = selectedFeed.length > 0 ? true : fieldValue;
                                        let feedCostObj = feedLib.feed_cost;
                                        let feedCostArray = [];
                                        let countCost = 0;

                                        feedCostObj?.map(cost => {
                                            let costType = Object.keys(cost)[0];
                                            let costValue = cost[Object.keys(cost)[0]];
                                            feedCostArray[countCost] = {
                                                id: countCost,
                                                value: cost[Object.keys(cost)[0]],
                                                text: t(costType) + ' (' + costValue + ')'
                                            }
                                            if (costType == this.state.defaultCostType) {
                                                (this.state.selectedCosts.findIndex(x => x.feedID == feedLib.id) === -1) && this.state.selectedCosts.push({
                                                    feedID: feedLib.id,
                                                    value: costValue
                                                });
                                            }
                                            countCost++;
                                        });


                                        return (
                                            <tr key={feedLib.id}>
                                                <td>
                                                    <CheckBox
                                                        fieldName={'selectedFeed' + feedLib.id}
                                                        fieldValue={fieldValue}
                                                        fieldID={feedLib.id}
                                                        checkUncheckHandler={this.selectFeedHandler.bind(this)} />
                                                </td>
                                                <td>{feedLib.id}</td>
                                                <td>{feedLib.feed_producer}</td>
                                                <td>{feedLib.feed_type}</td>
                                                <td>{feedLib.feed_name}</td>
                                                <td>{feedLib.feed_min_weight}</td>
                                                <td>{feedLib.feed_max_weight}</td>
                                                <td>{feedLib.vf3}</td>
                                                <td>{feedLib.bfcr}</td>
                                                <td>
                                                    <select
                                                        className={this.state.costErrors.find(item => item.feedID === feedLib.id) === undefined ? '' : 'no_feed_cost_error'}
                                                        onChange={e => this.costSelectHandler(e, feedLib.id)}
                                                        defaultValue={this.state.selectedCosts.find(x => x.feedID == feedLib.id)?.value}
                                                        name="feed_cost" id="feed_cost">
                                                        <option value="">{t('select_cost')}</option>
                                                        {
                                                            feedCostArray.map(list => {
                                                                return (
                                                                    <option key={list.id}
                                                                        value={list.value}>{list.text}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {feedAlreadyAdded &&
                                                        <i className="fa fa-check grey-stroke feed_added"></i>}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>}
                        {Object.keys(feedLibrary).length === 0 && <p className="text-center">{t('no_feed_found')}.</p>}
                    </div>

                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        paginationLinkHandler={this.paginationChangeHandler.bind(this)} />

                    <hr />

                    <div className="form-row">
                        <div className="col-6 col-xl-6 col-lg-6">
                            {errorMessage}
                        </div>
                        <div className="col-6 col-xl-6 col-lg-6">
                            <div className="text-right">
                                <SaveButton
                                    onClickHandler={this.addFeedToTable.bind(this)}
                                    name={t('add_to_feed_table')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}


const mapStateToProps = state => ({
    screenSize: state.page.screenSize,
    listFeedLibrary: state.feedLibrary.data,
    feedList: state.feedLibrary.feedList,
    feedSearchList: state.feedLibrary.feedSearchList,
    paginationData: state.feedLibrary.paginationData,
    caseNumbers: state.modelScreen.caseNumbers,
    inputs: state.modelScreen.inputs,
    currentCaseNo: state.feedModelScreen.currentCaseNo,
});

export default connect(mapStateToProps, {
    setFeedModelPreview,
    showFeedTablePopup,
    hideFeedLibraryPopup,
    fetchFeedLibrary,
    addFeedToList,
    feedSearch,
    resetFeedSearch,
    setFeedLibraryPagination,
    resetFeedModelError,
    setFeedModelError,
})(withTranslation()(FeedLibrary));
