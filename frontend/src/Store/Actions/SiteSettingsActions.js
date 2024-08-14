import { showSuccessMessage } from "../../Store/Actions/popupActions";
import AT2Client from "../../Api/AT2Client";
import axios from "axios";
import TokenService from "../../Services/TokenServices";


export const fetchSettings = () => dispatch => {


    let url = 'api/site-settings/list';

    return new Promise((resolve, reject) => {

        axios.get(url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch({ type: 'SET_SETTINGS_DATA', payload: response.data.data });
                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}

export const saveTranslationSettings = (data) => dispatch => {


    let url = 'api/site-settings/translation';

    return new Promise((resolve, reject) => {

        axios.post(url, data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then(response => {

                dispatch(showSuccessMessage(response.data.message));
                dispatch(fetchSettings());

                return resolve(response);

            }).catch(error => {

                console.log(error);
                return reject(error.response);

            });

    });
}
