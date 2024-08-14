import React, {Component} from 'react';
import {connect} from 'react-redux';
import {setGraphWrapperWidth, changeOutputColumns} from "../../../../../Store/Actions/MTBActions";
import {setFeedBarColors} from "../../../../../Store/Actions/FeedModelActions";
import {showInfoPopup} from "../../../../../Store/Actions/popupActions";
import './GraphView.css';
import MainTimeline from "../Timeline/MainTimeline";
import {
    Bar,
    BarChart,
    Cell,
    LabelList,
    LineChart,
    Line,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";
import BarCustomizedLabel from "./BarCustomizedLabel";
import {number_format} from "../../../../../Services/NumberServices";
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

        if (this.props.screenSize >= 1367 && this.props.outputColumns === 2 && this.props.caseNumbers.length <= 4) {
            this.props.changeOutputColumns();
        }


        this.setGraphBarColor();
    }

    componentDidUpdate(prevProps, prevState) {
        if (JSON.stringify(prevProps.feedTimeline) !== JSON.stringify(this.props.feedTimeline)) {
            this.setGraphBarColor();
        }

    }

    setGraphBarColor() {

        // algorithm to find max feed weight color from timeline

        if (this.props.feedTimeline !== undefined) {

            let barColors = [];

            let feedTemp = {};

            Object.keys(this.props.feedTimeline).map(caseNo => {
                feedTemp[caseNo] = [];
                this.props.feedTimeline[caseNo].map((feed, keyNumber) => {
                    feedTemp[caseNo][keyNumber] = {
                        producer: feed.feed_producer,
                        weightRange: parseFloat(feed.feed_max_weight) - parseFloat(feed.feed_min_weight)
                    }
                })
            });

            Object.keys(feedTemp).map((caseNo, keyNumber) => {
                let maxWeightFeedItem = feedTemp[caseNo].filter(item => item.weightRange === Math.max(...feedTemp[caseNo].map(i => i.weightRange)));
                const producer = this.props.feedProducer.filter(producer => producer.name === maxWeightFeedItem[0]['producer']);
                barColors[keyNumber] = producer[0]['color'];
            });

            this.props.setFeedBarColors(barColors);
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

    viewHelpTextHandler(e, helpText, graphBlockID) {
        const infoText = helpText === null || helpText === undefined || helpText === '' ? 'Help text not found' : helpText;
        const popUpYPosition = document.getElementById(graphBlockID).getBoundingClientRect().top;
        const popUpXPosition = parseInt(document.getElementById(graphBlockID).getBoundingClientRect().left);
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
                // skip NKR case1
                if (index === 'nytteKostRatio' && caseStr === 'Case1') {
                    if (this.props.caseNumbers.length === 1) {
                        tmp[countCase] = {
                            label: t(caseStr.replace(' ', '').toLowerCase()),
                            value: 0,
                            barLabelValue: 0
                        };
                    }
                } else {
                    let percentageStr = '';
                    tmp[countCase] = {
                        label: t(caseStr.replace(' ', '').toLowerCase()),
                        value: parseFloat(graphOutput[index][caseStr]),
                        barLabelValue: graphOutput[index][caseStr] + percentageStr
                    };
                    countCase++;
                }

            }

            graphData[index] = tmp;

            countIndex++;
        }

        const CustomTooltip = ({active, payload, label, resultName}) => {
            let index = this.state.index;
            const percentageStr = resultName === 'SGR' || resultName === 'Døde per gen %' || resultName === 'Dødelighet %' ? ' %' : '';

            let dec = 2;

            if (resultName === 'Tonn sløyd') {
                dec = 1;
            }

            if (resultName === 'Slaktevekt rund') {
                dec = 0;
            }

            if (resultName === 'Nytte/kost ratio') {
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

        let barColors = ['#1573c3', '#00a7ed', '#00C36A', '#22EBA0', '#1BA0C3'];

        if (this.props.graphBarColors !== undefined) {
            barColors = this.props.graphBarColors;
        }

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

        const graphWrapperHeight = this.props.screenSize >= 768 ? this.props.blockScrollHeight + 'px' : '100%';

        const showGraphSection = this.props.graphOutputLabel !== undefined && Object.keys(graphData).length > 0;

        let newNKR = [{BCR1: 0, BCR2: 0, label: 'Case1', label2: "BCR1 ----- BCR2"}];
        let nkrCount = 0;

        const totalCases = this.props.caseNumbers === undefined ? 1 : this.props.caseNumbers.length;
        let removeDash = totalCases <= 2 ? 0 : (totalCases - 2);
        let dash = '----';
        dash = dash.slice(0, dash.length - removeDash);
        if (showGraphSection) {
            this.props.caseNumbers.slice(1, this.props.caseNumbers.length).map(caseNo => {
                newNKR[nkrCount] = {
                    BCR1: parseFloat(this.props.graphOutput.nytteKostRatio['Case' + caseNo]),
                    BCR2: parseFloat(this.props.graphOutput.nytteKostRatio2['Case' + caseNo]),
                    label: t('case' + caseNo),
                    label2: "BCR1 " + dash + " BCR2"
                }

                nkrCount++;
            });
        }

        const vektutvikling = this.props.vektutvikling;

        const vektGraphWidth = this.props.graphWrapperWidth - 50;
        const vektGraphHeight = vektGraphWidth * 0.4;

        let vektsDevData = [];

        if (this.props.vektutvikling !== undefined) {

            const tmpArray = Object.keys(vektutvikling).map(caseNo => {
                return parseInt(Object.keys(vektutvikling[caseNo]).length);
            });
            const maxKey = 'case' + (tmpArray.indexOf(Math.max(...tmpArray)) + 1);
            Object.keys(vektutvikling[maxKey]).map(date => {

                const dateItem = vektutvikling[maxKey][date];
                const item = {};
                item.date = date;
                item.temp = parseFloat(dateItem.temp);

                Object.keys(vektutvikling).map(caseNo => {

                    item[caseNo] = vektutvikling[caseNo][date]?.vekt;

                });

                vektsDevData.push(item);
            });
        }

        return (
            <div id="graph-wrapper" style={{height: graphWrapperHeight}}>
                <div className="content-block mb-3 p-2">
                    <MainTimeline/>
                </div>
                {
                    showGraphSection === true && Object.keys(graphData).map(index => {
                        if (index === 'nytteKostRatio' || index === 'nytteKostRatio2') {
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
                                                    <XAxis dataKey="label"/>
                                                    <YAxis
                                                        type="number"
                                                        domain={[this.props.graphBaseValue[index], dataMax => index === 'efcr' ? (dataMax + (dataMax / 7)).toFixed(2) : (dataMax + (dataMax / 7)).toFixed(0)]}
                                                        allowDataOverFlow={true}/>
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
                                                            graphData[index].map((caseRow, keyNumber) => {
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

                {showGraphSection === true &&
                <div className={classArr['col' + countColumn + 'Class']} style={{width: (100 / numberOfColumns) + '%'}}>
                    <div className="content-block">
                        <div className="graph-content" id={'graph-block-bcr'}>
                            <h5 className="output-heading">{t('benefit_cost_ratio')}
                                {
                                    Boolean(this.props.feedGraphHelpText['bcr']) && <button
                                        type="button"
                                        id={'help-text-id-1'}
                                        className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn"
                                        onClick={e => this.viewHelpTextHandler(e, 'bcr_graph', 'graph-block-bcr')}>
                                        i
                                    </button>
                                }</h5>
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
                </div>}

                {vektsDevData.length > 0 && <div className="graph-col" style={{width: '100%'}}>
                    <div className="content-block">
                        <div className="graph-content">
                            <h5 className="output-heading">{t('weight_development')}</h5>
                            <div className="graph-plot">
                                {/*<ResponsiveContainer width="100%" height="300px">*/}
                                <LineChart
                                    width={vektGraphWidth}
                                    height={vektGraphHeight}
                                    data={vektsDevData}
                                    margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                    }}>
                                    <CartesianGrid strokeDasharray="2 2"/>
                                    <XAxis dataKey="date"/>
                                    <YAxis
                                        yAxisId="left"
                                        label={{
                                            fontSize: 15,
                                            value: t('average_weight') + '(g)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            textAnchor: "end"
                                        }}/>
                                    <YAxis
                                        label={{value: t('temperature'), angle: -90, fontSize: 15}}
                                        yAxisId="right"
                                        orientation="right"/>
                                    <Tooltip/>
                                    {this.props.caseNumbers.map(caseNo => {
                                        return (
                                            <Line yAxisId="left" type="monotone" dataKey={'case' + caseNo}
                                                  strokeWidth={2}
                                                  stroke={barColors[caseNo - 1]}
                                                  activeDot={{r: 7}}/>
                                        )
                                    })}
                                    <Line yAxisId="right" type="monotone" dataKey="temp" strokeWidth={2}
                                          activeDot={{r: 7}}
                                          stroke="#ED7D31"/>
                                </LineChart>
                                {/*</ResponsiveContainer>*/}
                            </div>
                        </div>
                    </div>
                </div>}

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
    vektutvikling: state.feedModelScreen.vektutvikling,
    feedTimeline: state.feedModelScreen.feedTimeline,
    caseNumbers: state.modelScreen.caseNumbers,
    feedProducer: state.feedLibrary.feedProducer,
    graphBarColors: state.feedModelScreen.graphBarColors,
    feedGraphHelpText: state.modelScreen.graphHelpText,
    blockScrollHeight: state.modelScreen.blockScrollHeight,
})

export default connect(mapStateToProps, {
    setGraphWrapperWidth,
    changeOutputColumns,
    setFeedBarColors,
    showInfoPopup,
})(withTranslation()(GraphView));
