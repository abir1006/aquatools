
const init = {
    authenticated: false,
    data: {
        user: {
            company: {}
        }
    }
};

const authReducer =  (state = init, action) => {
    switch(action.type) {
        case 'SET_AUTH_TRUE': {
            return {
                ...state,
                data: action.payload,
                authenticated: true
            }
        }
        case 'SET_COOKIE_CONSENT': {
            return {
                ...state,
                cookieAccepted: action.payload
            }
        }
        case 'SET_AUTH_FALSE': {
            return {
                ...state,
                authenticated: false,
                data: [],
            }
        }

        case 'SET_AUTH_FAILED_MESSAGE': {
            return {
                ...state,
                failedMessage: action.payload
            }
        }

        case 'SET_ACL': {
            return {
                ...state,
                acl: action.payload
            }
        }

        case 'SET_PERMITTED_MODELS': {
            return {
                ...state,
                permittedModels: action.payload
            }
        }

        case 'SET_PERMITTED_ADDONS': {
            return {
                ...state,
                permittedAddons: action.payload
            }
        }

        case 'SET_PERMITTED_USERS': {
            return {
                ...state,
                permittedUsers: action.payload
            }
        }

        default:
            return state;

    }
};

export default authReducer;


