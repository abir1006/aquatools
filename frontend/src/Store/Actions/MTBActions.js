import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {hideContentSpinner} from "./spinnerActions";

export const setModelCaseText = data => dispatch => {
    dispatch({type: 'SET_MODEL_CASE_TEXT', payload: data})
}

export const unsetModelCaseText = () => dispatch => {
    dispatch({type: 'UNSET_MODEL_CASE_TEXT'})
}

export const setGraphHelpText = helpTextObj => dispatch => {
    const defaultHelpText = {
        slaktevektRundKg: '',
        slaktevolumHOGTonn: '',
        efcr: '',
        prodkostPerKg: '',
        driftsResultatNOK1000: '',
        LakseprisNOKPerKg: 'help_avg_salmon_price_graph',
        bcr: false,
        grossProfitMargin: 'gpm_help_text',
    };

    const helpText = Boolean(helpTextObj) ? helpTextObj : defaultHelpText;

    dispatch({type: 'SET_MODEL_GRAPH_HELP_TEXT', payload: helpText})

}

export const mtbBlockList = (modelSlug, companyId, userName = '') => async dispatch => {
    try {
        const blockListResponse = await axios.post(
            'api/mtb/block_list', {
                'tool_slug': modelSlug,
                'company_id': companyId
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        await dispatch({type: 'SET_MODEL_SCREEN_TOOL_ID', payload: blockListResponse.data[0].id});
        await dispatch({type: 'SET_MODEL_SCREEN_BLOCK_DATA', payload: blockListResponse.data[0].blocks});
        const blocks = blockListResponse.data[0].blocks;
        const blockList = [];
        let countIndex = 0;
        blocks.map(async block => {
            dispatch({
                type: 'SET_MODEL_SCREEN_BLOCKS_EXPAND',
                payload: {
                    slug: block.slug,
                    expand: true,
                }
            });
            dispatch({
                type: 'SET_MODEL_SCREEN_BLOCKS_STATUS',
                payload: {
                    slug: block.slug,
                    status: block.is_default === 1,
                }
            });
            block.block_inputs.map(async input => {
                await dispatch(setModelScreenInputs({
                    [input.slug + '_case1']: input.slug === 'kn_for_generell_navn' ? userName : input.default_data,
                }));
                await dispatch(setModelScreenInputs({
                    [input.slug + '_case2']: input.slug === 'kn_for_generell_navn' ? userName : input.default_data,
                }));

                if (modelSlug === 'genetics') {
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case1']: input.slug === 'genetics_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case2']: input.slug === 'genetics_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        ['name_case1']: 'Case 1',
                    }));
                    await dispatch(setModelScreenInputs({
                        ['name_case2']: 'Case 2',
                    }));

                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case2']: input.default_data,
                    }));

                    await dispatch(setModelScreenInputs({
                        ['genetics_kvalitet_prod_case1']: 5,
                    }));

                    await dispatch(setModelScreenInputs({
                        ['genetics_kvalitet_prod_case2']: '0',
                    }));
                }

                if (modelSlug === 'optimalisering') {
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case1']: input.slug === 'optimalisering_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case2']: input.slug === 'optimalisering_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        ['name_case1']: 'Case 1',
                    }));
                    await dispatch(setModelScreenInputs({
                        ['name_case2']: 'Case 2',
                    }));

                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case2']: input.default_data,
                    }));
                }

                if (modelSlug === 'vaksinering') {
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case1']: input.slug === 'vaksinering_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case2']: input.slug === 'vaksinering_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case3']: input.slug === 'vaksinering_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case3']: input.default_data,
                    }));
                }

                if (modelSlug === 'cost_of_disease') {
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case1']: input.slug === 'cost_of_disease_general_navn' ? userName : input.default_data,
                    }));
                    await dispatch(setModelScreenInputs({
                        [input.slug + '_case2']: input.slug === 'cost_of_disease_general_navn' ? userName : input.default_data,
                    }));

                }

            })
            blockList[countIndex] = {id: block.id, name: block.name, slug: block.slug, is_default: block.is_default}
            countIndex++;
        });

        dispatch({
            type: 'SET_MODEL_SCREEN_BLOCKS_EXPAND',
            payload: {
                slug: 'model_output_block',
                expand: true,
            }
        });

        dispatch({type: 'SET_MODEL_SCREEN_BLOCK_LIST', payload: blockList});
        dispatch(hideContentSpinner());
    } catch (error) {
        console.log(error.response.data);
        dispatch(hideContentSpinner());
    }
}

