import React from 'react';
import {withTranslation} from 'react-i18next';
import {connect} from 'react-redux';
import {number_format} from "../../../../Services/NumberServices";

const KostNytte = props => {

    const {t} = props;

    const blockOutput = props.blockOutput === undefined ? {} : props.blockOutput;
    let countBlockOutput = 0;

    // Total benefit parameters
    let tonnBenefit = 0;
    let prodkostBenefit = 0;
    let marginBenefit = 0;
    let resultatIMillBenefit = 0;
    let totalNytteOrkostRatio = 0;
    let sumKostnaderNOK1000 = 0;
    let totalKostTiltakMil = 0;

    const totalCases = Object.keys(blockOutput).length;

    return (
        <div className="table-responsive text-nowrap">
            <table className="table table-borderless table-striped">
                <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">{t('ton')}</th>
                    <th scope="col">{t('production_cost')}</th>
                    <th scope="col">{t('margin')}</th>
                    <th scope="col">{t('results_mill')}</th>
                    <th scope="col">{t('cost_measures_mill')}</th>
                    {/*<th scope="col">{t('benefit_cost_ratio')} 1</th>*/}
                    <th scope="col">{t('gross_profit_margin')}</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.keys(blockOutput).map(objKey => {

                        countBlockOutput++;
                        // store first case value
                        if (countBlockOutput === 1) {
                            tonnBenefit = blockOutput[objKey].tonn
                            prodkostBenefit = blockOutput[objKey].prodkost;
                            marginBenefit = blockOutput[objKey].margin;
                            resultatIMillBenefit = blockOutput[objKey].resultatIMill;
                            sumKostnaderNOK1000 = blockOutput[objKey].sumKostnaderNOK1000;
                        }

                        // substract last case value and first case value
                        if (countBlockOutput === totalCases) {
                            tonnBenefit = blockOutput[objKey].tonn - tonnBenefit;
                            prodkostBenefit = blockOutput[objKey].prodkost - prodkostBenefit;
                            marginBenefit = blockOutput[objKey].margin - marginBenefit;
                            resultatIMillBenefit = blockOutput[objKey].resultatIMill - resultatIMillBenefit;
                            sumKostnaderNOK1000 = blockOutput[objKey].sumKostnaderNOK1000 - sumKostnaderNOK1000;
                            totalKostTiltakMil = blockOutput[objKey].totalKostTiltakMil;
                        }

                        const caseStr = Boolean(props.modelCaseText) && Boolean(props.modelCaseText['case' + countBlockOutput]) ? props.modelCaseText['case' + countBlockOutput] : t('case') + ' ' + countBlockOutput

                        return (
                            <tr key={countBlockOutput}>
                                <td>{caseStr}</td>
                                <td>{parseFloat(blockOutput[objKey].tonn) !== 0.00 && number_format(Math.round(blockOutput[objKey].tonn), 0, '.', ' ')}</td>
                                <td>{parseFloat(blockOutput[objKey].prodkost) !== 0.00 && number_format(blockOutput[objKey].prodkost.toFixed(2), 2, '.', ' ')}</td>
                                <td>{parseFloat(blockOutput[objKey].margin) !== 0.00 && number_format(blockOutput[objKey].margin.toFixed(2), 2, '.', ' ')}</td>
                                <td>{parseFloat(blockOutput[objKey].resultatIMill) !== 0.00 && number_format(Math.round(blockOutput[objKey].resultatIMill), 0, '.', ' ')}</td>
                                <td>{parseFloat(blockOutput[objKey].kostTiltakMil) !== 0.00 && number_format(blockOutput[objKey].kostTiltakMil.toFixed(2), 2, '.', ' ')}</td>
                                {/*<td>{parseFloat(blockOutput[objKey].nytteKostRatio1) !== 0.0 && number_format(blockOutput[objKey].nytteKostRatio1.toFixed(1), 1, '.', ' ')}</td>*/}
                                <td>{parseFloat(blockOutput[objKey].grossProfitMargin) !== 0.0 && number_format(blockOutput[objKey].grossProfitMargin, 2, '.', ' ')+'%'}</td>
                            </tr>
                        )
                    })
                }

                <tr key={countBlockOutput + 1}>
                    <td>{t('delta_values')}</td>
                    <td>{parseFloat(tonnBenefit) === 0.00 && '-'}{parseFloat(tonnBenefit) !== 0.00 && number_format(Math.round(tonnBenefit), 0, '.', ' ')}</td>
                    <td>
                        {parseFloat(prodkostBenefit) === 0.00 && '-'}
                        {parseFloat(prodkostBenefit) !== 0.00 && number_format(prodkostBenefit.toFixed(2), 2, '.', ' ')}
                    </td>
                    <td>{parseFloat(marginBenefit) === 0.00 && '-'}{parseFloat(marginBenefit) !== 0.00 && number_format(marginBenefit.toFixed(2), 2, '.', ' ')}</td>
                    <td>{parseFloat(resultatIMillBenefit) === 0.00 && '-'}{parseFloat(resultatIMillBenefit) !== 0.00 && number_format(resultatIMillBenefit.toFixed(1), 1, '.', ' ')}</td>
                    <td>{parseFloat(totalKostTiltakMil) === 0.00 && '-'} {parseFloat(totalKostTiltakMil) !== 0.00 && number_format(totalKostTiltakMil.toFixed(2), 1, '.', ' ')}</td>
                    <td></td>
                </tr>
                <tr key={countBlockOutput + 2}>
                    <td>{t('marginal_production')}</td>
                    <td>{parseFloat(tonnBenefit) === 0.00 && '-'}{parseFloat(tonnBenefit) !== 0.00 && number_format(Math.round(tonnBenefit), 0, '.', ' ')}</td>
                    <td>{parseFloat(tonnBenefit) === 0.00 && '-'}{parseFloat(tonnBenefit) !== 0.00 && number_format((sumKostnaderNOK1000 / tonnBenefit).toFixed(2), 2, '.', ' ')}</td>
                    <td>{parseFloat(resultatIMillBenefit) === 0.00 && '-'}{parseFloat(tonnBenefit) !== 0.00 && number_format(((resultatIMillBenefit * 1000) / tonnBenefit).toFixed(2), 2, '.', ' ')}</td>
                    <td></td>
                    <td>0.00</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

const mapStateToProps = state => ({
    blockOutput: state.modelScreen.blockOutput,
    modelCaseText: state.modelScreen.modelCaseText,
})

export default connect(mapStateToProps)(withTranslation()(KostNytte));
