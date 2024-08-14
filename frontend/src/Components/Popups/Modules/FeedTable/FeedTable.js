import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../../popup.css';
import './FeedTable.css';
import {hideFeedTablePopup, showFeedLibraryPopup} from "../../../../Store/Actions/popupActions";
import ListAutoComplete from "../../../Inputs/ListAutoComplete/ListAutoComplete";
import NavService from "../../../../Services/NavServices";
import SaveButton from "../../../Inputs/SaveButton";
import ActionButton from "../../../ActionButton/ActionButton";
import TimelinePreview from "../../../Model/Feed/ModelOutput/Timeline/TimelinePreview";
import {
    setModelScreenCases,
    removeModelScreenCase,
    setModelScreenInputs,
    changeOutputColumns
} from "../../../../Store/Actions/MTBActions";
import {
    fetchFeedLibrary,
    addFeedBlankRow,
    resetFeedTable,
    removeFeedFromList,
    updateFeedList,
    updateFeedField,
    setFeedTablePopupHeight,
    feedStaticData,
    resetFeedList
} from "../../../../Store/Actions/FeedLibraryActions";

import {
    resetFeedTimelinePreview,
    setFeedModelPreview,
    setFeedModelResult,
    resetFeedModelError,
    setFeedTableCaseNo,
    showEditFeedTable,
} from "../../../../Store/Actions/FeedModelActions";
import {withTranslation} from "react-i18next";

class FeedTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentModel: '',
            selectedRowNo: null,
            minWeight: [],
            showBlankRowBtn: true,
        };
        this.props.resetFeedTimelinePreview();
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            currentModel: NavService.getCurrentRoute()
        });

        this.props.setFeedTablePopupHeight(document.getElementById('at2_feed_table_popup').offsetHeight);
        if (this.props.caseNumbers.length === 0) {
            this.props.setModelScreenCases([1, 2]);
        }
    }

    async selectFeedHandler(feedName, feedID) {
        const selectedRowNo = this.state.selectedRowNo;
        let feedTableList = this.props.feedTableList === undefined || this.props.feedTableList.length === 0 ? [] : this.props.feedTableList.filter(item => item.feed_name !== '');
        let feedListLastItem = [];

        if (feedTableList.length === 0) {
            feedListLastItem = [];
        }

        if (feedTableList.length > 0) {
            feedListLastItem = feedTableList[feedTableList.length - 1];
            if (selectedRowNo <= feedTableList.length) {
                if (selectedRowNo === 0) {
                    feedListLastItem = [];
                }
                if (selectedRowNo > 0) {
                    feedListLastItem = feedTableList[selectedRowNo - 1];
                }
            }
        }

        let selectedFeed = {...this.props.feedLibrary.find(feed => feed.id === feedID)};

        selectedFeed.cost_per_kg = selectedFeed.cost_per_kg === undefined ? '' : selectedFeed.cost_per_kg;
        //
        if (feedListLastItem.length === 0) {
            selectedFeed.feed_min_weight = this.props.modelInputs.kn_for_grunnforutsetning_snittvekt_case1;
        } else {
            selectedFeed.feed_min_weight = parseInt(feedListLastItem.feed_max_weight) + 1;
            selectedFeed.feed_max_weight = parseInt(selectedFeed.feed_min_weight) >= parseInt(selectedFeed.feed_max_weight) ? parseInt(selectedFeed.feed_min_weight) + 2000 : selectedFeed.feed_max_weight;
        }

        const updateObj = {
            rowID: selectedRowNo,
            selectedFeed: selectedFeed
        };

        await this.props.updateFeedList(updateObj);


        let updateFeedList = this.props.feedTableList;

        // mapping feed table inputs to send to calculation API
        let feedInputs = [];
        updateFeedList.map((feed, keyNumber) => {
            feedInputs[keyNumber] = {
                feed_id: feed.id,
                feed_producer: feed.feed_producer,
                feed_name: feed.feed_name,
                feed_min_weight: feed.feed_min_weight,
                feed_max_weight: feed.feed_max_weight,
                bfcr: feed.bfcr,
                vf3: feed.vf3,
                mortality: feed.mortality,
                feed_cost: feed.cost_per_kg,
            };
        });

        let modelInputs = this.props.modelInputs;

        modelInputs['feed_table_case1'] = feedInputs;

        // send to backend calculation
        this.props.setFeedModelPreview(modelInputs, [1]);
        this.props.setFeedTablePopupHeight(document.getElementById('at2_feed_table_popup').offsetHeight);
    }

    showFeedLibraryPopup() {
        if (this.props.harvestDateReached !== undefined) {
            return false;
        }
        this.props.hideFeedTablePopup();
        this.props.showFeedLibraryPopup();
    }

    popupCloseHandler() {
        const currentCaseNo = this.props.currentCaseNo;
        if (this.props.editFeedTable === undefined) {
            if (currentCaseNo > 2) {
                this.props.removeModelScreenCase();
            }
            this.props.setFeedTableCaseNo(currentCaseNo - 1);
        }

        // If close from feed table edit mode, then re call result api to revert back case 1 feed table inputs
        if (Boolean(this.props.editFeedTable) && this.props.errorMessages === undefined) {
            const caseNumbers = this.props.caseNumbers;
            let modelInputs = this.props.modelInputs;

            // Submit after close
            if (currentCaseNo > 1) {
                modelInputs['feed_table_case1'] = this.props.feedTimeline['case1'];
                this.props.setModelScreenInputs({
                    feed_table_case1: this.props.feedTimeline['case1']
                });
            }
            modelInputs['feed_table_case' + this.props.currentCaseNo] = this.props.timelinePreview;
            this.props.setModelScreenInputs({
                ['feed_table_case' + this.props.currentCaseNo]: this.props.timelinePreview
            });
            this.props.setFeedModelResult(modelInputs, caseNumbers);
        }

        this.props.resetFeedTable();
        this.props.hideFeedTablePopup();
    }

    async addBlankRowHandler() {
        if (this.props.harvestDateReached !== undefined) {
            return false;
        }
        await this.props.addFeedBlankRow();
        this.props.setFeedTablePopupHeight(document.getElementById('at2_feed_table_popup').offsetHeight);
    }

    async resetFeedHandler() {
        await this.props.resetFeedTable();
        this.props.setFeedTablePopupHeight(document.getElementById('at2_feed_table_popup').offsetHeight);
    }

    async removeFeedRowHandler(rowID) {
        await this.props.resetFeedModelError();
        await this.props.removeFeedFromList(rowID);

        //let feedList = this.props.feedTableList.filter((feed, keyNumber) => keyNumber !== rowID);

        let feedList = this.props.feedTableList;

        // mapping feed table inputs to send to calculation API
        let updatedFeedInputs = [];

        feedList.map((feed, keyNumber) => {
            updatedFeedInputs[keyNumber] = {
                feed_id: feed.id,
                feed_producer: feed.feed_producer,
                feed_name: feed.feed_name,
                feed_min_weight: feed.feed_min_weight,
                feed_max_weight: feed.feed_max_weight,
                bfcr: feed.bfcr,
                vf3: feed.vf3,
                mortality: feed.mortality,
                feed_cost: feed.cost_per_kg,
            };
        });

        let modelInputs = this.props.modelInputs;

        // add real feed table value with inputs
        modelInputs['feed_table_case1'] = updatedFeedInputs;

        // send to backend calculation
        this.props.setFeedModelPreview(modelInputs, [1]);
        this.props.setFeedTablePopupHeight(document.getElementById('at2_feed_table_popup').offsetHeight);

    }

    async feedRow(id) {
        await this.setState({
            ...this.state,
            selectedRowNo: id
        })
    }

    feedOnChangeHandler(e, rowID, duration) {
        this.props.resetFeedModelError();
        // get input
        const input = {
            name: e.target.name,
            value: e.target.value,
            rowID: rowID
        };

        // update feed table text input
        this.props.updateFeedField(input);

        let feedList = this.props.feedTableList;
        feedList[rowID][input.name] = input.value;

        // mapping feed table inputs to send to calculation API
        let feedInputs = [];
        feedList.map((feed, keyNumber) => {
            feedInputs[keyNumber] = {
                feed_id: feed.id,
                feed_producer: feed.feed_producer,
                feed_name: feed.feed_name,
                feed_min_weight: feed.feed_min_weight,
                feed_max_weight: feed.feed_max_weight,
                bfcr: feed.bfcr,
                mortality: feed.mortality,
                vf3: feed.vf3,
                feed_cost: feed.cost_per_kg,
            };
        });

        let modelInputs = this.props.modelInputs;

        modelInputs['feed_table_case1'] = feedInputs;

        this.props.setFeedModelPreview(modelInputs, [1]);
        this.props.setFeedTablePopupHeight(document.getElementById('at2_feed_table_popup').offsetHeight);
    }

    submitFeedTimeline() {
        const caseNumbers = this.props.caseNumbers;
        let modelInputs = this.props.modelInputs;

        if (this.props.editFeedTable === undefined) {
            // Submit new timeline
            if (this.props.feedTimeline !== undefined) {
                modelInputs['feed_table_case1'] = this.props.feedTimeline['case1'];
                this.props.setModelScreenInputs({
                    feed_table_case1: this.props.feedTimeline['case1']
                });
                modelInputs['feed_table_case' + this.props.currentCaseNo] = this.props.timelinePreview;
                this.props.setModelScreenInputs({
                    ['feed_table_case' + this.props.currentCaseNo]: this.props.timelinePreview
                });
            } else {
                // first time add same timeline for two cases
                caseNumbers.map(caseNo => {
                    modelInputs['feed_table_case' + caseNo] = this.props.timelinePreview;
                    this.props.setModelScreenInputs({
                        ['feed_table_case' + caseNo]: this.props.timelinePreview
                    });
                });
            }
        } else {
            // Submit after edit feed
            if (this.props.currentCaseNo > 1) {
                modelInputs['feed_table_case1'] = this.props.feedTimeline['case1'];
                this.props.setModelScreenInputs({
                    feed_table_case1: this.props.feedTimeline['case1']
                });
            }
            modelInputs['feed_table_case' + this.props.currentCaseNo] = this.props.timelinePreview;
            this.props.setModelScreenInputs({
                ['feed_table_case' + this.props.currentCaseNo]: this.props.timelinePreview
            });
        }

        // Adjust columns
        if (this.props.screenSize >= 1367) {

            if (caseNumbers.length >= 4 && this.props.outputColumns === 3) {
                this.props.changeOutputColumns();
            }

            if (caseNumbers.length < 4 && this.props.outputColumns === 2) {
                this.props.changeOutputColumns();
            }
        }

        // set forbedring default value to new case
        this.props.blocks.map(async block => {
            if (block.slug === 'kn_for_forbedring') {
                block.block_inputs.map(async input => {
                    await this.props.setModelScreenInputs({
                        [input.slug + '_case' + this.props.caseNumbers.length]: this.props.inputs[input.slug + '_case1']
                    });
                })
            }
        });

        this.props.setFeedModelResult(modelInputs, caseNumbers);
        this.props.showEditFeedTable(undefined);
        this.props.hideFeedTablePopup();
        this.props.resetFeedList();
    }

    render() {
        const {t} = this.props;
        const currentCaseNo = this.props.currentCaseNo;
        const timelinePreview = this.props.timelinePreview === undefined ? undefined : this.props.timelinePreview;
        const feedTablePopupHeight = this.props.feedTablePopupHeight === undefined ? 0 : this.props.feedTablePopupHeight;
        const feedTableHeight = feedTablePopupHeight / 3;
        const popupTopMargin = this.props.feedTablePopupHeight === undefined ? 10 : this.props.feedTablePopupHeight / 2;
        const feedList = this.props.feedTableList === undefined ? [] : this.props.feedTableList;
        const feedLibrary = this.props.feedLibrary === undefined ? [] : this.props.feedLibrary;
        let feedTableDropDown = [];
        let count = 0;

        if (feedLibrary.length > 0) {
            feedLibrary.map(feed => {
                const feedProducer = this.props.feedProducer.find(producer => producer.name === feed.feed_producer);
                feedTableDropDown[count] = {id: feed.id, name: feed.feed_name, color: feedProducer.color};
                count++;
            });
        }

        let countFeed = 0;
        let feedKey = -1;
        const showTimeLinePreview = timelinePreview !== undefined && timelinePreview.length > 0;

        const feedTableErrors = this.props.errorMessages === undefined ? [] : this.props.errorMessages;

        const disableSubmitButton = feedList.length === 0 || feedTableErrors.length > 0;

        const popupTitle = this.props.editFeedTable === undefined ? t('add_feed') : t('edit_feed');

        const harvestDateMessage = t('harvest_date_is_reached');

        return (
            <div id="at2_popup">
                <div id="at2_feed_table_popup" className="popup_box feed_table_popup"
                     style={{marginTop: -popupTopMargin + 'px'}}>
                    <i
                        onClick={e => this.popupCloseHandler()}
                        className="fa fa-times feed_table_popup_close fa-btn"></i>

                    <h3>{popupTitle}</h3>

                    <hr/>

                    <h5 className="mt-3 mb-3">{t('feed_table') + ' ' + t('case' + currentCaseNo)}</h5>

                    <div className="form-row">
                        <div id="feed_table" style={{maxHeight: feedTableHeight + 'px'}}>
                            <ul className="head">
                                <li>{t('feed_name')}</li>
                                <li>{t('min_weight')}</li>
                                <li>{t('max_weight')}</li>
                                <li>{t('bfcr')}</li>
                                <li>{t('vf3')}</li>
                                <li>{t('mortality_percentage')}</li>
                                <li>{t('feed_price')}</li>
                                <li className="duration">{t('duration')}</li>
                                <li></li>
                            </ul>
                            {
                                feedList.length > 0 && feedList.map((feed, keyNumber) => {
                                    feedKey++;
                                    const duration = timelinePreview !== undefined && timelinePreview[feedKey] !== undefined ? timelinePreview[feedKey].duration : '';
                                    countFeed++;
                                    const feedID = !Boolean(feed.feed_name) ? '' : feed.id;
                                    const cost_per_kg = Boolean(feed.cost_per_kg) ? feed.cost_per_kg : feed.feed_cost?.find(x => 'quarterly' in x)?.quarterly;
                                    feed.cost_per_kg = Boolean(cost_per_kg) ? cost_per_kg : '';
                                    let disableInputClass = this.props.harvestDateReached !== undefined && duration === '' ? 'input-disable' : '';
                                    let disableDropdown = this.props.harvestDateReached !== undefined && duration === '';

                                    let mortality = Boolean(feed.mortality) ? feed.mortality : '';

                                    return (
                                        <ul key={countFeed}>
                                            <li onClick={e => this.feedRow(keyNumber)}>
                                                <ListAutoComplete
                                                    fieldDisabled={disableDropdown}
                                                    fieldName="feed_name"
                                                    fieldPlaceHolder={t('select_feed')}
                                                    fieldOnClick={this.selectFeedHandler.bind(this)}
                                                    selectedItemId={feedID}
                                                    listData={feedTableDropDown}/>
                                            </li>
                                            <li className={disableInputClass}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="feed_min_weight"
                                                    onChange={e => this.feedOnChangeHandler(e, keyNumber, duration)}
                                                    value={feed.feed_min_weight}/>
                                            </li>
                                            <li className={disableInputClass}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="feed_max_weight"
                                                    onChange={e => this.feedOnChangeHandler(e, keyNumber, duration)}
                                                    value={feed.feed_max_weight}/>
                                            </li>
                                            <li className={disableInputClass}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="bfcr"
                                                    onChange={e => this.feedOnChangeHandler(e, keyNumber, duration)}
                                                    value={feed.bfcr}/>
                                            </li>
                                            <li className={disableInputClass}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="vf3"
                                                    onChange={e => this.feedOnChangeHandler(e, keyNumber, duration)}
                                                    value={feed.vf3}/>
                                            </li>
                                            <li className={disableInputClass}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="mortality"
                                                    onChange={e => this.feedOnChangeHandler(e, keyNumber, duration)}
                                                    value={mortality}/>
                                            </li>
                                            <li className={disableInputClass}>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="cost_per_kg"
                                                    onChange={e => this.feedOnChangeHandler(e, keyNumber, duration)}
                                                    value={feed.cost_per_kg}/>
                                            </li>
                                            <li className="duration">
                                                &nbsp;{duration}
                                            </li>
                                            <li className="feed_line_remove text-center">
                                                <i className="fa fa-times"
                                                   onClick={e => this.removeFeedRowHandler(keyNumber)}></i>
                                            </li>
                                        </ul>
                                    )
                                })
                            }


                        </div>
                    </div>

                    <div className="form-row feed_action_btn">
                        <div className="col- col-xl-12 col-lg-12 col-md-12">
                            <ActionButton
                                onClickHandler={this.showFeedLibraryPopup.bind(this)}>
                                + {t('insert_from_feed_library')}
                            </ActionButton>
                            <ActionButton
                                onClickHandler={this.addBlankRowHandler.bind(this)}>
                                + {t('insert_blank_row')}
                            </ActionButton>
                            <ActionButton
                                onClickHandler={this.resetFeedHandler.bind(this)}>
                                {t('reset')}
                            </ActionButton>
                        </div>
                    </div>

                    <hr/>

                    <div className="form-row feed_action_btn" id="timeline_preview_panel">
                        <div className="col- col-xl-12 col-lg-12 col-md-12">
                            <h5>{t('feed_timeline_preview')}: {t('case' + currentCaseNo)}</h5>
                            {showTimeLinePreview === true && <TimelinePreview/>}
                        </div>
                    </div>

                    <hr/>

                    <div className="form-row">
                        <div className="col-6 col-xl-8 col-lg-8">
                            {feedTableErrors.length > 0 && feedTableErrors.map(error => {
                                let errorObj = error.search(':') !== -1 ? error.split(':') : false;
                                console.log(errorObj);
                                const translatedErrorMessage = Boolean(errorObj[0]) ? t(errorObj[0]) + ': ' + errorObj[1] : t(error);
                                return <p className="at2_error_text">{translatedErrorMessage}</p>
                            })}
                            {
                                this.props.harvestDateReached !== undefined &&
                                <p className="at2_harvest_date_text">{harvestDateMessage}</p>
                            }
                        </div>
                        <div className="col-6 col-xl-4 col-lg-4">
                            <div className="text-right">
                                <button
                                    className="btn btn-primary default-btn-atv2"
                                    onClick={e => this.submitFeedTimeline()}
                                    type="button" disabled={disableSubmitButton}>
                                    {t('apply_to_feed_model')}
                                </button>
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
    feedTableList: state.feedLibrary.feedList,
    feedLibrary: state.feedLibrary.data,
    feedProducer: state.feedLibrary.feedProducer,
    feedTablePopupHeight: state.feedLibrary.feedTablePopupHeight,
    currentCaseNo: state.feedModelScreen.currentCaseNo,
    timelinePreview: state.feedModelScreen.timelinePreview,
    slaktevektPreview: state.feedModelScreen.slaktevektPreview,
    slaktevekt: state.feedModelScreen.slaktevekt,
    feedTimeline: state.feedModelScreen.feedTimeline,
    errorMessages: state.feedModelScreen.errorMessages,
    modelInputs: state.modelScreen.inputs,
    caseNumbers: state.modelScreen.caseNumbers,
    editFeedTable: state.feedModelScreen.editFeedTable,
    harvestDateReached: state.feedModelScreen.harvestDateReached,
    outputColumns: state.modelScreen.outputColumns,
    blocks: state.modelScreen.blockData,
    inputs: state.modelScreen.inputs,
});

export default connect(mapStateToProps, {
    fetchFeedLibrary,
    addFeedBlankRow,
    resetFeedTable,
    removeFeedFromList,
    hideFeedTablePopup,
    showFeedLibraryPopup,
    updateFeedList,
    updateFeedField,
    setFeedModelResult,
    setModelScreenInputs,
    resetFeedModelError,
    setFeedTablePopupHeight,
    feedStaticData,
    setFeedTableCaseNo,
    setFeedModelPreview,
    resetFeedTimelinePreview,
    removeModelScreenCase,
    setModelScreenCases,
    resetFeedList,
    showEditFeedTable,
    changeOutputColumns
})(withTranslation()(FeedTable));