export const setModelScreenInputs = inputObject => async dispatch => {
    await dispatch({type: 'SET_MODEL_SCREEN_INPUTS', payload: inputObject})
}

let cancelToken;
export const setModelResult = (allInputObject, allCases, pageName = null) => async dispatch => {

    //Check if there are any previous pending requests
    if (typeof cancelToken !== typeof undefined) {
        cancelToken.cancel("Operation canceled due to new request.")
    }

    // call excel calculation API
    try {
        let data = allInputObject;
        data.total_cases = allCases.length;

        //Save the cancel token for the current request
        cancelToken = axios.CancelToken.source();

        let apiUrl = 'api/mtb/excel_calculation';
        if (Boolean(pageName)) {
            apiUrl = 'api/mtb/excel_calculation?pageName=modelScreen';
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

        const excelCalculationOutput = calculationResult.data;

        const graphOutputLabel = {
            tonnPerKonsPerAr: 'tons_per_cone_per_year',
            tonnSolgtPerSelskapPerAr: 'tons_sold_per_company_per_year',
            resultatIMill: 'results_mill',
            eFcr: 'efcr',
            prodKost: 'production_cost',
            lakseprisSnittKrPerKg: 'average_salmon_price_nok_kg',
            marginKrPerKgHOG: 'margin_nok_kg_hog',
            sgr: 'sgr', // Percentage
            dagerISjo: 'days_at_sea',
            snittvektSloyd: 'average_harvest_weight_round_hog',
            dodeAntall: 'deaths_1000',
            dodeTonn: 'døde_tonn',
            dodePerGen: 'deaths_per_gene_percentage', // Percentage
            smoltVektKg: 'smolt_weight_in_kg',
            smoltPerKonsPerAr: 'smolt_per_cons_per_year_1000',
            grossProfitMargin: 'gross_profit_margin_percentage'
        };

        let graphFinalOutput = {
            tonnPerKonsPerAr: {},
            tonnSolgtPerSelskapPerAr: {},
            resultatIMill: {},
            prodKost: {},
            lakseprisSnittKrPerKg: {},
            marginKrPerKgHOG: {},
            eFcr: {},
            sgr: {}, // Percentage
            dagerISjo: {},
            dodeAntall: {},
            dodeTonn: {},
            dodePerGen: {}, // Percentage
            snittvektSloyd: {},
            smoltVektKg: {},
            smoltPerKonsPerAr: {},
            nytteKostRatio1: {Case1: 0, Case2: 0},
            nytteKostRatio2: {Case1: 0, Case2: 0},
            grossProfitMargin: {}
        };

        let investeringOutput = {};
        let blockOutput = {};
        let printPDF = {};
        let defaultPriceModule = {};
        let priceModuleSnittvekt = {};
        let priceModuleCV = {};

        allCases.map(caseNo => {
            // return case wise output from API
            investeringOutput['case' + caseNo] = excelCalculationOutput['case' + caseNo]['investering'];
            blockOutput['case' + caseNo] = excelCalculationOutput['case' + caseNo]['blocks'];
            printPDF['case' + caseNo] = excelCalculationOutput['case' + caseNo]['pdf'];

            priceModuleSnittvekt['Case' + caseNo] = excelCalculationOutput['case' + caseNo]['price_module']['snittvekt'];
            priceModuleCV['Case' + caseNo] = excelCalculationOutput['case' + caseNo]['price_module']['cv'];


            for (let index in graphFinalOutput) {
                const resultStr = excelCalculationOutput['case' + caseNo]['graphs'][index].toString();
                graphFinalOutput[index]['Case' + caseNo] = parseFloat(resultStr.split(',').join(''));
            }
        });

        let graphBaseValue = {
            tonnPerKonsPerAr: 700,
            tonnSolgtPerSelskapPerAr: 0,
            resultatIMill: 0,
            prodKost: 25,
            lakseprisSnittKrPerKg: 30,
            marginKrPerKgHOG: 0,
            eFcr: 0.9,
            sgr: 0.3,
            dagerISjo: 200,
            dodeAntall: 0,
            dodeTonn: 0,
            dodePerGen: 0,
            snittvektSloyd: 2,
            smoltVektKg: 0.05,
            smoltPerKonsPerAr: 200,
            nytteKostRatio: 0,
            grossProfitMargin: 0
        };


        dispatch({type: 'SET_GRAPH_OUTPUT', payload: graphFinalOutput});
        dispatch({type: 'SET_GRAPH_BASE_VALUE', payload: graphBaseValue});
        dispatch({type: 'SET_INVESTERING_OUTPUT', payload: investeringOutput});
        dispatch({type: 'SET_BLOCK_OUTPUT', payload: blockOutput});
        dispatch({type: 'SET_PDF_OUTPUT', payload: printPDF});

        // set default snittvekt and CV input for price module from EM3
        dispatch({type: 'SET_PRICE_MODULE_SNITTVEKT', payload: priceModuleSnittvekt});
        dispatch({type: 'SET_PRICE_MODULE_CV', payload: priceModuleCV});

        dispatch({type: 'SET_GRAPH_OUTPUT_LABEL', payload: graphOutputLabel});
        dispatch({type: 'HIDE_MODEL_OUTPUT_SPINNER'});

    } catch (error) {
        console.log(error);
    }
}

export const hideModelOutputSpinner = () => dispatch => {
    dispatch({type: 'HIDE_MODEL_OUTPUT_SPINNER'});
}

export const setModelScreenAllInputs = allInputs => dispatch => {
    dispatch({type: 'SET_MODEL_SCREEN_ALL_INPUTS', payload: allInputs});
}

export const toggleMTBBlockList = () => async dispatch => {
    dispatch({type: 'SHOW_HIDE_MODEL_BLOCK_LIST'})
}

export const hideMTBBlockList = () => async dispatch => {
    dispatch({type: 'HIDE_MODEL_SCREEN_BLOCK_LIST'})
}

export const setModelScreenCases = caseNumbers => dispatch => {
    dispatch({type: 'SET_MODEL_SCREEN_INPUT_CASES', payload: caseNumbers});
}

export const resetModelScreen = () => async dispatch => {
    dispatch({type: 'RESET_MODEL_SCREEN'})
}

export const showHideModelScreenBlocks = blockSlug => dispatch => {
    dispatch({type: 'SHOW_HIDE_MODEL_SCREEN_BLOCKS', payload: blockSlug})
}

export const toggleModelScreenBlockExpand = blockSlug => dispatch => {
    dispatch({type: 'TOGGLE_MODEL_SCREEN_BLOCKS_EXPAND', payload: blockSlug})
}

export const addModelScreenNewCase = () => async dispatch => {
    await dispatch({type: 'ADD_MODEL_INPUT_CASE'})
}

export const removeModelScreenCase = () => async dispatch => {
    await dispatch({type: 'REMOVE_MODEL_INPUT_CASE'})
}

export const showTemplateNamePopup = () => dispatch => {
    dispatch({type: 'SHOW_TEMPLATE_NAME_POPUP'});
}

export const hideTemplateNamePopup = () => dispatch => {
    dispatch({type: 'HIDE_TEMPLATE_NAME_POPUP'});
}

export const changeModelOutputView = type => dispatch => {
    dispatch({type: 'CHANGE_MODEL_OUTPUT_VIEW', payload: type});
}

export const changeOutputColumns = () => dispatch => {
    dispatch({type: 'CHANGE_OUTPUT_COLUMNS'});
}

export const setGraphWrapperWidth = wrapperWidth => dispatch => {
    dispatch({type: 'SET_GRAPH_WRAPPER_WIDTH', payload: wrapperWidth});
}

export const showModelOutputSpinner = () => dispatch => {
    dispatch({type: 'SHOW_MODEL_OUTPUT_SPINNER'});
}

export const setBlockScrollHeight = height => dispatch => {
    dispatch({type: 'SET_MODEL_SCREEN_BLOCK_SCROLL_HEIGHT', payload: height});
}

export const setModelScreenBlockStatus = (slug, status) => dispatch => {
    dispatch({
        type: 'SET_MODEL_SCREEN_BLOCKS_STATUS',
        payload: {
            slug: slug,
            status: status,
        }
    });
}
