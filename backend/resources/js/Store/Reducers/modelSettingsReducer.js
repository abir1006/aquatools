const init = {
    data: [],
    addModel: false,
    editModel: false,
    modelSettings: false,
    inputs: {
        name: '',
        slug: '',
        details: '',
        id: '',
    },
    emptyFields: {
        isNameFieldEmpty: false,
        isSlugFieldEmpty: false,
    },
    inputErrors: '',
    selectedModelId: '',
};

const modelSettingsReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_MODEL_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'ADD_MODEL_DATA': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }

        case 'UPDATE_MODEL_DATA': {
            return {
                ...state,
                data: state.data.map(model => {
                    if (model.id === action.payload.id) {
                        return action.payload;
                    }
                    return model;
                })
            }
        }

        case 'DELETE_MODEL_DATA': {
            return {
                ...state,
                data: state.data.filter(model => model.id !== action.payload)
            }
        }

        case 'SET_MODEL_INPUTS': {
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

        case 'SET_MODEL_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    ...state.emptyFields,
                    [action.payload]: true,
                }
            }
        }

        case 'RESET_MODEL_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
            }
        }

        case 'SET_MODEL_INPUT_ERROR_MESSAGE': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SHOW_ADD_MODEL_FORM': {
            return {
                ...state,
                addModel: true,
                editModel: false,
                modelSettings: false,
            }
        }

        case 'SHOW_EDIT_MODEL_FORM': {
            return {
                ...state,
                addModel: false,
                editModel: true,
                modelSettings: false,
            }
        }

        case 'SHOW_MODEL_SETTINGS_FORM': {
            return {
                ...state,
                addModel: false,
                editModel: false,
                modelSettings: true,
            }
        }

        case 'HIDE_MODEL_FORMS': {
            return {
                ...state,
                addModel: false,
                editModel: false,
                modelSettings: false,
                inputs: {
                    name: '',
                    slug: '',
                    id: '',
                },
                emptyFields: {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
                selectedModelId: '',
            }
        }

        default:
            return state;

    }
};

export default modelSettingsReducer;


