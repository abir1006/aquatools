const init = {
    settings: {}
};

const SiteSettingsReducer = (state = init, action) => {
    switch (action.type) {
        case 'SET_SETTINGS_DATA': {
            return {
                ...state,
                settings: action.payload
            }
        }
        default:
            return state;

    }
};

export default SiteSettingsReducer;


