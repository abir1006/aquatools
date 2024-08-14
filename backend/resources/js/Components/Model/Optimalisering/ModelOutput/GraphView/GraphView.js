import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setGraphWrapperWidth, changeOutputColumns} from "../../../../../Store/Actions/MTBActions";
import './GraphView.css';

import {ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LabelList} from 'recharts';
import BarCustomizedLabel from "./BarCustomizedLabel";
import {number_format} from "../../../../../Services/NumberServices";
import {showInfoPopup} from "../../../../../Store/Actions/popupActions";
import {withTranslation} from "react-i18next";

class GraphView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numberOfColumns: 3,
            graphWidth: 0,
            graphHeight: 0,
            index: 0,
            graphWrapperHeight: '',
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            graphWrapperHeight: document.documentElement.offsetHeight - document.getElementById('graph-wrapper').getBoundingClientRect().top + 30,
        });
        window.addEventListener("resize", this.screenResize.bind(this));
        this.props.setGraphWrapperWidth(document.getElementById('graph-wrapper').offsetWidth);

        if (this.props.screenSize < 1367 && this.props.outputColumns === 3) {
            this.props.changeOutputColumns();
        }

        if (this.props.screenSize >= 1367 && this.props.outputColumns === 2 && this.props.caseNumbers.length < 5) {
            this.props.changeOutputColumns();
        }
    }

    screenResize() {

        this.props.setGraphWrapperWidth(document.getElementById('graph-wrapper').offsetWidth);

        if (this.props.screenSize < 1367 && this.props.outputColumns === 3) {
            this.props.changeOutputColumns();
        }

        if (this.props.screenSize >= 1367 && this.props.outputColumns === 2 && this.props.caseNumbers.length < 5) {
            this.props.changeOutputColumns();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.screenResize.bind(this));
    }

    viewHelpTextHandler(e, helpText, graphBlockID) {
        const infoText = helpText === null || helpText === undefined || helpText === '' ? 'Help text not found' : helpText;
        const popUpYPosition = document.getElementById(graphBlockID).getBoundingClientRect().top - 15;
        const graphBlockWidth = document.getElementById(graphBlockID).offsetWidth;
        const popUpXPosition = parseInt(document.getElementById(graphBlockID).getBoundingClientRect().left) + (parseInt(graphBlockWidth)/2);
        this.props.showInfoPopup(infoText, popUpXPosition, popUpYPosition);
    }

    render() {

        const {t} = this.props;

        const graphOutput = this.props.graphOutput;

        const graphData = {};

        let countIndex = 0;

        for (let index in graphOutput) {
            let countCase = 0;
            let tmp = [];
            for (let caseStr in graphOutput[index]) {
                let percentageStr = index === 'sgr' || index === 'dodePerGen' ? ' %' : '';
                let tmpLabel = this.props.modelInputs['name_' + caseStr.toLowerCase()] === undefined || this.props.modelInputs['name_' + caseStr.toLowerCase()] === '' ? caseStr : this.props.modelInputs['name_' + caseStr.toLowerCase()];
                tmp[countCase] = {
                    label: t(tmpLabel.replace(' ', '').toLowerCase()),
                    value: parseFloat(graphOutput[index][caseStr]),
                    barLabelValue: graphOutput[index][caseStr] + percentageStr
                };
                countCase++;
            }

            graphData[index] = tmp;

            countIndex++;
        }

        const CustomTooltip = ({active, payload, label, resultName}) => {
            let index = this.state.index;
            const percentageStr = resultName === 'SGR' || resultName === 'Døde per gen %' ? ' %' : '';

            let dec = 2;

            if (resultName === 'Slaktevolum HOG Tonn') {
                dec = 1;
            }

            if (resultName === 'Driftsresultat NOK 1000') {
                dec = 0;
            }

            if (resultName === 'Nytte/kost ratio' && label === 'BCR1') {
                dec = 1;
            }

            if (resultName === 'Nytte/kost ratio' && label === 'BCR2') {
                dec = 1;
            }

            if (active) {
                return (
                    <div className="custom-tooltip">
                        <p className="label">{`${label} : ${number_format(payload[index].value, dec, '.', ' ')}${percentageStr}`}</p>
                    </div>
                );
            }
            return null;
        };

        const barColors = ['#1573c3', '#00a7ed', '#00C36A', '#22EBA0', '#1BA0C3'];

        const numberOfColumns = this.props.outputColumns;


        let classArr = [];

        classArr.col1Class = 'graph-col pr-1';
        classArr.col2Class = numberOfColumns === 3 ? 'graph-col pl-1 pr-1' : 'graph-col pl-1';
        classArr.col3Class = numberOfColumns === 3 ? 'graph-col pl-1' : '';

        let countColumn = 0;
        let countGraph = 0;

        // calculate graph column width and height based on user select column count

        const dividedPlus = this.props.outputColumns === 3 ? 1 : 0.5;
        let graphColWidth = this.props.graphWrapperWidth / (this.props.outputColumns + dividedPlus);
        let graphColHeight = this.props.graphWrapperWidth / (this.props.outputColumns + dividedPlus + 1);

        if (this.props.screenSize >= 520 && this.props.screenSize <= 767) {
            graphColWidth = (this.props.graphWrapperWidth - 100) / 2;
            graphColHeight = (this.props.graphWrapperWidth - 50) / 2;
        }

        if (this.props.screenSize <= 519) {
            graphColWidth = this.props.graphWrapperWidth - 75;
            graphColHeight = this.props.graphWrapperWidth - 125;
        }


        const graphWrapperHeight = this.props.screenSize >= 768 ? this.state.graphWrapperHeight + 'px' : '100%';

        // New C/B Ratio graph
        let newNKR = [{BCR1: 0, BCR2: 0, label: t('case') + '1', label2: "BCR1 ----- BCR2"}];
        let nkrCount = 0;
        const totalCases = this.props.caseNumbers === undefined ? 1 : this.props.caseNumbers.length;
        let removeDash = totalCases <= 2 ? 0 : (totalCases - 2);
        let dash = '----';
        dash = dash.slice(0, dash.length - removeDash);
        this.props.caseNumbers.slice(1, this.props.caseNumbers.length).map(caseNo => {
            newNKR[nkrCount] = {
                BCR1: parseFloat(this.props.graphOutput.nytteKostRatio1['Case' + caseNo]),
                BCR2: parseFloat(this.props.graphOutput.nytteKostRatio2['Case' + caseNo]),
                label: t('case') + ' ' + caseNo,
                label2: "BCR1 " + dash + " BCR2"
            }

            nkrCount++;
        });

        return (
            <div id="graph-wrapper" style={{height: graphWrapperHeight}}>
                {
                    Object.keys(graphData).map((index, keyNumber) => {
                        if (index === 'nytteKostRatio1' || index === 'nytteKostRatio2') {
                            return null;
                        }
                        let countBarCell = -1;
                        countGraph++;
                        countColumn++;
                        if (countColumn > numberOfColumns) {
                            countColumn = 1;
                        }
                        const gHelpText = Boolean(this.props.optGraphHelpText) ? this.props.optGraphHelpText : '';
                        return (
                            <div key={countGraph} className={classArr['col' + countColumn + 'Class']}
                                 style={{width: (100 / numberOfColumns) + '%'}}>
                                <div className="content-block">
                                    <div className="graph-content" id={'graph-block-' + (keyNumber)}>
                                        <h5 className="output-heading">{t(this.props.graphOutputLabel[index])}
                                            {
                                                Boolean(this.props.optGraphHelpText[index]) && <button
                                                    type="button"
                                                    id={'help-text-id-' + (keyNumber)}
                                                    className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                                    onClick={e => this.viewHelpTextHandler(e, t(this.props.optGraphHelpText[index]), 'graph-block-' + (keyNumber))}>
                                                    i
                                                </button>
                                            }
                                        </h5>
                                        <div className="graph-plot">
                                            <ResponsiveContainer width="100%" height={graphColHeight}>
                                                <BarChart
                                                    data={graphData[index]}
                                                    margin={{
                                                        top: 15, right: 0, left: -20, bottom: 0,
                                                    }}>
                                                    <XAxis dataKey="label"/>

                                                    {this.props.graphBaseValue[index] === null && <YAxis
                                                        type="number"
                                                        allowDataOverFlow={true}/>}
                                                    {this.props.graphBaseValue[index] !== null && <YAxis
                                                        type="number"
                                                        domain={[this.props.graphBaseValue[index], dataMax => index === 'efcr' ? (dataMax + (dataMax / 7)).toFixed(2) : (dataMax + (dataMax / 7)).toFixed(0)]}
                                                        allowDataOverFlow={true}/>}

                                                    <Tooltip
                                                        resultName={this.props.graphOutputLabel[index]}
                                                        content={CustomTooltip}
                                                        cursor={false}/>
                                                    <Bar
                                                        isAnimationActive={false}
                                                        barSize={45}
                                                        dataKey="value">
                                                        <LabelList
                                                            graphData={graphData[index]}
                                                            resultName={this.props.graphOutputLabel[index]}
                                                            barWidth={45}
                                                            dataKey="barLabelValue"
                                                            content={<BarCustomizedLabel/>}
                                                        />
                                                        {
                                                            graphData[index].map(caseRow => {
                                                                countBarCell++;
                                                                return <Cell key={countBarCell}
                                                                             fill={barColors[countBarCell]}/>
                                                            })
                                                        }
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }

                {/*Nytte/ Kost ratio graph */}

                <div className={classArr['col' + countColumn + 'Class']} style={{width: (100 / numberOfColumns) + '%'}}>
                    <div className="content-block" id={'graph-block-bcr'}>
                        <div className="graph-content">
                            <h5 className="output-heading">{t('benefit_cost_ratio')}
                                {
                                    Boolean(this.props.optGraphHelpText['bcr']) && <button
                                        type="button"
                                        id={'help-text-id-1'}
                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                        onClick={e => this.viewHelpTextHandler(e, 'bcr_graph', 'graph-block-bcr')}>
                                        i
                                    </button>
                                }
                            </h5>
                            <div className="graph-plot">
                                <ResponsiveContainer width="100%" height={graphColHeight}>
                                    <BarChart
                                        data={newNKR}
                                        margin={{
                                            top: 15, right: 0, left: -20, bottom: 0,
                                        }}>
                                        <XAxis xAxisId={0} hide={true} dataKey="label"/>
                                        <XAxis
                                            minTickGap={-30}
                                            xAxisId={1}
                                            dy={-1}
                                            dataKey="label2"
                                            style={{
                                                fontSize: 10,
                                            }}/>

                                        <XAxis xAxisId={2} dy={-18} dataKey="label" axisLine={false} tickLine={false}/>
                                        <YAxis
                                            type="number"
                                            allowDataOverFlow={true}/>
                                        <Tooltip cursor={false}/>

                                        <Bar
                                            isAnimationActive={false}
                                            barSize={30}
                                            dataKey="BCR1">
                                            <LabelList
                                                resultName={'Nytte/kost ratio'}
                                                barWidth={30}
                                                totalCases={totalCases}
                                                dataKey="BCR1"
                                                content={<BarCustomizedLabel/>}
                                            />

                                            {
                                                newNKR.map((entry, index) => {
                                                    return <Cell key={`cell-${index}`} fill={barColors[index + 1]}/>
                                                })
                                            }

                                        </Bar>
                                        <Bar
                                            isAnimationActive={false}
                                            barSize={30}
                                            dataKey="BCR2">
                                            <LabelList
                                                resultName={'Nytte/kost ratio'}
                                                barWidth={30}
                                                totalCases={totalCases}
                                                dataKey="BCR2"
                                                content={<BarCustomizedLabel/>}
                                            />
                                            {
                                                newNKR.map((entry, index) => {
                                                    return <Cell key={`cell-${index}`} fill={barColors[index + 1]}/>
                                                })
                                            }
                                        </Bar>

                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        );
    }
}

const mapStateToProps = state => ({
    screenSize: state.page.screenSize,
    outputColumns: state.modelScreen.outputColumns,
    graphWrapperWidth: state.modelScreen.graphWrapperWidth,
    graphOutput: state.modelScreen.graphOutput,
    graphOutputLabel: state.modelScreen.graphOutputLabel,
    graphBaseValue: state.modelScreen.graphBaseValue,
    caseNumbers: state.modelScreen.caseNumbers,
    diseaseBlockName: state.modelScreen.inputs.block_sjukdom_name,
    budgetName: state.modelScreen.inputs.budget_name,
    modelInputs: state.modelScreen.inputs,
    optGraphHelpText: state.modelScreen.graphHelpText,
});

export default connect(mapStateToProps, {
    setGraphWrapperWidth,
    changeOutputColumns,
    showInfoPopup,
})(withTranslation()(GraphView));

