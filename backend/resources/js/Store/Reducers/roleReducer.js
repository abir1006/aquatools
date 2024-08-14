const init = {
    data: {},
    addRole: false,
    editRole: false,
    selectedRoleId: null,
    inputs: {
        name: null,
        slug: null,
    }
};

const roleReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_ROLES_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'ADD_ROLES_DATA': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }

        case 'SET_ROLE_ID': {
            return {
                ...state,
                selectedRoleId: action.payload
            }
        }

        case 'SET_ROLE_DATA': {
            return {
                ...state,
                inputs: {
                    name: action.payload.name,
                    slug: action.payload.slug
                }
            }
        }

        case 'DELETE_ROLE_DATA': {
            return {
                ...state,
                data: state.data.filter(role => role.id !== action.payload)
            }
        }

        case 'UPDATE_ROLE_DATA': {
            return {
                ...state,
                data: state.data.map(role => {
                    if (role.id === action.payload.id) {
                        return action.payload;
                    }
                    return role;
                })
            }
        }

        case 'UNSET_ROLES_DATA': {
            return {
                ...state,
                data: {}
            }
        }

        case 'SHOW_ADD_ROLE': {
            return {
                ...state,
                addRole: true,
                editRole: false,
            }
        }

        case 'SHOW_EDIT_ROLE': {
            return {
                ...state,
                addRole: false,
                editRole: true,
            }
        }

        case 'HIDE_ADD_EDIT_ROLE': {
            return {
                ...state,
                addRole: false,
                editRole: false,
                selectedRoleId: null,
                inputs: {
                    name: null,
                    slug: null,
                }
            }
        }

        default:
            return state;

    }
};

export default roleReducer;


