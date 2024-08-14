import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showFailedMessage, showSuccessMessage} from "./popupActions";
import {showContentSpinner, hideContentSpinner} from "./spinnerActions";
import {setCompanyInputs} from "./companyActions";


export const getUserProfileInfo = () => async dispatch => {
    dispatch(showUserSaveSpinner());
    try {
        const getUserProfileInfoResponse = await axios.get(
            'api/user/profile',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });


        console.log(getUserProfileInfoResponse);

        // response
        dispatch({type: 'SET_USER_PROFILE_DATA', payload: getUserProfileInfoResponse.data.data})
        dispatch(setUserProfileInputs({first_name: getUserProfileInfoResponse.data.data.first_name}));

        dispatch(setUserProfilePicInputs(getUserProfileInfoResponse.data.data.profile_pic));

        dispatch(hideUserSaveSpinner());


    } catch (error) {
        dispatch(hideUserSaveSpinner());
        const errorsObj = error.response.data.errors;
        let errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        dispatch(setUserInputsErrors(errorMessage));
    }
}


export const setUserProfileInfo = profileData => async dispatch => {
    await dispatch({type: 'SET_USER_PROFILE_DATA', payload: profileData})
    await dispatch({type: 'SET_USER_PROFILE_PIC_INPUTS', payload: profileData.profile_pic_url})
}

export const setUserProfileInputs = inputs => async dispatch => {
    await dispatch({type: 'SET_USER_PROFILE_INPUTS', payload: inputs})
}


export const setUserProfilePicInputs = inputs => async dispatch => {

    await dispatch({type: 'SET_USER_PROFILE_PIC_INPUTS', payload: inputs})
}


export const setUserProfileFieldsEmptyErrors = inputField => async dispatch => {
    await dispatch({type: 'SET_INPUT_EMPTY_ERRORS', payload: inputField})
}

export const resetUserProfileFieldsEmptyErrors = () => async dispatch => {
    await dispatch({type: 'RESET_INPUT_PROFILE_EMPTY_ERRORS'})
}

export const setUserPasswordFieldsEmptyErrors = inputField => async dispatch => {
    await dispatch({type: 'SET_INPUT_PASSWORD_EMPTY_ERRORS', payload: inputField})
}

export const resetUserPasswordFieldsEmptyErrors = () => async dispatch => {
    await dispatch({type: 'RESET_INPUT_PROFILE_PASS_EMPTY_ERRORS'})
}


