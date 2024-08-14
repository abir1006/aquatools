import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showSuccessMessage} from "./popupActions";

export const setCurrencyData = () => async dispatch => {
    try {
        const currencyResponse = await axios.post(
            'api/invoice_setting/currency_dropdown', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        dispatch({type: 'SET_CURRENCY_DATA', payload: currencyResponse.data})

    } catch (error) {

    }
}

export const setInvoiceDurationData = () => async dispatch => {
    try {
        const durationResponse = await axios.post(
            'api/invoice_setting/subscription_duration_dropdown', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        dispatch({type: 'SET_INVOICE_DURATION_DATA', payload: durationResponse.data})

    } catch (error) {
    }
}


export const saveInvoiceSettingsData = data => async dispatch => {
    try {
        const invoiceSettingsResponse = await axios.post(
            'api/invoice_setting/save', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        dispatch({type: 'ADD_INVOICE_SETTINGS_DATA', payload: invoiceSettingsResponse.data.data});
        dispatch(showSuccessMessage('successfully_saved'))
        dispatch({type: 'HIDE_ADD_EDIT_INVOICE_SETTINGS'});

    } catch (error) {
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        dispatch(setInvoiceSettingsInputsErrors(errorMessage))
        window.scrollTo(0, document.body.scrollHeight);
    }
}


export const updateInvoiceSettingsData = data => async dispatch => {
    const updatedData = data;
    try {
        updatedData.type = updatedData.type === 'Yearly' ? 2 : 1;
        const invoiceSettingsResponse = await axios.put(
            'api/invoice_setting/update', updatedData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        dispatch({type: 'UPDATE_INVOICE_SETTINGS_DATA', payload: invoiceSettingsResponse.data.data});
        dispatch(showSuccessMessage('successfully_updated'));
        dispatch({type: 'HIDE_ADD_EDIT_INVOICE_SETTINGS'});

    } catch (error) {
        updatedData.type = updatedData.type === 1 ? 'Monthly' : 'Yearly';
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        dispatch(setInvoiceSettingsInputsErrors(errorMessage));
        window.scrollTo(0, document.body.scrollHeight);
    }
}

export const setInvoiceSettingsInputsErrors = errorMessage => dispatch => {
    dispatch({type: 'SET_INVOICE_SETTINGS_INPUTS_ERRORS', payload: errorMessage})
}


export const getInvoiceSettingsData = data => async dispatch => {
    try {
        const invoiceSettingsResponse = await axios.post(
            'api/invoice_setting/list?page=settings-invoice', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        const responseObj = invoiceSettingsResponse.data.data;

        const invoiceSettingsData = [];

        Object.keys(responseObj).map(index => {
            const row = responseObj[index];
            const tmpObj = {}
            for (let p in row) {
                if (p === 'tool_price') {
                    const extractToolsPrice = JSON.parse(row[p]);
                    for (let tp in extractToolsPrice) {
                        tmpObj[tp] = extractToolsPrice[tp]
                    }
                } else if (p === 'add_on_price') {
                    const extractAddsOnPrice = JSON.parse(row[p]);
                    for (let ap in extractAddsOnPrice) {
                        tmpObj[ap] = extractAddsOnPrice[ap]
                    }
                } else if (p === 'user_price') {
                    const extractUsersPrice = JSON.parse(row[p]);
                    for (let up in extractUsersPrice) {
                        tmpObj[up] = extractUsersPrice[up]
                    }
                } else {
                    tmpObj[p] = row[p];
                }
            }

            invoiceSettingsData[index] = tmpObj;
        });

        dispatch({type: 'SET_INVOICE_SETTINGS_DATA', payload: invoiceSettingsData})

    } catch (error) {
        console.log(error.response.data);
    }
}

export const getCurrencyData = currencyData => dispatch => {
    dispatch({type: 'GET_CURRENCY_DATA', payload: currencyData})
}

export const getInvoiceSettingsInputs = () => dispatch => {
    dispatch({type: 'GET_INVOICE_SETTINGS_INPUTS'})
}

export const setInvoiceSettingsInputs = invoiceSettingsInputs => dispatch => {
    dispatch({type: 'SET_INVOICE_SETTINGS_INPUTS', payload: invoiceSettingsInputs})
}

export const showEditInvoiceSettingsForm = () => dispatch => {
    dispatch(hideInvoiceSettingsForms());
    dispatch({type: 'SHOW_EDIT_INVOICE_SETTINGS'})
}

export const showAddInvoiceSettingsForm = () => dispatch => {
    dispatch(hideInvoiceSettingsForms());
    dispatch({type: 'SHOW_ADD_INVOICE_SETTINGS'})
}

export const hideInvoiceSettingsForms = () => dispatch => {
    dispatch({type: 'HIDE_ADD_EDIT_INVOICE_SETTINGS'})
}

export const setSelectedInvoiceID = invoiceSettingsId => dispatch => {
    dispatch({type: 'SET_SELECTED_INVOICE_SETTINGS_ID', payload: invoiceSettingsId})
}
