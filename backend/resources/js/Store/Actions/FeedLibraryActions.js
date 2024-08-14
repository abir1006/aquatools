import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showSuccessMessage} from "./popupActions";

export const saveFeedLibrary = data => async dispatch => {
    dispatch(showFeedLibraryButtonSpinner());
    try {
        const saveResponse = await axios.post(
            'api/feed/save', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch(fetchFeedLibrary());
        dispatch(hideFeedLibraryButtonSpinner());
        dispatch(hideFeedLibraryForms());
        dispatch(showSuccessMessage('successfully_saved'))

    } catch (error) {
        console.log(error);
        dispatch(hideFeedLibraryButtonSpinner());
    }
}

export const updateFeedLibrary = (updatedData, pageNo) => async dispatch => {
    dispatch(showFeedLibraryButtonSpinner());
    try {
        const updateResponse = await axios.put(
            'api/feed/update', updatedData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch(fetchFeedLibrary(pageNo));
        dispatch(hideFeedLibraryButtonSpinner());
        dispatch(hideFeedLibraryForms());
        dispatch(showSuccessMessage('successfully_updated'))

    } catch (error) {
        console.log(error);
        dispatch(hideFeedLibraryButtonSpinner());
    }
}

export const feedSearch = (searchStr, data) => dispatch => {
    let resultData = data.filter(row =>
        (row.customer_name !== undefined && row.customer_name.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1) ||
        (row.feed_producer !== undefined && row.feed_producer.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1) ||
        (row.feed_type !== undefined && row.feed_type.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1) ||
        (row.feed_name !== undefined && row.feed_name.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1)
    );

    dispatch({type: 'FEED_SEARCH_LIST', payload: resultData});
    dispatch(setFeedLibraryPagination(1, resultData.length));

    if (searchStr === '') {
        dispatch(fetchFeedLibrary());
    }
}

export const feedStaticData = () => async dispatch => {

    const feedProducer = [
        {id: 1, name: 'Ewos', color: '#76af1b'},
        {id: 2, name: 'Skretting', color: '#ce7b6a'},
        {id: 3, name: 'Biomar', color: '#1573c3'},
    ];

    const feedTypes = [
        {id: 1, name: 'Growth'},
        {id: 2, name: 'Functional'},
    ];

    dispatch({type: 'SET_FEED_PRODUCER', payload: feedProducer});
    dispatch({type: 'SET_FEED_TYPES', payload: feedTypes});
}

export const fetchFeedLibraryFormFields = settingsName => async dispatch => {
    dispatch(showFeedLibraryFormSpinner());
    try {
        const fieldListResponse = await axios.post(
            'api/feed_settings/fieldList', {
                name: settingsName
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        if (fieldListResponse.data.length > 0) {
            let formData = {};
            formData[settingsName] = fieldListResponse.data;
            dispatch({type: 'SET_FEED_LIBRARY_FORMS_DATA', payload: formData})
        }

        dispatch(hideFeedLibraryFormSpinner());

    } catch (error) {
        console.log(error);
        dispatch(hideFeedLibraryFormSpinner());
    }
}

export const fetchFeedCustomFields = data => async dispatch => {
    try {
        const customFieldsResponse = await axios.post(
            'api/company/feedCustomFields', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'SET_FEED_CUSTOM_FIELDS', payload: customFieldsResponse.data})

    } catch (error) {
        console.log(error);
    }
}

export const clearFeedLibraryFormsData = () => async dispatch => {
    dispatch({type: 'CLEAR_FEED_LIBRARY_FORMS_DATA'})
}

export const fetchFeedLibrary = (pageNumber, pageName) => async dispatch => {

    let url = 'api/feed/list';

    if (Boolean(pageName)) {
        url = 'api/feed/list?pageName=feedLibrary';
    }

    try {
        const feedResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        let feedLibraryData = [];

        feedResponse.data.map((data, key) => {
            feedLibraryData[key] = {id: data.id, user_id: data.user_id, company_id: data.company_id};
            if (data.feed_fields.feedFieldsData.length > 0) {
                data.feed_fields.feedFieldsData.map(field => {
                    feedLibraryData[key][field.fieldName] = field.fieldValue;
                })
            }

            if (data.feed_fields.feedCostTypes !== undefined && data.feed_fields.feedCostTypes.length > 0) {
                let feedCosts = [];
                data.feed_fields.feedCostTypes.map((field, key) => {
                    feedCosts[key] = {[field.fieldName]: field.fieldValue};
                })

                feedLibraryData[key]['feed_cost'] = feedCosts;
            }

            feedLibraryData[key].created_at = data.created_at
        });

        dispatch({type: 'SET_FEED_LIBRARY', payload: feedLibraryData});
        let currentPage = pageNumber === undefined ? 1 : pageNumber;
        dispatch(setFeedLibraryPagination(currentPage, feedLibraryData.length));


    } catch (error) {
        console.log(error);
    }
}

export const setFeedLibraryPagination = (pageNumber, totalRecord) => dispatch => {
    const paginationData = {
        currentPage: pageNumber,
        perPage: 10,
        totalRecord: totalRecord,
    }
    dispatch({type: 'SET_FEED_LIBRARY_PAGINATION_DATA', payload: paginationData})
}

export const setFeedDataByID = (id, feedLibraryData) => dispatch => {
    const selectedFeed = feedLibraryData.find(feed => feed.id === id);
    Object.keys(selectedFeed).map(key => {
        if (key === 'feed_cost') {
            selectedFeed[key].map(fieldObj => {
                dispatch(setFeedCostInputs(fieldObj));
            })
        }
        if (key !== 'feed_cost' && key !== 'company_id' && key !== 'user_id' && key !== 'status' && key !== 'created_at') {
            dispatch(setFeedLibraryInputs({[key]: selectedFeed[key]}));
        }
    });
}

export const resetFeedSearch = () => dispatch => {
    dispatch({type: 'RESET_FEED_SEARCH_LIST'});
}

export const addFeedBlankRow = () => dispatch => {
    const feedBlankRow = {
        id: new Date().getTime().toString(),
        feed_name: '',
        feed_min_weight: '',
        feed_max_weight: '',
        vf3: '',
        mortality: '',
        bfcr: '',
        cost_per_kg: '',
        row_id: new Date().getTime().toString(),
    };

    dispatch({type: 'ADD_FEED_TO_LIST', payload: feedBlankRow});
}

export const resetFeedTable = () => dispatch => {
    dispatch({type: 'RESET_FEED_LIST'});
    dispatch({type: 'RESET_FEED_MODEL_ERROR_MESSAGES'});
    dispatch({type: 'SHOW_EDIT_FEED_TABLE', payload: undefined});
    dispatch({type: 'SET_FEED_TIMELINE_PREVIEW', payload: undefined})
    dispatch({type: 'SET_HARVEST_DATE_REACHED', payload: undefined});
}

export const resetFeedList = () => dispatch => {
    dispatch({type: 'RESET_FEED_LIST'});
}

export const resetFeedTableCases = () => dispatch => {
    dispatch({type: 'SET_CURRENT_CASE_NO', payload: undefined});
}

export const resetFeedTimeline = () => dispatch => {
    dispatch({type: 'SET_FEED_TIMELINE', payload: undefined});
}

export const addFeedToList = newFeed => dispatch => {
    dispatch({type: 'ADD_FEED_TO_LIST', payload: newFeed});
}

export const updateFeedList = updateObj => dispatch => {
    dispatch({type: 'UPDATE_FULL_FEED_LIST', payload: updateObj});
}

export const updateFeedField = inputObj => async dispatch => {
    await dispatch({type: 'UPDATE_FEED_FIELD', payload: inputObj});
}

export const removeFeedFromList = rowID => dispatch => {
    dispatch({type: 'REMOVE_FEED_FROM_LIST', payload: rowID});
}

// feed library actions

export const setFeedLibraryInputs = inputObj => dispatch => {
    dispatch({type: 'SET_FEED_LIBRARY_INPUTS', payload: inputObj})
}

export const setFeedCostInputs = inputObj => dispatch => {
    dispatch({type: 'SET_FEED_COST_INPUTS', payload: inputObj})
}

export const resetFeedLibraryInputs = () => dispatch => {
    dispatch({type: 'RESET_FEED_LIBRARY_INPUTS'})
}

export const setFeedLibraryInputsErrors = message => dispatch => {
    dispatch({type: 'SET_FEED_LIBRARY_INPUT_ERRORS', payload: message})
}

export const setFeedLibraryFieldsEmptyErrors = inputField => async dispatch => {
    await dispatch({type: 'SET_FEED_LIBRARY_INPUT_EMPTY_ERRORS', payload: inputField})
}

export const resetFeedLibraryFieldsEmptyErrors = () => async dispatch => {
    await dispatch({type: 'RESET_FEED_LIBRARY_INPUTS_EMPTY_ERRORS'})
}

export const showAddFeedLibraryForm = () => dispatch => {
    dispatch({type: 'ADD_FEED_LIBRARY'})
}

export const showEditFeedLibraryForm = () => dispatch => {
    dispatch({type: 'EDIT_FEED_LIBRARY'})
}

export const hideFeedLibraryForms = () => dispatch => {
    dispatch({type: 'HIDE_FEED_LIBRARY_FORMS'})
}

export const showFeedLibraryFormSpinner = () => dispatch => {
    dispatch({type: 'SHOW_FEED_LIBRARY_FORM_SPINNER'})
}

export const hideFeedLibraryFormSpinner = () => dispatch => {
    dispatch({type: 'HIDE_FEED_LIBRARY_FORM_SPINNER'})
}

export const showFeedLibraryButtonSpinner = () => dispatch => {
    dispatch({type: 'SHOW_FEED_LIBRARY_BUTTON_SPINNER'})
}

export const hideFeedLibraryButtonSpinner = () => dispatch => {
    dispatch({type: 'HIDE_FEED_LIBRARY_BUTTON_SPINNER'})
}

export const setFeedTablePopupHeight = height => dispatch => {
    dispatch({type: 'FEED_TABLE_POPUP_HEIGHT', payload: height})
}
