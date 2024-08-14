import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {hideContentSpinner, showContentSpinner} from "./spinnerActions";
import {setModelInputEmptyErrors, setModelInputErrorMessage} from "./ModelActions";
import {setConfirmBlockBulkDelete} from "./popupActions";

export const modelBlockList = modelID => async dispatch => {
    try {
        const blockListResponse = await axios.post(
            'api/block/list', {
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
        dispatch({type: 'SET_MODEL_BLOCK_DATA', payload: blockListResponse.data});
        dispatch(hideContentSpinner());
    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner());
    }
}

export const updateBlockInputsOrder = data => async dispatch => {
    try {
        const blockListResponse = await axios.put(
            'api/block_input/order/drag_n_drop', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

    } catch (error) {
        console.log(error.response.data);
    }
}

export const saveModelBlock = blockData => async dispatch => {
    dispatch({type: 'SHOW_BLOCK_SAVE_SPINNER'});
    try {
        const blockSaveResponse = await axios.post(
            'api/block/save',
            blockData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'ADD_MODEL_BLOCK_DATA', payload: blockSaveResponse.data.data});
        dispatch({type: 'RESET_MODEL_BLOCK_INPUTS'});
        dispatch({type: 'HIDE_BLOCK_SAVE_SPINNER'});
        dispatch(hideContentSpinner());

    } catch (error) {
        //console.log(error.response.data);
        dispatch({type: 'HIDE_BLOCK_SAVE_SPINNER'});
        dispatch(hideContentSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];

        if (Object.keys(errorsObj)[0] === 'name') {
            dispatch(setModelBlockInputEmptyErrors('isNameFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'slug') {
            dispatch(setModelBlockInputEmptyErrors('isSlugFieldEmpty'));
        }

        dispatch(setModelBlockInputErrorMessage(errorMessage));
    }
}

export const updateModelBlockData = updatedBlockData => async dispatch => {
    await dispatch({type: 'UPDATE_MODEL_BLOCK_DATA', payload: updatedBlockData});
}

export const setModelBlockInputs = inputs => async dispatch => {
    dispatch({type: 'SET_MODEL_BLOCK_INPUTS', payload: inputs})
}

export const setModelBlockInputEmptyErrors = inputField => async dispatch => {
    await dispatch({type: 'SET_MODEL_BLOCK_INPUT_EMPTY_ERRORS', payload: inputField})
}

export const resetModelBlockInputEmptyErrors = () => async dispatch => {
    await dispatch({type: 'RESET_MODEL_BLOCK_INPUT_EMPTY_ERRORS'})
}

export const setModelBlockInputErrorMessage = message => async dispatch => {
    await dispatch({type: 'SET_MODEL_BLOCK_INPUT_ERROR_MESSAGE', payload: message})
}

export const hideModelBlockForms = () => async dispatch => {
    dispatch({type: 'HIDE_MODEL_BLOCK_FORMS'})
}

export const showAddModelBlockForm = () => async dispatch => {
    dispatch({type: 'SHOW_ADD_MODEL_BLOCK_FORM'})
}

export const showModelBlockSettingsForm = () => async dispatch => {
    dispatch({type: 'SHOW_MODEL_BLOCK_SETTINGS_FORM'})
}

export const resetModelBlockInputs = () => async dispatch => {
    await dispatch({type: 'RESET_MODEL_BLOCK_INPUTS'})
}

export const bulkDeleteBlockData = blockIDs => async dispatch => {
    dispatch(setConfirmBlockBulkDelete(undefined));
    dispatch(setBlockDeleteSpinner(true));
    try {
        await axios.delete(
            'api/block/delete',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }, data: {
                    id: blockIDs
                }
            });

        // response
        dispatch(deleteModelScreeBlockData(blockIDs));
        dispatch(setBlockDeleteSpinner(undefined));
        dispatch(setBlockDeleteSuccess(true));

        setTimeout( ()=> {
            dispatch(setBlockDeleteSuccess(undefined));
        }, 1500)


    } catch (error) {
        console.log(error.response.data);
        dispatch(setBlockDeleteSpinner(undefined));
    }

}

export const deleteModelScreeBlockData = blockIDs => dispatch => {
    dispatch({type: 'DELETE_MODEL_BLOCK_DATA', payload: blockIDs})
}

export const setBlockDeleteSpinner = status => dispatch => {
    dispatch({type: 'SET_BLOCK_DELETE_SPINNER', payload: status})
}

export const setBlockDeleteSuccess = status => dispatch => {
    dispatch({type: 'SET_BLOCK_DELETE_SUCCESS', payload: status})
}
