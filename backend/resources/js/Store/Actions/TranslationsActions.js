import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { hideContentSpinner, showContentSpinner } from "./spinnerActions";
import { showSuccessMessage } from "../../Store/Actions/popupActions";
import { isNull } from "lodash";
import { useTranslation } from "react-i18next";

export const showTranslationDeleteConfirmPopup = id => dispatch => {
    dispatch({ type: 'SHOW_TRANSLATION_DELETE_CONFIRM_POPUP', payload: id })
}
export const hideTranslationForms = () => dispatch => {
    dispatch({ type: 'HIDE_ADD_EDIT_TRANSLATION' })
}

export const showImportTranslationForm = () => dispatch => {
    dispatch({ type: 'SHOW_IMPORT_TRANSLATION' })
}

export const showAddTranslationForm = () => dispatch => {
    dispatch({ type: 'SHOW_ADD_TRANSLATION' })
}

export const showEditTranslationForm = () => dispatch => {
    dispatch({ type: 'SHOW_EDIT_TRANSLATION' })
}

export const setSelectedItem = item => dispatch => {
    dispatch({ type: 'SET_SELECTED_TRANSLATION', payload: item })
}

export const setSelectedLang = code => dispatch => {
    dispatch({ type: 'SET_SELECTED_LANG', payload: code })
}

export const importTranslation = (data) => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/translations/import',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage(response.data.message));
                dispatch(fetchItems());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}


export const updateTranslation = (id, data) => dispatch => {


    return new Promise((resolve, reject) => {

        axios.put('/api/translations/' + id,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_updated'));
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}


export const saveTranslation = data => dispatch => {


    return new Promise((resolve, reject) => {

        axios.post('/api/translations',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage('successfully_saved'));
                dispatch(fetchItems());
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const fetchItems = (pageNumber = 1, q = '') => dispatch => {

    dispatch(showContentSpinner());

    let url = 'api/translations';

    if (pageNumber !== undefined || pageNumber !== 0) {
        url = url + '?page=' + pageNumber + '&q=' + q;
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

                response = response.data;

                dispatch({ type: 'SET_TRANSLATION_LIST', payload: response.data.data });

                const paginationData = {
                    currentPage: response.data.current_page,
                    perPage: response.data.per_page,
                    totalRecord: response.data.total,
                }

                dispatch({ type: 'SET_TRANSLATION_PAGINATION_DATA', payload: paginationData })

                dispatch(hideContentSpinner());
                return resolve(response);

            }).catch(error => {
                dispatch(hideContentSpinner());
                return reject(error.response);

            });

    });
}

export const fetchLanguages = (setDefault = null) => dispatch => {



    let url = 'api/translations/languages';

    return new Promise((resolve, reject) => {

        axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                const list = response.data.data;

                dispatch({ type: 'SET_LANGUAGE_LIST', payload: list });

                //set default lang
                if (!isNull(setDefault)) {
                    const defaultLang = list.find(x => x.default == true);
                    const code = defaultLang?.code;
                    if (code) {
                        dispatch(setSelectedLang(code));
                    }
                }

                return resolve(response);

            }).catch(error => {
                return reject(error.response);

            });

    });
}


