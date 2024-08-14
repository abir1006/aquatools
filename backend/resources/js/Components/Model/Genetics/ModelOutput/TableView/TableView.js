import React, {Component} from 'react';
import {connect} from 'react-redux';
import './TableView.css';
import {number_format} from "../../../../../Services/NumberServices";
import {withTranslation} from "react-i18next";

class TableView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableViewHeight: '',
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            tableViewHeight: document.documentElement.offsetHeight - document.getElementById('model_table_view').getBoundingClientRect().top
        });
    }

    render() {
        const {t} = this.props;
        const totalCases = Object.keys(this.props.tableViewData).length;
        const tableViewClassName = 'table-view-column-count-' + (totalCases + 1);
        const caseNumbers = [];
        for (let countTmp = 1; countTmp <= totalCases; countTmp++) {
            caseNumbers[countTmp] = countTmp;
        }
        let countKey = 0;
        const tableViewHeight = this.props.screenSize >= 768 ? this.state.tableViewHeight + 'px' : '100%';

        const modelInputs = this.props.inputs;


        return (
            <div id="model_table_view" className={tableViewClassName} style={{height: tableViewHeight}}>
                <div key={++countKey} className="content-block mb-3">
                    <div className="text-nowrap">
                        <table className="table table-borderless table-striped mb-0">
                            <thead>
                            <tr>
                                <th>{t('basic_preconditions_in_the_model')}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{t('number_of_smolts')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        let antallSmolt = modelInputs['genetics_produksjonsmodell_antall_smolt_case1'];
                                        antallSmolt = antallSmolt === '' ? 0 : antallSmolt;
                                        return <td
                                            key={++countKey}>{caseNo === 1 && number_format(antallSmolt, 0, '.', ' ')}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td>{t('harvest_weight_hog_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        let slaktevektHOGkg = this.props.tableViewData['case1'].slaktevektHOGkg === '' ? 0 : this.props.tableViewData['case1'].slaktevektHOGkg;
                                        return <td
                                            key={++countKey}>{caseNo === 1 && slaktevektHOGkg}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td>{t('salmon_price_nok_per_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        let laksepris = modelInputs['genetics_produksjonsmodell_laksepris_case1'];
                                        laksepris = laksepris === '' ? 0 : laksepris;
                                        return <td
                                            key={++countKey}>{caseNo === 1 && laksepris}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('number_of_eggs_per_smolt')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        let eggNumber = modelInputs['genetics_grunnforutsetninger_antall_rogn_per_smolt_case1'];
                                        eggNumber = eggNumber === '' ? 0 : eggNumber;
                                        return <td
                                            key={++countKey}>{caseNo === 1 && eggNumber}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('estimated_total_cost_nok_1000')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        let totalProdKostCase1 = this.props.tableViewData['case1'].totalProdKostCase1;
                                        totalProdKostCase1 = totalProdKostCase1 === '' ? 0 : totalProdKostCase1;
                                        return <td
                                            key={++countKey}>{caseNo === 1 && totalProdKostCase1}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('variable_costs_in_percentage_of_total_production_cost')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        let totalVariableKost = this.props.tableViewData['case1'].totalVariableKost;
                                        totalVariableKost = totalVariableKost === '' ? 0 : totalVariableKost;
                                        return <td
                                            key={++countKey}>{caseNo === 1 && totalVariableKost + '%'}</td>
                                    })
                                }
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>


                <div key={++countKey} className="content-block mb-3">
                    <div className="text-nowrap">
                        <table className="table table-borderless table-striped mb-0">
                            <thead>
                            <tr>
                                <th>{t('effects_improved_production').toUpperCase()}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        let caseLabel = !Boolean(this.props.inputs['name_case' + caseNo]) ? 'Case ' + caseNo : this.props.inputs['name_case' + caseNo];
                                        caseLabel = caseLabel === 'Case ' + caseNo ? t('case' + caseNo) : caseLabel;
                                        return <th key={++countKey}>{caseLabel}</th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{t('increased_growth_grams')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].oktSlaktevektGram}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('reduced_mortality_in_percentage')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].redusertDodelighetPercentage + '%'}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('average_weight_of_reduced_mortality_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].snittvektDeadfiskKg}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('reduced_bfcr')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].redusertBFCRPercentage + '%'}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('reduced_prod_cost_per_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{modelInputs['genetics_effekter_genetikk_reduksjon_prodkost_per_kg_case' + caseNo]}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('reduced_in_downgrading_prod_percentage')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].reduksjonNedklassingProdPercentage + '%'}</td>
                                    })
                                }
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

                <div key={++countKey} className="content-block mb-3">
                    <div className="text-nowrap">
                        <table className="table table-borderless table-striped mb-0">
                            <thead>
                            <tr>
                                <th>{t('result_improve_production').toUpperCase()}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        let caseLabel = !Boolean(this.props.inputs['name_case' + caseNo]) ? 'Case ' + caseNo : this.props.inputs['name_case' + caseNo];
                                        caseLabel = caseLabel === 'Case ' + caseNo ? t('case' + caseNo) : caseLabel;
                                        return <th key={++countKey}>{caseLabel}</th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{t('slaughter_volume_hog_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktevolumHGkg}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('average_salmon_price_nok_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].lakseprisNOKPerKg}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('sales_value_nok_1000')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].salgsverdiNOK1000}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('prod_cost_nok_per_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].prodkostKrPerkg}</td>
                                    })
                                }
                            </tr>


                            <tr>
                                <td>{t('operating_profit_nok_1000')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].driftsResultatNOK1000}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('mortality_percentage')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].dodelighetPercentage + '%'}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('efcr')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].efcr}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('extra_genetics_cost_per_egg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].merkostnadTiltakProduksjonNOK1000}</td>
                                    })
                                }
                            </tr>


                            <tr>
                                <td>{t('extra_cost_increased_egg_price_total')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].merkostTiltakKrKg}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('more_slaughtered_genetics_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].merslaktKg}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('increased_profit_nok_1000')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].oktResultatNOK1000}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('benefit_cost_ratio1')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].nytteKostRatio1}</td>
                                    })
                                }
                            </tr>

                            <tr>
                                <td>{t('benefit_cost_ratio2')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].nytteKostRatio2}</td>
                                    })
                                }
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    tableViewData: state.modelScreen.pdfOutput,
    screenSize: state.page.screenSize,
    caseNumbers: state.modelScreen.caseNumbers,
    inputs: state.modelScreen.inputs,
})

export default connect(mapStateToProps)(withTranslation()(TableView));

