import axios from "axios";
import TokenService from "../../Services/TokenServices";
import { showSuccess, showSuccessMessage } from "./popupActions";

export const setTemperatureModuleInputs = inputObj => dispatch => {
    dispatch({ type: 'SET_TEMPERATURE_MODULE_INPUTS', payload: inputObj })
}

export const resetTemperatureModuleInputs = () => dispatch => {
    dispatch({ type: 'RESET_TEMPERATURE_MODULE_INPUTS' })
}

export const listTemperatureTemplates = () => async dispatch => {
    try {
        const templateListResponse = await axios.post('api/temperature/template/list',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        dispatch({ type: 'SET_TEMPERATURE_TEMPLATES', payload: templateListResponse.data })

    } catch (error) {
        console.log(error.response.data);
    }
}

export const setTemperatureFromTemplateDropdown = id => async dispatch => {

    try {

        await axios.get(`api/temperature/${id}`,

            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then((temperatureResponse) => {

                console.log(temperatureResponse.data.data.template_data);

                dispatch(setTemperatureModuleOutput({
                    temperature_data: temperatureResponse.data.data.template_data
                }));
                dispatch(hideTemperatureModuleSpinner());
            });



    } catch (error) {


        dispatch(setTemperatureModuleOutput({
            temperature_data: undefined
        }));

        dispatch(setTemperatureModuleError(error.response.data.message));
    }
}

export const fetchTemperatureFromBarentsWatch = data => async dispatch => {
    dispatch(setTemperatureModuleError(''));
    dispatch(showTemperatureModuleSpinner());
    try {
        const temperatureResponse = await axios.post('api/temperature/fetch',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        console.log(temperatureResponse.data.data.temperature_data);

        dispatch(setTemperatureModuleOutput({
            temperature_data: temperatureResponse.data.data.temperature_data
        }));
        dispatch(hideTemperatureModuleSpinner());

    } catch (error) {
        dispatch(hideTemperatureModuleSpinner());
        dispatch(setTemperatureModuleOutput({
            temperature_data: undefined
        }));
        console.log(error.response.data);
        dispatch(setTemperatureModuleError(error.response.data.message));
    }
}


export const saveTemperatureAsTemplate = data => async dispatch => {
    try {
        const templateSaveResponse = await axios.post('api/temperature/template/save',
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then((templateSaveResponse) => {
                dispatch(listTemperatureTemplates());
                //dispatch(showSuccess(templateSaveResponse.data.message));
            });




    } catch (error) {
        console.log(error.response.data);
    }
}

export const setTemperatureModuleOutput = inputObj => dispatch => {
    dispatch({ type: 'SET_TEMPERATURE_MODULE_OUTPUTS', payload: inputObj })
}

export const resetTemperatureModule = () => dispatch => {
    dispatch({ type: 'RESET_TEMPERATURE_MODULE_INPUTS' });
    dispatch({ type: 'RESET_TEMPERATURE_MODULE_OUTPUTS' });
    dispatch({ type: 'SET_TEMPERATURE_TEMPLATES', payload: undefined })
    dispatch({ type: 'TEMPERATURE_MODULE_ERROR', payload: undefined });
}

export const resetTemperatureModuleOutputs = () => dispatch => {
    dispatch({ type: 'RESET_TEMPERATURE_MODULE_OUTPUTS' })
}

export const showTemperatureModuleSpinner = () => dispatch => {
    dispatch({ type: 'SHOW_TEMPERATURE_MODULE_SPINNER' })
}

export const hideTemperatureModuleSpinner = () => dispatch => {
    dispatch({ type: 'HIDE_TEMPERATURE_MODULE_SPINNER' })
}
export const setTemperatureModuleError = message => dispatch => {
    dispatch({ type: 'TEMPERATURE_MODULE_ERROR', payload: message });
}
