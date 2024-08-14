import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {showSuccessMessage} from "./popupActions";
import {hideContentSpinner, showContentSpinner} from "./spinnerActions";
import AT2Client from "../../Api/AT2Client";

export const setSelectedTemplate = data => async dispatch => {
    dispatch({type: 'SET_SELECTED_TEMPLATE', payload: data})
}

export const renameTemplate = (id, name) => async dispatch => {

    const url = `/template/${id}/rename`;
    const data = {name: name};

    return AT2Client.post(url, data);

}

export const companyListByToolAccess = modelID => async dispatch => {
    try {
        const listResponse = await axios.post(
            'api/company/list_by_tool_access', {
                tool_id: modelID
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_COMPANY_DATA', payload: listResponse.data})
    } catch (error) {
        console.log(error.response.data);
    }
}

export const saveTemplate = data => async dispatch => {
    try {
        const templateSaveResponse = await axios.post(
            'api/template/save', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        await dispatch(templateList(data.tool_id, data.user_id));
        await dispatch(showSuccessMessage('successfully_saved'));
        console.log(templateSaveResponse.data.data)
        await dispatch(setSelectedTemplate({
            id: templateSaveResponse.data.data.id,
            name: templateSaveResponse.data.data.name,
            user_id: templateSaveResponse.data.data.user_id,
            hasWriteAccess: templateSaveResponse?.data?.data?.user_id || false,
            action: 'template_saved'
        }))

    } catch (error) {
        console.log(error.response.data);
        const errorsObj = error.response.data.errors;
        const errorMessage = errorsObj[Object.keys(errorsObj)[0]];
        if (Object.keys(errorsObj)[0] === 'name') {
            await dispatch(setTemplateNameErrorMessage(errorMessage))
        }
    }
}

export const templateList = (modelId, userId) => async dispatch => {
    try {
        const templateListResponse = await axios.post(
            'api/template/list_dropdown', {
                tool_id: modelId,
                user_id: userId,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'SET_MODEL_TEMPLATES_DATA', payload: templateListResponse.data});

    } catch (error) {
        console.log(error.response.data);
    }
}


export const templateListAll = (pageNumber, sort = null) => async dispatch => {
    dispatch(showAllTemplateContentSpinner());

    let url = 'api/template/all_saved_template_list';

    if (pageNumber !== undefined || pageNumber !== 0) {
        url = url + '?page=' + pageNumber;
    }

    // sorting
    if (Boolean(sort)) {
        let s = url.includes("?") ? '&' : '?';
        s = s + Object.keys(sort).map(x => x + '=' + sort[x]).join('&');
        url = url + s;
    }

    try {
        const templateListAllResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'SET_ALL_TEMPLATES_DATA', payload: templateListAllResponse.data.data});
        const paginationData = {
            currentPage: templateListAllResponse.data.current_page,
            perPage: templateListAllResponse.data.per_page,
            totalRecord: templateListAllResponse.data.total,
        }

        dispatch({type: 'SET_ALL_TEMPLATES_PAGINATION_DATA', payload: paginationData});
        dispatch(hideAllTemplateContentSpinner());

    } catch (error) {
        dispatch(hideAllTemplateContentSpinner());
        console.log(error.response.data);
    }
}


export const myTemplateList = (pageNumber, sort = null, pageName) => async dispatch => {

    dispatch(showMyTemplateContentSpinner());

    let url = 'api/template/own_template_list';

    url = url + '?page=' + pageNumber;

    // sorting
    if (Boolean(sort)) {
        let s = url.includes("?") ? '&' : '?';
        s = s + Object.keys(sort).map(x => x + '=' + sort[x]).join('&');
        url = url + s;
    }

    if (Boolean(pageName)) {
        url = url + '&pageName=' + pageName;
    }


    try {
        const myTemplateListResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'SET_MY_TEMPLATES_DATA', payload: myTemplateListResponse.data.data});
        const paginationData = {
            currentPage: myTemplateListResponse.data.current_page,
            perPage: myTemplateListResponse.data.per_page,
            totalRecord: myTemplateListResponse.data.total,
        }

        dispatch({type: 'SET_MY_TEMPLATES_PAGINATION_DATA', payload: paginationData});
        dispatch(hideMyTemplateContentSpinner());

    } catch (error) {
        dispatch(hideMyTemplateContentSpinner());
        console.log(error.response.data);
    }
}


