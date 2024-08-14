const init = {};

const codModelScreenReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_COD_CASE_NAMES': {
            return {
                ...state,
                caseLabels: action.payload
            }
        }

        default:
            return state;

    }
};

export default codModelScreenReducer;


