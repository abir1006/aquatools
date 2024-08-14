const init = {
    featuredMaterials: [],
    materials: [],
    selectedMaterial: null,
    categories: [],
    tags: [],
    notifications: [],
    paginationData: {
        currentPage: '',
        perPage: '',
        totalRecord: '',
    }
}

const materialsReducer = (state = init, action) => {
    switch (action.type) {

        case 'REMOVE_NOTIFICATIONS': {
            return {
                ...state,
                notifications: state.notifications.filter(x => x.id !== action.payload)
            }
        }

        case 'SET_UNREAD_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload
            }
        }

        case 'SET_MATERIAL_TAGS': {
            return {
                ...state,
                tags: action.payload
            }
        }

        case 'SET_MATERIAL_CATEGORIES': {
            return {
                ...state,
                categories: action.payload
            }
        }

        case 'SET_MATERIAL_LIST': {
            return {
                ...state,
                materials: action.payload
            }
        }
        case 'SET_FEATURED_MATERIAL_LIST': {
            return {
                ...state,
                featuredMaterials: action.payload
            }
        }


        case 'SET_MATERIAL_PAGINATION_DATA': {
            return {
                ...state,
                paginationData: action.payload
            }
        }

        case 'SET_SELECTED_MATERIAL': {
            return {
                ...state,
                selectedMaterial: action.payload
            }
        }

        default:
            return state;
    }
}

export default materialsReducer;