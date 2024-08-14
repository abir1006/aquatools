import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showSuccessMessage} from "./popupActions";

export const saveFeedSettings = data => async dispatch => {
    dispatch(showFeedSettingsSpinner());
    try {
        const saveFeedSettingsResponse = await axios.post(
            'api/feed_settings/save', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch(setFeedSettingsName(''));
        dispatch(feedSettingsList());
        dispatch(hideFeedSettingsSpinner());
        dispatch(showSuccessMessage('successfully_saved'));
    } catch (error) {
        dispatch(hideFeedSettingsSpinner());
        console.log(error.response.data);
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        dispatch(setFeedSettingsFieldError(errorMessage));
    }
}

export const feedSettingsList = () => async dispatch => {
    try {
        const feedSettingsResponse = await axios.post(
            'api/feed_settings/list', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_FEED_SETTINGS_DATA', payload: feedSettingsResponse.data})
    } catch (error) {
        console.log(error.response.data);
    }
}

export const updateFeedFormFieldsSettings = updatedData => async dispatch => {
    dispatch(showFeedSettingsSpinner());
    try {
        const feedSettingsResponse = await axios.put(
            'api/feed_settings/update', updatedData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch(feedSettingsList())
        dispatch(hideFeedSettingsSpinner());
        dispatch(hideFeedFieldsSettingsForm());
        dispatch(showSuccessMessage('successfully_updated'));
    } catch (error) {
        console.log(error.response.data);
        dispatch(hideFeedSettingsSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        dispatch(setFeedSettingsFieldError(errorMessage));
    }
}


export const setFeedFormSettingsInputs = inputObj => dispatch => {
    dispatch({type: 'SET_FEED_SETTINGS_INPUTS', payload: inputObj})
}

export const addFeedFormFieldSettingsList = fieldObj => dispatch => {
    dispatch({type: 'ADD_FEED_FORM_FIELD_SETTINGS', payload: fieldObj})
}

export const setFeedFormFieldsData = fieldObj => dispatch => {
    dispatch({type: 'SET_FEED_FORM_FIELD_SETTINGS', payload: fieldObj})
}

export const updateFeedFormFieldSettingsList = fieldObj => dispatch => {
    dispatch({type: 'UPDATE_FEED_FORM_FIELD_SETTINGS', payload: fieldObj})
}

export const removeFeedFormFieldSettings = fieldSettingsName => dispatch => {
    dispatch({type: 'REMOVE_FEED_FORM_FIELD_SETTINGS', payload: fieldSettingsName})
}

export const showFeedFieldsSettingsForm = () => dispatch => {
    dispatch({type: 'SHOW_FEED_LIBRARY_FIELD_SETTINGS_FORM'})
}

export const hideFeedFieldsSettingsForm = () => dispatch => {
    dispatch({type: 'HIDE_FEED_LIBRARY_FIELD_SETTINGS_FORM'})
}

export const resetFeedFieldSettings = () => dispatch => {
    dispatch({type: 'RESET_FEED_FIELD_SETTINGS'})
}

export const showFeedSettingsSpinner = () => dispatch => {
    dispatch({type: 'SHOW_FEED_SETTINGS_SPINNER'})
}

export const hideFeedSettingsSpinner = () => dispatch => {
    dispatch({type: 'HIDE_FEED_SETTINGS_SPINNER'})
}

export const showAddFeedSettingsForm = () => dispatch => {
    dispatch({type: 'SHOW_ADD_FEED_SETTINGS_FORM'})
}

export const showEditFeedSettingsForm = () => dispatch => {
    dispatch({type: 'SHOW_EDIT_FEED_SETTINGS_FORM'})
}

export const setFeedSettingsFieldError = message => dispatch => {
    dispatch({type: 'SET_FEED_SETTINGS_FORM_ERRORS', payload: message})
}

export const setFeedSettingsName = name => dispatch => {
    dispatch({type: 'SET_FEED_SETTINGS_NAME', payload: name})
}

export const clearFeedSettingsFieldError = () => dispatch => {
    dispatch({type: 'CLEAR_FEED_SETTINGS_FORM_ERRORS'})
}

export const showFeedSettingsCancelIcon = () => dispatch => {
    dispatch({type: 'SHOW_FEED_SETTINGS_CANCEL_ICON'})
}


export const hideFeedSettingsCancelIcon = () => dispatch => {
    dispatch({type: 'HIDE_FEED_SETTINGS_CANCEL_ICON'})
}
