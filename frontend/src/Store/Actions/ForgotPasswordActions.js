import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { showFailedMessage, showSuccessMessage } from "./popupActions";
import { showContentSpinner, hideContentSpinner } from "./spinnerActions";


export const userListAll = () => async dispatch => {

    let url = 'api/user/listAll';
    try {
        const userListAllResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'SET_USERS_DATA', payload: userListAllResponse.data })
    } catch (error) {
        console.log(error.response.data)
    }
}


export const sendForgotPassRequest = userData => async dispatch => {

    return new Promise((resolve, reject) => {
        axios.post('api/user/reset_password/forgot', userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            })
            .then((response) => {

                dispatch({ type: 'SET_MESSAGE', payload: response.data.message });
                dispatch({ type: 'SHOW_TOKEN_INPUT_SCREEN' });
                dispatch({ type: 'SET_FORGOT_EMAIL', payload: userData.email });

                return resolve();
            })
            .catch(error => {
                dispatch({ type: 'SHOW_TOKEN_INPUT_SCREEN' });
                dispatch({ type: 'SET_FORGOT_EMAIL', payload: userData.email });
                return reject(error.response);
            });
    });

}

export const sendResendCodeRequest = userData => async dispatch => {

    return new Promise((resolve, reject) => {
        axios.post('api/user/reset_password/forgot_resend', userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            })
            .then((response) => {

                return resolve(response);
            })
            .catch(error => {
                return reject(error.response);
            });
    });

}


export const sendPasswordChangeRequest = userData => async dispatch => {

    return new Promise((resolve, reject) => {
        axios.post('api/user/reset_password/change', userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            })
            .then((response) => {

                //dispatch({ type: 'SET_MESSAGE', payload: response.data.message });
                dispatch({ type: 'SHOW_EMAIL_INPUT_SCREEN' });
                dispatch({ type: 'SET_FORGOT_EMAIL', payload: '' });

                return resolve();
            })
            .catch(error => {
                return reject(error.response);
            });
    });

}




export const sendTokenVerificationRequest = userData => async dispatch => {

    return new Promise((resolve, reject) => {
        axios.post('api/user/reset_password/verify_code', userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            })
            .then((response) => {

                dispatch({ type: 'SET_MESSAGE', payload: response.data.message });
                dispatch({ type: 'SHOW_PASSWORD_INPUT_SCREEN' });

                return resolve();
            })
            .catch(error => {
                return reject(error.response);
            });
    });

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
        dispatch({ type: 'UPDATE_USER_DATA', payload: userUpdateResponse.data.data })
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
    dispatch(setUserInputs({ new_password: '' }));
    dispatch(setUserInputs({ confirm_new_password: '' }));

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
    await dispatch({ type: 'SET_INPUTS_BY_USER_ID', payload: userId })
}

export const setUserInputs = inputObj => dispatch => {
    dispatch({ type: 'SET_USER_INPUTS', payload: inputObj })
}

export const resetUserInputs = () => dispatch => {
    dispatch({ type: 'RESET_USER_INPUTS' })
}

export const setUserInputsErrors = message => dispatch => {
    dispatch({ type: 'SET_USER_INPUT_ERRORS', payload: message })
}

export const setUserFieldsEmptyErrors = inputField => async dispatch => {
    await dispatch({ type: 'SET_USER_INPUT_EMPTY_ERRORS', payload: inputField })
}

export const resetUserFieldsEmptyErrors = () => async dispatch => {
    await dispatch({ type: 'RESET_USER_INPUTS_EMPTY_ERRORS' })
}

export const showAddUserForm = () => dispatch => {
    dispatch({ type: 'SHOW_ADD_USER' })
}

export const showEditUserForm = () => dispatch => {
    dispatch({ type: 'SHOW_EDIT_USER' })
}

export const showChangePasswordForm = () => dispatch => {
    dispatch({ type: 'SHOW_USER_CHANGE_PASSWORD' })
}

export const hideUserForms = () => dispatch => {
    dispatch({ type: 'HIDE_USER_FORMS' })
}



export const showChangePasswordSpinner = () => dispatch => {
    dispatch({ type: 'SHOW_CHANGE_PASSWORD_SPINNER' })
}

export const hideChangePasswordSpinner = () => dispatch => {
    dispatch({ type: 'HIDE_CHANGE_PASSWORD_SPINNER' })
}

export const showUserSaveSpinner = () => dispatch => {
    dispatch({ type: 'SHOW_USER_SAVE_SPINNER' })
}

export const hideUserSaveSpinner = () => dispatch => {
    dispatch({ type: 'HIDE_USER_SAVE_SPINNER' })
}
