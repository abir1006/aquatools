const init = {};

const feedModelScreenReducer = (state = init, action) => {
    switch (action.type) {

        case 'SHOW_EDIT_FEED_TABLE': {
            return {
                ...state,
                editFeedTable: action.payload
            }
        }

        case 'SET_CURRENT_CASE_NO': {
            return {
                ...state,
                currentCaseNo: action.payload
            }
        }

        case 'SET_FEED_TIMELINE_PREVIEW': {
            return {
                ...state,
                timelinePreview: action.payload
            }
        }

        case 'SET_FEED_TIMELINE': {
            return {
                ...state,
                feedTimeline: action.payload
            }
        }

        case 'SET_FEED_TIMELINE_RESIZE': {
            return {
                ...state,
                weightResize: action.payload
            }
        }

        case 'SET_FEED_FIRST_MOUSE_POS': {
            return {
                ...state,
                firstMousePos: action.payload
            }
        }

        case 'INCREASE_WEIGHT_IN_FEED_TIMELINE': {
            const params = action.payload;
            let updateFeedTimeLine = state.feedTimeline === undefined ? [] : state.feedTimeline;

            updateFeedTimeLine[params.caseNo][params.feedIndex].feed_max_weight = parseFloat(params.maxWeight) + 20;
            const nextIndexFeedMinWeight = parseFloat(updateFeedTimeLine[params.caseNo][params.feedIndex + 1].feed_min_weight);
            updateFeedTimeLine[params.caseNo][params.feedIndex + 1].feed_min_weight = nextIndexFeedMinWeight + 20;
            return {
                ...state,
                feedTimeline: {...updateFeedTimeLine}
            }
        }

        case 'DECREASE_WEIGHT_IN_FEED_TIMELINE': {
            const params = action.payload;
            let updateFeedTimeLine = state.feedTimeline === undefined ? [] : state.feedTimeline;
            updateFeedTimeLine[params.caseNo][params.feedIndex].feed_max_weight = parseFloat(params.maxWeight) - 20;
            const nextIndexFeedMinWeight = parseFloat(updateFeedTimeLine[params.caseNo][params.feedIndex + 1].feed_min_weight);
            updateFeedTimeLine[params.caseNo][params.feedIndex + 1].feed_min_weight = nextIndexFeedMinWeight - 20;

            return {
                ...state,
                feedTimeline: {...updateFeedTimeLine}
            }
        }

        case 'SET_FEED_TIMELINE_SLAKTEVEKT': {
            return {
                ...state,
                slaktevekt: action.payload
            }
        }

        case 'SET_TIMELINE_SLAKTEVEKT_PREVIEW': {
            return {
                ...state,
                slaktevektPreview: action.payload
            }
        }

        case 'SET_FEED_MODEL_ERROR_MESSAGES': {
            const errorMessage = state.errorMessages === undefined ? '' : state.errorMessages;
            return {
                ...state,
                errorMessages: [...errorMessage, action.payload]
            }
        }

        case 'RESET_FEED_MODEL_ERROR_MESSAGES': {
            return {
                ...state,
                errorMessages: undefined
            }
        }

        case 'SET_HARVEST_DATE_REACHED': {
            return {
                ...state,
                harvestDateReached: action.payload
            }
        }

        case 'SET_CASE_WISE_HARVEST_DATE_REACHED': {
            return {
                ...state,
                caseWiseHarvestDateReached: action.payload
            }
        }

        case 'SET_FEED_WEIGHT_DEVELOPMENT_GRAPH_DATA': {
            return {
                ...state,
                vektutvikling: action.payload
            }
        }

        case 'SET_FEED_GRAPH_BAR_COLORS': {
            return {
                ...state,
                graphBarColors: action.payload
            }
        }

        case 'SET_FEED_TABLE_INPUT_BLOCK_ERRORS': {
            return {
                ...state,
                feedTableInputBlockErrors: action.payload
            }
        }

        default:
            return state;

    }
};

export default feedModelScreenReducer;


