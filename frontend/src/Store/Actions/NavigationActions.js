
export const handleSubMenuOpen = (e, subMenus, subMenuName) => dispatch => {

    dispatch({
        type: 'SCREEN_RESIZE',
        payload: {
            sideBarWidth: document.getElementById('sidebar').offsetWidth,
            screenSize: window.innerWidth,
        }
    })

    dispatch(
        {
            type: 'SUBMENU_OPEN',
            payload: {
                subMenuName: subMenuName
            }
        }
    )
}

export const handleMobileNavSliding = () => dispatch => {
    dispatch({type: 'MOBILE_NAV_SLIDING'})
}

export const navExpandCollapse = () => dispatch => {
    dispatch({type: 'NAV_EXPAND_COLLAPSE'})
}

export const setNavExpand = () => dispatch => {
    dispatch({type: 'SET_NAV_EXPAND'})
}


export const setNavCollapse = () => dispatch => {
    dispatch({type: 'SET_NAV_COLLAPSE'})
}

