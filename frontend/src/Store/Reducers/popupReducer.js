const init = {
    showLogsBulkDeletePopup: undefined,
    showTemplateNamePopup: false,
    showInfoPopup: false,
    showPDFPopup: false,
    showPopup: false,
    confirmYes: false,
    confirmNo: false,
    confirmItemId: null,
    confirmItem: null,
    showNotificationPopup: false,
    notificationMessage: null,
    notificationType: null,
    showSuccess: undefined,
    isDirty: false,
    confirmUrl: '',
    showInputBulkDeletePopup: undefined,
};

const popupReducer = (state = init, action) => {

    switch (action.type) {

        case 'SET_CONFIRM_YES': {
            return {
                ...state,
                confirmUrl: action.payload
            }
        }

        case 'SET_CONFIRM_NO': {
            return {
                ...state,
                confirmUrl: action.payload
            }
        }


        case 'SET_IS_DIRTY': {
            return {
                ...state,
                isDirty: true
            }
        }
        case 'UNSET_IS_DIRTY': {
            return {
                ...state,
                isDirty: false
            }
        }

        case 'SHOW_RESET_MODEL_TO_DEFAULT_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload.modelName,
                confirmItemMessage: action.payload.message,
                confirmItemName: 'modelScreen'
            }
        }

        case 'SHOW_ACCOUNT_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemMessage: action.payload,
                confirmAccountDelete: undefined,
                confirmItemName: 'remove_account'
            }
        }

        case 'SET_CONFIRM_ACCOUNT_DELETE': {
            return {
                ...state,
                confirmAccountDelete: action.payload,
            }
        }

        case 'SHOW_TRANSLATION_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'translation'
            }
        }

        case 'SHOW_NAVIGATION_PROMPT_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload.location,
                confirmItemMessage: action.payload.message,
                confirmItemName: 'navigation_prompt',
                confirmNavigationSwitch: undefined,
            }
        }

        case 'SET_CONFIRM_NAVIGATION_SWITCH': {
            return {
                ...state,
                confirmNavigationSwitch: action.payload
            }
        }

        case 'SHOW_FEED_LIBRARY_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'feed library'
            }
        }

        //

        case 'SHOW_LOGS_BULK_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemMessage: action.payload,
                confirmLogsBulkDelete: undefined,
                confirmItemName: 'delete_user_logs'
            }
        }

        case 'SET_CONFIRM_LOGS_BULK_DELETE': {
            return {
                ...state,
                confirmLogsBulkDelete: action.payload,
            }
        }

        //

        case 'SHOW_FEED_SETTINGS_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'feed settings'
            }
        }

        case 'SHOW_FEED_LIBRARY_POPUP': {
            return {
                ...state,
                showFeedLibraryPopup: true,
            }
        }

        case 'HIDE_FEED_LIBRARY_POPUP': {
            return {
                ...state,
                showFeedLibraryPopup: false,
            }
        }

        case 'SHOW_TEMPERATURE_MODULE_POPUP': {
            return {
                ...state,
                showTemperatureModulePopup: true,
            }
        }

        case 'HIDE_TEMPERATURE_MODULE_POPUP': {
            return {
                ...state,
                showTemperatureModulePopup: false,
            }
        }

        case 'SHOW_REPORT_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'report'
            }
        }

        case 'SHOW_TEMPLATE_UPDATE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload.id,
                confirmItemMessage: action.payload.message,
                confirmItemName: 'template update'
            }
        }

        case 'SHOW_FEED_TABLE_POPUP': {
            return {
                ...state,
                showFeedTablePopup: true,
            }
        }

        case 'HIDE_FEED_TABLE_POPUP': {
            return {
                ...state,
                showFeedTablePopup: false,
            }
        }

        case 'SHOW_PRICE_MODULE_POPUP': {
            return {
                ...state,
                showPriceModulePopup: true,
            }
        }

        case 'HIDE_PRICE_MODULE_POPUP': {
            return {
                ...state,
                showPriceModulePopup: false,
            }
        }

        case 'SHOW_SHARED_BY_OTHERS_REMOVE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'template shared with you'
            }
        }

        case 'SHOW_SHARED_BY_ME_REMOVE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'template shared by you'
            }
        }

        case 'SHOW_SHARED_BY_OTHER_REMOVE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'shared by other'
            }
        }

        case 'SHOW_TEMPLATE_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'template'
            }
        }

        case 'SHOW_TEMPLATE_NOTES_POPUP': {
            return {
                ...state,
                showTemplateNotesPopup: action.payload,
            }
        }

        case 'SHOW_PDF_POPUP': {
            return {
                ...state,
                showPDFPopup: true,
            }
        }

        case 'HIDE_PDF_POPUP': {
            return {
                ...state,
                showPDFPopup: false,
            }
        }

        case 'SHOW_PPT_POPUP': {
            return {
                ...state,
                showPPTPopup: true,
            }
        }

        case 'HIDE_PPT_POPUP': {
            return {
                ...state,
                showPPTPopup: false,
            }
        }

        case 'SHOW_INFO_POPUP': {
            return {
                ...state,
                showInfoPopup: true,
                infoText: action.payload.infoText,
                xPosition: action.payload.xPosition,
                yPosition: action.payload.yPosition,
            }
        }

        case 'HIDE_INFO_POPUP': {
            return {
                ...state,
                showInfoPopup: false,
                infoText: '',
                yPosition: '',
            }
        }

        case 'SHOW_TEMPLATE_NAME_POPUP': {
            return {
                ...state,
                showTemplateNamePopup: true,
            }
        }

        case 'HIDE_TEMPLATE_NAME_POPUP': {
            return {
                ...state,
                showTemplateNamePopup: false,
            }
        }

        case 'SHOW_MODEL_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'model'
            }
        }

        case 'SHOW_MODEL_BLOCK_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload.itemIDs,
                confirmItemMessage: action.payload.message,
                confirmBlockBulkDelete: undefined,
                confirmItemName: 'modelBlock'
            }
        }

        case 'SHOW_ROLE_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'role'
            }
        }



        case 'SHOW_COMPANY_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'company'
            }
        }

        case 'SHOW_MATERIAL_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'material'
            }
        }

        case 'SHOW_TAG_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'tag'
            }
        }

        case 'SHOW_CATEGORY_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'category'
            }
        }


        case 'SHOW_USER_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'user'
            }
        }

        case 'SHOW_INPUTS_BULK_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload.itemIDs,
                confirmItemMessage: action.payload.message,
                confirmInputBulkDelete: undefined,
                confirmItemName: 'delete_block_inputs'
            }
        }

        case 'SET_CONFIRM_INPUT_BULK_DELETE': {
            return {
                ...state,
                confirmInputBulkDelete: action.payload,
            }
        }

        case 'SET_CONFIRM_BLOCK_BULK_DELETE': {
            return {
                ...state,
                confirmBlockBulkDelete: action.payload,
            }
        }

        case 'SHOW_INVOICE_SETTINGS_DELETE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: true,
                confirmYes: false,
                confirmNo: false,
                confirmItemId: action.payload,
                confirmItemName: 'invoice_settings'
            }
        }

        case 'SHOW_NOTIFICATION_POPUP': {
            return {
                ...state,
                showNotificationPopup: true,
                notificationMessage: action.payload
            }
        }

        case 'HIDE_NOTIFICATION_POPUP': {
            return {
                ...state,
                showNotificationPopup: false,
                notificationMessage: null,
            }
        }

        case 'SHOW_SUCCESS': {
            return {
                ...state,
                showSuccess: action.payload
            }
        }

        case 'HIDE_SHOW_SUCCESS': {
            return {
                ...state,
                showSuccess: undefined
            }
        }


        case 'HIDE_CONFIRM_POPUP': {
            return {
                ...state,
                showPopup: false,
                showBlockUnblockPopup: false,
                confirmItemName: null,
                confirmItemId: null,
                confirmItemMessage: undefined,
            }
        }

        default:
            return state;
    }
};

export default popupReducer;


