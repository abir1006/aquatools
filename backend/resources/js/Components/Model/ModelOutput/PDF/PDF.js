import React from 'react';

const PDF = props => {

    const pdfFrame = {
        width: '980px',
        float: 'left',
        fonSize: '16px !important',
        fontFamily: 'acumin-pro-condensed, sans-serif',
        fontStyle: 'normal',
        fontWeight: '400',
        color: '#3a343a',
    }

    const table = {
        display: 'table',
        borderCollapse: 'separate',
        boxSizing: 'border-box',
        whiteSpace: 'normal',
        lineHeight: 'normal',
        fontWeight: 'normal',
        fontSize: 'medium',
        fontStyle: 'normal',
        textAlign: 'start',
        borderSpacing: '2px',
        borderColor: 'grey',
        fontVariant: 'normal',
        width: '100%',
        marginBottom: '1rem',
        color: '#212529',
    }

    const tr = {
        display: 'table-row',
        backgroundColor: '#fff',
    }

    const th = {
        display: 'table-cell',
    }

    const totalCases = Object.keys(props.tableViewData).length;
    const tableViewClassName = 'table-view-column-count-' + (totalCases + 1);
    const caseNumbers = [];
    for (let countTmp = 1; countTmp <= totalCases; countTmp++) {
        caseNumbers[countTmp] = countTmp;
    }
    let countKey = 0;

    return (
        <html lang="en">
        <head></head>
        <body>
        <div style={pdfFrame}>
            <div id="model_table_view" className={tableViewClassName}>
                <div key={++countKey} className="content-block mb-3">
                    <div className="text-nowrap">
                        <table style={table}>
                            <thead>
                            <tr style={tr} key={++countKey}>
                                <th style={th} key={++countKey}>Variabler</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th style={th} key={++countKey}>Case {caseNo}</th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}>Antall konsesjoner</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{parseInt(props.tableViewData['case' + caseNo].antallKons)}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Tilgjengelig MTB tonn</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].tilgjengeligMTBTonn}</td>
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
                                <th key={++countKey}>Produksjon</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}>MTB utnytting %</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].mtbUtnytting}%</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Snitt temp °C</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].snitttemp}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Smoltvekt gram</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].smoltvektGram}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Slaktevekt rund kg</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].slaktevektRundKg}</td>
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
                                <th key={++countKey}>Biologi</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}>Tilvekst VF3</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td key={++countKey}>{props.tableViewData['case' + caseNo].vf3}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>bFCR</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].bfcr}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Svinn % biomasse per mnd</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].svinnBiomassePerMnd}%</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Nedklassing prod % biomasse</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].nedklassingProdBiomasse}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Utkast % biomasse</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].utkastBiomasse}</td>
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
                                <th key={++countKey}>Kostnader og priser</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}>Smoltkost NOK per stk</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].smoltPrisNOKPerStk}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Fôrpris NOK per kg</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].forprisNokPerKg}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Dødfisk NOK per kg</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].dodfiskNokPerKg}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Innkjøring og slakt per kg HOG</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].innkjoringOgSlaktPerKgHOG}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Kostnad prod kval. NOK per kg HOG</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].prodkvalitetRedusertPrisPerKg}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Laksepris</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].laksepris}</td>
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
                                <th key={++countKey}>Resultat</th>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <th key={++countKey}></th>
                                    })
                                }
                            </tr>
                            </thead>
                            <tbody>
                            <tr key={++countKey}>
                                <td key={++countKey}><b>Tonn per kons per år</b></td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td key={++countKey}>
                                            <b>{props.tableViewData['case' + caseNo].tonnPerKonsPerAr}</b></td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Tonn per selskap HOG</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].tonnPerSelsKapHOG}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Økt produksjon per år %</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].oktProduksjonPerAr === 0 ? '-' : props.tableViewData['case' + caseNo].oktProduksjonPerAr + '%'}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Produsert sjø tonn</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].produsertSjoTonn}</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}><b>Resultat NOK 1000</b></td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td key={++countKey}>
                                            <b>{props.tableViewData['case' + caseNo].resultatNOK1000}</b></td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Økt resultat NOK 1000</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].oktResultatNOK1000}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Forbedring resultat %</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].forbedringResultatPercentage}%</td>
                                    })
                                }
                            </tr>

                            <tr key={++countKey}>
                                <td key={++countKey}>Nytte/kost ratio</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].nytteOrKostRatio === 0 ? '' : props.tableViewData['case' + caseNo].nytteOrKostRatio}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}><b>Prodkost kr/ kg</b></td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td key={++countKey}>
                                            <b>{props.tableViewData['case' + caseNo].prodkostPerKgHOG}</b></td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Snitt Laksepris NOK per kg HOG</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].snittLakseprisNokPerKgHog}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Smolt per kons per år (1000)</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].smoltPerKonsPerAr1000}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Smolt per år selskap mill.</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].smoltPerArSelskapMill}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>eFCR</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].eFCR}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Dødfisk tonn per år</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].dodfiskTonnPerAr}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}><b>Døde per gen %</b></td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td key={++countKey}>
                                            <b>{props.tableViewData['case' + caseNo].dodePerGen}</b></td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Dager i sjø</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].dagerISjø}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Reduserte dager</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].reduserteDager === 0 ? '-' : props.tableViewData['case' + caseNo].reduserteDager}</td>
                                    })
                                }
                            </tr>
                            <tr key={++countKey}>
                                <td key={++countKey}>Reduksjon risikotid %</td>
                                {
                                    caseNumbers.map(caseNo => {
                                        if (caseNo === 1) {
                                            return <td key={++countKey}></td>
                                        }
                                        return <td
                                            key={++countKey}>{props.tableViewData['case' + caseNo].reduksjonRisikotid}%</td>
                                    })
                                }
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </body>
        </html>
    );
}

export default PDF;
