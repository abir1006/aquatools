

export const showContentSpinner = () => dispatch => {
    dispatch({type: 'SHOW_CONTENT_SPINNER'})
}

export const showRemoveAccountSpinner = status => dispatch => {
    dispatch({type: 'SHOW_REMOVE_ACCOUNT_SPINNER', payload: status})
}

export const hideContentSpinner = () => dispatch =>  {
    dispatch({type: 'HIDE_SPINNER'})
}

export const showFormSpinner = () => dispatch => {
    dispatch({type: 'SHOW_FORM_SPINNER'})
}

export const hideFormSpinner = () => dispatch =>  {
    dispatch({type: 'HIDE_FORM_SPINNER'})
}
