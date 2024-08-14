import axios from "axios";
import TokenService from "../../Services/TokenServices";

export const showNavigationPromptConfirmPopup = (location, message) => dispatch => {
    dispatch({ type: 'SHOW_NAVIGATION_PROMPT_CONFIRM_POPUP', payload: { location: location, message: message } })
}

export const setFeedTableCaseNo = caseNo => dispatch => {
    dispatch({ type: 'SET_CURRENT_CASE_NO', payload: caseNo })
}

export const setFeedTimelineResize = status => dispatch => {
    dispatch({ type: 'SET_FEED_TIMELINE_RESIZE', payload: status })
}

export const setFeedFirstMousePos = mousePos => dispatch => {
    dispatch({ type: 'SET_FEED_FIRST_MOUSE_POS', payload: mousePos })
}

export const increaseWeightInFeedTimeline = (caseNo, feedIndex, maxWeight) => dispatch => {
    const params = {
        caseNo: caseNo,
        feedIndex: feedIndex,
        maxWeight: maxWeight
    }
    dispatch({ type: 'INCREASE_WEIGHT_IN_FEED_TIMELINE', payload: params });
}

export const decreaseWeightInFeedTimeline = (caseNo, feedIndex, maxWeight) => dispatch => {
    const params = {
        caseNo: caseNo,
        feedIndex: feedIndex,
        maxWeight: maxWeight
    }
    dispatch({ type: 'DECREASE_WEIGHT_IN_FEED_TIMELINE', payload: params });
}

let cancelToken;
export const setFeedModelResult = (allInputObject, allCases) => async dispatch => {

    let hasFeedError = false;

    if (
        allInputObject.kn_for_grunnforutsetning_harvest_date_case1 == null ||
        allInputObject.kn_for_grunnforutsetning_utsettsdato_case1 == null
    ) {
        dispatch(setFeedModelError('release_date_and_harvest_date_are_not_set'));
        hasFeedError = true;
    }

    if (allInputObject.temperature_module === undefined || allInputObject.temperature_module == null) {
        dispatch(setFeedModelError('temperature_data_is_not_set'));
        hasFeedError = true;
    }

    if (allInputObject.feed_table_case1 !== undefined && allInputObject.feed_table_case1.length === 0) {
        hasFeedError = true;
    }

    if (allInputObject.feed_table_case1 === undefined) {
        dispatch(setFeedModelError('feed_data_is_not_added'));
        hasFeedError = true;
        dispatch(resetFeedModelOutput());
    }

    if (hasFeedError === true) {
        return false;
    }

    //Check if there are any previous pending requests
    if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel("Operation canceled due to new request.")
    }

    // call excel calculation API
    try {
        let data = {...allInputObject};
        data.kn_for_grunnforutsetning_antall_utsatt_case1 = data.kn_for_grunnforutsetning_antall_utsatt_case1.toString().split(' ').join('');
        data.total_cases = allCases.length;

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        const calculationResult = await axios.post(
            'api/feedModel/calculation', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                cancelToken: cancelToken.token
            });

        dispatch(resetFeedModelError());

        const calculationOutput = calculationResult.data;
        const feedTimeline = {};
        const slaktevekt = {};

        const graphOutputLabel = {
            slaktevektRund: 'harvest_weight_round_gram',
            tonnSloyd: 'slaughter_volume_hog_tonn',
            efcr: 'economic_feed_conversion_ratio_efcr',
            forprisPerKgFor: 'feed_price_per_kg_of_feed',
            prodkostPerKg: 'prod_cost_nok_per_kg',
            driftsResultat: 'operating_profit_nok_mill',
            forkostPerKg: 'feed_costs_nok_per_kg_produced',
            mortality: 'mortality_percentage'
        };

        let graphFinalOutput = {
            slaktevektRund: {},
            tonnSloyd: {},
            efcr: {},
            forprisPerKgFor: {},
            prodkostPerKg: {},
            driftsResultat: {},
            nytteKostRatio: { Case1: 0, Case2: 0 },
            nytteKostRatio2: { Case1: 0, Case2: 0 },
            forkostPerKg: {},
            mortality: {}
        };

        let printPDF = {};
        let vektutvikling = {};

        let dateReached = {};

        allCases.map(caseNo => {
            //dispatch({type: 'SET_CASE_WISE_HARVEST_DATE_REACHED', payload: {['case' + caseNo]: undefined}});
            feedTimeline['case' + caseNo] = calculationOutput['case' + caseNo]['timeline'];
            let currentTimeline = calculationOutput['case' + caseNo]['timeline'];
            let endDuration = '';
            if (currentTimeline[currentTimeline.length - 1].duration !== undefined) {
                endDuration = currentTimeline[currentTimeline.length - 1].duration.split('-')[1].trim();
            }
            if (endDuration === allInputObject.kn_for_grunnforutsetning_harvest_date_case1) {
                dateReached['case' + caseNo] = true;
                dispatch({ type: 'SET_CASE_WISE_HARVEST_DATE_REACHED', payload: dateReached });
            }
            slaktevekt['case' + caseNo] = calculationOutput['case' + caseNo]['slaktevekt'];
            printPDF['case' + caseNo] = calculationOutput['case' + caseNo]['pdf'];
            vektutvikling['case' + caseNo] = calculationOutput['case' + caseNo]['vektutvikling'];
            for (let index in graphFinalOutput) {
                const resultStr = calculationOutput['case' + caseNo]['graphs'][index]?.toString();
                graphFinalOutput[index]['Case' + caseNo] = parseFloat(resultStr?.split(',')?.join(''))?.toFixed(2);
            }
        });

        let graphBaseValue = {
            slaktevektRund: 5500,
            tonnSloyd: 0,
            efcr: 0,
            forprisPerKgFor: 11.5,
            prodkostPerKg: 40,
            driftsResultat: 0,
            nytteKostRatio: 0,
            forkostPerKg: 0,
            mortality: 0
        };
        dispatch({ type: 'SET_GRAPH_BASE_VALUE', payload: graphBaseValue });
        dispatch({ type: 'SET_GRAPH_OUTPUT', payload: graphFinalOutput });
        dispatch({ type: 'SET_PDF_OUTPUT', payload: printPDF });
        dispatch({ type: 'SET_GRAPH_OUTPUT_LABEL', payload: graphOutputLabel });
        dispatch({ type: 'SET_FEED_WEIGHT_DEVELOPMENT_GRAPH_DATA', payload: vektutvikling });
        dispatch({
            type: 'SET_FEED_TIMELINE',
            payload: Object.keys(feedTimeline).length === 0 ? undefined : feedTimeline
        });

        dispatch({ type: 'SET_FEED_TIMELINE_SLAKTEVEKT', payload: slaktevekt });

        if (Object.keys(feedTimeline).length === 0) {
            dispatch(resetFeedModelOutput());
        }

    } catch (error) {
        console.log(error);
        dispatch(resetFeedModelError());
        if( Boolean(error.response)) {
            dispatch(setFeedModelError(error.response.data.message));
        }
    }
}

