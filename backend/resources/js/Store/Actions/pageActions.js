import NavService from "../../Services/NavServices";


export const handleWindowResize = () => dispatch => {
    dispatch({
        type: 'SCREEN_RESIZE',
        payload: {
            sideBarWidth: document.getElementById('sidebar').offsetWidth,
            screenSize: window.innerWidth,
        }
    })
}

export const setCurrentRoute = (routeName = '') => dispatch => {
    dispatch({type: 'SET_CURRENT_ROUTE', payload: routeName})
}

