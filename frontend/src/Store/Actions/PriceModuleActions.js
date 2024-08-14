import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {setModelScreenInputs} from "./MTBActions";

export const setPriceModuleDefaultInputs = caseNumbers => dispatch => {
    const cvDefault = 22;
    caseNumbers.map(caseNo => {
        dispatch(setPriceModuleInputs(
            {['price_module_cv_case' + caseNo]: cvDefault}
        ));
        dispatch(setPriceModuleInputs(
            {['lakse_pris_percentage_case' + caseNo]: 100}
        ));
    })
}

let cancelToken;

export const priceModuleResult = (priceModuleInputs, caseNumbers, modelSlug) => async dispatch => {

    //Check if there are any previous pending requests
    if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel("Operation canceled due to new request.")
    }

    try {
        priceModuleInputs.total_cases = caseNumbers.length;

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        const priceModuleResult = await axios.post(
            'api/mtb/price_module_excel_calculation', priceModuleInputs,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                cancelToken: cancelToken.token
            });

        const priceModuleExcelOutput = priceModuleResult.data;

        let priceModuleOutput = {}
        caseNumbers.map(caseNo => {
            const laksePrice = priceModuleExcelOutput['case' + caseNo]['result']['snittpris'];
            const verdi = priceModuleExcelOutput['case' + caseNo]['result']['verdi'];
            priceModuleOutput['price_module_snittpris_case' + caseNo] = laksePrice;
            priceModuleOutput['price_module_verdi_case' + caseNo] = verdi;
        });

        priceModuleOutput.price_module_avg_lakse_price = priceModuleExcelOutput['case1']['result']['gjennomsnittligLaksepris'];
        priceModuleOutput.price_module_forward_lakse_price = priceModuleExcelOutput['case1']['result']['forwardLaksepris'];
        priceModuleOutput.price_module_justert_forward_lakse_price = priceModuleExcelOutput['case1']['result']['justertForwardLaksepris'];
        priceModuleOutput.historic_start_year = priceModuleExcelOutput['case1']['result']['historic_start_year'];
        priceModuleOutput.historic_start_week = priceModuleExcelOutput['case1']['result']['historic_start_week'];
        priceModuleOutput.historic_end_year = priceModuleExcelOutput['case1']['result']['historic_end_year'];
        priceModuleOutput.historic_end_week = priceModuleExcelOutput['case1']['result']['historic_end_week'];
        priceModuleOutput.forward_start_year = priceModuleExcelOutput['case1']['result']['forward_start_year'];
        priceModuleOutput.forward_start_month = priceModuleExcelOutput['case1']['result']['forward_start_month'];
        priceModuleOutput.forward_end_year = priceModuleExcelOutput['case1']['result']['forward_end_year'];
        priceModuleOutput.forward_end_month = priceModuleExcelOutput['case1']['result']['forward_end_month'];

        dispatch({type: 'SET_PRICE_MODULE_OUTPUTS', payload: priceModuleOutput})

    } catch (error) {
        console.log(error);
    }
}

export const addMTBLaksePrice = (priceModuleSnittpris, caseNumbers, modelSlug, priceModuleInputs) => async dispatch => {
    await caseNumbers.map(caseNo => {
        let laksePriceInput = {};
        let cvInput = {};
        if (modelSlug === 'kn_for') {
            laksePriceInput['kn_for_konomi_laksepris_case' + caseNo] = priceModuleSnittpris['price_module_snittpris_case' + caseNo]
        }
        if (modelSlug === 'mtb') {
            cvInput['mtb_biologi_cv_case' + caseNo] = priceModuleInputs['price_module_cv_case' + caseNo];
            dispatch(setModelScreenInputs(cvInput));
            laksePriceInput['mtb_priser_laksepris_case' + caseNo] = priceModuleSnittpris['price_module_snittpris_case' + caseNo];
        }
        if (modelSlug === 'optimalisering') {
            laksePriceInput['optimalisering_produksjonsmodell_laksepris_case' + caseNo] = priceModuleSnittpris['price_module_snittpris_case' + caseNo];
        }
        if (modelSlug === 'vaksinering') {
            laksePriceInput['vaksinering_produksjonsmodell_laksepris_case' + caseNo] = priceModuleSnittpris['price_module_snittpris_case' + caseNo];
        }

        if (modelSlug === 'cost_of_disease') {
            laksePriceInput['cost_of_disease_produksjonsmodell_laksepris_case' + caseNo] = priceModuleSnittpris['price_module_snittpris_case' + caseNo];
        }

        if (modelSlug === 'genetics') {
            laksePriceInput['genetics_produksjonsmodell_laksepris_case' + caseNo] = priceModuleSnittpris['price_module_snittpris_case' + caseNo];
        }

        dispatch(setModelScreenInputs(laksePriceInput));
    })
}

export const setPriceModuleInputs = inputObj => dispatch => {
    dispatch({type: 'SET_PRICE_MODULE_INPUTS', payload: inputObj})
}

export const takePriceModuleCVFrom = valueFrom => dispatch => {
    dispatch({type: 'TAKE_PRICE_MODULE_CV_FROM', payload: valueFrom})
}

export const takePriceModuleSnittvektFrom = valueFrom => dispatch => {
    dispatch({type: 'TAKE_PRICE_MODULE_SNITTVEKT_FROM', payload: valueFrom})
}

export const resetPriceModuleInputs = () => dispatch => {
    dispatch({type: 'RESET_PRICE_MODULE_INPUTS'})
}

export const reloadPriceModuleDefaultInputs = (defaultInputs, caseNumbers, modelSlug) => dispatch => {
    caseNumbers.map(caseNo => {
        const inputObj1 = {
            ['price_module_snittvekt_case' + caseNo]: defaultInputs['case' + caseNo]['snittvekt']
        }
        const inputObj2 = {
            ['price_module_cv_case' + caseNo]: defaultInputs['case' + caseNo]['cv']
        }

        dispatch({type: 'SET_PRICE_MODULE_INPUTS', payload: inputObj1})
        dispatch({type: 'SET_PRICE_MODULE_INPUTS', payload: inputObj2})
    });
}

export const setPriceModuleCurrentModel = modelSlug => dispatch => {
    dispatch({type: 'SET_PRICE_MODULE_CURRENT_MODEL', payload: modelSlug})
}
