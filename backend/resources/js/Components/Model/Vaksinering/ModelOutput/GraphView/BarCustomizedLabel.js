import React from "react";
import {number_format} from "../../../../../Services/NumberServices";

const BarCustomizedLabel = props => {
    const {resultName, barWidth, totalCases, numberOfColumns, colHeight, x, y, fill, value, viewBox} = props;
    let barHeight = viewBox.height;
    let yAxis = y + 10;
    let yAxisValue = yAxis + (barHeight / 2);
    if (Math.abs(viewBox.height) < 15) {
        yAxisValue = viewBox.height < 0 ? y - 10 : y - 5;
    }
    let fillColor = Math.abs(viewBox.height) < 15 ? '#787878' : '#ffffff';

    const percentageStr = resultName === 'deadPercentage' ? ' %' : '';

    let fontSize = 15;

    let dec = 2;

    if (resultName === 'driftsResultat') {
        dec = 0;
    }

    if (resultName === 'okteUtgifter' || resultName === 'biologiskeTap' || resultName === 'tonnSloyd' || resultName === 'deadPercentage') {
        dec = 1;
    }

    if (resultName === 'Nytte/kost ratio') {
        dec = 1;
    }

    let formatValue = number_format(value, dec, '.', ' ');

    let dividedBy = 2;

    if (numberOfColumns === 2) {
        dividedBy = 1.85;
    }

    if (totalCases === 5) {
        dividedBy = 2.25;
    }

    if (resultName === 'Nytte/kost ratio') {
        if (totalCases === 4) {
            dividedBy = 2.25;
        }

        if (totalCases === 5) {
            dividedBy = 2;
        }
        //formatValue = value;
        fontSize = 13;
    }

    if (resultName === 'okteUtgifter' && Math.round(viewBox.height) <= 5) {
        yAxisValue = yAxisValue - 10;
    }

    if (resultName === 'biologiskeTap' && Math.round(viewBox.height) <= 5) {
        yAxisValue = yAxisValue - 2;
    }

    return <text
        fontWeight="bold"
        fontSize={fontSize}
        x={parseFloat(x + barWidth / dividedBy)}
        y={yAxisValue} fill={fillColor}
        textAnchor="middle">
        {formatValue + percentageStr}
    </text>
}

export default BarCustomizedLabel;
