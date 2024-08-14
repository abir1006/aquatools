import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {hideContentSpinner, showContentSpinner} from "./spinnerActions";

export const latestActivity = () => async dispatch => {
    try {
        const latestActivityResponse = await axios.post(
            'api/user/activity/latest', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'SET_USER_LATEST_ACTIVITY_DATA', payload: latestActivityResponse.data})
    } catch (error) {
        console.log(error.response.data);
    }
}

export const allActivityLogs = (pageNumber, filter_data = {}) => async dispatch => {
    dispatch(showContentSpinner());
    let url = 'api/user/activity/logs';

    if (Boolean(pageNumber)) {
        url = url + '?page=' + pageNumber;
    }
    try {
        const allActivityResponse = await axios.post(
            url, filter_data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }

            });


        // response
        dispatch({type: 'SET_USER_ALL_ACTIVITY_DATA', payload: allActivityResponse.data.data})

        const paginationData = {
            currentPage: allActivityResponse.data.current_page,
            perPage: allActivityResponse.data.per_page,
            totalRecord: allActivityResponse.data.total,
        }

        dispatch({type: 'SET_USER_ALL_ACTIVITY_PAGINATION_DATA', payload: paginationData})
        dispatch(hideContentSpinner());

    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner());
    }
}

export const deleteActivity = activityID => async dispatch => {
    try {
        const deleteResponse = await axios.delete(
            'api/user/activity/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: {
                    id: activityID
                }
            });
        // response
        dispatch(latestActivity())
    } catch (error) {
        console.log(error.response.data);
    }
}


export const deleteUserLogs = deleteOptions => async dispatch => {
    try {
        const deleteResponse = await axios.delete(
            'api/user/activity/delete_logs', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: deleteOptions
            });
        // response
        dispatch(allActivityLogs(1, {}))
    } catch (error) {
        console.log(error.response.data);
    }
}


export const exportUserLogs = data => async dispatch => {
    try {
        const exportResponse = await axios.get(
            'api/user/activity/export', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }

            });
    } catch (error) {
        console.log(error.response.data);
    }
}
