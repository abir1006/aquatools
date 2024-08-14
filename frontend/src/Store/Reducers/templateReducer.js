
const init = {
    modelTemplates: [],
    isTemplateNameFieldEmpty: false,
    errorMessage: '',
};

const templateReducer =  (state = init, action) => {
    switch(action.type) {
        case 'SET_MODEL_TEMPLATES_DATA': {
            return {
                ...state,
                modelTemplates: action.payload
            }
        }

        case 'ADD_MODEL_TEMPLATE_DATA': {
            return {
                ...state,
                modelTemplates: [action.payload, ...state.modelTemplates]
            }
        }

        case 'SET_ALL_TEMPLATES_DATA': {
            return {
                ...state,
                allTemplates: action.payload
            }
        }

        case 'ALL_SHARED_BY_ME_TEMPLATE_DATA': {
            return {
                ...state,
                allSharedByMeTemplates: action.payload
            }
        }

        case 'ALL_SHARED_WITH_ME_TEMPLATE_DATA': {
            return {
                ...state,
                allSharedWithMeTemplates: action.payload
            }
        }

        case 'SET_MY_TEMPLATES_DATA': {
            return {
                ...state,
                myTemplates: action.payload
            }
        }

        case 'SET_TEMPLATE_USERS_DATA': {
            return {
                ...state,
                users: action.payload
            }
        }

        case 'SET_TEMPLATE_NAME_ERROR_MESSAGE': {
            return {
                ...state,
                isTemplateNameFieldEmpty: true,
                errorMessage: action.payload
            }
        }

        case 'RESET_TEMPLATE_NAME_ERROR_MESSAGE': {
            return {
                ...state,
                isTemplateNameFieldEmpty: false,
                errorMessage: ''
            }
        }

        case 'SHOW_TEMPLATE_SHARING_SCREEN': {
            return {
                ...state,
                templateSharingScreen: true
            }
        }

        case 'SHOW_SHARE_BUTTON_SPINNER': {
            return {
                ...state,
                shareBtnSpinner: true
            }
        }

        case 'HIDE_SHARE_BUTTON_SPINNER': {
            return {
                ...state,
                shareBtnSpinner: false
            }
        }

        case 'HIDE_TEMPLATE_SHARING_SCREEN': {
            return {
                ...state,
                templateSharingScreen: false
            }
        }

        case 'SET_ALL_TEMPLATES_PAGINATION_DATA': {
            return {
                ...state,
                allTemplatesPaginationData: action.payload
            }
        }

        case 'SET_ALL_SHARED_BY_ME_PAGINATION_DATA': {
            return {
                ...state,
                allSharedByMePaginationData: action.payload
            }
        }

        case 'SET_ALL_SHARED_WITH_ME_PAGINATION_DATA': {
            return {
                ...state,
                allSharedWithMePaginationData: action.payload
            }
        }

        case 'SET_MY_TEMPLATES_PAGINATION_DATA': {
            return {
                ...state,
                myTemplatesPaginationData: action.payload
            }
        }

        case 'SET_TEMPLATE_USERS_PAGINATION_DATA': {
            return {
                ...state,
                templateUsersPaginationData: action.payload
            }
        }

        case 'SET_SHARED_TEMPLATE': {
            return {
                ...state,
                sharedTemplateData: action.payload
            }
        }

        case 'SET_SELECTED_TEMPLATE': {
            return {
                ...state,
                selectedTemplate: action.payload
            }
        }

        case 'SHOW_ALL_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                allTemplateContentSpinner: true
            }
        }

        case 'HIDE_ALL_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                allTemplateContentSpinner: false
            }
        }


        case 'SHOW_MY_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                myTemplateContentSpinner: true
            }
        }

        case 'HIDE_MY_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                myTemplateContentSpinner: false
            }
        }

        case 'SHOW_SHARED_BY_ME_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                sharedByMeTemplateContentSpinner: true
            }
        }

        case 'HIDE_SHARED_BY_ME_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                sharedByMeTemplateContentSpinner: false
            }
        }

        case 'SHOW_SHARED_WITH_ME_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                sharedWithMeTemplateContentSpinner: true
            }
        }

        case 'HIDE_SHARED_WITH_ME_TEMPLATES_CONTENT_SPINNER': {
            return {
                ...state,
                sharedWithMeTemplateContentSpinner: false
            }
        }

        default:
            return state;

    }
};

export default templateReducer;


