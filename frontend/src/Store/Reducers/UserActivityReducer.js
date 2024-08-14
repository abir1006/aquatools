const init = {};

const activityReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_USER_LATEST_ACTIVITY_DATA': {
            return {
                ...state,
                latestActivity: action.payload
            }
        }

        case 'SET_USER_ALL_ACTIVITY_DATA': {
            return {
                ...state,
                data: action.payload
            }
        }

        case 'SET_LATEST_NOTIFICATION_DATA': {
            return {
                ...state,
                latestNotifications: action.payload
            }
        }

        case 'SET_USER_ALL_ACTIVITY_PAGINATION_DATA': {
            return {
                ...state,
                userLogsPaginationData: action.payload
            }
        }

        default:
            return state;

    }
};

export default activityReducer;


