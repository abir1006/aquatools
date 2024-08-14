export const setConfirmYes = (url) => async (dispatch) => {
    dispatch({type: 'SET_CONFIRM_YES', payload: url});
}
export const setConfirmNo = () => async (dispatch) => {
    dispatch({type: 'SET_CONFIRM_NO', payload: ''});
}

export const setConfirmNavigationSwitch = status => dispatch => {
    dispatch({type: 'SET_CONFIRM_NAVIGATION_SWITCH', payload: status});
}

export const setIsDirty = () => dispatch => {
    dispatch({type: 'SET_IS_DIRTY'});
}
export const unsetIsDirty = () => dispatch => {
    dispatch({type: 'UNSET_IS_DIRTY'});
}

export const showSuccessMessage = message => dispatch => {
    dispatch({type: 'SHOW_NOTIFICATION_POPUP', payload: message});
    window.scrollTo(0, 0);
    setTimeout(() => {
        dispatch({type: 'HIDE_NOTIFICATION_POPUP'})
    }, 3000);
}

export const showSuccess = message => dispatch => {
    dispatch({type: 'SHOW_SUCCESS', payload: message});
    setTimeout(() => {
        dispatch({type: 'HIDE_SHOW_SUCCESS'})
    }, 3000);
}


export const showInvoiceSettingsConfirmPopup = itemId => dispatch => {
    dispatch({type: 'SHOW_INVOICE_SETTINGS_DELETE_CONFIRM_POPUP', payload: itemId})
}

export const showFailedMessage = message => dispatch => {
    window.scrollTo(0, 0);
    dispatch({type: 'SHOW_NOTIFICATION_POPUP', payload: message});
    setTimeout(() => {
        dispatch({type: 'HIDE_NOTIFICATION_POPUP'})
    }, 3000);
}


export const showModelDeleteConfirmPopup = itemId => dispatch => {
    dispatch({type: 'SHOW_MODEL_DELETE_CONFIRM_POPUP', payload: itemId})
}

export const showBlockDeleteConfirmPopup = itemId => dispatch => {
    dispatch({type: 'SHOW_MODEL_BLOCK_DELETE_CONFIRM_POPUP', payload: itemId})
}

export const showBlockBulkDeleteConfirmPopup = payloads => dispatch => {
    dispatch({type: 'SHOW_MODEL_BLOCK_DELETE_CONFIRM_POPUP', payload: payloads})
}

export const showInfoPopup = (text, xPosition, yPosition) => dispatch => {
    dispatch({
        type: 'SHOW_INFO_POPUP',
        payload: {
            infoText: text,
            xPosition: xPosition,
            yPosition: yPosition
        }
    })
}

export const hideInfoPopup = () => dispatch => {
    dispatch({type: 'HIDE_INFO_POPUP'})
}

export const showPDFPopup = () => dispatch => {
    dispatch({type: 'SHOW_PDF_POPUP'});
}

export const hidePDFPopup = () => dispatch => {
    dispatch({type: 'HIDE_PDF_POPUP'});
}

export const showPPTPopup = () => dispatch => {
    dispatch({type: 'SHOW_PPT_POPUP'});
}

export const hidePPTPopup = () => dispatch => {
    dispatch({type: 'HIDE_PPT_POPUP'});
}

export const showInputsBulkDeleteConfirmPopup = inputIDs => dispatch => {
    dispatch({type: 'SHOW_INPUTS_BULK_DELETE_CONFIRM_POPUP', payload: inputIDs})
}

export const showRoleDeleteConfirmPopup = roleId => dispatch => {
    dispatch({type: 'SHOW_ROLE_DELETE_CONFIRM_POPUP', payload: roleId})
}

export const showSharedByMeRemoveConfirmPopup = shareId => dispatch => {
    dispatch({type: 'SHOW_SHARED_BY_ME_REMOVE_CONFIRM_POPUP', payload: shareId})
}

export const showSharedWithMeRemoveConfirmPopup = shareId => dispatch => {
    dispatch({type: 'SHOW_SHARED_BY_OTHERS_REMOVE_CONFIRM_POPUP', payload: shareId})
}

export const showPriceModulePopup = () => dispatch => {
    dispatch({type: 'SHOW_PRICE_MODULE_POPUP'});
}

export const hidePriceModulePopup = () => dispatch => {
    dispatch({type: 'HIDE_PRICE_MODULE_POPUP'});
}

export const showFeedTablePopup = () => dispatch => {
    dispatch({type: 'SHOW_FEED_TABLE_POPUP'});
}

export const hideFeedTablePopup = () => dispatch => {
    dispatch({type: 'HIDE_FEED_TABLE_POPUP'});
}

export const showFeedLibraryPopup = () => dispatch => {
    dispatch({type: 'SHOW_FEED_LIBRARY_POPUP'});
}

export const hideFeedLibraryPopup = () => dispatch => {
    dispatch({type: 'HIDE_FEED_LIBRARY_POPUP'});
}

export const showTemplateUpdateConfirmPopup = (templateId, message) => dispatch => {
    dispatch({type: 'SHOW_TEMPLATE_UPDATE_CONFIRM_POPUP', payload: {id: templateId, message: message}})
}

export const showReportDeleteConfirmPopup = reportID => dispatch => {
    dispatch({type: 'SHOW_REPORT_DELETE_CONFIRM_POPUP', payload: reportID})
}

export const showTemperatureModulePopup = () => dispatch => {
    dispatch({type: 'SHOW_TEMPERATURE_MODULE_POPUP'});
}

export const hideTemperatureModulePopup = () => dispatch => {
    dispatch({type: 'HIDE_TEMPERATURE_MODULE_POPUP'});
    dispatch({type: 'RESET_TEMPERATURE_MODULE_INPUTS'});
}

export const showFeedSettingsDeleteConfirmPopup = itemId => dispatch => {
    dispatch({type: 'SHOW_FEED_SETTINGS_DELETE_CONFIRM_POPUP', payload: itemId})
}

export const showFeedLibraryDeleteConfirmPopup = itemId => dispatch => {
    dispatch({type: 'SHOW_FEED_LIBRARY_DELETE_CONFIRM_POPUP', payload: itemId})
}

export const resetModelToDefaultConfirmPopup = itemObj => dispatch => {
    dispatch({type: 'SHOW_RESET_MODEL_TO_DEFAULT_CONFIRM_POPUP', payload: itemObj})
}

export const setConfirmInputBulkDelete = status => dispatch => {
    dispatch({type: 'SET_CONFIRM_INPUT_BULK_DELETE', payload: status})
}

export const setConfirmBlockBulkDelete = status => dispatch => {
    dispatch({type: 'SET_CONFIRM_BLOCK_BULK_DELETE', payload: status})
}

export const showLogsBulkDeleteConfirmPopup = message => dispatch => {
    dispatch({type: 'SHOW_LOGS_BULK_DELETE_CONFIRM_POPUP', payload: message})
}

export const setConfirmLogsBulkDelete = status => dispatch => {
    dispatch({type: 'SET_CONFIRM_LOGS_BULK_DELETE', payload: status})
}

export const hideConfirmPopup = () => dispatch => {
    dispatch({type: 'HIDE_CONFIRM_POPUP'})
}

export const showAccountDeleteConfirmPopup = message => dispatch => {
    dispatch({ type: 'SHOW_ACCOUNT_DELETE_CONFIRM_POPUP', payload: message })
}

export const setConfirmAccountDelete = status => dispatch => {
    dispatch({ type: 'SET_CONFIRM_ACCOUNT_DELETE', payload: status })
}
