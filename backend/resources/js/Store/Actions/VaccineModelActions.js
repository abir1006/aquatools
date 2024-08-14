import axios from "axios";
import TokenService from "../../Services/TokenServices";

export const setVaccineCaseLabels = (budgetName, diseaseName) => dispatch => {
    const budgetBlockName = Boolean(budgetName) === false ? 'budget' : budgetName;
    const diseaseBlockName = Boolean(diseaseName) === false ? 'disease' : diseaseName;
    const vaccineCaseLabels = {
        3: {Case1: budgetBlockName, Case2: diseaseBlockName, Case3: 'vacc_a'},
        4: {Case1: budgetBlockName, Case2: diseaseBlockName, Case3: 'vacc_a', Case4: 'vacc_b'},
        5: {Case1: budgetBlockName, Case2: diseaseBlockName, Case3: 'vacc_a', Case4: 'vacc_b', Case5: 'vacc_c'},
    };

    dispatch({type: 'SET_VACCINE_CASE_NAMES', payload: vaccineCaseLabels})
}

export const setVaccineNames = vaccineNames => dispatch => {
    dispatch({type: 'SET_VACCINE_NAMES', payload: vaccineNames})
}

export const addVaccineNames = () => async dispatch => {
    await dispatch({type: 'ADD_VACCINE_NAMES'})
}

export const removeVaccineNames = () => async dispatch => {
    await dispatch({type: 'REMOVE_VACCINE_NAMES'})
}


let cancelToken;

export const setVaccineModelResult = (allInputObject, allCases, pageName) => async dispatch => {

    //Check if there are any previous pending requests
    if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel("Operation canceled due to new request.")
    }

    // call excel calculation API
    try {
        let data = {...allInputObject};
        // remove space from Antall smolt
        data.vaksinering_produksjonsmodell_antall_smolt_case1 = data.vaksinering_produksjonsmodell_antall_smolt_case1.toString().split(' ').join('');
        data.total_cases = allCases.length;

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        let apiUrl = 'api/vaccine/calculation';
        if (Boolean(pageName)) {
            apiUrl = 'api/vaccine/calculation?pageName=' + pageName;
        }

        const calculationResult = await axios.post(
            apiUrl, data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                cancelToken: cancelToken.token
            });

        let calculationOutput = calculationResult.data;

        const graphOutputLabel = {
            slaktevektRund: 'average_weight_at_slaughter_kg',
            tonnSloyd: 'slaughter_volume_hog_tonn',
            efcr: 'economic_feed_conversion_ratio_efcr',
            prodkostPerKg: 'production_cost_nok_kg',
            driftsResultat: 'operating_profit_nok_1000',
            lakseprisGjennomsnittKrPerkg: 'average_salmon_price_nok_kg',
            deadPercentage: 'mortality_percentage',
        };

        let graphFinalOutput = {
            slaktevektRund: {},
            tonnSloyd: {},
            efcr: {},
            prodkostPerKg: {},
            driftsResultat: {},
            biologiskeTap: {},
            okteUtgifter: {},
            nytteKostRatio1: {},
            nytteKostRatio2: {},
            lakseprisGjennomsnittKrPerkg: {},
            deadPercentage: {},
        };

        let printPDF = {};

        let priceModuleSnittvekt = {};
        let priceModuleCV = {};


        allCases.map(caseNo => {
            printPDF['case' + caseNo] = calculationOutput['case' + caseNo]['pdf'];

            priceModuleSnittvekt['Case' + caseNo] = calculationOutput['case' + caseNo]['price_module']['snittvekt'];
            priceModuleCV['Case' + caseNo] = calculationOutput['case' + caseNo]['price_module']['cv'];

            for (let index in graphFinalOutput) {
                const resultStr = calculationOutput['case' + caseNo]['graphs'][index].toString();
                graphFinalOutput[index]['Case' + caseNo] = parseFloat(resultStr.split(',').join(''));
            }
        });

        let graphBaseValue = {
            slaktevektRund: 0,
            tonnSloyd: 0,
            efcr: 1,
            prodkostPerKg: 0,
            driftsResultat: 0,
            kostnadVedSjukdom: 0,
            nytteKostRatio: 0,
            lakseprisGjennomsnittKrPerkg: 0,
            deadPercentage: 0,
        };
        dispatch({type: 'SET_GRAPH_BASE_VALUE', payload: graphBaseValue});
        dispatch({type: 'SET_GRAPH_OUTPUT', payload: graphFinalOutput});
        dispatch({type: 'SET_PDF_OUTPUT', payload: printPDF});
        dispatch({type: 'SET_GRAPH_OUTPUT_LABEL', payload: graphOutputLabel});

        // set default snittvekt and CV input for price module from EM3
        dispatch({ type: 'SET_PRICE_MODULE_SNITTVEKT', payload: priceModuleSnittvekt });
        dispatch({ type: 'SET_PRICE_MODULE_CV', payload: priceModuleCV });

    } catch (error) {
        console.log(error);
    }
}
