const init = {
    contentSpinner: false,
    formSpinner: false
};

const spinnerReducer = (state = init, action) => {
    switch (action.type) {

        case 'SHOW_CONTENT_SPINNER': {
            return {
                ...state,
                contentSpinner: true
            }
        }

        case 'SHOW_REMOVE_ACCOUNT_SPINNER': {
            return {
                ...state,
                removeAccountSpinner: action.payload
            }
        }

        case 'HIDE_SPINNER': {
            return {
                ...state,
                contentSpinner: false
            }
        }

        case 'SHOW_FORM_SPINNER': {
            return {
                ...state,
                formSpinner: true
            }
        }

        case 'HIDE_FORM_SPINNER': {
            return {
                ...state,
                formSpinner: false
            }
        }

        default:
            return state;

    }
};

export default spinnerReducer;


