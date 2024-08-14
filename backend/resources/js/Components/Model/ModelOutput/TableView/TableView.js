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

        return (
            <div id="model_table_view" className={tableViewClassName} style={{ height: tableViewHeight }}>
                <div key={++countKey} className="content-block mb-3">
                    <div className="text-nowrap">
                        <table className="table table-borderless table-striped mb-0">
                            <thead>
                                <tr key={++countKey}>
                                    <th key={++countKey}>{t('variables')}</th>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <th key={++countKey}>{t('case')} {caseNo}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('number_of_licenses')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{parseInt(this.props.tableViewData['case' + caseNo].antallKons)}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('available_mtb_tons')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].tilgjengeligMTBTonn}</td>
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
                                <tr key={++countKey}>
                                    <th key={++countKey}>{t('production')}</th>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <th key={++countKey}></th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('mtb_utilization_percentage')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].mtbUtnytting}%</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('average_temp_c')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].snitttemp}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('smolt_weight_in_grams')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].smoltvektGram}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('average_weight_at_slaughter_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktevektRundKg}</td>
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
                                <tr key={++countKey}>
                                    <th key={++countKey}>{t('biology')}</th>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <th key={++countKey}></th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('increased_vf3')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>{this.props.tableViewData['case' + caseNo].vf3}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('bfcr')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].bfcr}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('waste_percentage_biomass_per_month')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].svinnBiomassePerMnd}%</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('downgrade_production_quality_percentage_biomass')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].nedklassingProdBiomasse}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('draft_percentage_biomass')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].utkastBiomasse}</td>
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
                                <tr key={++countKey}>
                                    <th key={++countKey}>{t('costs_and_prices')}</th>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <th key={++countKey}></th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('smolt_cost_nok_per_fish')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].smoltPrisNOKPerStk}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('feed_cost_nok_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].forprisNokPerKg}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('dead_fish_nok_kg')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].dodfiskNokPerKg}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('well_boat_and_harvest_cost_per_kg_hog')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].innkjoringOgSlaktPerKgHOG}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('cost_prod_qual_nok_per_kg_hog')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].prodkvalitetRedusertPrisPerKg}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('salmon_price')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].laksepris}</td>
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
                                <tr key={++countKey}>
                                    <th key={++countKey}>{t('result')}</th>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <th key={++countKey}></th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr key={++countKey}>
                                    <td key={++countKey}><b>{t('tons_per_cone_per_year')}</b></td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>
                                                <b>{this.props.tableViewData['case' + caseNo].tonnPerKonsPerAr}</b></td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('tons_per_company_hog')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].tonnPerSelsKapHOG}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('increased_production_per_year_percentage')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}></td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].oktProduksjonPerAr === 0 ? '-' : this.props.tableViewData['case' + caseNo].oktProduksjonPerAr + '%'}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('produced_sea_tons')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].produsertSjoTonn}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}><b>{t('sales_revenues_nok_mill')}</b></td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>
                                                <b>{this.props.tableViewData['case' + caseNo].salgsinntekterNOK1000}</b></td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}><b>{t('total_costs_nok_mill')}</b></td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>
                                                <b>{this.props.tableViewData['case' + caseNo].sumKostnaderNOK1000}</b></td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}><b>{t('result_nok_mill')}</b></td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>
                                                <b>{this.props.tableViewData['case' + caseNo].resultatNOK1000}</b></td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('increased_result_nok_1000')}</td>
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
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('improved_profit_percentage')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}></td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].forbedringResultatPercentage}%</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('benefit_cost_ratio')} 1</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}></td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].nytteOrKostRatio === '0.0' ? '' : this.props.tableViewData['case' + caseNo].nytteOrKostRatio}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('benefit_cost_ratio')} 2</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}></td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].nytteKostRatio2 === '0.00' ? '' : this.props.tableViewData['case' + caseNo].nytteKostRatio2}</td>
                                        })
                                    }
                                </tr>

                                <tr key={++countKey}>
                                    <td key={++countKey}><b>{t('production_cost_nok_kg')}</b></td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>
                                                <b>{this.props.tableViewData['case' + caseNo].prodkostPerKgHOG}</b></td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('average_salmon_price_nok_per_kg_hog')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].snittLakseprisNokPerKgHog}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('smolt_per_cons_per_year_1000')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].smoltPerKonsPerAr1000}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('smolt_per_year_company_mill')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].smoltPerArSelskapMill}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('efcr')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].eFCR}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('dead_fish_ton_per_year')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].dodfiskTonnPerAr}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}><b>{t('deaths_per_gene_percentage')}</b></td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td key={++countKey}>
                                                <b>{this.props.tableViewData['case' + caseNo].dodePerGen + '%'}</b></td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('days_at_sea')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].dagerISjø}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('reduced_days_in_sea')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}></td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].reduserteDager === 0 ? '-' : this.props.tableViewData['case' + caseNo].reduserteDager}</td>
                                        })
                                    }
                                </tr>
                                <tr key={++countKey}>
                                    <td key={++countKey}>{t('reduction_risk_time_percentage')}</td>
                                    {
                                        caseNumbers.map(caseNo => {
                                            if (caseNo === 1) {
                                                return <td key={++countKey}></td>
                                            }
                                            return <td
                                                key={++countKey}>{this.props.tableViewData['case' + caseNo].reduksjonRisikotid}%</td>
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
})

export default connect(mapStateToProps)(withTranslation()(TableView));