export const saveUser = userData => async dispatch => {
    dispatch(showUserSaveSpinner());
    try {
        const userSaveResponse = await axios.post(
            'api/user/save', userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'ADD_USER_DATA', payload: userSaveResponse.data.data})
        dispatch({type: 'ADD_USERS_PAGINATION_TOTAL_RECORD'})
        dispatch(hideUserSaveSpinner());
        dispatch(showSuccessMessage('successfully_saved'))
        dispatch(hideUserForms());

    } catch (error) {
        dispatch(hideUserSaveSpinner());
        const errorsObj = error.response.data.errors;
        let errorMessage = errorsObj[Object.keys(errorsObj)[0]];

        if (Object.keys(errorsObj)[0] === 'email') {
            dispatch(setUserFieldsEmptyErrors('isEmailFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setUserFieldsEmptyErrors('isPasswordFieldEmpty'));
            dispatch(setUserFieldsEmptyErrors('isPasswordConfirmFieldEmpty'));
        }

        dispatch(setUserInputsErrors(errorMessage));
    }
}

export const updateUser = updatedData => async dispatch => {
    dispatch(showUserSaveSpinner());
    try {
        const userUpdateResponse = await axios.post(
            'api/user/update', updatedData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'UPDATE_USER_DATA', payload: userUpdateResponse.data.data})
        dispatch(hideUserSaveSpinner());
        dispatch(showSuccessMessage('successfully_updated'));
        dispatch(hideUserForms());

    } catch (error) {
        dispatch(hideUserSaveSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];

        if (Object.keys(errorsObj)[0] === 'email') {
            dispatch(setUserFieldsEmptyErrors('isEmailFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setUserFieldsEmptyErrors('isPasswordFieldEmpty'));
            dispatch(setUserFieldsEmptyErrors('isPasswordConfirmFieldEmpty'));
        }

        dispatch(setUserInputsErrors(errorMessage));
    }
}


export const changePassword = changePasswordData => async dispatch => {

    dispatch(showChangePasswordSpinner());
    dispatch(setUserInputs({new_password: ''}));
    dispatch(setUserInputs({confirm_new_password: ''}));

    try {
        const changePasswordResponse = await axios.post('api/user/change_password',
            changePasswordData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch(hideContentSpinner());
        dispatch(hideChangePasswordSpinner());
        dispatch(showSuccessMessage('successfully_updated'));
        dispatch(resetUserInputs());
        dispatch(hideUserForms());


    } catch (error) {
        dispatch(hideChangePasswordSpinner());
        const errorsObj = error.response.data.errors;
        let errorMessage = '';
        const errorMessageObj = errorsObj[Object.keys(errorsObj)[0]];
        errorMessageObj.map(errorMsg => {
            errorMessage += errorMsg + ' ';
        });

        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setUserFieldsEmptyErrors('isPasswordFieldEmpty'));
            dispatch(setUserFieldsEmptyErrors('isPasswordConfirmFieldEmpty'));
        }

        dispatch(setUserInputsErrors(errorMessage));
    }

}

export const setUserByID = userId => async dispatch => {
    await dispatch({type: 'SET_INPUTS_BY_USER_ID', payload: userId})
}

export const setUserInputs = inputObj => dispatch => {
    dispatch({type: 'SET_USER_INPUTS', payload: inputObj})
}

export const resetUserInputs = () => dispatch => {
    dispatch({type: 'RESET_USER_INPUTS'})
}

export const setUserInputsErrors = message => dispatch => {
    dispatch({type: 'SET_USER_INPUT_ERRORS', payload: message})
}

export const setUserFieldsEmptyErrors = inputField => async dispatch => {
    await dispatch({type: 'SET_USER_INPUT_EMPTY_ERRORS', payload: inputField})
}

export const resetUserFieldsEmptyErrors = () => async dispatch => {
    await dispatch({type: 'RESET_USER_INPUTS_EMPTY_ERRORS'})
}

export const showAddUserForm = () => dispatch => {
    dispatch({type: 'SHOW_ADD_USER'})
}

export const showEditUserForm = () => dispatch => {
    dispatch({type: 'SHOW_EDIT_USER'})
}

export const showChangePasswordForm = () => dispatch => {
    dispatch({type: 'SHOW_USER_CHANGE_PASSWORD'})
}

export const hideUserForms = () => dispatch => {
    dispatch({type: 'HIDE_USER_FORMS'})
}

export const showUserDeleteConfirmPopup = userId => dispatch => {
    dispatch({type: 'SHOW_USER_DELETE_CONFIRM_POPUP', payload: userId})
}

export const showChangePasswordSpinner = () => dispatch => {
    dispatch({type: 'SHOW_CHANGE_PASSWORD_SPINNER'})
}

export const hideChangePasswordSpinner = () => dispatch => {
    dispatch({type: 'HIDE_CHANGE_PASSWORD_SPINNER'})
}

export const showUserSaveSpinner = () => dispatch => {
    dispatch({type: 'SHOW_USER_SAVE_SPINNER'})
}

export const hideUserSaveSpinner = () => dispatch => {
    dispatch({type: 'HIDE_USER_SAVE_SPINNER'})
}


export const showProfileSaveSpinner = () => dispatch => {
    dispatch({type: 'SHOW_PROFILE_SAVE_SPINNER'})
}


export const hideProfileSaveSpinner = () => dispatch => {
    dispatch({type: 'HIDE_PROFILE_SAVE_SPINNER'})
}
