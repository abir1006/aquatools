import React from 'react';
import './Timeline.css';
import { connect } from 'react-redux';
import { showFeedTablePopup } from "../../../../../Store/Actions/popupActions";
import { fetchFeedLibrary } from "../../../../../Store/Actions/FeedLibraryActions";

const TimelinePreview = props => {
    const currentCaseNo = props.currentCaseNo === undefined ? 1 : props.currentCaseNo;
    const timelinePreview = props.timelinePreview === undefined ? [] : props.timelinePreview;
    if (timelinePreview.length === 0) {
        return null;
    }
    let lastMaxWeight = timelinePreview[timelinePreview.length - 1].feed_max_weight;

    const slaktevekt = props.slaktevektPreview === undefined ? 0 : props.slaktevektPreview.toFixed(2);

    return (
        <div id="feed_module_timeline" className="timeline_preview feeds3">
            <ul className="timeline_date">
                {
                    timelinePreview.map(feed => {
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
                        const timeLineWidth = Math.round((feed.feed_max_weight - feed.feed_min_weight) / lastMaxWeight * 100);
                        const endDateLeftMargin = timeLineWidth < 4 ? -40 : 0;
                        return <li style={{ width: timeLineWidth + '%' }}>
                            {/*<span className="date_start">{startDate}</span>*/}
                            <span className="date_end" style={{ marginRight: endDateLeftMargin + 'px' }}>{endDate}</span>
                        </li>
                    })
                }
            </ul>
            <ul className="timeline_weight">
                {
                    timelinePreview.map(feed => {
                        if (feed.duration === undefined || feed.duration === null || feed.duration === '') {
                            return null;
                        }
                        const maxWeight = parseFloat(feed.feed_max_weight) > parseFloat(slaktevekt) ? slaktevekt : feed.feed_max_weight;
                        const timeLineWidth = Math.round((feed.feed_max_weight - feed.feed_min_weight) / lastMaxWeight * 100);
                        const endWeightLeftMargin = timeLineWidth < 4 ? -25 : 0;
                        return <li style={{ width: timeLineWidth + '%' }}>
                            {/*<span className="weight_start">{feed.feed_min_weight} g</span>*/}
                            <span className="weight_end"
                                style={{ marginRight: endWeightLeftMargin + 'px' }}>{maxWeight} g</span></li>
                    })
                }
            </ul>
            <ul className="timeline_feed timeline_case1">
                {
                    timelinePreview.map(feed => {
                        if (feed.duration === undefined || feed.duration === null || feed.duration === '') {
                            return null;
                        }
                        const producer = props.feedProducer.find(producer => producer.name === feed.feed_producer);
                        const timeLineWidth = Math.round((feed.feed_max_weight - feed.feed_min_weight) / lastMaxWeight * 100);
                        return <li style={{
                            width: timeLineWidth + '%',
                            backgroundColor: producer.color
                        }} title={feed.feed_name}>{feed.feed_name}</li>
                    })
                }
            </ul>
        </div>
    )
}

const mapStateToProps = state => ({
    blockOutput: state.modelScreen.blockOutput,
    currentCaseNo: state.feedModelScreen.currentCaseNo,
    timelinePreview: state.feedModelScreen.timelinePreview,
    feedProducer: state.feedLibrary.feedProducer,
    slaktevektPreview: state.feedModelScreen.slaktevektPreview,
})

export default connect(mapStateToProps, {
    showFeedTablePopup,
    fetchFeedLibrary,
})(TimelinePreview);
