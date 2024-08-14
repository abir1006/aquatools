import {feedStaticData} from "../Actions/FeedLibraryActions";

const init = {};

const feedLibraryReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_FEED_PRODUCER': {
            return {
                ...state,
                feedProducer: action.payload
            }
        }

        case 'SET_FEED_TYPES': {
            return {
                ...state,
                feedTypes: action.payload
            }
        }

        case 'SET_FEED_CUSTOM_FIELDS': {
            return {
                ...state,
                companyFeedCustomFields: action.payload
            }
        }

        case 'SHOW_FEED_LIBRARY_BUTTON_SPINNER': {
            return {
                ...state,
                feedLibraryButtonSpinner: true
            }
        }

        case 'HIDE_FEED_LIBRARY_BUTTON_SPINNER': {
            return {
                ...state,
                feedLibraryButtonSpinner: false
            }
        }

        case 'SHOW_FEED_LIBRARY_FORM_SPINNER': {
            return {
                ...state,
                feedLibraryFormSpinner: true
            }
        }

        case 'HIDE_FEED_LIBRARY_FORM_SPINNER': {
            return {
                ...state,
                feedLibraryFormSpinner: false
            }
        }

        case 'CLEAR_FEED_LIBRARY_FORMS_DATA': {
            return {
                ...state,
                formSettingsData: undefined
            }
        }

        case 'SET_FEED_LIBRARY_FORMS_DATA': {
            const formObj = state.formSettingsData === undefined ? [] : state.formSettingsData;
            return {
                ...state,
                formSettingsData: [...formObj, action.payload]
            }
        }

        case 'SET_FEED_LIBRARY_INPUTS': {
            const objectKey = Object.keys(action.payload)[0];
            const ObjectValue = action.payload[Object.keys(action.payload)[0]];
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [objectKey]: ObjectValue
                }
            }
        }

        case 'SET_FEED_COST_INPUTS': {
            const objectKey = Object.keys(action.payload)[0];
            const ObjectValue = action.payload[Object.keys(action.payload)[0]];
            return {
                ...state,
                costInputs: {
                    ...state.costInputs,
                    [objectKey]: ObjectValue
                }
            }
        }

        case 'SET_FEED_DATA_BY_ID': {
            return {
                ...state,
                selectedFeedData: action.payload
            }
        }

        case 'SET_FEED_LIBRARY_INPUT_ERRORS': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SET_FEED_LIBRARY_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyErrors: {
                    ...state.emptyErrors,
                    [action.payload]: true,
                }
            }
        }

        case 'RESET_FEED_LIBRARY_INPUTS_EMPTY_ERRORS': {
            return {
                ...state,
                emptyErrors: undefined
            }
        }

        case 'SET_FEED_LIBRARY_PAGINATION_DATA': {
            return {
                ...state,
                paginationData: action.payload
            }
        }

        case 'ADD_FEED_LIBRARY_PAGINATION_TOTAL_RECORD': {
            return {
                ...state,
                paginationData: {
                    ...state.paginationData,
                    totalRecord: state.paginationData.totalRecord + 1
                }
            }
        }

        case 'MINUS_FEED_LIBRARY_PAGINATION_TOTAL_RECORD': {
            return {
                ...state,
                paginationData: {
                    ...state.paginationData,
                    totalRecord: state.paginationData.totalRecord - 1
                }
            }
        }

        case 'RESET_FEED_LIBRARY_INPUTS': {
            return {
                ...state,
                inputs: undefined,
                costInputs: undefined
            }
        }

        case 'SET_FEED_LIBRARY': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'ADD_FEED_LIBRARY': {
            return {
                ...state,
                addFeedLibrary: true
            }
        }

        case 'EDIT_FEED_LIBRARY': {
            return {
                ...state,
                editFeedLibrary: true
            }
        }

        case 'HIDE_FEED_LIBRARY_FORMS': {
            return {
                ...state,
                addFeedLibrary: false,
                editFeedLibrary: false,
            }
        }

        case 'UPDATE_FEED_FIELD': {
            const rowID = action.payload.rowID;
            const name = action.payload.name;
            const value = action.payload.value;
            return {
                ...state,
                feedList: state.feedList.map((feed, keyNumber) => keyNumber === rowID ? {...feed, [name]: value} : feed)
            }
        }

        case 'UPDATE_FULL_FEED_LIST': {
            const selectedRowNo = action.payload.rowID;
            const selectedFeed = action.payload.selectedFeed;
            return {
                ...state,
                feedList: state.feedList.map((feed, keyNumber) => {
                    if (keyNumber === selectedRowNo) {
                        return selectedFeed;
                    }
                    return feed;
                })
            }
        }

        case 'SET_FEED_COST_TO_LIST': {
            return {
                ...state,
                feedList: action.payload
            }
        }

        case 'FEED_SEARCH_LIST': {
            return {
                ...state,
                feedSearchList: action.payload
            }
        }

        case 'RESET_FEED_SEARCH_LIST': {
            return {
                ...state,
                feedSearchList: undefined
            }
        }

        case 'ADD_FEED_TO_LIST': {
            const feedList = state.feedList === undefined ? [] : state.feedList;
            return {
                ...state,
                feedList: [...feedList, action.payload]
            }
        }

        case 'RESET_FEED_LIST': {
            return {
                ...state,
                feedList: []
            }
        }

        case 'FEED_TABLE_POPUP_HEIGHT': {
            return {
                ...state,
                feedTablePopupHeight: action.payload
            }
        }

        case 'REMOVE_FEED_FROM_LIST': {
            const updateFeedList = state.feedList.filter((feed,keyNumber) => keyNumber !== action.payload)
            return {
                ...state,
                feedList: updateFeedList
            }
        }

        default:
            return state;

    }
};

export default feedLibraryReducer;


