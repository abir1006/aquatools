import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setGraphWrapperWidth, changeOutputColumns} from "../../../../../Store/Actions/MTBActions";
import './GraphView.css';

import {ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, LabelList} from 'recharts';
import BarCustomizedLabel from "./BarCustomizedLabel";
import {number_format} from "../../../../../Services/NumberServices";
import {withTranslation} from 'react-i18next';

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

        if (this.props.screenSize >= 1367 && this.props.outputColumns === 2 && this.props.caseNumbers.length <= 4) {
            this.props.changeOutputColumns();
        }
    }

    screenResize() {
        this.props.setGraphWrapperWidth(document.getElementById('graph-wrapper').offsetWidth);

        if (this.props.screenSize < 1367 && this.props.outputColumns === 3) {
            this.props.changeOutputColumns();
        }

        if (this.props.screenSize >= 1367 && this.props.outputColumns === 2 && this.props.caseNumbers.length <= 4) {
            this.props.changeOutputColumns();
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.screenResize.bind(this));
    }

    render() {

        const {t} = this.props;

        const graphOutput = this.props.graphOutput;

        const graphData = {};

        let countIndex = 0;

        const diseaseBlockName = this.props.diseaseBlockName === undefined || this.props.diseaseBlockName === '' ? 'SAV3' : this.props.diseaseBlockName;
        const budgetName = this.props.budgetName === undefined || this.props.budgetName === '' ? t('budget') : this.props.budgetName;

        let vaccineCaseLabel = {
            1: {Case1: budgetName},
            2: {Case1: budgetName, Case2: diseaseBlockName},
            3: {Case1: budgetName, Case2: diseaseBlockName, Case3: 'Vaks A'},
            4: {Case1: budgetName, Case2: diseaseBlockName, Case3: 'Vaks A', Case4: 'Vaks B'},
            5: {Case1: budgetName, Case2: diseaseBlockName, Case3: 'Vaks A', Case4: 'Vaks B', Case5: 'Vaks C'},
        };

        const totalCases = this.props.caseNumbers === undefined ? 3 : this.props.caseNumbers.length;


        for (let index in graphOutput) {
            let countCase = 0;
            let tmp = [];
            for (let caseStr in graphOutput[index]) {
                let percentageStr = index === 'sgr' || index === 'dodePerGen' ? ' %' : '';
                tmp[countCase] = {
                    label: vaccineCaseLabel[totalCases][caseStr],
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
            const percentageStr = resultName === 'deadPercentage' ? ' %' : '';

            let dec = 2;

            if (resultName === 'driftsResultat') {
                dec = 0;
            }

            if (resultName === 'Cod' || resultName === 'tonnSloyd') {
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

        let numberOfColumns = this.props.outputColumns;

        // if(totalCases > 4) {
        //     numberOfColumns = 2;
        // }

        let classArr = [];

        classArr.col1Class = 'graph-col pr-1';
        classArr.col2Class = numberOfColumns === 3 ? 'graph-col pl-1 pr-1' : 'graph-col pl-1';
        classArr.col3Class = numberOfColumns === 3 ? 'graph-col pl-1' : '';

        let countColumn = 0;
        let countGraph = 0;

        // calculate graph column width and height based on user select column count

        const dividedPlus = numberOfColumns === 3 ? 1 : 0.5;
        let graphColWidth = this.props.graphWrapperWidth / (numberOfColumns + dividedPlus);
        let graphColHeight = this.props.graphWrapperWidth / (numberOfColumns + dividedPlus + 1);

        if (this.props.screenSize >= 520 && this.props.screenSize <= 767) {
            graphColWidth = (this.props.graphWrapperWidth - 100) / 2;
            graphColHeight = (this.props.graphWrapperWidth - 50) / 2;
        }

        if (this.props.screenSize <= 519) {
            graphColWidth = this.props.graphWrapperWidth - 75;
            graphColHeight = this.props.graphWrapperWidth - 125;
        }

        //const cData = [{label: 'Case1', value: 500}, {label: 'Case2', value: 250}]

        const graphWrapperHeight = this.props.screenSize >= 768 ? this.state.graphWrapperHeight + 'px' : '100%';


        let codGraphData = [];

        this.props.caseNumbers.map((caseNo, keyNumber) => {
            if (caseNo !== 1) {
                codGraphData[keyNumber - 1] = {
                    label: vaccineCaseLabel[totalCases]['Case' + caseNo],
                    biologiskeTap: parseFloat(this.props.graphOutput.biologiskeTap['Case' + caseNo]),
                    okteUtgifter: parseFloat(this.props.graphOutput.okteUtgifter['Case' + caseNo]),
                    codColor: barColors[keyNumber]
                }
            }
        });

        const yAxisDataFormatter = (number) => {
            return parseInt(number);
        }

        let barSize = 45;

        if (numberOfColumns === 2) {
            barSize = 55;
        }

        let countGPMBarCell = -1;

        const excludedGraphs = [
            'nytteKostRatio1',
            'nytteKostRatio2',
            'biologiskeTap',
            'okteUtgifter',
            'grossProfitMargin',
        ]

        return (
            <div id="graph-wrapper" style={{height: graphWrapperHeight}}>
                {
                    Object.keys(graphData).map(index => {
                        if (excludedGraphs.includes(index)) {
                            return null;
                        }
                        let countBarCell = -1;
                        countGraph++;
                        countColumn++;
                        if (countColumn > numberOfColumns) {
                            countColumn = 1;
                        }
                        return (
                            <div key={countGraph} className={classArr['col' + countColumn + 'Class']}
                                 style={{width: (100 / numberOfColumns) + '%'}}>
                                <div className="content-block">
                                    <div className="graph-content">
                                        <h5 className="output-heading">{t(this.props.graphOutputLabel[index])}</h5>
                                        <div className="graph-plot">
                                            <ResponsiveContainer width="100%" height={graphColHeight}>
                                                <BarChart
                                                    data={graphData[index]}
                                                    margin={{
                                                        top: 15, right: 0, left: -20, bottom: 0,
                                                    }}>
                                                    <XAxis dataKey="label" minTickGap={-50}/>
                                                    <YAxis
                                                        type="number"
                                                        //tickFormatter={yAxisDataFormatter}
                                                        //domain={[this.props.graphBaseValue[index], dataMax => index === 'efcr' ? (dataMax + (dataMax / 7)).toFixed(2) : parseInt((dataMax + (dataMax / 7)).toFixed(0))]}
                                                        allowDataOverFlow={true}/>
                                                    <Tooltip
                                                        resultName={index}
                                                        content={CustomTooltip}
                                                        cursor={false}/>
                                                    <Bar
                                                        isAnimationActive={false}
                                                        barSize={barSize}
                                                        dataKey="value">
                                                        <LabelList
                                                            graphData={graphData[index]}
                                                            resultName={index}
                                                            barWidth={barSize}
                                                            totalCases={totalCases}
                                                            numberOfColumns={numberOfColumns}
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

                {/*Cost of disease graph*/}

                <div className={classArr['col' + countColumn + 'Class']} style={{width: (100 / numberOfColumns) + '%'}}>
                    <div className="content-block">
                        <div className="graph-content">
                            <h5 className="output-heading">{t('cost_of_disease_nok_1000')}</h5>
                            <div className="graph-plot">
                                <ResponsiveContainer width="100%" height={graphColHeight}>
                                    <BarChart
                                        stackOffset="sign"
                                        data={codGraphData}
                                        margin={{
                                            top: 40, right: 0, left: -20, bottom: 0,
                                        }}>
                                        <XAxis dataKey="label"/>
                                        <YAxis
                                            type="number"
                                            allowDataOverFlow={true}/>
                                        <Tooltip cursor={false}/>

                                        <Bar dataKey="biologiskeTap" isAnimationActive={false} barSize={barSize}
                                             stackId=""
                                             minPointSize={0}>
                                            <LabelList
                                                resultName={'biologiskeTap'}
                                                barWidth={barSize}
                                                dataKey="biologiskeTap"
                                                content={<BarCustomizedLabel/>}
                                            />
                                            {
                                                codGraphData.map((entry, index) => {
                                                    return <Cell key={`cell-${index}`} fill={entry.codColor}/>
                                                })
                                            }
                                        </Bar>
                                        <Bar dataKey="okteUtgifter" isAnimationActive={false} barSize={barSize}
                                             stackId=""
                                             fill="#c77100" minPointSize={0}>
                                            <LabelList
                                                resultName={'okteUtgifter'}
                                                barWidth={barSize}
                                                dataKey="okteUtgifter"
                                                content={<BarCustomizedLabel/>}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Gross Profit Margin */}

                <div className={classArr['col' + countColumn + 'Class']} style={{width: (100 / numberOfColumns) + '%'}}>
                    <div className="content-block">
                        <div className="graph-content" id={'graph-block-gpm'}>
                            <h5 className="output-heading">{t(this.props.graphOutputLabel['grossProfitMargin'])}
                                {
                                    Boolean(this.props.codGraphHelpText['grossProfitMargin']) && <button
                                        type="button"
                                        id={'help-text-id-gpm'}
                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                        onClick={e => this.viewHelpTextHandler(e, t(this.props.codGraphHelpText['grossProfitMargin']), 'graph-block-gpm')}>
                                        i
                                    </button>
                                }
                            </h5>
                            <div className="graph-plot">
                                <ResponsiveContainer width="100%" height={graphColHeight}>
                                    <BarChart
                                        data={graphData['grossProfitMargin']}
                                        margin={{
                                            top: 15, right: 0, left: -20, bottom: 0,
                                        }}>
                                        <XAxis dataKey="label" minTickGap={-50}/>
                                        <YAxis
                                            type="number"
                                            //tickFormatter={yAxisDataFormatter}
                                            //domain={[this.props.graphBaseValue[index], dataMax => index === 'efcr' ? (dataMax + (dataMax / 7)).toFixed(2) : parseInt((dataMax + (dataMax / 7)).toFixed(0))]}
                                            allowDataOverFlow={true}/>
                                        <Tooltip
                                            resultName={'grossProfitMargin'}
                                            content={CustomTooltip}
                                            cursor={false}/>
                                        <Bar
                                            isAnimationActive={false}
                                            barSize={barSize}
                                            dataKey="value">
                                            <LabelList
                                                graphData={graphData['grossProfitMargin']}
                                                resultName={'grossProfitMargin'}
                                                barWidth={barSize}
                                                totalCases={totalCases}
                                                numberOfColumns={numberOfColumns}
                                                dataKey="barLabelValue"
                                                content={<BarCustomizedLabel/>}
                                            />
                                            {
                                                graphData['grossProfitMargin'].map(caseRow => {
                                                    countGPMBarCell++;
                                                    return <Cell fill={barColors[countGPMBarCell]}/>
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
    codGraphHelpText: state.modelScreen.graphHelpText,
});

export default connect(mapStateToProps, {
    setGraphWrapperWidth,
    changeOutputColumns
})(withTranslation()(GraphView));

