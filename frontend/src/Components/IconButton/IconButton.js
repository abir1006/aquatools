import React from 'react';
import './IconButton.css';

const IconButton = props => {
    const btnClick = () => {
        props.onClickHandler();
    }
    const btnDisabled = props.btnDisabled === undefined ? false : props.btnDisabled;
    return (
        <button
            style={props?.style || {}}
            title={props.title}
            disabled={btnDisabled}
            onClick={btnClick}
            className="btn btn-primary-outline at2-btn-no-bg at2-icon-btn">
            {props.children}
        </button>
    );
}

export default IconButton;

