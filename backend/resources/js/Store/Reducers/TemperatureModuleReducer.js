const init = {};

const temperatureModuleReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_TEMPERATURE_TEMPLATES': {
            return {
                ...state,
                temperatureTemplates: action.payload
            }
        }

        case 'SET_TEMPERATURE_MODULE_INPUTS': {
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

        case 'SET_TEMPERATURE_MODULE_OUTPUTS': {
            return {
                ...state,
                outputs: action.payload
            }
        }

        case 'RESET_TEMPERATURE_MODULE_OUTPUTS': {
            return {
                ...state,
                outputs: undefined
            }
        }


        case 'RESET_TEMPERATURE_MODULE_INPUTS': {
            return {
                ...state,
                inputs: undefined,
            }
        }

        case 'SHOW_TEMPERATURE_MODULE_SPINNER': {
            return {
                ...state,
                temperatureSpinner: true,
            }
        }

        case 'HIDE_TEMPERATURE_MODULE_SPINNER': {
            return {
                ...state,
                temperatureSpinner: undefined,
            }
        }

        case 'TEMPERATURE_MODULE_ERROR': {
            return {
                ...state,
                errorMessage: action.payload,
            }
        }
        case 'TEMPERATURE_MODULE_SUCCESS': {
            return {
                ...state,
                successMessage: action.payload,
            }
        }

        default:
            return state;

    }
};

export default temperatureModuleReducer;


