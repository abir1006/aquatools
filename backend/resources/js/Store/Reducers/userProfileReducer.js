const init = {

    emptyProfileInfoFields:{
        isFirstNameFieldEmpty: false,
        isLastNameFieldEmpty: false,


    },
    emptyPasswordFields:{
        isOldPasswordFieldEmpty: false,
        isNewPasswordFieldEmpty: false,
        isNewPasswordConfirmationFieldEmpty: false


    },
    data: [],
    userProfileInputs: {
        company_id: '',
        first_name: '',
        last_name: '',
        email: '',
        profile_picture: '',
    },

    userPasswordInputs: {
        old_password: '',
        new_password: '',
        new_password_confirmation: '',
    },
    userProfilePicInputs: '',
    inputErrors: '',
    userProfileSpinner: false
};

const userProfileReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_USER_PROFILE_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }
        case 'SET_USER_PROFILE_INPUTS': {
            let objectKey = Object.keys(action.payload)[0];
            let ObjectValue = action.payload[Object.keys(action.payload)[0]];
            return {
                ...state,
                userProfileInputs: {
                    ...state.userProfileInputs,
                    [objectKey]: ObjectValue
                }
            }
        }
        case 'SET_INPUT_EMPTY_ERRORS': {
            return {
                ...state,
                emptyProfileInfoFields: {
                    ...state.emptyProfileInfoFields,
                    [action.payload]: true,
                }
            }
        }

        case 'SET_INPUT_PASSWORD_EMPTY_ERRORS': {
            return {
                ...state,
                emptyPasswordFields: {
                    ...state.emptyPasswordFields,
                    [action.payload]: true,
                }
            }
        }

        case 'SET_USER_PROFILE_PIC_INPUTS': {
            return {
                ...state,
                userProfilePicInputs: action.payload
            }


        }
        case 'SHOW_PROFILE_SAVE_SPINNER': {
            return {
                ...state,
                userProfileSpinner: true,
            }
        }

        case 'HIDE_PROFILE_SAVE_SPINNER': {
            return {
                ...state,
                userProfileSpinner: false,
            }
        }

        case 'RESET_INPUT_PROFILE_EMPTY_ERRORS': {
            return {
                ...state,
                emptyProfileInfoFields:{
                    isFirstNameFieldEmpty: false,
                    isLastNameFieldEmpty: false,


                }
            }
        }
        case 'RESET_INPUT_PROFILE_PASS_EMPTY_ERRORS': {
            return {
                ...state,
                emptyPasswordFields:{
                    isOldPasswordFieldEmpty: false,
                    isNewPasswordFieldEmpty: false,
                    isNewPasswordConfirmationFieldEmpty: false


                }
            }
        }

        default:
            return state;

    }
};

export default userProfileReducer;


