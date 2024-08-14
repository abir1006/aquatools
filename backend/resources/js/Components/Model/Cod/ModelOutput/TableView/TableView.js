import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import './TableView.css';

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

        const { t } = this.props;

        const totalCases = Object.keys(this.props.tableViewData).length;
        const tableViewClassName = 'table-view-column-count-' + (totalCases + 1);
        const caseNumbers = [];
        for (let countTmp = 1; countTmp <= totalCases; countTmp++) {
            caseNumbers[countTmp] = countTmp;
        }
        let countKey = 0;
        const tableViewHeight = this.props.screenSize >= 768 ? this.state.tableViewHeight + 'px' : '100%';

        const modelInputs = this.props.inputs;

        const diseaseBlockName = modelInputs.block_sjukdom_name === undefined || modelInputs.block_sjukdom_name === '' ? 'SAV3' : modelInputs.block_sjukdom_name;
        const budgetName = modelInputs.budget_name === undefined || modelInputs.budget_name === '' ? 'budget' : modelInputs.budget_name;

        const vaccineNames = {
            3: { Case1: budgetName, Case2: diseaseBlockName, Case3: 'Vaksine A' },
            4: { Case1: budgetName, Case2: diseaseBlockName, Case3: 'Vaksine A', Case4: 'Vaksine B' },
            5: { Case1: budgetName, Case2: diseaseBlockName, Case3: 'Vaksine A', Case4: 'Vaksine B', Case5: 'Vaksine C' },
        }

        let caseNumbersArr = this.props.caseNumbers;

        const vaccineCases = this.props.caseNumbers === undefined ? [] : this.props.caseNumbers;


        return (
            <div id="model_table_view" className={tableViewClassName} style={{ height: tableViewHeight }}>
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
                                            let antallSmolt = modelInputs['cost_of_disease_produksjonsmodell_antall_smolt_case1'];
                                            antallSmolt = antallSmolt === '' ? 0 : antallSmolt;
                                            return <td
                                                key={++countKey}>{caseNo === 1 && antallSmolt}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('salmon_price_nok_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            let laksepris = modelInputs['cost_of_disease_produksjonsmodell_laksepris_case1'];
                                            laksepris = laksepris === '' ? 0 : laksepris;
                                            return <td
                                                key={++countKey}>{caseNo === 1 && laksepris}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('production_cost_nok_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            let prodKost = modelInputs['cost_of_disease_produksjonsmodell_prod_kost_budsjett_case1'];
                                            prodKost = prodKost === '' ? 0 : prodKost;
                                            return <td
                                                key={++countKey}>{caseNo === 1 && prodKost}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('smolt_weight_in_grams')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            let smoltvekt = modelInputs['cost_of_disease_grunnforutsetninger_budsjett_smoltvekt_gram_case1'];
                                            smoltvekt = smoltvekt === '' ? 0 : smoltvekt;
                                            return <td
                                                key={++countKey}>{caseNo === 1 && smoltvekt}</td>
                                        })
                                    }
                                </tr>

                                <tr>
                                    <td>{t('average_weight_at_slaughter_hog_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            let slaktevektHOGkg = this.props.tableViewData['case1'].slaktevektHOGkg === '' ? 0 : this.props.tableViewData['case1'].slaktevektHOGkg;
                                            return <td
                                                key={++countKey}>{caseNo === 1 && slaktevektHOGkg}</td>
                                        })
                                    }
                                </tr>

                                <tr>
                                    <td>{t('mortality_percentage')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            let deadPer = this.props.tableViewData['case1'].deadPercentage === '' ? 0 : this.props.tableViewData['case1'].deadPercentage;
                                            return <td
                                                key={++countKey}>{caseNo === 1 && deadPer + '%'}</td>
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
                                    <th></th>
                                    <th></th>

                                </tr>
                            </thead>
                            <thead>
                                <tr>
                                    <th>{t('effects_disease_and_vaccine')}</th>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            if (caseNo === 2) {
                                                return (
                                                    <th key={++countKey}>
                                                        {diseaseBlockName}
                                                    </th>
                                                )
                                            }

                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{t('reduced_weight_at_slaughter_kg')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_redusert_slaktevekt_kg_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(1)}
                                                    </td>
                                                )
                                            }


                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('mortality_percentage')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_kt_ddelighet_prosentpoeng_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(1) + '%'}
                                                    </td>
                                                )
                                            }

                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('average_weight_of_increased_mortality_kg')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_vekt_pa_ddfisk_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(1)}
                                                    </td>
                                                )
                                            }


                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('increased_bfcr')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_kt_bfcr_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(2)}
                                                    </td>
                                                )
                                            }


                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('increased_downgrade_production_quality_biomass')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_kt_nedklassing_prod_kvalitet_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(1) + '%'}
                                                    </td>
                                                )
                                            }

                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('increased_downgrade_draft_biomass')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_utkast_poeng_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(1) + '%'}
                                                    </td>
                                                )
                                            }


                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('extraordinary_costs_nok_1000')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_ekstraordinre_kostnader_nok_mill_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue * 1000;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {sjukdomValue}
                                                    </td>
                                                )
                                            }


                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('treatment_costs_nok_1000')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_behandlingskostnad_nok_mill_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue * 1000;


                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {sjukdomValue}
                                                    </td>
                                                )
                                            }

                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('costs_of_prophylactic_measures_nok_1000')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_forebygginskostnad_nok_mill_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue * 1000;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {sjukdomValue}
                                                    </td>
                                                )
                                            }

                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('probability_of_disease')}</td>
                                    {
                                        caseNumbers.slice(2, caseNumbers.length + 1).map(caseNo => {
                                            let sjukdomValue = modelInputs['cost_of_disease_effekter_sjukdom_sannsynlighet_for_sjukdom_case1'];
                                            sjukdomValue = sjukdomValue === '' ? 0 : sjukdomValue;

                                            if (caseNo === 2) {
                                                return (
                                                    <td key={++countKey}>
                                                        {parseFloat(sjukdomValue).toFixed(1) + '%'}
                                                    </td>
                                                )
                                            }


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
                                    <th>{t('production_result')}</th>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <th key={++countKey}>{caseNo == 1 ? t(budgetName) : diseaseBlockName}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{t('slaughter_weight_round_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktevektRundvektKg}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('number_of_harvested')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktetAntall}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('slaughter_weight_hog_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktevektHOGkg}</td>
                                        })
                                    }
                                </tr>

                                <tr>
                                    <td>{t('slaughter_volume_hog_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktevolumHOGKg}</td>
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
                                    <td>{t('production_cost_nok_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].prodkostKrPerKg}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('operating_profit_nok_1000')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].driftsResultat}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('mortality_percentage')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].deadPercentage + '%'}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('biomass_deadfish_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].biomasseDeadfiskKg}</td>
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
                                    <td>{t('average_salmon_price_nok_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].lakseprisGjennomsnittKrPerkg}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('cost_of_disease_nok_1000')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}>0</td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].kostnadVedSjukdom}</td>
                                        })
                                    }
                                </tr>
                                <tr>
                                    <td>{t('lost_slaughter_volume_hog_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}>0</td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].taptSlaktevolumeHOGKg}</td>
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