export const allTemplateSearch = searchStr => async dispatch => {
    dispatch(showAllTemplateContentSpinner());
    try {
        const allTemplateSearchResponse = await axios.post(
            'api/template/all_saved_template_list_search', {
                search: searchStr,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: allTemplateSearchResponse.data.current_page,
            perPage: allTemplateSearchResponse.data.per_page,
            totalRecord: allTemplateSearchResponse.data.total,
        }
        dispatch({type: 'SET_ALL_TEMPLATES_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'SET_ALL_TEMPLATES_DATA', payload: allTemplateSearchResponse.data.data})
        dispatch(hideAllTemplateContentSpinner());

    } catch (error) {
        dispatch(hideAllTemplateContentSpinner());
        console.log(error.response.data);
    }
}

export const myTemplateSearch = searchStr => async dispatch => {
    dispatch(showMyTemplateContentSpinner());
    try {
        const myTemplateSearchResponse = await axios.post(
            'api/template/own_template_list_search', {
                search: searchStr,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: myTemplateSearchResponse.data.current_page,
            perPage: myTemplateSearchResponse.data.per_page,
            totalRecord: myTemplateSearchResponse.data.total,
        }
        dispatch({type: 'SET_MY_TEMPLATES_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'SET_MY_TEMPLATES_DATA', payload: myTemplateSearchResponse.data.data})
        dispatch(hideMyTemplateContentSpinner());

    } catch (error) {
        dispatch(hideAllTemplateContentSpinner());
        console.log(error.response.data);
    }
}

export const templateUserList = (templateId, companyID, pageNumber) => async dispatch => {

    if (templateId === undefined || templateId === null || templateId === '') {
        return false;
    }

    let url = 'api/template/user_list';

    if (pageNumber !== undefined && pageNumber !== 0) {
        url = url + '?page=' + pageNumber;
    }

    dispatch(showContentSpinner());

    try {
        const data = {
            template_id: templateId
        }

        if (companyID !== undefined && companyID !== '') {
            data.company_id = companyID
        }

        const templateUserListResponse = await axios.post(
            url, data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: templateUserListResponse.data.current_page,
            perPage: templateUserListResponse.data.per_page,
            totalRecord: templateUserListResponse.data.total,
        }

        dispatch({type: 'SET_TEMPLATE_USERS_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'SET_TEMPLATE_USERS_DATA', payload: templateUserListResponse.data.data})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
        console.log(error.response.data);
    }
}


export const templateUserSearch = (templateId, searchStr) => async dispatch => {
    dispatch(showContentSpinner());
    try {
        const templateUserSearchResponse = await axios.post(
            'api/template/user_list_search', {
                template_id: templateId,
                search: searchStr,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: templateUserSearchResponse.data.current_page,
            perPage: templateUserSearchResponse.data.per_page,
            totalRecord: templateUserSearchResponse.data.total,
        }
        dispatch({type: 'SET_TEMPLATE_USERS_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'SET_TEMPLATE_USERS_DATA', payload: templateUserSearchResponse.data.data})
        dispatch(hideContentSpinner());

    } catch (error) {
        dispatch(hideContentSpinner());
        console.log(error.response.data);
    }
}


export const shareTemplate = (data, pageNo) => async dispatch => {
    dispatch(showShareButtonSpinner());
    try {
        const shareTemplateResponse = await axios.post(
            'api/template/share', data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch(hideShareButtonSpinner());
        dispatch(showSuccessMessage('successfully_shared'));
        let companyID = '';
        if (data.company_id !== undefined || data.company_id !== '') {
            companyID = data.company_id;
        }
        dispatch(templateUserList(data.template_id, companyID, pageNo));

    } catch (error) {
        dispatch(hideShareButtonSpinner());
        console.log(error.response.data);
    }
}

export const removeSharedByMe = (shareId, pageNo) => async dispatch => {
    try {
        const removeResponse = await axios.delete(
            'api/template/remove_share', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: {
                    id: shareId
                }
            });
        // response
        dispatch(showSuccessMessage('successfully_removed'));
        dispatch(allSharedByMeTemplatesData(pageNo));

    } catch (error) {
        console.log(error.response.data);
    }
}

export const removeSharedWithMe = (shareId, pageNo) => async dispatch => {
    try {
        const removeResponse = await axios.delete(
            'api/template/remove_share', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: {
                    id: shareId
                }
            });
        // response
        dispatch(showSuccessMessage('successfully_removed'));
        dispatch(allSharedWithMeTemplatesData(pageNo));

    } catch (error) {
        console.log(error.response.data);
    }
}

export const allSharedByMeTemplatesData = (pageNumber, sort = null) => async dispatch => {

    dispatch(showSharedByMeTemplateContentSpinner());

    let url = 'api/template/shared_by_me_template_list';

    //console.log(pageNumber);

    if (pageNumber !== undefined && pageNumber !== 0) {
        url = url + '?page=' + pageNumber;
    }

    // sorting
    if (Boolean(sort)) {
        let s = url.includes("?") ? '&' : '?';
        s = s + Object.keys(sort).map(x => x + '=' + sort[x]).join('&');
        url = url + s;
    }


    try {
        const allSharedByMeTemplateResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch(hideSharedByMeTemplateContentSpinner());
        const paginationData = {
            currentPage: allSharedByMeTemplateResponse.data.current_page,
            perPage: allSharedByMeTemplateResponse.data.per_page,
            totalRecord: allSharedByMeTemplateResponse.data.total,
        }
        dispatch({type: 'SET_ALL_SHARED_BY_ME_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'ALL_SHARED_BY_ME_TEMPLATE_DATA', payload: allSharedByMeTemplateResponse.data.data});


    } catch (error) {
        dispatch(hideSharedByMeTemplateContentSpinner());
        console.log(error.response.data);
    }
}


export const sharedByMeTemplateSearch = searchStr => async dispatch => {
    dispatch(showSharedByMeTemplateContentSpinner());
    try {
        const searchResponse = await axios.post(
            'api/template/shared_by_me_template_list_search', {
                search: searchStr,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: searchResponse.data.current_page,
            perPage: searchResponse.data.per_page,
            totalRecord: searchResponse.data.total,
        }

        dispatch({type: 'SET_SHARED_BY_ME_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'ALL_SHARED_BY_ME_TEMPLATE_DATA', payload: searchResponse.data.data});
        dispatch(hideSharedByMeTemplateContentSpinner());

    } catch (error) {
        dispatch(hideSharedByMeTemplateContentSpinner());
        console.log(error.response.data);
    }
}

export const allSharedWithMeTemplatesData = (pageNumber, sort = null) => async dispatch => {

    dispatch(showSharedWithMeTemplateContentSpinner());

    let url = 'api/template/shared_with_me_template_list';

    if (pageNumber !== undefined && pageNumber !== 0) {
        console.log(pageNumber)
        url = url + '?page=' + pageNumber;
    }

    // sorting
    if (Boolean(sort)) {
        let s = url.includes("?") ? '&' : '?';
        s = s + Object.keys(sort).map(x => x + '=' + sort[x]).join('&');
        url = url + s;
    }

    try {
        const templateResponse = await axios.post(
            url, {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch(hideSharedWithMeTemplateContentSpinner());
        const paginationData = {
            currentPage: templateResponse.data.current_page,
            perPage: templateResponse.data.per_page,
            totalRecord: templateResponse.data.total,
        }
        dispatch({type: 'SET_SHARED_WITH_ME_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'ALL_SHARED_WITH_ME_TEMPLATE_DATA', payload: templateResponse.data.data});


    } catch (error) {
        dispatch(hideSharedWithMeTemplateContentSpinner());
        console.log(error.response.data);
    }
}


export const sharedWithMeTemplateSearch = searchStr => async dispatch => {

    dispatch(showSharedWithMeTemplateContentSpinner());
    try {
        const searchResponse = await axios.post(
            'api/template/shared_with_me_template_list_search', {
                search: searchStr,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        const paginationData = {
            currentPage: searchResponse.data.current_page,
            perPage: searchResponse.data.per_page,
            totalRecord: searchResponse.data.total,
        }

        dispatch({type: 'SET_SHARED_WITH_ME_PAGINATION_DATA', payload: paginationData})
        dispatch({type: 'ALL_SHARED_WITH_ME_TEMPLATE_DATA', payload: searchResponse.data.data});
        dispatch(hideSharedWithMeTemplateContentSpinner());

    } catch (error) {
        dispatch(hideSharedWithMeTemplateContentSpinner());
        console.log(error.response.data);
    }
}

export const setTemplateNameErrorMessage = message => dispatch => {
    dispatch({type: 'SET_TEMPLATE_NAME_ERROR_MESSAGE', payload: message});
}

export const resetTemplateNameErrorMessage = () => dispatch => {
    dispatch({type: 'RESET_TEMPLATE_NAME_ERROR_MESSAGE'});
}

export const showTemplateSharingScreen = () => dispatch => {
    dispatch({type: 'SHOW_TEMPLATE_SHARING_SCREEN'});
}

export const hideTemplateSharingScreen = () => dispatch => {
    dispatch({type: 'HIDE_TEMPLATE_SHARING_SCREEN'});
}

export const setSharedTemplate = (templateID, templateName, modelID, modelName) => dispatch => {
    dispatch({
        type: 'SET_SHARED_TEMPLATE', payload: {
            id: templateID, name: templateName,
            modelID: modelID,
            modelName: modelName
        }
    });
}

export const showAllTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'SHOW_ALL_TEMPLATES_CONTENT_SPINNER'})
}

export const hideAllTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'HIDE_ALL_TEMPLATES_CONTENT_SPINNER'})
}

export const showMyTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'SHOW_MY_TEMPLATES_CONTENT_SPINNER'})
}

export const hideMyTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'HIDE_MY_TEMPLATES_CONTENT_SPINNER'})
}

export const showSharedByMeTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'SHOW_SHARED_BY_ME_TEMPLATES_CONTENT_SPINNER'})
}

export const hideSharedByMeTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'HIDE_SHARED_BY_ME_TEMPLATES_CONTENT_SPINNER'})
}

export const showSharedWithMeTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'SHOW_SHARED_WITH_ME_TEMPLATES_CONTENT_SPINNER'})
}

export const hideSharedWithMeTemplateContentSpinner = () => dispatch => {
    dispatch({type: 'HIDE_SHARED_WITH_ME_TEMPLATES_CONTENT_SPINNER'})
}

export const showTemplateDeleteConfirmPopup = templateId => dispatch => {
    dispatch({type: 'SHOW_TEMPLATE_DELETE_CONFIRM_POPUP', payload: templateId})
}

export const showShareButtonSpinner = () => dispatch => {
    dispatch({type: 'SHOW_SHARE_BUTTON_SPINNER'})
}

export const hideShareButtonSpinner = () => dispatch => {
    dispatch({type: 'HIDE_SHARE_BUTTON_SPINNER'})
}

