const init = {
    tool_id: '',
    showModelBlockList: false,
    caseNumbers: [1,2],
    templateList: [],
    blockList:[],
    blockData:[],
    blockStatus:[],
    blockExpand: [],
    inputs: {},
    outputSpinner: true,
    outputView: 'graph',
    outputColumns: 3,
};

const modelScreenReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_MODEL_SCREEN_TOOL_ID': {
            return {
                ...state,
                tool_id: action.payload
            }
        }

        case 'SET_MODEL_SCREEN_BLOCK_SCROLL_HEIGHT': {
            return {
                ...state,
                blockScrollHeight: action.payload
            }
        }

        case 'SET_MODEL_SCREEN_BLOCK_LIST': {
            return {
                ...state,
                blockList: action.payload
            }
        }

        case 'SET_MODEL_SCREEN_BLOCK_DATA': {
            return {
                ...state,
                blockData: action.payload
            }
        }

        case 'SHOW_HIDE_MODEL_BLOCK_LIST': {
            return {
                ...state,
                showModelBlockList: state.showModelBlockList !== true,
            }
        }

        case 'HIDE_MODEL_SCREEN_BLOCK_LIST': {
            return {
                ...state,
                showModelBlockList: false,
            }
        }

        case 'SHOW_HIDE_MODEL_SCREEN_BLOCKS': {
            return {
                ...state,
                blockStatus: {
                    ...state.blockStatus,
                    [action.payload+'_show']: state.blockStatus[action.payload+'_show'] !== true
                }
            }
        }

        case 'SET_MODEL_SCREEN_BLOCKS_STATUS': {
            return {
                ...state,
                blockStatus: {
                    ...state.blockStatus,
                    [action.payload.slug+'_show']: action.payload.status
                }
            }
        }

        case 'SET_MODEL_SCREEN_BLOCKS_EXPAND': {
            return {
                ...state,
                blockExpand: {
                    ...state.blockExpand,
                    [action.payload.slug+'_expand']: true
                }
            }
        }

        case 'TOGGLE_MODEL_SCREEN_BLOCKS_EXPAND': {
            return {
                ...state,
                blockExpand: {
                    ...state.blockExpand,
                    [action.payload+'_expand']: state.blockExpand[action.payload+'_expand'] !== true
                }
            }
        }

        case 'SET_MODEL_SCREEN_ALL_INPUTS': {
            return {
                ...state,
                inputs: action.payload
            }
        }

        case 'SET_MODEL_SCREEN_INPUTS': {
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

        case 'SET_MODEL_SCREEN_INPUT_CASES': {
            return {
                ...state,
                caseNumbers: action.payload
            }
        }

        case 'ADD_MODEL_INPUT_CASE': {
            state.caseNumbers.push(state.caseNumbers.length+1);
            return {
                ...state,
                caseNumbers: [...state.caseNumbers]
            }
        }

        case 'REMOVE_MODEL_INPUT_CASE': {
            state.caseNumbers.pop();
            return {
                ...state,
                caseNumbers: [...state.caseNumbers]
            }
        }

        case 'RESET_MODEL_SCREEN': {
            return {
                ...state,
                // showModelBlockList: false,
                // caseNumbers: [1,2],
                // inputs: {},

                tool_id: '',
                showModelBlockList: false,
                caseNumbers: [1,2],
                templateList: [],
                blockList:[],
                blockData:[],
                blockStatus:[],
                blockExpand: [],
                inputs: {},
                outputSpinner: true,
                outputView: 'graph',
                outputColumns: 3,
            }
        }
        case 'SET_BLOCK_OUTPUT': {
            return {
                ...state,
                blockOutput: action.payload
            }
        }

        case 'SET_INVESTERING_OUTPUT': {
            return {
                ...state,
                investeringOutput: action.payload
            }
        }

        case 'SET_GRAPH_OUTPUT': {
            return {
                ...state,
                graphOutput: action.payload,
            }
        }

        case 'SET_GRAPH_BASE_VALUE': {
            return {
                ...state,
                graphBaseValue: action.payload,
            }
        }

        case 'SET_GRAPH_OUTPUT_LABEL': {
            return {
                ...state,
                graphOutputLabel: action.payload,
            }
        }

        case 'SET_PDF_OUTPUT': {
            return {
                ...state,
                pdfOutput: action.payload
            }
        }

        case 'SET_PPT_OUTPUT': {
            return {
                ...state,
                pptOutput: action.payload
            }
        }

        case 'CHANGE_OUTPUT_COLUMNS': {
            return {
                ...state,
                outputColumns: state.outputColumns === 3 ? 2 : 3
            }
        }

        case 'SET_GRAPH_WRAPPER_WIDTH': {
            return {
                ...state,
                graphWrapperWidth: action.payload,
            }
        }

        case 'CHANGE_MODEL_OUTPUT_VIEW': {
            return {
                ...state,
                outputView: action.payload
            }
        }

        case 'HIDE_MODEL_OUTPUT_SPINNER': {
            return {
                ...state,
                outputSpinner: false
            }
        }

        case 'SHOW_MODEL_OUTPUT_SPINNER': {
            return {
                ...state,
                outputSpinner: true
            }
        }

        case 'SET_MODEL_GRAPH_HELP_TEXT': {
            return {
                ...state,
                graphHelpText: action.payload
            }
        }

        default:
            return state;

    }
};

export default modelScreenReducer;


