import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showContentSpinner, hideContentSpinner} from "./spinnerActions";

export const clickToDownload = (fileUrl) => {
    let a = document.createElement('A');
    a.href = fileUrl;
    a.download = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export const downloadFile = (fileName, pageName, url) => async dispatch => {
    try {
        const downloadResponse = await axios.post(
            'api/download/file', {
                fileName: fileName,
                pageName: pageName,
                url: url
            },
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        const fileUrl = window.URL.createObjectURL(new Blob([downloadResponse.data]));
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();

    } catch (error) {
        console.log(error);
    }
}

export const reportList = (pageNumber, pageName) => async dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/report/list';
    url = url + '?page=' + pageNumber;

    if (Boolean(pageName)) {
        url = url + '&pageName=' + pageName;
    }

    try {
        const reportListResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_REPORT_DATA', payload: reportListResponse.data.data})
        const paginationData = {
            currentPage: reportListResponse.data.current_page,
            perPage: reportListResponse.data.per_page,
            totalRecord: reportListResponse.data.total,
        }

        dispatch({type: 'SET_REPORT_PAGINATION_DATA', payload: paginationData})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
    }
}

export const reportSearch = (searchData, pageNumber) => async dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/report/search';
    url = url + '?page=' + pageNumber;

    try {
        const reportSearchResponse = await axios.post(
            url,
            searchData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_REPORT_DATA', payload: reportSearchResponse.data.data})
        const paginationData = {
            currentPage: reportSearchResponse.data.current_page,
            perPage: reportSearchResponse.data.per_page,
            totalRecord: reportSearchResponse.data.total,
        }

        dispatch({type: 'SET_REPORT_PAGINATION_DATA', payload: paginationData})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
    }
}


