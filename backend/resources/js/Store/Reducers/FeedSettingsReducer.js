const init = {};

const feedSettingsReducer = (state = init, action) => {
    switch (action.type) {

        case 'RESET_FEED_FIELD_SETTINGS': {
            return {
                ...state,
                inputs: undefined,
                feedSettingsName: undefined,
            }
        }

        case 'SET_FEED_SETTINGS_DATA': {
            return {
                ...state,
                feedSettingsData: action.payload
            }
        }

        case 'SET_FEED_SETTINGS_NAME': {
            return {
                ...state,
                feedSettingsName: action.payload
            }
        }

        case 'SET_FEED_SETTINGS_FORM_ERRORS': {
            return {
                ...state,
                hasFeedSettingsFieldError: true,
                feedSettingsErrorMessage: action.payload
            }
        }

        case 'CLEAR_FEED_SETTINGS_FORM_ERRORS': {
            return {
                ...state,
                hasFeedSettingsFieldError: false,
                feedSettingsErrorMessage: ''
            }
        }

        case 'SET_FEED_SETTINGS_INPUTS': {
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

        case 'SET_FEED_FORM_FIELD_SETTINGS': {
            return {
                ...state,
                feedFormSettingsFieldList: action.payload
            }
        }

        case 'ADD_FEED_FORM_FIELD_SETTINGS': {
            const tmpObj = state.feedFormSettingsFieldList === undefined ? [] : state.feedFormSettingsFieldList;
            return {
                ...state,
                feedFormSettingsFieldList: [...tmpObj, action.payload]
            }
        }

        case 'UPDATE_FEED_FORM_FIELD_SETTINGS': {
            const updatedList = state.feedFormSettingsFieldList.map(field => {
                let tmp = Object.assign({}, field);
                if (tmp.fieldName === action.payload.feed_settings_field_name) {
                    tmp.fieldLabel = action.payload.feed_settings_field_label
                }
                return tmp;
            });
            return {
                ...state,
                feedFormSettingsFieldList: updatedList
            }
        }

        case 'REMOVE_FEED_FORM_FIELD_SETTINGS': {
            let updatedFieldList = state.feedFormSettingsFieldList.filter(field => field.fieldName !== action.payload);
            return {
                ...state,
                feedFormSettingsFieldList: updatedFieldList
            }
        }

        case 'SHOW_FEED_SETTINGS_CANCEL_ICON': {
            return {
                ...state,
                feedSettingsCancelIcon: true
            }
        }

        case 'HIDE_FEED_SETTINGS_CANCEL_ICON': {
            return {
                ...state,
                feedSettingsCancelIcon: false
            }
        }

        case 'SHOW_ADD_FEED_SETTINGS_FORM': {
            return {
                ...state,
                addFeedSettingsForm: true
            }
        }

        case 'SHOW_EDIT_FEED_SETTINGS_FORM': {
            return {
                ...state,
                editFeedSettingsForm: true
            }
        }

        case 'SHOW_FEED_LIBRARY_FIELD_SETTINGS_FORM': {
            return {
                ...state,
                feedLibraryFieldsSettingsForm: true
            }
        }

        case 'HIDE_FEED_LIBRARY_FIELD_SETTINGS_FORM': {
            return {
                ...state,
                feedLibraryFieldsSettingsForm: false,
                addFeedSettingsForm: false,
                editFeedSettingsForm: false,
            }
        }

        case 'SHOW_FEED_SETTINGS_SPINNER': {
            return {
                ...state,
                feedSettingsSpinner: true
            }
        }

        case 'HIDE_FEED_SETTINGS_SPINNER': {
            return {
                ...state,
                feedSettingsSpinner: false
            }
        }

        default:
            return state;

    }
};

export default feedSettingsReducer;


