const init = {
    data : {}
};

const permissionActionsReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_PERMISSION_ACTIONS_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        default:
            return state;

    }
};

export default permissionActionsReducer;


