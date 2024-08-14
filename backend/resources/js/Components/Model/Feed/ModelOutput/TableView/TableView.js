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
        if (this.props.tableViewData !== undefined) {
            this.setState({
                ...this.state,
                tableViewHeight: document.documentElement.offsetHeight - document.getElementById('model_table_view').getBoundingClientRect().top
            });
        }
    }

    render() {
        const {t} = this.props;

        if (this.props.tableViewData === undefined) {
            return null;
        }
        const totalCases = Object.keys(this.props.tableViewData).length;
        const tableViewClassName = 'table-view-column-count-' + (totalCases + 1);
        const caseNumbers = [];
        for (let countTmp = 1; countTmp <= totalCases; countTmp++) {
            caseNumbers[countTmp] = countTmp;
        }
        let countKey = 0;
        const tableViewHeight = this.props.screenSize >= 768 ? this.state.tableViewHeight + 'px' : '100%';

        return (
            <div id="model_table_view" className={tableViewClassName} style={{height: tableViewHeight}}>
                {
                    caseNumbers.map(caseNo => {
                        return (
                            <div key={caseNo} className="content-block mb-3">
                                <div className="text-nowrap">
                                    <table className="table table-responsive table-borderless table-striped mb-0">
                                        <thead>
                                        <tr>
                                            <th>{t('feed_table') + ' ' + t('case' + caseNo)}</th>
                                        </tr>
                                        <tr>
                                            <th>{t('feed_name')}</th>
                                            <th>{t('min_weight')}</th>
                                            <th>{t('max_weight')}</th>
                                            <th>{t('bfcr').toUpperCase()}</th>
                                            <th>{t('vf3').toUpperCase()}</th>
                                            <th>{t('mortality_percentage')}</th>
                                            <th>{t('feed_price')}</th>
                                            <th>{t('duration')}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            this.props.feedTimeline['case' + caseNo].map(feed => {
                                                const mortality = feed.mortality === undefined || feed.mortality === null || feed.mortality === '' ? '' : feed.mortality + '%';
                                                return (
                                                    <tr>
                                                        <td>{feed.feed_name}</td>
                                                        <td>{feed.feed_min_weight}</td>
                                                        <td>{feed.feed_max_weight}</td>
                                                        <td>{feed.bfcr}</td>
                                                        <td>{feed.vf3}</td>
                                                        <td>{mortality}</td>
                                                        <td>{feed.feed_cost}</td>
                                                        <td>{feed.duration}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )
                    })
                }

                <div key={++countKey} className="content-block mb-3">
                    <div className="text-nowrap">
                        <table className="table table-borderless table-striped mb-0">
                            <thead>
                            <tr>
                                <th>{t('basic_preconditions')}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{t('release_date')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo === 1 && this.props.tableViewData['case1'].utsettsDato}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td>{t('exposure_weight')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo === 1 && this.props.tableViewData['case1'].utsettsVekt}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td>{t('number_of_smolts')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo === 1 && number_format(this.props.tableViewData['case1'].antallSmolt, 0, '.', ' ')}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td>{t('harvest_date')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo === 1 && this.props.tableViewData['case1'].slakteDato}</td>
                                    })
                                }
                            </tr>
                            <tr>
                                <td>{t('days_in_production')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo === 1 && this.props.tableViewData['case1'].dagerIProduksjon}</td>
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
                            <tr key={++countKey}>
                                <th key={++countKey}>{t('production')}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}>{t('case' + caseNo)}</th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('harvest_weight')} (g)</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktevekt}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('vf3').toUpperCase()}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].vf3}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('growth')} (kg)</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].tilvekstKg}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('slaughtered_biomass_net')} (tonn)</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].slaktetBiomasseNettoTonn}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('mortality_percentage')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].mortality + '%'}</td>
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
                                <th key={++countKey}>{t('feed')}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
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
                                <td key={++countKey}>{t('efcr')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].efcr}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('amount_of_feed')} (kg)</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].FormengdeKg}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('feed_costs_mill')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].forkostMill}</td>
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
                                <th key={++countKey}>{t('economy')}</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('feed_price_per_kg_of_feed')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].forprisPerKgFor}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('feed_costs_nok_per_kg_produced')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].forkostPerKgProdusert}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('prod_cost_nok_per_kg')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].prodkostPerKg}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('revenues_mill')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].inntekterMill}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>{t('costs_mill')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].kostnaderMill}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>{t('operating_profit_nok_mill')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].driftsResultatMill}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>{t('margin_percentage')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{this.props.tableViewData['case' + caseNo].marginPercentage}%</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>{t('benefit_cost_ratio1')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo > 1 && this.props.tableViewData['case' + caseNo].kostNytteRatio}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>{t('benefit_cost_ratio2')}</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{caseNo > 1 && this.props.tableViewData['case' + caseNo].kostNytteRatio2}</td>
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
    modelInputs: state.modelScreen.inputs,
    feedTimeline: state.feedModelScreen.feedTimeline,
})

export default connect(mapStateToProps)(withTranslation()(TableView));

