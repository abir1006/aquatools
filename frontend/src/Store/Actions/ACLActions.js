
export const showEditPermission = () => dispatch => {
    dispatch({type: 'SHOW_EDIT_PERMISSIONS'})
}

export const hideEditPermission = () => dispatch => {
    dispatch({type: 'HIDE_EDIT_PERMISSIONS'})
}
