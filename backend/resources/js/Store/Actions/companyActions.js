import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { showFailedMessage, showSuccessMessage } from "./popupActions";
import { showContentSpinner, hideContentSpinner, showFormSpinner, hideFormSpinner } from "./spinnerActions";
import moment from "moment";
import DateTimeService from "../../Services/DateTimeServices";


export const searchCompany = searchData => async dispatch => {
    dispatch(showContentSpinner());
    try {
        const searchResponse = await axios.post(
            'api/company/search', searchData,
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
        dispatch({ type: 'SET_COMPANY_PAGINATION_DATA', payload: paginationData })
        dispatch({ type: 'SET_COMPANY_SEARCH_DATA', payload: searchResponse.data.data })
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
        console.log(error.response.data);
    }
}

export const updateCompany = updatedCompanyData => async dispatch => {
    dispatch(showCompanySaveSpinner());
    try {
        const companyUpdateResponse = await axios.put(
            'api/company/update', updatedCompanyData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'UPDATE_COMPANY_DATA', payload: companyUpdateResponse.data.data })
        dispatch(hideCompanySaveSpinner());
        dispatch(showSuccessMessage('successfully_updated'))
        dispatch({ type: 'HIDE_ADD_EDIT_COMPANY' });

    } catch (error) {
        dispatch(hideCompanySaveSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        if (Object.keys(errorsObj)[0] === 'name') {
            dispatch(setCompanyFieldsEmptyErrors('isNameFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'email') {
            dispatch(setCompanyFieldsEmptyErrors('isEmailFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'contact_number') {
            dispatch(setCompanyFieldsEmptyErrors('isPhoneFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'zip_code') {
            dispatch(setCompanyFieldsEmptyErrors('isZipFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setCompanyFieldsEmptyErrors('isPasswordFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setCompanyFieldsEmptyErrors('isPasswordConfirmFieldEmpty'));
        }
        dispatch(setCompanyInputsErrors(errorMessage));
    }
}


export const setCompanyByID = (companyID, allModels, allAddons) => async dispatch => {

    dispatch(resetCompanyInputs());
    dispatch(showFormSpinner());

    try {
        const fetchCompanyResponse = await axios.post(
            'api/company/edit', {
            id: companyID
        },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        // set currency and duration in inputs.
        const duration = fetchCompanyResponse.data.data.agreement_end === 1 ? 'Yearly' : fetchCompanyResponse.data.data.type;
        const currency = fetchCompanyResponse.data.data.agreement_end === 1 ? 'NOK' : fetchCompanyResponse.data.data.currency;
        await dispatch(setCompanyInputs({ type: duration }));
        await dispatch(setCompanyInputs({ currency: currency }));
        //await dispatch(allDuration(fetchCompanyResponse.data.data.currency));

        // first load default price settings, later override with invoice price
        const changedPlan = {
            currency: currency,
            type: duration === 'Yearly' ? 2 : 1
        }


        await dispatch(searchInvoiceSettings(changedPlan));
        await dispatch(hideFormSpinner());


        // extract company all permitted features and invoices if agreement not ended yet

        const companyTools = fetchCompanyResponse.data.data.tools;
        const invoices = fetchCompanyResponse.data.data.invoices;
        const lastInvoice = fetchCompanyResponse.data.data.last_invoice[0];
        const isTrialUsed = fetchCompanyResponse.data.data.is_trial_used;

        if (fetchCompanyResponse.data.data.agreement_end === 0) {

            // iterate and find already permitted models and prices.

            companyTools.map(async row => {
                const model = allModels.filter(model => model.id === row.tool_id);
                invoices.map(async invoice => {
                    let companyAgreementEnded = false;

                    if (Boolean(invoice.agreement_end_date)) {
                        const today = moment().valueOf();
                        const agreementEndDate = moment(invoice.agreement_end_date + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss').valueOf();
                        companyAgreementEnded = today > agreementEndDate;
                    }

                    invoice.invoice_details.map(async inv_details => {
                        if (!Boolean(companyAgreementEnded) && inv_details.item_slug === model[0].slug) {
                            const inputPrice = model[0].slug + '_price';
                            const toolsInputPermission = model[0].slug + '_permission';
                            const inputDiscount = model[0].slug + '_discount';
                            const modelIsSent = model[0].slug + '_is_sent';
                            const modelIsTrial = model[0].slug + '_trial';
                            const trialStart = model[0].slug + '_trial_start';
                            const trialEnd = model[0].slug + '_trial_end';

                            let modelPermission = true;

                            if (Boolean(inv_details.trial_end)) {
                                const today = moment().valueOf();
                                const endDate = moment(inv_details.trial_end + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss').valueOf();
                                modelPermission = !(today > endDate);
                            }

                            dispatch(setCompanyInputs({ [toolsInputPermission]: modelPermission }))

                            // creating an state to detect if the feature is sent in invoice or not
                            if (invoice.is_sent === 1) {
                                await dispatch(setCompanyInputs({ [modelIsSent]: true }))
                            } else {
                                await dispatch(setCompanyInputs({ [modelIsSent]: false }))
                            }

                            const priceObj = inv_details.unit_price.toString().split('.');
                            let toolPrice = parseInt(priceObj[1]) > 0 ? inv_details.unit_price : parseInt(priceObj[0]);
                            if (Boolean(modelPermission)) {
                                await dispatch(setCompanyInputs({ [inputPrice]: toolPrice }))
                            }
                            await dispatch(setCompanyInputs({ [inputDiscount]: inv_details.discount_price }))

                            if (Boolean(modelIsTrial)) {
                                await dispatch(setCompanyInputs({ [modelIsTrial]: inv_details.trial }))
                            }
                            if (Boolean(trialStart)) {
                                await dispatch(setCompanyInputs({ [trialStart]: inv_details.trial_start }))
                            }
                            if (Boolean(trialEnd)) {
                                await dispatch(setCompanyInputs({ [trialEnd]: inv_details.trial_end }))
                            }
                        }
                    })
                })
            });

            // iterate and find already permitted addons and prices.

            // companyAddons.map(row => {
            //
            //     const addon = allAddons.filter(addon => addon.id === row.addon_id);
            //
            //     invoices.map(async invoice => {
            //         invoice.invoice_details.map(async inv_details => {
            //             if (inv_details.item_slug === addon[0].slug) {
            //                 const inputPrice = addon[0].slug + '_price';
            //                 const addonsInputPermission = addon[0].slug + '_permission';
            //                 const inputDiscount = addon[0].slug + '_discount';
            //                 const addonIsSent = addon[0].slug + '_is_sent';
            //
            //                 dispatch(setCompanyInputs({[addonsInputPermission]: true}))
            //
            //                 // creating an state to detect if this feature is sent in invoice or not
            //                 if (invoice.is_sent === 1) {
            //                     await dispatch(setCompanyInputs({[addonIsSent]: true}))
            //                 } else {
            //                     await dispatch(setCompanyInputs({[addonIsSent]: false}))
            //                 }
            //
            //                 const priceObj = inv_details.unit_price.toString().split('.');
            //                 const addonsPrice = parseInt(priceObj[1]) > 0 ? inv_details.unit_price : parseInt(priceObj[0])
            //                 await dispatch(setCompanyInputs({[inputPrice]: addonsPrice}))
            //                 await dispatch(setCompanyInputs({[inputDiscount]: inv_details.discount_price}))
            //             }
            //         })
            //     })
            // });

            // extract last invoice and set user price from invoices

            if (Boolean(lastInvoice) && lastInvoice.is_sent === 0) {
                await dispatch(setCompanyInputs({ 'invoice_id': lastInvoice.id }));
                await dispatch(setCompanyInputs({ 'number_of_user': lastInvoice.number_of_user }))
            }

            if (Boolean(lastInvoice) && lastInvoice.is_sent === 1) {
                await dispatch(setCompanyInputs({ 'number_of_user': '' }));
            }

            if (Boolean(lastInvoice.invoice_details) && lastInvoice.invoice_details.length === 0) {
                await dispatch(setCompanyInputs({ 'number_of_user': '' }));
            }

            if (Boolean(lastInvoice.invoice_details) && lastInvoice.invoice_details.length > 0) {
                lastInvoice.invoice_details.map(async inv_details => {
                    if (inv_details.item_name.search('Users') >= 0) {
                        const priceObj = inv_details.unit_price.toString().split('.');
                        let userPrice = parseInt(priceObj[1]) > 0 ? inv_details.unit_price : parseInt(priceObj[0]);
                        if (lastInvoice.is_sent === 1) {
                            await dispatch(setCompanyInputs({ 'users_price': 0 }))
                        } else {
                            await dispatch(setCompanyInputs({ 'users_price': userPrice }))
                        }

                    }
                })
            }
        }

        // extract agreement period, start date, end date from last invoice object.

        const trialPeriod = Boolean(lastInvoice) ? lastInvoice.trial_period : 0;

        // If last invoice has no items then no of users should be zero

        if (fetchCompanyResponse.data.data.agreement_end === 0) {
            const tmpObj = lastInvoice.agreement_period.toString().split('.');
            const agreementPeriod = parseInt(tmpObj[1]) > 0 ? lastInvoice.agreement_period : parseInt(tmpObj[0]);
            const agreementStartData = moment(lastInvoice.agreement_start_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            const agreementEndData = moment(lastInvoice.agreement_end_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
            await dispatch(setCompanyInputs({ 'agreement_period': agreementPeriod }));
            await dispatch(setCompanyInputs({ 'agreement_start_date': agreementStartData }));
            await dispatch(setCompanyInputs({ 'agreement_end_date': agreementEndData }));
            await dispatch(setCompanyInputs({ 'trial_period': trialPeriod === 1 }));

        } else {
            const dateMoment = moment();
            const agreementStartData = dateMoment.format('DD/MM/YYYY');
            const agreementEndData = dateMoment.add(1, 'year').format('DD/MM/YYYY');
            await dispatch(setCompanyInputs({ 'agreement_start_date': agreementStartData }));
            await dispatch(setCompanyInputs({ 'agreement_end_date': agreementEndData }));
            await dispatch(searchInvoiceSettings({
                currency: fetchCompanyResponse.data.data.currency,
                type: fetchCompanyResponse.data.data.type === 'Yearly' ? 2 : 1,
            }));
        }


        // delete these properties so that these are not set in input reducer
        delete fetchCompanyResponse.data.data['tools'];
        delete fetchCompanyResponse.data.data['addons'];
        delete fetchCompanyResponse.data.data['invoices'];
        delete fetchCompanyResponse.data.data['lastInvoices'];


        let selectedCompany = fetchCompanyResponse.data.data;

        // store company email to detect if email is changing.
        selectedCompany.previous_email = selectedCompany.email;

        if (selectedCompany.user_create === 1) {
            selectedCompany.show_password_field_checkbox = false;
        }

        await dispatch({ type: 'SET_INPUTS_BY_COMPANY', payload: selectedCompany })

        // set flag isTrialUsed for already created company

        if (isTrialUsed === 0 && trialPeriod === 0) {
            await dispatch(setCompanyInputs({ is_trial_used: 1 }));
        }

    } catch (error) {
        console.log(error.response.data);
        dispatch(hideFormSpinner());
    }
}

export const allCompanies = () => async dispatch => {

    let url = 'api/company/list';
    return axios.post(
        url, {},
        {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TokenService.getToken()}`
            }
        });

}

export const companyList = pageNumber => async dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/company/list';

    if (pageNumber !== undefined || pageNumber !== 0) {
        url = url + '?page=' + pageNumber;
    }

    try {
        const companyListResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'SET_COMPANY_DATA', payload: companyListResponse.data.data })

        const paginationData = {
            currentPage: companyListResponse.data.current_page,
            perPage: companyListResponse.data.per_page,
            totalRecord: companyListResponse.data.total,
        }

        dispatch({ type: 'SET_COMPANY_PAGINATION_DATA', payload: paginationData })
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
        //dispatch(setCompanyInputsErrors('Problem with fetching company list data, please try again.'));
    }
}


export const companyListAll = () => async dispatch => {
    try {
        const companyListAllResponse = await axios.post(
            'api/company/list_all', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'SET_COMPANY_DATA', payload: companyListAllResponse.data })
    } catch (error) {
        console.log(error.response.data);
    }
}

export const saveCompany = companyData => async dispatch => {
    dispatch(showCompanySaveSpinner());
    try {
        const companySaveResponse = await axios.post(
            'api/company/save', companyData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'ADD_COMPANY_DATA', payload: companySaveResponse.data.data })
        dispatch({ type: 'ADD_COMPANY_PAGINATION_TOTAL_RECORD' })
        dispatch(hideCompanySaveSpinner());
        dispatch(showSuccessMessage('successfully_saved'))
        dispatch({ type: 'HIDE_ADD_EDIT_COMPANY' });

    } catch (error) {
        dispatch(hideCompanySaveSpinner());
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        if (Object.keys(errorsObj)[0] === 'name') {
            dispatch(setCompanyFieldsEmptyErrors('isNameFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'email') {
            dispatch(setCompanyFieldsEmptyErrors('isEmailFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'contact_number') {
            dispatch(setCompanyFieldsEmptyErrors('isPhoneFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'zip_code') {
            dispatch(setCompanyFieldsEmptyErrors('isZipFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setCompanyFieldsEmptyErrors('isPasswordFieldEmpty'));
        }
        if (Object.keys(errorsObj)[0] === 'password') {
            dispatch(setCompanyFieldsEmptyErrors('isPasswordConfirmFieldEmpty'));
        }
        dispatch(setCompanyInputsErrors(errorMessage));
    }
}

export const blockUnblockCompany = (companyID, companyStatus) => async dispatch => {

    try {
        const blockUnblockResponse = await axios.post('api/company/change_status',
            {
                id: companyID,
                status: companyStatus,

            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'UPDATE_COMPANY_STATUS', payload: { id: companyID, status: companyStatus } })


    } catch (error) {
        console.log(error.response.data);
    }
}

export const getAllTools = () => async dispatch => {

    try {
        const allToolsResponse = await axios.post(
            'api/tool/list', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        dispatch({ type: 'SET_TOOLS_DATA', payload: allToolsResponse.data })

    } catch (error) {
    }
}

export const getAllAddons = () => async dispatch => {

    try {
        const allAddonsResponse = await axios.post(
            'api/addon/list', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({ type: 'SET_ADDONS_DATA', payload: allAddonsResponse.data })

    } catch (error) {
    }
}

export const searchInvoiceSettings = (changedPlan, inputNumberOfUsers) => async dispatch => {

    inputNumberOfUsers = inputNumberOfUsers === null || inputNumberOfUsers === undefined || inputNumberOfUsers === '' ? 0 : inputNumberOfUsers;

    try {
        const invoicePlanResponse = await axios.post(
            'api/invoice_setting/search', changedPlan,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const invSettingsData = invoicePlanResponse.data.data;
        dispatch({ type: 'SET_COMPANY_INVOICE_SETTINGS', payload: invoicePlanResponse.data.data })
        for (let index in invSettingsData) {
            if (index === 'status' || index === 'created_at' || index === 'updated_at' || index === 'id') {
                continue;
            }
            if (index === 'price_per_user') {
                //dispatch({type: 'SET_COMPANY_INPUTS', payload: {number_of_user: 2}})
                dispatch({
                    type: 'SET_COMPANY_INPUTS',
                    payload: { users_price: inputNumberOfUsers * invSettingsData['price_per_user'] }
                })
            } else {
                dispatch({ type: 'SET_COMPANY_INPUTS', payload: { [index]: invSettingsData[index] } })
            }
        }

    } catch (error) {
        console.log(error.response.data);
        //dispatch(showFailedMessage('Price settings data not found!'));
    }
}

export const allCurrency = () => async dispatch => {

    try {
        const allSettingsResponse = await axios.post(
            'api/invoice_setting/list', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        const settingsData = allSettingsResponse.data.data;

        const allCurrency = {}

        Object.keys(settingsData).map(key => {
            allCurrency[settingsData[key].currency] = settingsData[key].currency;
        });
        dispatch({ type: 'SET_ALL_CURRENCY', payload: allCurrency })

    } catch (error) {
        console.log(error.response.data);
    }
}

export const allDuration = (selectedCurrency, inputNumberOfUsers) => async dispatch => {

    try {
        const allSettingsResponse = await axios.post(
            'api/invoice_setting/list', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response

        const settingsData = allSettingsResponse.data.data;
        const allDuration = {}
        Object.keys(settingsData).map(key => {
            if (settingsData[key].currency === selectedCurrency) {
                allDuration[settingsData[key].type] = settingsData[key].type;
            }
        });

        // reset duration input
        const durationType = Object.keys(allDuration).length === 1 ? Object.keys(allDuration)[0] : Object.keys(allDuration).pop();
        await dispatch(setCompanyInputs({ type: durationType }))
        await dispatch({ type: 'SET_ALL_DURATION', payload: allDuration })

        const changedPlan = {
            currency: selectedCurrency,
            type: durationType === 'Yearly' ? 2 : 1
        }


        dispatch(searchInvoiceSettings(changedPlan, inputNumberOfUsers));

    } catch (error) {
        console.log(error.response.data);
    }
}

export const showAddCompanyForm = () => dispatch => {
    dispatch(setModelTrialErrors(undefined));
    dispatch({ type: 'SHOW_ADD_COMPANY' })
}

export const showEditCompanyForm = () => dispatch => {
    dispatch(setModelTrialErrors(undefined));
    dispatch({ type: 'SHOW_EDIT_COMPANY' })
}

export const hideCompanyForm = () => dispatch => {
    dispatch({ type: 'HIDE_ADD_EDIT_COMPANY' })
}

export const setUserAsCompanyAdmin = () => dispatch => {
    dispatch({ type: 'ADD_USER_AS_COMPANY_ADMIN' })
}

export const loadCompanyInputs = () => dispatch => {
    dispatch({ type: 'LOAD_COMPANY_INPUTS' })
}

export const setDefaultCompanyInputs = () => dispatch => {
    const dateMoment = moment();
    const defaultAgreementStartData = moment().format('DD/MM/YYYY');
    const defaultAgreementEndData = dateMoment.add(1, 'year').format('DD/MM/YYYY');
    dispatch(setCompanyInputs({ agreement_start_date: defaultAgreementStartData }));
    dispatch(setCompanyInputs({ agreement_end_date: defaultAgreementEndData }));
}

export const setCompanyInputs = inputs => async dispatch => {
    await dispatch({ type: 'SET_COMPANY_INPUTS', payload: inputs })
}

export const resetCompanyInputs = inputs => dispatch => {
    dispatch({ type: 'RESET_COMPANY_INPUTS', payload: inputs })
}

export const setCompanyInputsErrors = message => dispatch => {
    dispatch({ type: 'SET_INPUT_ERRORS', payload: message })
}

export const setCompanyFieldsEmptyErrors = inputField => async dispatch => {
    await dispatch({ type: 'SET_INPUT_EMPTY_ERRORS', payload: inputField })
}

export const resetCompanyFieldsEmptyErrors = () => async dispatch => {
    await dispatch({ type: 'RESET_INPUT_EMPTY_ERRORS' })
}

export const showCompanyDeleteConfirmPopup = companyId => dispatch => {
    dispatch({ type: 'SHOW_COMPANY_DELETE_CONFIRM_POPUP', payload: companyId })
}

export const showCompanyBlockUnblockConfirmPopup = (companyId, companyStatus) => dispatch => {
    dispatch({ type: 'SHOW_COMPANY_BLOCK_CONFIRM_POPUP', payload: { id: companyId, status: companyStatus } })
}

export const setModelTotalPrice = modelTotalPrice => dispatch => {
    dispatch({ type: 'SET_MODELS_TOTAL_PRICE', payload: modelTotalPrice })
}

export const showCompanySaveSpinner = () => dispatch => {
    dispatch({ type: 'SHOW_COMPANY_SAVE_SPINNER' })
}

export const hideCompanySaveSpinner = () => dispatch => {
    dispatch({ type: 'HIDE_COMPANY_SAVE_SPINNER' })
}

export const setModelTrialErrors = errors => dispatch => {
    dispatch({ type: 'SET_MODEL_TRIAL_ERRORS', payload: errors })
}