let cancelTokenPreview;

export const setFeedModelPreview = previewInputs => async dispatch => {

    dispatch(setFeedTableInputBlockErrors({}));

    dispatch({ type: 'SET_HARVEST_DATE_REACHED', payload: undefined });

    let hasFeedError = false;

    if (
        previewInputs.kn_for_grunnforutsetning_antall_utsatt_case1 == null ||
        previewInputs.kn_for_grunnforutsetning_harvest_date_case1 == null ||
        previewInputs.kn_for_grunnforutsetning_snittvekt_case1 == null ||
        previewInputs.kn_for_grunnforutsetning_utsettsdato_case1 == null
    ) {
        dispatch(setFeedModelError('basic_preconditions_input_fields_should_not_be_empty'));
        hasFeedError = true;
    }

    if (previewInputs.temperature_module === undefined || previewInputs.temperature_module == null) {
        dispatch(setFeedModelError('temperature_data_is_not_set'));
        hasFeedError = true;
    }

    if (previewInputs.feed_table_case1 === undefined || previewInputs.feed_table_case1.length === 0) {
        hasFeedError = true;
        dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined })
    }

    if (parseFloat(previewInputs.feed_table_case1[0]['feed_min_weight']) !== parseFloat(previewInputs.kn_for_grunnforutsetning_snittvekt_case1)) {
        hasFeedError = true;
        dispatch(setFeedModelError('invalid_weight_range_started'));
        dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
        return false;
    }

    previewInputs.feed_table_case1.map(feed => {
        if (feed.feed_name !== '') {
            if (parseFloat(feed.feed_min_weight) >= parseFloat(feed.feed_max_weight)) {
                hasFeedError = true;
                dispatch(setFeedModelError( 'invalid_weight_range_for_feed: "' + feed.feed_name + '"'));
                dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
                return false;
            }

            if (feed.bfcr === undefined || feed.bfcr === '') {
                hasFeedError = true
                dispatch(setFeedModelError('bfcr_not_found_for_feed: "' + feed.feed_name + '"'));
                dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
                return false;
            }

            if (feed.vf3 === undefined || feed.vf3 === '') {
                hasFeedError = true
                dispatch(setFeedModelError('vf3_not_found_for_feed: "' + feed.feed_name + '"'));
                dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
                return false;
            }

            if (feed.mortality === undefined || feed.mortality === '') {
                hasFeedError = true
                dispatch(setFeedModelError('mortality_percentage_not_found_for_feed: "' + feed.feed_name + '"'));
                dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
                return false;
            }

            if (feed.feed_cost === undefined || feed.feed_cost === '') {
                hasFeedError = true;
                dispatch(setFeedModelError('feed_cost_not_found_for_feed: "' + feed.feed_name + '"'));
                dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
                return false;
            }
        }
    });

    if (hasFeedError === true) {
        return false;
    }

    //Check if there are any previous pending requests
    if (typeof cancelTokenPreview !== typeof undefined) {
        cancelTokenPreview.cancel("Operation canceled due to new request.")
    }

    // call excel calculation API
    try {
        let data = {...previewInputs};
        data.kn_for_grunnforutsetning_antall_utsatt_case1 = data.kn_for_grunnforutsetning_antall_utsatt_case1.toString().split(' ').join('');
        data.total_cases = 1;
        //Save the cancel token for the current request
        cancelTokenPreview = axios.CancelToken.source();
        const calculationResult = await axios.post(
            'api/feedModel/calculation', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                cancelToken: cancelTokenPreview.token
            });

        dispatch(resetFeedModelError());

        const calculationOutput = calculationResult.data;
        let endDuration = '';
        if (calculationOutput['case1']['timeline'][calculationOutput['case1']['timeline'].length - 1].duration !== undefined) {
            endDuration = calculationOutput['case1']['timeline'][calculationOutput['case1']['timeline'].length - 1].duration.split('-')[1].trim();
        }

        if (endDuration === previewInputs.kn_for_grunnforutsetning_harvest_date_case1) {
            dispatch({ type: 'SET_HARVEST_DATE_REACHED', payload: true });
        }

        const timelinePreview = calculationOutput['case1']['timeline'];
        const slaktevekt = calculationOutput['case1']['slaktevekt'];

        dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: timelinePreview });
        dispatch({ type: 'SET_TIMELINE_SLAKTEVEKT_PREVIEW', payload: slaktevekt });

    } catch (error) {
        dispatch(resetFeedModelError());
        console.log(error.response.data.message);
        dispatch(setFeedModelError(error.response.data.message));
        dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined })
    }
}

