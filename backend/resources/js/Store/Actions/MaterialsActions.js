import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { hideContentSpinner, showContentSpinner } from "./spinnerActions";
import { showSuccessMessage } from "../../Store/Actions/popupActions";

export const showMaterialDeleteConfirmPopup = id => dispatch => {
    dispatch({ type: 'SHOW_MATERIAL_DELETE_CONFIRM_POPUP', payload: id })
}

export const showCategoryDeleteConfirmPopup = id => dispatch => {
    dispatch({ type: 'SHOW_CATEGORY_DELETE_CONFIRM_POPUP', payload: id })
}

export const showTagDeleteConfirmPopup = id => dispatch => {
    dispatch({ type: 'SHOW_TAG_DELETE_CONFIRM_POPUP', payload: id })
}

export const markasRead = id => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/materials/notification/read/' + id,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {
                dispatch({ type: 'REMOVE_NOTIFICATIONS', payload: id });
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const fetchunreadNotifications = () => dispatch => {


    return new Promise((resolve, reject) => {

        axios.get('/api/material/notifications',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                let unreadNotifications = response.data;
                if (!Array.isArray(unreadNotifications))
                    unreadNotifications = Object.values(unreadNotifications);

                console.log('unread=', unreadNotifications);

                dispatch({ type: 'SET_UNREAD_NOTIFICATIONS', payload: unreadNotifications });
                return resolve(response);

            }).catch(error => {
                dispatch(hideContentSpinner());
                return reject(error.response);

            });

    });
}


export const updateMaterial = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/material/update',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_updated'));
                dispatch(fetchMaterials());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const updateMaterialTag = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.put('/api/tags/' + data.id,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_updated'));
                dispatch(fetchMaterialTags());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const saveMaterialTag = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/tags',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_saved'));
                dispatch(fetchMaterialTags());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const updateMaterialCategory = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.put('/api/categories/' + data.id,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_updated'));
                dispatch(fetchMaterialCategories());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const saveMaterialCategory = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/categories',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_saved'));
                dispatch(fetchMaterialCategories());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const saveMaterialsOrder = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/material/saveOrder',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const saveMaterial = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/material/save',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_saved'));
                //dispatch(fetchMaterials());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const performSearch = (filters) => dispatch => {

    dispatch(showContentSpinner());

    return new Promise((resolve, reject) => {

        axios.post('/api/material/search',
            filters,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch({ type: 'SET_MATERIAL_LIST', payload: response.data.data });
                const paginationData = {
                    currentPage: response.data.current_page,
                    perPage: response.data.per_page,
                    totalRecord: response.data.total,
                }

                dispatch({ type: 'SET_MATERIAL_PAGINATION_DATA', payload: paginationData })

                dispatch(hideContentSpinner());
                return resolve(response);

            }).catch(error => {
                dispatch(hideContentSpinner());
                return reject(error.response);

            });

    });
}

export const fetchMaterialTags = (pageNumber = 1) => dispatch => {

    return new Promise((resolve, reject) => {

        axios.get('/api/tags',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch({ type: 'SET_MATERIAL_TAGS', payload: response.data });
                return resolve(response);

            }).catch(error => {

                return reject(error.response);

            });

    });
}

export const fetchMaterialCategories = (page = '') => dispatch => {

    let url = '/api/categories';
    if (Boolean(page))
        url += '?page=' + page;

    return new Promise((resolve, reject) => {

        axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch({ type: 'SET_MATERIAL_CATEGORIES', payload: response.data });
                return resolve(response);

            }).catch(error => {

                return reject(error.response);

            });

    });
}

export const fetchFeaturedMaterials = () => dispatch => {

}
export const fetchMaterials = (pageNumber = 1, all = false, featured = false) => dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/material/list';

    if (pageNumber !== undefined || pageNumber !== 0) {
        url = url + '?page=' + pageNumber;
    }

    if (all) {
        url = url.includes('?') ? url + '&all=true' : url + '?all=true';
    }

    if (featured) {
        url = url.includes('?') ? url + '&featured=true' : url + '?featured=true';
    }


    return new Promise((resolve, reject) => {

        axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                if (!Boolean(featured)) {
                    dispatch({ type: 'SET_MATERIAL_LIST', payload: response.data.data });

                    const paginationData = {
                        currentPage: response.data.current_page,
                        perPage: response.data.per_page,
                        totalRecord: response.data.total,
                    }

                    dispatch({ type: 'SET_MATERIAL_PAGINATION_DATA', payload: paginationData })
                } else {
                    dispatch({ type: 'SET_FEATURED_MATERIAL_LIST', payload: response.data.data });
                }

                dispatch(hideContentSpinner());
                return resolve(response);

            }).catch(error => {
                dispatch(hideContentSpinner());
                return reject(error.response);

            });

    });
}

export const fetchSingleMaterial = (id) => dispatch => {

    dispatch(showContentSpinner());

    return new Promise((resolve, reject) => {

        axios.get(`/api/material/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {
                dispatch(hideContentSpinner());
                return resolve(response);

            }).catch(error => {
                dispatch(hideContentSpinner());
                return reject(error.response);

            });

    });
}


