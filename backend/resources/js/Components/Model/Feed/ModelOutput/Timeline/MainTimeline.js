import React from 'react';
import './Timeline.css';
import {connect} from 'react-redux';
import {showFeedTablePopup} from "../../../../../Store/Actions/popupActions";
import {fetchFeedLibrary, addFeedToList} from "../../../../../Store/Actions/FeedLibraryActions";
import {setModelScreenInputs, removeModelScreenCase} from "../../../../../Store/Actions/MTBActions";
import {
    increaseWeightInFeedTimeline,
    decreaseWeightInFeedTimeline,
    setFeedTimelineResize,
    setFeedFirstMousePos,
    setFeedModelResult,
    setFeedTableCaseNo,
    showEditFeedTable,
    setFeedModelPreview,
} from "../../../../../Store/Actions/FeedModelActions";
import {withTranslation} from "react-i18next";

const MainTimeline = props => {

    const editFeedTable = caseNo => {
        props.setFeedTableCaseNo(caseNo);
        props.showEditFeedTable(true);
        let selectedFeedInput = [];
        let countFeedInput = 0;
        const selectedTimeline = props.feedTimeline['case' + caseNo];


        selectedTimeline.map(selectedFeed => {
            selectedFeedInput[countFeedInput] = {
                feed_id: selectedFeed.feed_id,
                feed_producer: selectedFeed.feed_producer,
                feed_name: selectedFeed.feed_name,
                feed_min_weight: selectedFeed.feed_min_weight,
                feed_max_weight: selectedFeed.feed_max_weight,
                bfcr: selectedFeed.bfcr,
                vf3: selectedFeed.vf3,
                mortality: selectedFeed.mortality,
                feed_cost: selectedFeed.feed_cost,
            };
            const feedList = {
                id: selectedFeed.feed_id,
                feed_producer: selectedFeed.feed_producer,
                feed_name: selectedFeed.feed_name,
                feed_min_weight: selectedFeed.feed_min_weight,
                feed_max_weight: selectedFeed.feed_max_weight,
                bfcr: selectedFeed.bfcr,
                vf3: selectedFeed.vf3,
                mortality: selectedFeed.mortality,
                cost_per_kg: selectedFeed.feed_cost,
            }
            countFeedInput++;
            props.addFeedToList(feedList);
        });

        let modelInputs = props.modelInputs;
        modelInputs['feed_table_case1'] = selectedFeedInput;
        props.setFeedModelPreview(modelInputs);
        props.showFeedTablePopup();
    }

    const dragFeedMouseDownHandler = e => {
        props.setFeedTimelineResize(true);
        props.setFeedFirstMousePos(e.clientX);
    }

    const firstMousePos = props.firstMousePos === undefined ? 0 : props.firstMousePos;

    const feedDragMouseMove = (e, caseNo, maxWeight, feedID, feedIndex) => {

        if (Boolean(props.errorMessages)) {
            return false;
        }

        if (props.weightResize === undefined || props.weightResize === false)
            return;

        // drag left
        if (e.clientX < firstMousePos) {
            props.decreaseWeightInFeedTimeline(caseNo, feedIndex, maxWeight);
        }

        // drag right
        if (e.clientX > firstMousePos) {
            props.increaseWeightInFeedTimeline(caseNo, feedIndex, maxWeight);
        }

        props.setFeedFirstMousePos(e.clientX);
    }

    const feedDragMouseUp = e => {

        if (Boolean(props.errorMessages)) {
            return false;
        }

        props.setFeedTimelineResize(false);

        const caseNumbers = props.caseNumbers;

        let modelNewInputs = props.modelInputs;


        let feedNewInputs = {};

        // mapping feed table inputs to send to calculation API

        Object.keys(feedTimeLine).map(caseNo => {
            //console.log(feedTimeLine[caseNo]);
            let tmpObj = [];
            feedTimeLine[caseNo].map((feed, keyNumber) => {
                tmpObj[keyNumber] = {
                    feed_id: feed.feed_id,
                    feed_producer: feed.feed_producer,
                    feed_name: feed.feed_name,
                    feed_min_weight: feed.feed_min_weight,
                    feed_max_weight: feed.feed_max_weight,
                    bfcr: feed.bfcr,
                    vf3: feed.vf3,
                    mortality: feed.mortality,
                    feed_cost: feed.feed_cost,
                };
            });
            feedNewInputs[caseNo] = tmpObj;
        });

        caseNumbers.map(caseNo => {
            modelNewInputs['feed_table_case' + caseNo] = feedNewInputs['case' + caseNo];
            props.setModelScreenInputs({
                ['feed_table_case' + caseNo]: feedNewInputs['case' + caseNo]
            });
        });

        // send to backend calculation
        props.setFeedModelResult(modelNewInputs, caseNumbers);
    }

    const releaseMouseDrag = () => {
        props.setFeedTimelineResize(false);
    }

    const deleteTimeline = selectedCaseNo => {
        const exchangeCount = props.caseNumbers.length - selectedCaseNo;
        const caseCountBeforeDelete = props.caseNumbers.length;
        props.removeModelScreenCase();
        let modelInputs = props.modelInputs;
        delete modelInputs['feed_table_case' + selectedCaseNo];

        if (Boolean(props.feedTableErrors) && Object.keys(props.feedTableErrors).length > 0 && Boolean(props.feedTableErrors['case' + selectedCaseNo])) {
            delete props.feedTableErrors['case' + selectedCaseNo];
        }

        if (exchangeCount > 0) {
            for (let i = selectedCaseNo; i <= caseCountBeforeDelete; i++) {
                modelInputs['feed_table_case' + i] = modelInputs['feed_table_case' + (i + 1)];
                delete modelInputs['feed_table_case' + (i + 1)];
            }
        }

        let currentCaseNo = selectedCaseNo === 1 ? undefined : props.currentCaseNo - 1;
        props.setFeedTableCaseNo(currentCaseNo);
        props.setFeedModelResult(modelInputs, props.caseNumbers);
    }

    let countCase = 0;

    let feedTimeLine = props.feedTimeline === undefined ? {} : props.feedTimeline;

    const showMainTimeline = Object.keys(feedTimeLine).length > 0;

    const mainTimeLinePercentage = 89;

    const hasFeedTableError = Boolean(props.errorMessages);

    const timeLineEditIconClass = hasFeedTableError ? 'fa fa-pencil-square-o cursor_pointer ml-2 input-disable' : 'fa fa-pencil-square-o cursor_pointer ml-2'
    const timeLineDeleteIconClass = hasFeedTableError ? 'fa fa-times white-stroke ml-1 input-disable' : 'fa fa-times white-stroke ml-1 '

    const {t} = props;

    return (
        <div onMouseUp={releaseMouseDrag} id="feed_module_timeline" className="timeline_output feeds3">            {
            showMainTimeline === true && Object.keys(feedTimeLine).map((caseNo, keyNumber) => {
                countCase++;
                const caseWiseTimeline = feedTimeLine[caseNo];
                let lastMaxWeight = caseWiseTimeline[caseWiseTimeline.length - 1].feed_max_weight;
                const slaktevekt = props.slaktevekt === undefined || props.slaktevekt[caseNo] === undefined ? 0 : props.slaktevekt[caseNo].toFixed(2);
                const lessWidth = Math.floor(10 / caseWiseTimeline.length);
                let timelineDateTotalWidth = 0;
                let timelineWeightTotalWidth = 0;
                let timelineNameTotalWidth = 0;
                return (
                    <div>
                        <ul className="timeline_date">
                            <li>{t('date')}</li>
                            {
                                caseWiseTimeline.map(feed => {
                                    if (feed.duration === undefined || feed.duration === null || feed.duration === '') {
                                        return null;
                                    }
                                    const duration = feed.duration;
                                    let startDate = '';
                                    let endDate = '';
                                    if (duration !== undefined && duration !== '' && duration !== null) {
                                        const dateArr = duration.split('-');
                                        startDate = dateArr[0].trim();
                                        endDate = dateArr[1].trim();
                                    }
                                    const tmpN = (feed.feed_max_weight - feed.feed_min_weight) / lastMaxWeight;
                                    let timeLineWidth = Math.floor((tmpN * 100) - (lessWidth * tmpN));
                                    timelineDateTotalWidth = timelineDateTotalWidth + timeLineWidth;
                                    let restWidthPercentage = mainTimeLinePercentage - timelineDateTotalWidth;
                                    if (restWidthPercentage < 0) {
                                        timeLineWidth = timeLineWidth + restWidthPercentage;
                                    }

                                    const endDateLeftMargin = timeLineWidth < 4 ? -40 : 0;
                                    return <li style={{width: timeLineWidth + '%'}}>
                                        {/*<span className="date_start">{startDate}</span>*/}
                                        <span className="date_end"
                                              style={{marginRight: endDateLeftMargin + 'px'}}>{endDate}</span>
                                    </li>
                                })
                            }
                        </ul>
                        <ul className="timeline_weight">
                            <li>{t('weight')} (g)</li>
                            {
                                caseWiseTimeline.map(feed => {
                                    if (feed.duration === undefined || feed.duration === null || feed.duration === '') {
                                        return null;
                                    }
                                    const maxWeight = parseFloat(feed.feed_max_weight) > parseFloat(slaktevekt) ? slaktevekt : feed.feed_max_weight;
                                    const tmpN = (feed.feed_max_weight - feed.feed_min_weight) / lastMaxWeight;
                                    let timeLineWidth = Math.floor((tmpN * 100) - (lessWidth * tmpN));
                                    timelineWeightTotalWidth = timelineWeightTotalWidth + timeLineWidth;
                                    let restWidthPercentage = mainTimeLinePercentage - timelineWeightTotalWidth;
                                    if (restWidthPercentage < 0) {
                                        timeLineWidth = timeLineWidth + restWidthPercentage;
                                    }
                                    const endWeightLeftMargin = timeLineWidth < 4 ? -25 : 0;
                                    return <li style={{width: timeLineWidth + '%'}}>
                                        {/*<span className="weight_start">{feed.feed_min_weight} g</span>*/}
                                        <span className="weight_end"
                                              style={{marginRight: endWeightLeftMargin + 'px'}}>{maxWeight} g</span>
                                    </li>
                                })
                            }
                        </ul>
                        <ul className="timeline_feed">
                            <li>
                                <i onClick={() => editFeedTable(keyNumber + 1)}
                                   className={timeLineEditIconClass} aria-hidden="true"></i>
                                <i onClick={() => deleteTimeline(keyNumber + 1)}
                                   className={timeLineDeleteIconClass}></i>
                            </li>
                            {
                                caseWiseTimeline.map((feed, keyNumber) => {
                                    if (feed.duration === undefined || feed.duration === null || feed.duration === '') {
                                        return null;
                                    }
                                    const producer = props.feedProducer.find(producer => producer.name === feed.feed_producer);
                                    const tmpN = (feed.feed_max_weight - feed.feed_min_weight) / lastMaxWeight;
                                    let timeLineWidth = Math.floor((tmpN * 100) - (lessWidth * tmpN));
                                    timelineNameTotalWidth = timelineNameTotalWidth + timeLineWidth;
                                    let restWidthPercentage = mainTimeLinePercentage - timelineNameTotalWidth;
                                    if (restWidthPercentage < 0) {
                                        timeLineWidth = timeLineWidth + restWidthPercentage;
                                    }
                                    return <li
                                        title={feed.feed_name}
                                        onMouseMove={e => feedDragMouseMove(e, caseNo, feed.feed_max_weight, feed.feed_id, keyNumber)}
                                        onMouseUp={e => feedDragMouseUp(e)}
                                        style={{
                                            width: timeLineWidth + '%',
                                            backgroundColor: producer.color
                                        }}>{feed.feed_name}
                                        <span
                                            onMouseDown={dragFeedMouseDownHandler}
                                            className="drag_feed_weight"></span>
                                    </li>
                                })
                            }
                        </ul>
                    </div>
                )
            })
        }

            {showMainTimeline === true && Boolean(props.errorMessages) &&
            <p className="at2_error_text pl-1">{t('please_fix_feed_table_input_data_to_change_timeline')}</p>}

            {
                showMainTimeline === false && <div>
                    <ul className="timeline_date">
                        <li>{t('date')}</li>
                        <li>
                            <span className="date_start">dd/mm/yy</span>
                            <span className="date_end">dd/mm/yy</span>
                        </li>
                        <li>
                            <span className="date_start">dd/mm/yy</span>
                            <span className="date_end">dd/mm/yy</span>
                        </li>
                        <li>
                            <span className="date_start">dd/mm/yy</span>
                            <span className="date_end">dd/mm/yy</span>
                        </li>
                    </ul>
                    <ul className="timeline_weight">
                        <li>{t('weight')} (g)</li>
                        <li>
                            <span className="weight_start">NN g</span>
                            <span className="weight_end">NN g</span>
                        </li>
                        <li>
                            <span className="weight_start">NN g</span>
                            <span className="weight_end">NN g</span>
                        </li>
                        <li>
                            <span className="weight_start">NN g</span>
                            <span className="weight_end">NN g</span>
                        </li>
                    </ul>
                    <ul className="timeline_feed">
                        <li></li>
                        <li title={t('feed') + ' 1'}>
                            {t('feed')} 1
                        </li>
                        <li className="blue_timeline" title={t('feed') + ' 2'}>
                            {t('feed')} 2
                        </li>
                        <li className="orange_timeline" title={t('feed') + ' 3'}>
                            {t('feed')} 3
                        </li>
                    </ul>

                    <ul className="timeline_date">
                        <li>{t('date')}</li>
                        <li>
                            <span className="date_start">dd/mm/yy</span>
                            <span className="date_end">dd/mm/yy</span>
                        </li>
                        <li>
                            <span className="date_start">dd/mm/yy</span>
                            <span className="date_end">dd/mm/yy</span>
                        </li>
                        <li>
                            <span className="date_start">dd/mm/yy</span>
                            <span className="date_end">dd/mm/yy</span>
                        </li>
                    </ul>
                    <ul className="timeline_weight">
                        <li>{t('weight')} (g)</li>
                        <li>
                            <span className="weight_start">NN g</span>
                            <span className="weight_end">NN g</span>
                        </li>
                        <li>
                            <span className="weight_start">NN g</span>
                            <span className="weight_end">NN g</span>
                        </li>
                        <li>
                            <span className="weight_start">NN g</span>
                            <span className="weight_end">NN g</span>
                        </li>
                    </ul>
                    <ul className="timeline_feed">
                        <li></li>
                        <li title={t('feed') + ' 1'}>
                            {t('feed')} 1
                        </li>
                        <li className="blue_timeline" title={t('feed') + ' 2'}>
                            {t('feed')} 2
                        </li>
                        <li className="orange_timeline" title={t('feed') + ' 3'}>
                            {t('feed')} 3
                        </li>
                    </ul>
                </div>
            }

        </div>
    );
}

const mapStateToProps = state => ({
    currentCaseNo: state.feedModelScreen.currentCaseNo,
    feedTimeline: state.feedModelScreen.feedTimeline,
    weightResize: state.feedModelScreen.weightResize,
    firstMousePos: state.feedModelScreen.firstMousePos,
    feedProducer: state.feedLibrary.feedProducer,
    slaktevekt: state.feedModelScreen.slaktevekt,
    mainTimeLine: state.feedModelScreen.mainTimeLine,
    modelInputs: state.modelScreen.inputs,
    caseNumbers: state.modelScreen.caseNumbers,
    feedTableErrors: state.feedModelScreen.feedTableInputBlockErrors,
    errorMessages: state.feedModelScreen.errorMessages,
})

export default connect(mapStateToProps, {
    showFeedTablePopup,
    fetchFeedLibrary,
    increaseWeightInFeedTimeline,
    decreaseWeightInFeedTimeline,
    setFeedTimelineResize,
    setFeedFirstMousePos,
    setModelScreenInputs,
    setFeedModelResult,
    removeModelScreenCase,
    setFeedTableCaseNo,
    showEditFeedTable,
    addFeedToList,
    setFeedModelPreview,
})(withTranslation()(MainTimeline));
