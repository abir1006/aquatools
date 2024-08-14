const init = {
    sideBarWidth: null,
    screenSize: null,
};

const pageReducer = (state = init, action) => {
    switch (action.type) {
        case 'SCREEN_RESIZE': {
            return {
                ...state,
                sideBarWidth: action.payload.sideBarWidth,
                screenSize: action.payload.screenSize
            }
        }

        case 'SET_CURRENT_ROUTE': {
            return {
                ...state,
                currentRoute: action.payload
            }
        }

        case 'SET_ALL_CHECKBOX': {
            return {
                ...state,
                allCheck: action.payload
            }
        }

        default:
            return state;
    }
};

export default pageReducer;


