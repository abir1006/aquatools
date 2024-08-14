const init = {
    addUser: false,
    editUser: false,
    paginationData: {
        currentPage: '',
        perPage: '',
        totalRecord: '',
    },
    data: [],
    inputs: {
        company_id: '',
        role_id: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 1,
    },
    emptyErrors: {
        isCompanyFieldEmpty: false,
        isRoleFieldEmpty: false,
        isFirstNameFieldEmpty: false,
        isLastNameFieldEmpty: false,
        isEmailFieldEmpty: false,
        isPasswordFieldEmpty: false,
        isConfirmPasswordFieldEmpty: false,
    },
    inputErrors: '',
};

const userReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_USERS_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'ADD_USER_DATA': {
            return {
                ...state,
                data: [action.payload, ...state.data]
            }
        }

        case 'UPDATE_USER_DATA': {
            return {
                ...state,
                data: state.data.map(user => {
                    if (user.id === action.payload.id) {
                        return action.payload;
                    }
                    return user;
                })
            }
        }

        case 'SET_USER_INPUTS': {
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

        case 'SET_INPUTS_BY_USER_ID': {
            const selectedUser = state.data.filter(user => user.id === action.payload);
            selectedUser[0].role_id = selectedUser[0].roles[0].id;
            return {
                ...state,
                inputs: selectedUser[0]
            }
        }

        case 'SET_USER_INPUT_ERRORS': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SET_USER_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyErrors: {
                    ...state.emptyErrors,
                    [action.payload]: true,
                }
            }
        }

        case 'RESET_USER_INPUTS_EMPTY_ERRORS': {
            return {
                ...state,
                emptyErrors: {
                    isCompanyFieldEmpty: false,
                    isRoleFieldEmpty: false,
                    isFirstNameFieldEmpty: false,
                    isLastNameFieldEmpty: false,
                    isEmailFieldEmpty: false,
                    isPasswordFieldEmpty: false,
                    isConfirmPasswordFieldEmpty: false,
                }
            }
        }

        case 'RESET_USER_INPUTS': {
            return {
                ...state,
                inputs: {
                    company_id: '',
                    role_id: '',
                    first_name: '',
                    last_name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    status: 1,
                }
            }
        }

        case 'SET_USERS_PAGINATION_DATA': {
            return {
                ...state,
                paginationData: action.payload
            }
        }

        case 'ADD_USERS_PAGINATION_TOTAL_RECORD': {
            return {
                ...state,
                paginationData: {
                    ...state.paginationData,
                    totalRecord: state.paginationData.totalRecord + 1
                }
            }
        }

        case 'MINUS_USERS_PAGINATION_TOTAL_RECORD': {
            return {
                ...state,
                paginationData: {
                    ...state.paginationData,
                    totalRecord: state.paginationData.totalRecord - 1
                }
            }
        }

        case 'UPDATE_USER_STATUS': {
            return {
                ...state,
                data: state.data.map(user => {
                    if (user.id === action.payload.id) {
                        user.status = action.payload.status;
                    }
                    return user;
                })
            }
        }

        case 'SHOW_ADD_USER': {
            return {
                ...state,
                addUser: true,
                editUser: false,
                changePassword: false,
            }
        }

        case 'SHOW_EDIT_USER': {
            return {
                ...state,
                addUser: false,
                editUser: true,
                changePassword: false,
            }
        }

        case 'SHOW_USER_CHANGE_PASSWORD': {
            return {
                ...state,
                changePassword: true,
                addUser: false,
                editUser: false,
            }
        }

        case 'HIDE_USER_FORMS': {
            return {
                ...state,
                addUser: false,
                editUser: false,
                changePassword: false,
            }
        }

        case 'SHOW_CHANGE_PASSWORD_SPINNER': {
            return {
                ...state,
                changePasswordSpinner: true,
            }
        }

        case 'HIDE_CHANGE_PASSWORD_SPINNER': {
            return {
                ...state,
                changePasswordSpinner: false,
            }
        }

        case 'SHOW_USER_SAVE_SPINNER': {
            return {
                ...state,
                userSaveSpinner: true,
            }
        }

        case 'HIDE_USER_SAVE_SPINNER': {
            return {
                ...state,
                userSaveSpinner: false,
            }
        }

        default:
            return state;

    }
};

export default userReducer;


