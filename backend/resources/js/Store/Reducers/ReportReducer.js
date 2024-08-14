const init = {
};

const reportReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_REPORT_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'SET_REPORT_PAGINATION_DATA': {
            return {
                ...state,
                paginationData: action.payload
            }
        }

        default:
            return state;

    }
};

export default reportReducer;


