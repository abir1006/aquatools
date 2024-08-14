const init = {
    emailInputScreen: true,
    tokenInputScreen: false,
    passwordInputScreen: false,
    tokenResendScreen: false,
    inputEmail: '',
    inputErrors: '',
    message: ""
};

const forgotPasswordReducer = (state = init, action) => {
    switch (action.type) {


        case 'SET_MESSAGE': {
            return {
                ...state,
                message: action.payload
            }
        }

        case 'SET_FORGOT_EMAIL': {
            return {
                ...state,
                inputEmail: action.payload
            }
        }


        case 'SET_USER_INPUT_ERRORS': {
            return {
                ...state,
                inputErrors: action.payload
            }
        }

        case 'SHOW_EMAIL_INPUT_SCREEN': {
            return {
                ...state,
                emailInputScreen: true,
                tokenInputScreen: false,
                passwordInputScreen: false,
                tokenResendScreen: false,
            }
        }

        case 'SHOW_TOKEN_INPUT_SCREEN': {
            return {
                ...state,
                emailInputScreen: false,
                tokenInputScreen: true,
                passwordInputScreen: false,
                tokenResendScreen: false,
            }
        }

        case 'SHOW_PASSWORD_INPUT_SCREEN': {
            return {
                ...state,
                emailInputScreen: false,
                tokenInputScreen: false,
                passwordInputScreen: true,
                tokenResendScreen: false,
            }
        }
        case 'SHOW_TOKEN_RESEND_SCREEN': {
            return {
                ...state,
                emailInputScreen: false,
                tokenInputScreen: false,
                passwordInputScreen: false,
                tokenResendScreen: true,
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

export default forgotPasswordReducer;


