import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { hideContentSpinner, showContentSpinner } from "./spinnerActions";
import { showSuccessMessage } from "./popupActions";

export const getModelDetails = (slug) => dispatch => {

    return axios.get(
        'api/tool/single/' + slug,
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TokenService.getToken()}`
            }
        });

}

export const getModelList = (pageName = undefined) => async dispatch => {

    dispatch(showContentSpinner());

    try {
        let apiUrl = 'api/tool/list';
        if (Boolean(pageName)) {
            apiUrl = 'api/tool/list?page=' + pageName;
        }
        const modelListResponse = await axios.post(
            apiUrl, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'SET_MODEL_DATA', payload: modelListResponse.data })
        dispatch(hideContentSpinner());

    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner());
    }
}

export const saveModel = data => async dispatch => {
    dispatch(showContentSpinner());
    try {
        const modelSaveResponse = await axios.post(
            'api/tool/save', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({ type: 'ADD_MODEL_DATA', payload: modelSaveResponse.data.data })
        dispatch(hideContentSpinner());
        dispatch(showSuccessMessage('successfully_saved'))
        dispatch({ type: 'HIDE_MODEL_FORMS' });

    } catch (error) {
        dispatch(hideContentSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];

        if (Object.keys(errorsObj)[0] === 'name') {
            dispatch(setModelInputEmptyErrors('isNameFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'slug') {
            dispatch(setModelInputEmptyErrors('isSlugFieldEmpty'));
        }

        dispatch(setModelInputErrorMessage(errorMessage));
    }
}

export const updateModel = updatedData => async dispatch => {
    dispatch(showContentSpinner());
    try {
        const modelUpdateResponse = await axios.put(
            'api/tool/update', updatedData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({ type: 'UPDATE_MODEL_DATA', payload: modelUpdateResponse.data.data })
        dispatch(hideContentSpinner());
        dispatch(showSuccessMessage('successfully_updated'))
        dispatch({ type: 'HIDE_MODEL_FORMS' });

    } catch (error) {
        dispatch(hideContentSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];

        if (Object.keys(errorsObj)[0] === 'name') {
            dispatch(setModelInputEmptyErrors('isNameFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'slug') {
            dispatch(setModelInputEmptyErrors('isSlugFieldEmpty'));
        }

        dispatch(setModelInputErrorMessage(errorMessage));
    }
}

export const setModelByID = (modelID, allModels) => async dispatch => {
    const selectedModel = allModels.filter(model => model.id === modelID);
    dispatch(setModelInputs({ id: modelID }))
    dispatch(setModelInputs({ name: selectedModel[0].name }))
    dispatch(setModelInputs({ slug: selectedModel[0].slug }))
    dispatch(setModelInputs({ details: selectedModel[0].details }))
}

export const setModelInputs = inputs => async dispatch => {
    dispatch({ type: 'SET_MODEL_INPUTS', payload: inputs })
}

export const setModelInputEmptyErrors = inputField => async dispatch => {
    await dispatch({ type: 'SET_MODEL_INPUT_EMPTY_ERRORS', payload: inputField })
}

export const resetModelInputEmptyErrors = () => async dispatch => {
    await dispatch({ type: 'RESET_MODEL_INPUT_EMPTY_ERRORS' })
}

export const setModelInputErrorMessage = message => async dispatch => {
    await dispatch({ type: 'SET_MODEL_INPUT_ERROR_MESSAGE', payload: message })
}

export const hideModelForms = () => async dispatch => {
    dispatch({ type: 'HIDE_MODEL_FORMS' })
}

export const showAddModelForm = () => async dispatch => {
    dispatch({ type: 'SHOW_ADD_MODEL_FORM' })
}

export const showEditModelForm = () => async dispatch => {
    dispatch({ type: 'SHOW_EDIT_MODEL_FORM' })
}

export const showModelSettingsForm = () => async dispatch => {
    dispatch({ type: 'SHOW_MODEL_SETTINGS_FORM' })
}
