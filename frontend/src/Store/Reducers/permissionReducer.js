const init = {
    data: {},
    editPermissions: false,
};

const permissionReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_PERMISSIONS_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'SHOW_EDIT_PERMISSIONS': {
            return {
                ...state,
                editPermissions: true,
            }
        }

        case 'HIDE_EDIT_PERMISSIONS': {
            return {
                ...state,
                editPermissions: false,
            }
        }

        default:
            return state;

    }
};

export default permissionReducer;


