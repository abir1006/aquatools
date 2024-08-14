import React from 'react';
import './StatisticsWidget.css';

const StatsWidget = props => {
    return (
        <div className="stats_widget_block">
            <div style={{borderColor: props.color}} className="widget_circle">
                {props.count}
            </div>
            <p>{props.label}</p>
        </div>
    );
}

export default StatsWidget;

