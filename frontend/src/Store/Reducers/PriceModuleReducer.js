const init = {};

const priceModuleReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_PRICE_MODULE_CURRENT_MODEL': {
            return {
                ...state,
                currentModelSlug: action.payload
            }
        }
        case 'TAKE_PRICE_MODULE_CV_FROM': {
            return {
                ...state,
                cvFrom: action.payload
            }
        }
        case 'TAKE_PRICE_MODULE_SNITTVEKT_FROM': {
            return {
                ...state,
                snittvektFrom: action.payload
            }
        }
        case 'SET_PRICE_MODULE_SNITTVEKT': {
            return {
                ...state,
                defaultSnittvekt: action.payload
            }
        }
        case 'SET_PRICE_MODULE_CV': {
            return {
                ...state,
                defaultCV: action.payload
            }
        }
        case 'SET_PRICE_MODULE_INPUTS': {
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

        case 'SET_PRICE_MODULE_OUTPUTS': {
            return {
                ...state,
                outputs: action.payload
            }
        }

        case 'SET_PRICE_MODULE_DEFAULT_INPUTS': {
            return {
                ...state,
                defaultInputs: action.payload
            }
        }

        case 'RESET_PRICE_MODULE_INPUTS': {
            return {
                ...state,
                inputs: undefined,
                outputs: undefined,
                defaultSnittvekt: undefined,
                defaultCV: undefined,
            }
        }

        default:
            return state;

    }
};

export default priceModuleReducer;