export const setFeedModelError = message => dispatch => {
    dispatch({ type: 'SET_FEED_MODEL_ERROR_MESSAGES', payload: message });
}

export const resetFeedModelError = () => dispatch => {
    dispatch({ type: 'RESET_FEED_MODEL_ERROR_MESSAGES' });
}

export const resetFeedTimelinePreview = () => dispatch => {
    dispatch({ type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined });
    dispatch({ type: 'SET_TIMELINE_SLAKTEVEKT_PREVIEW', payload: undefined });
}

export const showEditFeedTable = status => dispatch => {
    dispatch({ type: 'SHOW_EDIT_FEED_TABLE', payload: status });
}

export const resetFeedModelOutput = () => dispatch => {
    dispatch({ type: 'SET_GRAPH_OUTPUT', payload: undefined });
    dispatch({ type: 'SET_GRAPH_BASE_VALUE', payload: undefined });
    dispatch({ type: 'SET_PDF_OUTPUT', payload: undefined });
    dispatch({ type: 'SET_GRAPH_OUTPUT_LABEL', payload: undefined });
    dispatch({ type: 'SET_FEED_TIMELINE', payload: undefined });
    dispatch({ type: 'SET_FEED_TIMELINE_SLAKTEVEKT', payload: undefined });
    dispatch({ type: 'SET_FEED_WEIGHT_DEVELOPMENT_GRAPH_DATA', payload: undefined });
}

export const setFeedBarColors = barColors => dispatch => {
    dispatch({ type: 'SET_FEED_GRAPH_BAR_COLORS', payload: barColors });
}

export const setFeedTableInputBlockErrors = errors => dispatch => {
    dispatch({ type: 'SET_FEED_TABLE_INPUT_BLOCK_ERRORS', payload: errors });
}
