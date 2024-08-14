const init = {
    data: {},
    addInvoiceSettings: false,
    editInvoiceSettings: false,
    currencyList: {},
    durationTypes: {},
    inputs: {
        currency: '',
        type: '',
        genetics_price: '',
        optimalisering_price: '',
        cost_of_disease_price: '',
        vaksinering_price: '',
        mtb_price: '',
        kn_for_price: '',
        slaktmodel_price: '',
        custom_report_price: '',
        save_template_price: '',
        download_template_price: '',
        share_template_price: '',
        save_cod_price: '',
        price_per_user: '',
        status: 1,
        id: '',
    },
    inputErrors: '',
    selectedInvoiceSettingsId: '',
};

const invoiceSettingsReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_INVOICE_SETTINGS_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'GET_INVOICE_SETTINGS_INPUTS': {
            return {
                ...state,
                inputs: state.inputs
            }
        }

        case 'SET_SELECTED_INVOICE_SETTINGS_ID': {
            return {
                ...state,
                selectedInvoiceSettingsId: action.payload
            }
        }

        case 'SET_INVOICE_SETTINGS_INPUTS': {
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

        case 'SET_INVOICE_SETTINGS_INPUTS_ERRORS': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'ADD_INVOICE_SETTINGS_DATA': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }

        case 'DELETE_INVOICE_SETTINGS_DATA': {
            return {
                ...state,
                data: state.data.filter(invoiceSettings => invoiceSettings.id !== action.payload)
            }
        }

        case 'UPDATE_INVOICE_SETTINGS_DATA': {
            return {
                ...state,
                data: Object.keys(state.data).map(key => {
                    if (state.data[key].id === action.payload.id) {
                        return action.payload;
                    }
                    return state.data[key];
                })
            }
        }

        case 'UNSET_INVOICE_SETTINGS_DATA': {
            return {
                ...state,
                data: {}
            }
        }

        case 'SHOW_ADD_INVOICE_SETTINGS': {
            return {
                ...state,
                addInvoiceSettings: true,
                editInvoiceSettings: false,
            }
        }

        case 'SHOW_EDIT_INVOICE_SETTINGS': {
            return {
                ...state,
                addInvoiceSettings: false,
                editInvoiceSettings: true,
            }
        }

        case 'HIDE_ADD_EDIT_INVOICE_SETTINGS': {
            return {
                ...state,
                addInvoiceSettings: false,
                editInvoiceSettings: false,
                inputs: {
                    currency: '',
                    type: '',
                    genetics_price: '',
                    optimalisering_price: '',
                    cost_of_disease_price: '',
                    vaksinering_price: '',
                    mtb_price: '',
                    kn_for_price: '',
                    slaktmodel_price: '',
                    custom_report_price: '',
                    save_template_price: '',
                    download_template_price: '',
                    share_template_price: '',
                    save_cod_price: '',
                    price_per_user: '',
                    status: 1,
                    id: '',
                },
                inputErrors: '',
            }
        }

        case 'SET_CURRENCY_DATA': {
            return {
                ...state,
                currencyList: action.payload
            }
        }

        case 'SET_INVOICE_DURATION_DATA': {
            return {
                ...state,
                durationTypes: action.payload
            }
        }

        default:
            return state;

    }
};

export default invoiceSettingsReducer;


