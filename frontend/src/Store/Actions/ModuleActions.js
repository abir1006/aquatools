import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {hideContentSpinner, showContentSpinner} from "./spinnerActions";

export const moduleList = modelID => async dispatch => {
    dispatch(showContentSpinner());
    try {
        const blockListResponse = await axios.post(
            'api/module/list', {
                tool_id: modelID
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_MODULE_DATA', payload: blockListResponse.data});
        dispatch(hideContentSpinner());

    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner());
    }
}

export const saveModule = moduleData => async dispatch => {
    try {
        const blockSaveResponse = await axios.post(
            'api/module/save',
            moduleData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'ADD_MODULE_DATA', payload: blockSaveResponse.data.data});
        dispatch({type: 'RESET_MODULE_INPUTS'});
        dispatch(hideContentSpinner());

    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner());
    }
}

export const updateModuleData = updatedModuleData => async dispatch => {
    await dispatch({type: 'UPDATE_MODULE_DATA', payload: updatedModuleData});
}

export const setModuleInputs = inputs => async dispatch => {
    dispatch({type: 'SET_MODULE_INPUTS', payload: inputs})
}

export const setModuleInputEmptyErrors = inputField => async dispatch => {
    await dispatch({type: 'SET_MODULE_INPUT_EMPTY_ERRORS', payload: inputField})
}

export const resetModuleInputEmptyErrors = () => async dispatch => {
    await dispatch({type: 'RESET_MODULE_INPUT_EMPTY_ERRORS'})
}

export const setModuleInputErrorMessage = message => async dispatch => {
    await dispatch({type: 'SET_MODULE_INPUT_ERROR_MESSAGE', payload: message})
}

export const hideModuleForms = () => async dispatch => {
    dispatch({type: 'HIDE_MODULE_FORMS'})
}

export const showAddModelBlockForm = () => async dispatch => {
    dispatch({type: 'SHOW_ADD_MODULE_FORM'})
}

export const resetModuleInputs = () => async dispatch => {
    await dispatch({type: 'RESET_MODULE_INPUTS'})
}
