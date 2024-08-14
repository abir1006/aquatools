import axios from "axios";
import TokenService from "../../Services/TokenServices";


let cancelToken;

export const setGeneticsModelResult = (allInputObject, allCases, pageName) => async dispatch => {

    //Check if there are any previous pending requests
    if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel("Operation canceled due to new request.")
    }

    // call excel calculation API
    try {
        let data = allInputObject;
        data.total_cases = allCases.length;
        data.genetics_produksjonsmodell_antall_smolt_case1 = data.genetics_produksjonsmodell_antall_smolt_case1.toString().split(' ').join('');

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        let apiUrl = 'api/genetics/calculation';
        if (Boolean(pageName)) {
            apiUrl = 'api/genetics/calculation?pageName=' + pageName;
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
            slaktevektRundKg: 'average_weight_at_slaughter_kg',
            slaktevolumHOGTonn: 'slaughter_volume_hog_tonn',
            efcr: 'economic_feed_conversion_ratio_efcr',
            prodkostPerKg: 'production_cost_nok_kg',
            driftsResultatNOK1000: 'operating_profit_nok_1000',
            LakseprisNOKPerKg: 'average_salmon_price_nok_kg',
        };

        let graphFinalOutput = {
            slaktevektRundKg: {},
            slaktevolumHOGTonn: {},
            efcr: {},
            prodkostPerKg: {},
            driftsResultatNOK1000: {},
            LakseprisNOKPerKg: {},
            nytteKostRatio1: {},
            nytteKostRatio2: {},
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
                graphFinalOutput[index]['Case' + caseNo] = parseFloat(resultStr.split(',').join('')).toFixed(2);
            }
        });

        let graphBaseValue = {
            slaktevektRundKg: 0,
            slaktevolumHOGTonn: 0,
            efcr: 0,
            prodkostPerKg: 40,
            driftsResultatNOK1000: 0,
            LakseprisNOKPerKg: 30,
        };

        dispatch({type: 'SET_GRAPH_BASE_VALUE', payload: graphBaseValue});
        dispatch({type: 'SET_GRAPH_OUTPUT', payload: graphFinalOutput});
        dispatch({type: 'SET_PDF_OUTPUT', payload: printPDF});
        dispatch({type: 'SET_GRAPH_OUTPUT_LABEL', payload: graphOutputLabel});

        // set default snittvekt and CV input for price module from EM3
        dispatch({type: 'SET_PRICE_MODULE_SNITTVEKT', payload: priceModuleSnittvekt});
        dispatch({type: 'SET_PRICE_MODULE_CV', payload: priceModuleCV});

    } catch (error) {
        console.log(error);
    }
}
