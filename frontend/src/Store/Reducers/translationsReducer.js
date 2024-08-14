const init = {
    languages: [],
    selectedLang: '',
    items: [],
    addTranslation: false,
    editTranslation: false,
    importTranslation: false,
    selectedItem: null,
    paginationData: {
        currentPage: '',
        perPage: '',
        totalRecord: '',
    }
}

const translationsReducer = (state = init, action) => {
    switch (action.type) {

        case 'SET_SELECTED_LANG': {
            return {
                ...state,
                selectedLang: action.payload
            }
        }

        case 'SET_LANGUAGE_LIST': {
            return {
                ...state,
                languages: action.payload
            }
        }

        case 'SET_TRANSLATION_LIST': {
            return {
                ...state,
                items: action.payload
            }
        }

        case 'SET_TRANSLATION_PAGINATION_DATA': {
            return {
                ...state,
                paginationData: action.payload
            }
        }

        case 'SET_SELECTED_TRANSLATION': {
            return {
                ...state,
                selectedItem: action.payload
            }
        }

        case 'SHOW_IMPORT_TRANSLATION': {
            return {
                ...state,
                importTranslation: true,
                addTranslation: false,
                editTranslation: false,
            }
        }

        case 'SHOW_ADD_TRANSLATION': {
            return {
                ...state,
                addTranslation: true,
                editTranslation: false,
            }
        }

        case 'SHOW_EDIT_TRANSLATION': {
            return {
                ...state,
                addTranslation: false,
                editTranslation: true,
            }
        }

        case 'HIDE_ADD_EDIT_TRANSLATION': {
            return {
                ...state,
                addTranslation: false,
                editTranslation: false,
                importTranslation: false,
                selectedItem: null
            }
        }


        default:
            return state;
    }
}

export default translationsReducer;