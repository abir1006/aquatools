import React from 'react';
import './StatisticsWidget.css';

const LastLogin = props => {
    return (
        <div className="stats_widget_block">
            <div style={{borderColor: props.color}} className="widget_circle">
                <p>
                    <span>{props.loginTime.day}</span> <br/>
                    {props.loginTime.month} <br/>
                    {props.loginTime.year}
                </p>
            </div>
            <p>{props.label}</p>
        </div>
    );
}

export default LastLogin;

