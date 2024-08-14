const init = {
    data: [],
    addModule: false,
    editModule: false,
    inputs: {
        name: '',
        slug: '',
    },
    emptyFields : {
        isNameFieldEmpty: false,
        isSlugFieldEmpty: false,
    },
    inputErrors: '',
};

const moduleReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_MODULE_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'ADD_MODULE_DATA': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }

        case 'UPDATE_MODULE_DATA': {
            return {
                ...state,
                data: state.data.map(module => {
                    if (module.id === action.payload.id) {
                        return action.payload;
                    }
                    return module;
                })
            }
        }

        case 'DELETE_MODULE_DATA': {
            return {
                ...state,
                data: state.data.filter(module => module.id !== action.payload)
            }
        }

        case 'SET_MODULE_INPUTS': {
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

        case 'SET_MODULE_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    ...state.emptyFields,
                    [action.payload]: true,
                }
            }
        }

        case 'RESET_MODULE_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
            }
        }

        case 'SET_MODULE_INPUT_ERROR_MESSAGE': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SHOW_ADD_MODULE_FORM': {
            return {
                ...state,
                addModule: true,
                editModule: false,
            }
        }

        case 'SHOW_MODEL_BLOCK_SETTINGS_FORM': {
            return {
                ...state,
                addModule: false,
                editModule: true,
            }
        }


        case 'HIDE_MODULE_FORMS': {
            return {
                ...state,
                addModule: false,
                editModule: false,
                inputs: {
                    name: '',
                    slug: '',
                },
                emptyFields : {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
            }
        }

        case 'RESET_MODULE_INPUTS': {
            return {
                ...state,
                inputs: {
                    name: '',
                    slug: '',
                },
                emptyFields : {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
            }
        }

        default:
            return state;

    }
};

export default moduleReducer;


