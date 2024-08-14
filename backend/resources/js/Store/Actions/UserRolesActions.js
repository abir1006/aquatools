

export const showAddRoleForm = () => dispatch => {
    dispatch({type: 'SHOW_ADD_ROLE'})
}

export const showEditRoleForm = () => dispatch => {
    dispatch({type: 'SHOW_EDIT_ROLE'})
}

export const setSelectedRoleId = selectedRoleId => dispatch => {
    dispatch({type: 'SET_ROLE_ID', payload: selectedRoleId})
}

export const setEditedRoleData = selectedRole => dispatch => {
    dispatch({type: 'SET_ROLE_DATA', payload: selectedRole})
}

export const setRolesData = roles => dispatch => {
    dispatch({type: 'SET_ROLES_DATA', payload: roles})
}

export const hideRoleForms = () => dispatch => {
    dispatch({type: 'HIDE_ADD_EDIT_ROLE'})
}
