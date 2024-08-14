const init = {
    emptyFields : {
        isNameFieldEmpty: false,
        isContactPersonFieldEmpty: false,
        isContactPersonLastNameFieldEmpty: false,
        isPhoneFieldEmpty: false,
        isEmailFieldEmpty: false,
        isAddressFieldEmpty: false,
        isZipFieldEmpty: false,
        isCountryFieldEmpty: false,
        isStateFieldEmpty: false,
        isCityFieldEmpty: false,
        isNumberOfLicenceFieldEmpty: false,
        isAuth0OrgIDFieldEmpty: false,
        isPasswordFieldEmpty: false,
        isPasswordConfirmFieldEmpty: false,
    },
    isFieldEmpty: false,
    paginationData: {
        currentPage: '',
        perPage: '',
        totalRecord: '',
    },
    addCompany: false,
    editCompany: false,
    data: {},
    searchResult: {},
    toolsData: [],
    addonsData: {},
    inputErrors: '',
    inputs: {
        name: '',
        email: '',
        contact_person: '',
        contact_person_last_name: '',
        contact_number: '',
        phone_number: '',
        address_line_1: '',
        address_line_2: '',
        zip_code: '',
        country: '',
        state: '',
        city: '',
        user_create: 0,
        show_password_field_checkbox: true,
        show_password_field: false,
        view_invoice: false,
        password: '',
        password_confirmation: '',
        type: 'Yearly',
        currency: 'NOK',
        number_of_licence: '',
        auth0_org_id: '',
        logo: '',
        logo_url: '',
        agreement_period: 1,
        agreement_start_date: '',
        agreement_end_date: '',
        genetics_permission: '',
        genetics_price: 0,
        genetics_discount: 0,
        cost_of_disease_permission: '',
        cost_of_disease_price: 0,
        cost_of_disease_discount: 0,
        slaktmodel_permission: '',
        slaktmodel_price: 0,
        slaktmodel_discount: 0,
        vaksinering_permission: '',
        vaksinering_price: 0,
        vaksinering_discount: 0,
        optimalisering_permission: '',
        optimalisering_price: 0,
        optimalisering_discount: 0,
        mtb_permission: '',
        mtb_price: 0,
        mtb_discount: 0,
        kn_for_permission: '',
        kn_for_price: 0,
        kn_for_discount: 0,
        custom_report_permission: '',
        custom_report_price: 0,
        custom_report_discount: 0,
        download_template_permission: '',
        download_template_price: 0,
        download_template_discount: 0,
        share_template_permission: '',
        share_template_price: 0,
        share_template_discount: 0,
        save_template_permission: '',
        save_template_price: 0,
        save_template_discount: 0,
        save_cod_permission: '',
        save_cod_price: 0,
        save_cod_discount: 0,
        users_price: 0,
        number_of_user: '',
    },
    invoiceSettingsData: {},
    allCurrency: {},
    allDuration: {},
    currencySymbols: {
        NOK: 'kr.',
        USD: '$',
        EURO: '€'
    },
    currencyChanged: false,
    durationChanged: false,
    modelsTotalPrice: 0,
    addonsTotalPrice: 0,
};

const companyReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_COMPANY_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'SET_MODELS_TOTAL_PRICE': {
            return {
                ...state,
                modelsTotalPrice: action.payload
            }
        }

        case 'SET_ADDONS_TOTAL_PRICE': {
            return {
                ...state,
                addonsTotalPrice: action.payload
            }
        }

        case 'SET_INPUTS_BY_COMPANY': {
            return {
                ...state,
                inputs: {...state.inputs, ...action.payload}
            }
        }

        case 'SET_COMPANY_SEARCH_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'DELETE_COMPANY_DATA': {
            return {
                ...state,
                data: state.data.filter(company => company.id !== action.payload)
            }
        }

        case 'SET_COMPANY_PAGINATION_DATA': {
            return {
                ...state,
                paginationData: action.payload
            }
        }

        case 'ADD_COMPANY_DATA': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }

        case 'UPDATE_COMPANY_DATA': {
            return {
                ...state,
                data: state.data.map(company => {
                    if (company.id === action.payload.id) {
                        return action.payload;
                    }
                    return company;
                })
            }
        }

        case 'UPDATE_COMPANY_STATUS': {
            return {
                ...state,
                data: state.data.map(company => {
                    if (company.id === action.payload.id) {
                        company.status = action.payload.status;
                    }
                    return company;
                })
            }
        }

        case 'SET_TOOLS_DATA': {
            return {
                ...state,
                toolsData: action.payload
            }
        }

        case 'SET_ADDONS_DATA': {
            return {
                ...state,
                addonsData: action.payload
            }
        }

        case 'SET_INPUT_ERRORS': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SET_COMPANY_INPUTS': {
            const objectKey = Object.keys(action.payload)[0];
            const ObjectValue = action.payload[Object.keys(action.payload)[0]];
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [objectKey]: ObjectValue
                }
            }
        }

        case 'ADD_COMPANY_PAGINATION_TOTAL_RECORD': {
            return {
                ...state,
                paginationData: {
                    ...state.paginationData,
                    totalRecord: state.paginationData.totalRecord + 1
                }
            }
        }

        case 'MINUS_COMPANY_PAGINATION_TOTAL_RECORD': {
            return {
                ...state,
                paginationData: {
                    ...state.paginationData,
                    totalRecord: state.paginationData.totalRecord - 1
                }
            }
        }

        case 'SET_COMPANY_INVOICE_SETTINGS': {
            return {
                ...state,
                invoiceSettingsData: action.payload
            }
        }

        case 'SET_ALL_CURRENCY': {
            return {
                ...state,
                allCurrency: action.payload
            }
        }

        case 'SET_ALL_DURATION': {
            return {
                ...state,
                allDuration: action.payload
            }
        }

        case 'SET_ALL_INVOICE_SETTINGS': {
            return {
                ...state,
                allInvoiceSettings: action.payload
            }
        }

        case 'LOAD_COMPANY_INPUTS': {
            return {
                ...state,
                inputs: state.inputs
            }
        }


        case 'RESET_COMPANY_INPUTS': {
            return {
                ...state,
                inputs: {
                    name: '',
                    email: '',
                    contact_person: '',
                    contact_person_last_name: '',
                    contact_number: '',
                    phone_number: '',
                    address_line_1: '',
                    address_line_2: '',
                    zip_code: '',
                    country: '',
                    state: '',
                    city: '',
                    user_create: 0,
                    show_password_field_checkbox: true,
                    show_password_field: false,
                    view_invoice: false,
                    password: '',
                    password_confirmation: '',
                    type: 'Yearly',
                    currency: 'NOK',
                    number_of_licence: '',
                    auth0_org_id: '',
                    logo: '',
                    logo_url: '',
                    agreement_period: 1,
                    agreement_start_date: '',
                    agreement_end_date: '',
                    genetics_permission: '',
                    genetics_price: 0,
                    genetics_discount: 0,
                    cost_of_disease_permission: '',
                    cost_of_disease_price: 0,
                    cost_of_disease_discount: 0,
                    slaktmodel_permission: '',
                    slaktmodel_price: 0,
                    slaktmodel_discount: 0,
                    vaksinering_permission: '',
                    vaksinering_price: 0,
                    vaksinering_discount: 0,
                    optimalisering_permission: '',
                    optimalisering_price: 0,
                    optimalisering_discount: 0,
                    mtb_permission: '',
                    mtb_price: 0,
                    mtb_discount: 0,
                    kn_for_permission: '',
                    kn_for_price: 0,
                    kn_for_discount: 0,
                    custom_report_permission: '',
                    custom_report_price: 0,
                    custom_report_discount: 0,
                    download_template_permission: '',
                    download_template_price: 0,
                    download_template_discount: 0,
                    share_template_permission: '',
                    share_template_price: 0,
                    share_template_discount: 0,
                    save_template_permission: '',
                    save_template_price: 0,
                    save_template_discount: 0,
                    save_cod_permission: '',
                    save_cod_price: 0,
                    save_cod_discount: 0,
                    users_price: 0,
                    number_of_user: '',
                },
                currencySymbols: {
                    NOK: 'kr.',
                    USD: '$',
                    EURO: '€'
                }
            }
        }

        case 'UNSET_COMPANY_DATA': {
            return {
                ...state,
                data: {}
            }
        }

        case 'SET_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    ...state.emptyFields,
                    [action.payload]: true,
                }
            }
        }

        case 'RESET_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    isNameFieldEmpty: false,
                    isContactPersonFieldEmpty: false,
                    isContactPersonLastNameFieldEmpty: false,
                    isPhoneFieldEmpty: false,
                    isEmailFieldEmpty: false,
                    isAddressFieldEmpty: false,
                    isZipFieldEmpty: false,
                    isCountryFieldEmpty: false,
                    isStateFieldEmpty: false,
                    isCityFieldEmpty: false,
                    isNumberOfLicenceFieldEmpty: false,
                    isAuth0OrgIDFieldEmpty: false,
                    isPasswordFieldEmpty: false,
                    isPasswordConfirmFieldEmpty: false,
                }
            }
        }

        case 'SHOW_ADD_COMPANY': {
            return {
                ...state,
                addCompany: true,
                editCompany: false,
            }
        }

        case 'SHOW_EDIT_COMPANY': {
            return {
                ...state,
                addCompany: false,
                editCompany: true,
            }
        }

        case 'SHOW_COMPANY_SAVE_SPINNER': {
            return {
                ...state,
                companySaveSpinner: true,
            }
        }

        case 'HIDE_COMPANY_SAVE_SPINNER': {
            return {
                ...state,
                companySaveSpinner: false,
            }
        }

        case 'HIDE_ADD_EDIT_COMPANY': {
            return {
                ...state,
                addCompany: false,
                editCompany: false,
                modelsTotalPrice: 0,
                addonsTotalPrice: 0,
            }
        }

        case 'SET_MODEL_TRIAL_ERRORS': {
            return {
                ...state,
                modelTrialErrors: action.payload,
            }
        }

        default:
            return state;

    }
};

export default companyReducer;


