import React, {Component} from 'react';
import './FeedTableInputBlock.css'
import {connect} from 'react-redux';
import {Slider} from "material-ui-slider";
import InputNumber from "../../../Inputs/InputNumber";
import ListAutoComplete from "../../../Inputs/ListAutoComplete/ListAutoComplete";
import {setModelScreenInputs} from "../../../../Store/Actions/MTBActions";
import {setFeedModelResult, setFeedTableInputBlockErrors} from "../../../../Store/Actions/FeedModelActions";
import {withTranslation} from "react-i18next";

class FeedTableInputBlock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedTableBlockExpand: true,
            rowNoCaseNo: null
        }
    }

    feedTableBlockExpandCollapseHandler() {
        this.setState({
            ...this.state,
            feedTableBlockExpand: this.state.feedTableBlockExpand !== true
        })
    }

    feedTableCaseExpandCollapseHandler(feedTableCaseExpandState) {
        this.setState({
            ...this.state,
            [feedTableCaseExpandState]: this.state[feedTableCaseExpandState] === undefined || this.state[feedTableCaseExpandState] === true ? false : true
        })
    }

    changeFeed(rowNo, caseNo, inputs, feedName, feedID) {

        let modelInputs = {...inputs};

        const snittvekt = parseInt(modelInputs.kn_for_grunnforutsetning_snittvekt_case1);

        let selectedFeed = this.props.feedLibrary.find(feed => feed.id === feedID);

        const minWeight = selectedFeed['feed_min_weight'];
        const maxWeight = selectedFeed['feed_max_weight'];
        const feedCost = selectedFeed['feed_cost'] === undefined || selectedFeed['feed_cost'].length === 0 ? '' : Object.values(selectedFeed['feed_cost'][0])[0];


        if (caseNo === 1 && modelInputs.total_cases === 1 && this.props.caseNumbers.length === 2) {

            let case1FeedInputs = [];
            let case2FeedInputs = [];

            modelInputs.feed_table_case1.map((item, keyNumber) => {
                case1FeedInputs[keyNumber] = {...item};
            });

            modelInputs.feed_table_case2.map((item, keyNumber) => {
                case2FeedInputs[keyNumber] = {...item};
            });

            delete modelInputs['feed_table_case1'];
            delete modelInputs['feed_table_case2'];

            if (rowNo === 0) {
                case1FeedInputs[rowNo]['feed_min_weight'] = modelInputs.kn_for_grunnforutsetning_snittvekt_case1;
                case1FeedInputs[rowNo]['feed_max_weight'] = snittvekt >= maxWeight ? snittvekt + 1500 : selectedFeed['feed_max_weight'];
                case1FeedInputs[rowNo]['bfcr'] = selectedFeed['bfcr'];
                case1FeedInputs[rowNo]['vf3'] = selectedFeed['vf3'];
                case1FeedInputs[rowNo]['mortality'] = selectedFeed['mortality'];
                case1FeedInputs[rowNo]['feed_name'] = selectedFeed['feed_name'];
                case1FeedInputs[rowNo]['feed_producer'] = selectedFeed['feed_producer'];
                case1FeedInputs[rowNo]['feed_cost'] = feedCost;
                case1FeedInputs[rowNo]['feed_id'] = feedID;
            }

            if (rowNo > 0) {
                const minWeight = parseInt(case1FeedInputs[rowNo - 1]['feed_max_weight']) + 1;
                const maxWeight = minWeight >= parseInt(selectedFeed['feed_max_weight']) ? minWeight + 1500 : selectedFeed['feed_max_weight'];
                case1FeedInputs[rowNo]['feed_min_weight'] = minWeight;
                case1FeedInputs[rowNo]['feed_max_weight'] = maxWeight;
                case1FeedInputs[rowNo]['bfcr'] = selectedFeed['bfcr'];
                case1FeedInputs[rowNo]['vf3'] = selectedFeed['vf3'];
                case1FeedInputs[rowNo]['mortality'] = selectedFeed['mortality'];
                case1FeedInputs[rowNo]['feed_name'] = selectedFeed['feed_name'];
                case1FeedInputs[rowNo]['feed_producer'] = selectedFeed['feed_producer'];
                case1FeedInputs[rowNo]['feed_cost'] = feedCost;
                case1FeedInputs[rowNo]['feed_id'] = feedID;
            }

            modelInputs.feed_table_case1 = case1FeedInputs;
            modelInputs.feed_table_case2 = case2FeedInputs;

        } else {
            if (rowNo === 0) {
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_min_weight'] = modelInputs.kn_for_grunnforutsetning_snittvekt_case1;
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_max_weight'] = snittvekt >= maxWeight ? snittvekt + 1500 : selectedFeed['feed_max_weight'];
                modelInputs['feed_table_case' + caseNo][rowNo]['bfcr'] = selectedFeed['bfcr'];
                modelInputs['feed_table_case' + caseNo][rowNo]['vf3'] = selectedFeed['vf3'];
                modelInputs['feed_table_case' + caseNo][rowNo]['mortality'] = selectedFeed['mortality'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_name'] = selectedFeed['feed_name'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_producer'] = selectedFeed['feed_producer'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_cost'] = feedCost;
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_id'] = feedID;
            }

            if (rowNo > 0) {
                const minWeight = parseInt(modelInputs['feed_table_case' + caseNo][rowNo - 1]['feed_max_weight']) + 1;
                const maxWeight = minWeight >= parseInt(selectedFeed['feed_max_weight']) ? minWeight + 1500 : selectedFeed['feed_max_weight'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_min_weight'] = minWeight;
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_max_weight'] = maxWeight;
                modelInputs['feed_table_case' + caseNo][rowNo]['bfcr'] = selectedFeed['bfcr'];
                modelInputs['feed_table_case' + caseNo][rowNo]['vf3'] = selectedFeed['vf3'];
                modelInputs['feed_table_case' + caseNo][rowNo]['mortality'] = selectedFeed['mortality'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_name'] = selectedFeed['feed_name'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_producer'] = selectedFeed['feed_producer'];
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_cost'] = feedCost;
                modelInputs['feed_table_case' + caseNo][rowNo]['feed_id'] = feedID;
            }
        }

        return modelInputs;
    }

    selectFeedHandler(feedName, feedID) {

        const rowNo = parseInt(this.state.rowNoCaseNo.split('-')[0]);
        const caseNo = parseInt(this.state.rowNoCaseNo.split('-')[1]);

        const modelInputs = this.changeFeed(rowNo, caseNo, this.props.modelInputs, feedName, feedID);

        this.props.setModelScreenInputs({
            ['feed_table_case' + caseNo]: modelInputs['feed_table_case' + caseNo]
        });

        let inputFeedTable = [];

        this.props.caseNumbers.map((caseNo, keyNumber) => {
            inputFeedTable[keyNumber] = modelInputs['feed_table_case' + caseNo];
        });

        this.iterateForErrors(inputFeedTable, rowNo, caseNo);

        // update timeline, graph output as soon as input changed
        this.props.setFeedModelResult(modelInputs, this.props.caseNumbers);

    }

    iterateForErrors(inputFeedTable, rowNo, currentCaseNo) {

        const {t} = this.props;

        let errors = Object.keys(this.props.inputErrors).length > 0 ? this.props.inputErrors : {};
        let errorTmp = [];
        let prevFeed = inputFeedTable[currentCaseNo - 1][0];

        // check next feed if exist
        if (inputFeedTable[currentCaseNo - 1][1] !== undefined) {
            let currentTimeline = inputFeedTable[currentCaseNo - 1];
            let nextIndex = 1;
            let rowNumber = nextIndex;

            currentTimeline.map((nextFeed, keyNumber) => {

                let hasWeightError = false;
                let hasError = false;

                let maxMinIndex = rowNumber;

                if (keyNumber > 0) {
                    prevFeed = currentTimeline[keyNumber - 1];
                }

                errorTmp[keyNumber] = {
                    feed_id: nextFeed.feed_id,
                    feed_name: nextFeed.feed_name,
                }

                if (keyNumber > 0) {
                    if (errorTmp[keyNumber - 1] === undefined) {
                        errorTmp[keyNumber - 1] = {
                            feed_id: nextFeed.feed_id,
                            feed_name: nextFeed.feed_name,
                        }
                    }
                    let maxWeight = parseFloat(prevFeed.feed_max_weight) + 1;
                    let minWeight = parseFloat(nextFeed.feed_min_weight);

                    if (minWeight !== maxWeight) {
                        hasError = true;
                        errorTmp[keyNumber - 1].weightError = 'invalid_weight_range: ' + prevFeed.feed_max_weight + '(g) - ' + nextFeed.feed_min_weight + '(g)';
                    }
                }

                let currentMinWeight = parseFloat(nextFeed.feed_min_weight);
                let currentMaxWeight = parseFloat(nextFeed.feed_max_weight);

                if (currentMinWeight >= currentMaxWeight) {
                    hasError = true;
                    errorTmp[keyNumber].minMaxError = 'minimum_weight_can_not_be_equal_or_greater';
                }

                let vf3 = nextFeed.vf3;
                let bfcr = nextFeed.bfcr;
                let feedCost = nextFeed.feed_cost;

                if (vf3 === undefined || vf3 === '') {
                    hasError = true;
                    errorTmp[keyNumber].vf3Error = 'vf3 - not_found';
                }

                if (bfcr === undefined || bfcr === '') {
                    hasError = true;
                    errorTmp[keyNumber].bfcrError = 'bfcr - not_found';
                }

                if (feedCost === undefined || feedCost === '') {
                    hasError = true;
                    errorTmp[keyNumber].feedCostError = 'feed_costs - not_found';
                }

                if (hasError === false) {
                    delete errorTmp[keyNumber];
                }

                rowNumber++;
            });

            errors['case' + currentCaseNo] = errorTmp;
        }

        this.props.setFeedTableInputBlockErrors(errors);
    }

    inputRangeChangeHandler(name) {
        return function (value) {
            const fieldName = name.split(',')[0];
            const caseNo = name.split(',')[1];
            const index = name.split(',')[2];

            let modelInputs = this.props.modelInputs;

            let inputValue = value;

            // Change ranger value with multiply to work smooth

            if (fieldName === 'vf3') {
                inputValue = inputValue / 10;
            }

            if (fieldName === 'bfcr') {
                inputValue = inputValue / 100;
            }

            if (fieldName === 'feed_cost') {
                inputValue = inputValue / 10;
            }

            modelInputs['feed_table_case' + caseNo][index][fieldName] = inputValue;

            this.props.setModelScreenInputs({
                ['feed_table_case' + caseNo]: modelInputs['feed_table_case' + caseNo]
            });

        }.bind(this)
    }

    rangeChangeCompleteHandler(name) {
        return function (value) {
            if (name !== undefined) {
                let inputFeedTable = [];
                const fieldName = name.split(',')[0];
                const caseNo = name.split(',')[1];
                const rowNo = name.split(',')[2];

                let modelInputs = this.props.modelInputs;

                let inputValue = value;

                // Change ranger value with multiply to work smooth

                if (fieldName === 'vf3') {
                    inputValue = inputValue / 10;
                }

                if (fieldName === 'bfcr') {
                    inputValue = inputValue / 100;
                }

                if (fieldName === 'feed_cost') {
                    inputValue = inputValue / 10;
                }

                modelInputs['feed_table_case' + caseNo][rowNo][fieldName] = inputValue;

                this.props.caseNumbers.map((caseNo, keyNumber) => {
                    inputFeedTable[keyNumber] = modelInputs['feed_table_case' + caseNo];
                });

                this.iterateForErrors(inputFeedTable, rowNo, caseNo);
            }
            this.props.setFeedModelResult(this.props.modelInputs, this.props.caseNumbers);
        }.bind(this)
    }

    feedTableBlockInputChangeHandler(inputTarget) {
        const {name, value} = inputTarget;
        const fieldName = name.split(',')[0];
        const caseNo = name.split(',')[1];
        const index = name.split(',')[2];

        let modelInputs = this.props.modelInputs;

        modelInputs['feed_table_case' + caseNo][index][fieldName] = value;

        let inputFeedTable = [];

        this.props.caseNumbers.map((caseNo, keyNumber) => {
            inputFeedTable[keyNumber] = modelInputs['feed_table_case' + caseNo];
        });

        this.iterateForErrors(inputFeedTable, index, caseNo);

        this.props.setModelScreenInputs({
            ['feed_table_case' + caseNo]: modelInputs['feed_table_case' + caseNo]
        });

        // update timeline, graph output as soon as input changed
        this.props.setFeedModelResult(this.props.modelInputs, this.props.caseNumbers);

    }

    feedTableRowCase(rowNoCaseNo) {
        this.setState({
            ...this.state,
            rowNoCaseNo: rowNoCaseNo
        })
    }

    render() {

        const {t} = this.props;

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

        const caseNumbers = this.props.caseNumbers;
        const modelInputs = this.props.modelInputs;

        const totalCases = caseNumbers.length;

        // Do not show feed table input block until timeline added
        if (this.props.feedTimeline === undefined || modelInputs['feed_table_case1'] === undefined || modelInputs['feed_table_case' + totalCases] === undefined || feedTableDropDown.length === 0) {
            return null;
        }

        const feedTimeline = this.props.feedTimeline;

        const feedTableErrors = this.props.errorMessages === undefined ? [] : this.props.errorMessages;

        const feedErrors = !Boolean(this.props.inputErrors) ? {} : this.props.inputErrors;

        return (
            <div className="section-block">
                <div className="content-block p-2">
                    <div className="screen-block-label"
                         onClick={e => this.feedTableBlockExpandCollapseHandler()}>{t('feed_table')}
                        {this.state.feedTableBlockExpand && <i className="fa fa-angle-up"></i>}
                        {this.state.feedTableBlockExpand === false && <i className="fa fa-angle-down"></i>}
                    </div>
                    {this.state.feedTableBlockExpand && <div className="section-block m-0">
                        {
                            caseNumbers.map(caseNo => {
                                return (
                                    <div className="content-block p-2">
                                        <div className="screen-block-label"
                                             onClick={() => this.feedTableCaseExpandCollapseHandler('feedTableExpandCase' + caseNo)}>
                                            {t('case' + caseNo)}
                                            {(this.state['feedTableExpandCase' + caseNo] === undefined || this.state['feedTableExpandCase' + caseNo] === true) &&
                                            <i className="fa fa-angle-up"></i>}
                                            {(this.state['feedTableExpandCase' + caseNo] !== undefined && this.state['feedTableExpandCase' + caseNo] === false) &&
                                            <i className="fa fa-angle-down"></i>}
                                        </div>
                                        {(this.state['feedTableExpandCase' + caseNo] === undefined || this.state['feedTableExpandCase' + caseNo] === true) &&
                                        <div className="screen-block-inputs" id="feed_table_inputs">
                                            <div className="card block-card">
                                                {
                                                    modelInputs['feed_table_case' + caseNo] !== undefined && modelInputs['feed_table_case' + caseNo].map((feed, keyNumber) => {
                                                        let minWeight = feed.feed_min_weight === '' ? '' : parseInt(feed.feed_min_weight);
                                                        const maxWeight = feed.feed_max_weight === '' ? '' : parseInt(feed.feed_max_weight);
                                                        const bfcr = feed.bfcr === undefined ? '' : feed.bfcr;
                                                        const vf3 = feed.vf3 === undefined ? '' : feed.vf3;
                                                        let mortality = feed.mortality === undefined || feed.mortality === '' ? '' : parseFloat(feed.mortality);
                                                        const feedCost = feed.feed_cost === undefined ? '' : feed.feed_cost;

                                                        if (keyNumber === 0) {
                                                            minWeight = modelInputs.kn_for_grunnforutsetning_snittvekt_case1;
                                                        }

                                                        const duration = feedTimeline !== undefined && feedTimeline['case' + caseNo] !== undefined && feedTimeline['case' + caseNo][keyNumber] !== undefined ? feedTimeline['case' + caseNo][keyNumber].duration : '';

                                                        let disableInputClass = this.props.caseWiseHarvestDateReached !== undefined && this.props.caseWiseHarvestDateReached['case' + caseNo] !== undefined && duration === '' ? 'input-disable' : '';
                                                        let disableDropdown = this.props.caseWiseHarvestDateReached !== undefined && this.props.caseWiseHarvestDateReached['case' + caseNo] !== undefined && duration === '';


                                                        let invalidWeight = false;
                                                        let invalidMinWeight = false;
                                                        let invalidWeightMessage = '';

                                                        let invalidMinMaxWeight = false;
                                                        let invalidMinMaxWeightMessage = '';

                                                        let invalidVf3 = false;
                                                        let invalidVf3Message = '';

                                                        let invalidBfcr = false;
                                                        let invalidBfcrMessage = '';

                                                        let invalidFeedCost = false;
                                                        let invalidFeedCostMessage = '';

                                                        let invalidMessage = '';

                                                        if (Object.keys(feedErrors).length > 0) {
                                                            if (feedErrors['case' + caseNo] !== undefined && feedErrors['case' + caseNo][keyNumber - 1] !== undefined && feedErrors['case' + caseNo][keyNumber - 1].weightError !== undefined) {
                                                                invalidMinWeight = true;
                                                            }

                                                            if (feedErrors['case' + caseNo] !== undefined && feedErrors['case' + caseNo][keyNumber] !== undefined) {

                                                                if (feedErrors['case' + caseNo][keyNumber].weightError !== undefined) {
                                                                    invalidWeight = true;
                                                                    const errorStrArr = feedErrors['case' + caseNo][keyNumber].weightError.split(':');
                                                                    invalidWeightMessage = t(errorStrArr[0]) + ' ' + errorStrArr[1];
                                                                }

                                                                if (feedErrors['case' + caseNo][keyNumber].minMaxError !== undefined) {
                                                                    invalidMinMaxWeight = true;
                                                                    invalidMinMaxWeightMessage = t(feedErrors['case' + caseNo][keyNumber].minMaxError);
                                                                }

                                                                if (feedErrors['case' + caseNo][keyNumber].vf3Error !== undefined) {
                                                                    invalidVf3 = true;
                                                                    invalidVf3Message = feedErrors['case' + caseNo][keyNumber].vf3Error;
                                                                    invalidMessage = t('fields_empty_message');
                                                                }

                                                                if (feedErrors['case' + caseNo][keyNumber].bfcrError !== undefined) {
                                                                    invalidBfcr = true;
                                                                    invalidBfcrMessage = feedErrors['case' + caseNo][keyNumber].bfcrError;
                                                                    invalidMessage = t('fields_empty_message');
                                                                }

                                                                if (feedErrors['case' + caseNo][keyNumber].feedCostError !== undefined) {
                                                                    invalidFeedCost = true;
                                                                    invalidFeedCostMessage = feedErrors['case' + caseNo][keyNumber].feedCostError;
                                                                    invalidMessage = t('fields_empty_message');
                                                                }
                                                            }
                                                        }


                                                        return (
                                                            <form className={disableInputClass}>
                                                                {/*{invalidVf3 &&*/}
                                                                {/*<p className="at2_error_text">{invalidVf3Message}</p>}*/}
                                                                {/*{invalidBfcr &&*/}
                                                                {/*<p className="at2_error_text">{invalidBfcrMessage}</p>}*/}
                                                                {/*{invalidFeedCost &&*/}
                                                                {/*<p className="at2_error_text">{invalidFeedCostMessage}</p>}*/}
                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-6 col-xl-4 col-lg-4 col-md-4 col-sm-4">
                                                                        <div className="model-screen-field-label">
                                                                            {t('feed_name')}
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        onClick={e => this.feedTableRowCase(keyNumber + '-' + caseNo)}
                                                                        className="col-6 col-xl-8 col-lg-8 col-md-8 col-sm-8">
                                                                        <ListAutoComplete
                                                                            fieldDisabled={disableDropdown}
                                                                            fieldName="feed_name"
                                                                            fieldPlaceHolder={t('select_feed')}
                                                                            fieldOnClick={this.selectFeedHandler.bind(this)}
                                                                            selectedItemId={feed.feed_id}
                                                                            listData={feedTableDropDown}/>
                                                                    </div>
                                                                </div>
                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t('min_weight')}
                                                                        </div>

                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        {keyNumber > 0 && <Slider
                                                                            onChangeComplete={this.rangeChangeCompleteHandler('feed_min_weight,' + caseNo + ',' + keyNumber)}
                                                                            onChange={this.inputRangeChangeHandler('feed_min_weight,' + caseNo + ',' + keyNumber)}
                                                                            id=""
                                                                            color="#102640"
                                                                            min={135}
                                                                            max={7000}
                                                                            value={minWeight}/>}
                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-3 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <InputNumber
                                                                            isFieldEmpty={invalidMinWeight || invalidMinMaxWeight}
                                                                            isDisable={keyNumber === 0 && 'true'}
                                                                            fieldName={'feed_min_weight,' + caseNo + ',' + keyNumber}
                                                                            fieldID={'feed_min_weight_' + caseNo + '_' + keyNumber}
                                                                            fieldOnChange={this.feedTableBlockInputChangeHandler.bind(this)}
                                                                            fieldValue={minWeight}/>
                                                                    </div>
                                                                </div>

                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t('max_weight')}
                                                                        </div>

                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <Slider
                                                                            onChangeComplete={this.rangeChangeCompleteHandler('feed_max_weight,' + caseNo + ',' + keyNumber)}
                                                                            onChange={this.inputRangeChangeHandler('feed_max_weight,' + caseNo + ',' + keyNumber)}
                                                                            id=""
                                                                            color="#102640"
                                                                            min={135}
                                                                            max={7000}
                                                                            value={maxWeight}/>
                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-3 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <InputNumber
                                                                            isFieldEmpty={invalidWeight || invalidMinMaxWeight}
                                                                            fieldName={'feed_max_weight,' + caseNo + ',' + keyNumber}
                                                                            fieldID={'feed_max_weight_' + caseNo + '_' + keyNumber}
                                                                            fieldOnChange={this.feedTableBlockInputChangeHandler.bind(this)}
                                                                            fieldValue={maxWeight}/>
                                                                    </div>
                                                                </div>

                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t('bfcr')}
                                                                        </div>

                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <Slider
                                                                            onChangeComplete={this.rangeChangeCompleteHandler('bfcr,' + caseNo + ',' + keyNumber)}
                                                                            onChange={this.inputRangeChangeHandler('bfcr,' + caseNo + ',' + keyNumber)}
                                                                            id=""
                                                                            color="#102640"
                                                                            min={90}
                                                                            max={140}
                                                                            value={bfcr * 100}/>
                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-3 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <InputNumber
                                                                            isFieldEmpty={invalidBfcr}
                                                                            fieldName={'bfcr,' + caseNo + ',' + keyNumber}
                                                                            fieldID={'bfcr_' + caseNo + '_' + keyNumber}
                                                                            fieldOnChange={this.feedTableBlockInputChangeHandler.bind(this)}
                                                                            fieldValue={bfcr}/>
                                                                    </div>
                                                                </div>

                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t('vf3')}
                                                                        </div>

                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <Slider
                                                                            onChangeComplete={this.rangeChangeCompleteHandler('vf3,' + caseNo + ',' + keyNumber)}
                                                                            onChange={this.inputRangeChangeHandler('vf3,' + caseNo + ',' + keyNumber)}
                                                                            id=""
                                                                            color="#102640"
                                                                            min={20}
                                                                            max={50}
                                                                            value={vf3 * 10}/>
                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-3 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <InputNumber
                                                                            isFieldEmpty={invalidVf3}
                                                                            fieldName={'vf3,' + caseNo + ',' + keyNumber}
                                                                            fieldID={'vf3_' + caseNo + '_' + keyNumber}
                                                                            fieldOnChange={this.feedTableBlockInputChangeHandler.bind(this)}
                                                                            fieldValue={vf3}/>
                                                                    </div>
                                                                </div>

                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t('mortality_percentage')}
                                                                        </div>

                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <Slider
                                                                            onChangeComplete={this.rangeChangeCompleteHandler('mortality,' + caseNo + ',' + keyNumber)}
                                                                            onChange={this.inputRangeChangeHandler('mortality,' + caseNo + ',' + keyNumber)}
                                                                            id=""
                                                                            color="#102640"
                                                                            min={0}
                                                                            max={100}
                                                                            value={mortality > 100 ? 100 : mortality}/>
                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-3 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <InputNumber
                                                                            isFieldEmpty={invalidVf3}
                                                                            fieldName={'mortality,' + caseNo + ',' + keyNumber}
                                                                            fieldID={'mortality' + caseNo + '_' + keyNumber}
                                                                            fieldOnChange={this.feedTableBlockInputChangeHandler.bind(this)}
                                                                            fieldValue={mortality}/>
                                                                    </div>
                                                                </div>

                                                                <div className="row mb-2">
                                                                    <div
                                                                        className="col-12 col-xl-4 col-lg-4 col-md-4 col-sm-4 pr-xl-1 pr-lg-1 pr-md-1">
                                                                        <div className="model-screen-field-label">
                                                                            {t('feed_price')}
                                                                        </div>

                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-5 col-lg-4 col-md-4 col-sm-5 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <Slider
                                                                            onChangeComplete={this.rangeChangeCompleteHandler('feed_cost,' + caseNo + ',' + keyNumber)}
                                                                            onChange={this.inputRangeChangeHandler('feed_cost,' + caseNo + ',' + keyNumber)}
                                                                            id=""
                                                                            color="#102640"
                                                                            min={90}
                                                                            max={150}
                                                                            value={feedCost * 10}/>
                                                                    </div>
                                                                    <div
                                                                        className="col-6 col-xl-3 col-lg-4 col-md-4 col-sm-3 pl-xl-1 pl-lg-1 pl-md-1">
                                                                        <InputNumber
                                                                            isFieldEmpty={invalidFeedCost}
                                                                            fieldName={'feed_cost,' + caseNo + ',' + keyNumber}
                                                                            fieldID={'feed_cost_' + caseNo + '_' + keyNumber}
                                                                            fieldOnChange={this.feedTableBlockInputChangeHandler.bind(this)}
                                                                            fieldValue={feedCost}/>
                                                                    </div>
                                                                </div>
                                                                {invalidWeight &&
                                                                <p className="at2_error_text">{invalidWeightMessage}</p>}
                                                                {invalidMessage !== '' &&
                                                                <p className="at2_error_text">{invalidMessage}</p>}
                                                                {invalidMinMaxWeight &&
                                                                <p className="at2_error_text">{invalidMinMaxWeightMessage}</p>}
                                                            </form>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>}
                                    </div>
                                )
                            })
                        }
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    feedLibrary: state.feedLibrary.data,
    feedProducer: state.feedLibrary.feedProducer,
    modelInputs: state.modelScreen.inputs,
    caseNumbers: state.modelScreen.caseNumbers,
    feedTimeline: state.feedModelScreen.feedTimeline,
    caseWiseHarvestDateReached: state.feedModelScreen.caseWiseHarvestDateReached,
    errorMessages: state.feedModelScreen.errorMessages,
    editFeedTable: state.feedModelScreen.editFeedTable,
    currentCaseNo: state.feedModelScreen.currentCaseNo,
    inputErrors: state.feedModelScreen.feedTableInputBlockErrors,
})

export default connect(mapStateToProps, {
    setModelScreenInputs,
    setFeedModelResult,
    setFeedTableInputBlockErrors
})(withTranslation()(FeedTableInputBlock));
