import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showSuccessMessage, showTemplateNotesPopup} from "./popupActions";
import { hideContentSpinner, showContentSpinner } from "./spinnerActions";
import {setSelectedTemplate} from "./TemplateActions";

export const getTemplateNote = ( selectedTemplate, data ) => async dispatch => {
    try {
        const res = await axios.get(
            'api/template_notes/list',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                params: data
            });
        // response
        const tData = selectedTemplate;
        tData['notes'] = res?.data?.notes || ''
        tData['noteID'] = res.data.id
        dispatch(setSelectedTemplate(tData))
        // dispatch(templateList(data.tool_id, data.user_id));
        // dispatch(showSuccessMessage('successfully_saved'));

    } catch (error) {
        console.log(error.response.data);
    }
}

export const saveTemplateNote = ( selectedTemplate, data ) => async dispatch => {
    dispatch(showContentSpinner())
    try {
        const res = await axios.post(
            'api/template_notes/save',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        const tData = selectedTemplate;
        console.log(res.data.data)
        tData['notes'] = res?.data?.data?.notes || ''
        tData['noteID'] = res.data?.data?.id || undefined
        dispatch(setSelectedTemplate(tData))
        dispatch(hideContentSpinner())
        dispatch(showTemplateNotesPopup(false))

    } catch (error) {
        dispatch(hideContentSpinner())
    }
}

export const updateTemplateNote = ( selectedTemplate, data ) => async dispatch => {
    dispatch(showContentSpinner())
    try {
        const res = await axios.put(
            'api/template_notes/update',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        const tData = selectedTemplate;
        tData['notes'] = res?.data?.notes || ''
        tData['noteID'] = res.data.id
        dispatch(setSelectedTemplate(tData))
        dispatch(hideContentSpinner())
        dispatch(showTemplateNotesPopup(false))

    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner())
    }
}

