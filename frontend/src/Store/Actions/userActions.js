import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showFailedMessage, showSuccessMessage} from "./popupActions";
import {showContentSpinner, hideContentSpinner, showRemoveAccountSpinner} from "./spinnerActions";

export const removeUserAccount = (deleteData, history) => async dispatch => {
    try {
        dispatch(showRemoveAccountSpinner(true));
        const deleteResponse = await axios.post('api/user/delete', deleteData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TokenService.getToken()}`
            }
        });
        // response
        dispatch(showRemoveAccountSpinner(false));
        TokenService.removeToken();
        history.push('/admin/login');
    } catch (error) {
        console.log(error.response.data);
        dispatch(showRemoveAccountSpinner(undefined));
        dispatch(showFailedMessage('action_failed_try_again'))
    }
}

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
        dispatch({type: 'SET_USERS_DATA', payload: userListAllResponse.data})
    } catch (error) {
        console.log(error.response.data)
    }
}

export const userList = (pageNumber, pageName) => async dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/user/list';

    url = url + '?page=' + pageNumber;

    if (Boolean(pageName)) {
        url = url + '&pageName=' + pageName;
    }

    try {
        const userListResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_USERS_DATA', payload: userListResponse.data.data})
        const paginationData = {
            currentPage: userListResponse.data.current_page,
            perPage: userListResponse.data.per_page,
            totalRecord: userListResponse.data.total,
        }

        dispatch({type: 'SET_USERS_PAGINATION_DATA', payload: paginationData})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
    }
}

export const userSearch = searchData => async dispatch => {

    dispatch(showContentSpinner());

    try {
        const searchResponse = await axios.post(
            'api/user/search',
            searchData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: searchResponse.data.current_page,
            perPage: searchResponse.data.per_page,
            totalRecord: searchResponse.data.total,
        }

        dispatch({type: 'SET_USERS_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'SET_USERS_DATA', payload: searchResponse.data.data})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
    }
}


export const userListSort = (sortData, pageNo) => async dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/user/listSort';
    url = url + '?page=' + pageNo;

    try {
        const sortResponse = await axios.post(
            url,
            sortData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: sortResponse.data.current_page,
            perPage: sortResponse.data.per_page,
            totalRecord: sortResponse.data.total,
        }

        // define column ordering with maintain pagination

        // let userData = [];

        // Process company and role data for column sorting
        // sortResponse.data.data.map( (item,key) => {
        //     let user = item;
        //     user.company_name = item.company.name;
        //     user.role = item.roles[0].name;
        //     userData[key] = user;
        // });


        // if (sortData.sort_type === 'asc') {
        //     userData = _.sortBy(userData, sortData.sort_by);
        // }
        //
        // if (sortData.sort_type === 'desc') {
        //     userData = _.sortBy(userData, sortData.sort_by).reverse();
        // }

        dispatch({type: 'SET_USERS_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'SET_USERS_DATA', payload: sortResponse.data.data})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
    }
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


export const blockUnblockUser = (userID, userStatus) => async dispatch => {

    try {
        const blockUnblockResponse = await axios.post('api/user/change_status',
            {
                id: userID,
                status: userStatus
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'UPDATE_USER_STATUS', payload: {id: userID, status: userStatus}})


    } catch (error) {
        console.log(error.response.data);
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

export const updateCookieConsent = updatedData => async dispatch => {

    try {
        const userUpdateResponse = await axios.post(
            'api/user/update_cookie_consent', updatedData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_COOKIE_CONSENT', payload: userUpdateResponse.data.data.accept_cookie})

    } catch (error) {
        console.log(error);
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
