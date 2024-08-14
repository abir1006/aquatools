const init = {
    profilePopup: false,
    subMenuShow: false,
    currentSubMenuName: null,
    navCollapse: false,
    mobileNavSliding: null,
};

const navigationReducer = (state = init, action) => {
    switch (action.type) {
        case 'PROFILE_CLICK': {
            return {
                ...state,
                profilePopup: state.profilePopup !== true
            }
        }
        case 'SUBMENU_OPEN': {
            return {
                ...state,
                subMenuShow: state.subMenuShow !== true,
                currentSubMenuName: action.payload.subMenuName
            }
        }
        case 'SUBMENU_CLOSE': {
            return {
                ...state,
                subMenuShow: state.subMenuShow !== true
            }
        }
        case 'NAV_EXPAND_COLLAPSE': {
            return {
                ...state,
                navCollapse: state.navCollapse !== true
            }
        }

        case 'SET_NAV_COLLAPSE': {
            return {
                ...state,
                navCollapse: true,
            }
        }

        case 'SET_NAV_EXPAND': {
            return {
                ...state,
                navCollapse: false,
                mobileNavSliding: false,
            }
        }

        case 'MOBILE_NAV_SLIDING': {
            return {
                ...state,
                navCollapse: false,
                mobileNavSliding: state.mobileNavSliding !== true
            }
        }
        case 'LOAD_DEFAULT_NAV_STATE': {
            return {
                ...state,
                profilePopup: false,
                subMenuShow: false,
                currentSubMenuName: null,
                mobileNavSliding: null,
            };
        }
        default:
            return state;
    }
};

export default navigationReducer;


