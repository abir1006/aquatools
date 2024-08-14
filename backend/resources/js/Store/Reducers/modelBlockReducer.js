const init = {
    data: [],
    addBlock: false,
    blockSettings: false,
    showBlockSaveSpinner: false,
    inputs: {
        name: '',
        slug: '',
        case_type: 'Row',
        column_no: 1,
        is_default: true,
        has_cases: true,
    },
    emptyFields : {
        isNameFieldEmpty: false,
        isSlugFieldEmpty: false,
    },
    inputErrors: '',
};

const modelBlockReducer = (state = init, action) => {
    switch (action.type) {

        case 'SHOW_BLOCK_SAVE_SPINNER': {
            return {
                ...state,
                showBlockSaveSpinner: true
            }
        }

        case 'HIDE_BLOCK_SAVE_SPINNER': {
            return {
                ...state,
                showBlockSaveSpinner: false
            }
        }

        case 'SET_MODEL_BLOCK_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'ADD_MODEL_BLOCK_DATA': {
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        }

        case 'UPDATE_MODEL_BLOCK_DATA': {
            return {
                ...state,
                data: state.data.map(block => {
                    if (block.id === action.payload.id) {
                        return action.payload;
                    }
                    return block;
                })
            }
        }

        case 'DELETE_MODEL_BLOCK_DATA': {
            return {
                ...state,
                data: state.data.filter(model => !action.payload.includes(model.id))
            }
        }

        case 'SET_BLOCK_DELETE_SPINNER': {
            return {
                ...state,
                showBlockDeleteSpinner: action.payload,
            }
        }

        case 'SET_BLOCK_DELETE_SUCCESS': {
            return {
                ...state,
                showBlockDeleteSuccess: action.payload,
            }
        }

        case 'SET_MODEL_BLOCK_INPUTS': {
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

        case 'SET_MODEL_BLOCK_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    ...state.emptyFields,
                    [action.payload]: true,
                }
            }
        }

        case 'RESET_MODEL_BLOCK_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyFields: {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
            }
        }

        case 'SET_MODEL_BLOCK_INPUT_ERROR_MESSAGE': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SHOW_ADD_MODEL_BLOCK_FORM': {
            return {
                ...state,
                addBlock: true,
                blockSettings: false,
            }
        }

        case 'SHOW_MODEL_BLOCK_SETTINGS_FORM': {
            return {
                ...state,
                addBlock: false,
                blockSettings: true,
            }
        }


        case 'HIDE_MODEL_BLOCK_FORMS': {
            return {
                ...state,
                addBlock: false,
                blockSettings: false,
                inputs: {
                    name: '',
                    slug: '',
                    case_type: 'Row',
                    column_no: 1,
                    is_default: true,
                    has_cases: true,
                },
                emptyFields : {
                    isNameFieldEmpty: false,
                    isSlugFieldEmpty: false,
                },
                inputErrors: '',
            }
        }

        case 'RESET_MODEL_BLOCK_INPUTS': {
            return {
                ...state,
                inputs: {
                    name: '',
                    slug: '',
                    case_type: 'Row',
                    column_no: 1,
                    is_default: true,
                    has_cases: true,
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

export default modelBlockReducer;


