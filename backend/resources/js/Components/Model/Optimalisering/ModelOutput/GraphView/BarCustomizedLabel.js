import React from "react";
import { number_format } from "../../../../../Services/NumberServices";

const BarCustomizedLabel = props => {
    const { resultName, barWidth, colHeight, x, y, fill, value, viewBox } = props;
    let barHeight = viewBox.height;
    let yAxis = y + 10;
    let yAxisValue = yAxis + (barHeight / 2);
    if (Math.abs(viewBox.height) < 15) {
        yAxisValue = viewBox.height < 0 ? y - 10 : y - 5;
    }
    let fillColor = Math.abs(viewBox.height) < 15 ? '#787878' : '#ffffff';

    const percentageStr = resultName === 'SGR' || resultName === 'Døde per gen %' ? ' %' : '';

    let fontSize = 15;

    let dec = 2;

    if (resultName === 'Slaktevolum HOG Tonn') {
        dec = 1;
    }

    if (resultName === 'Driftsresultat NOK 1000') {
        dec = 0;
    }

    if (resultName === 'Nytte/kost ratio') {
        dec = 1;
    }

    let formatValue = number_format(value, dec, '.', ' ');

    if (resultName === 'Nytte/kost ratio') {
        fontSize = 13;
    }

    return <text
        fontWeight="bold"
        fontSize={fontSize}
        x={x + barWidth / 2}
        y={yAxisValue} fill={fillColor}
        textAnchor="middle">
        {formatValue + percentageStr}
    </text>
}

export default BarCustomizedLabel;
