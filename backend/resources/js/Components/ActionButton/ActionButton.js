import React from 'react';
import './ActionButton.css';

const ActionButton = props => {
    const btnClickHandler = e => {
        props.onClickHandler();
    }

    const btnClass = "btn btn-primary default-btn-atv2 atv2-action-btn "+props.btnClass;
    const btnDisabled = props.btnDisabled === undefined ? false : props.btnDisabled;

    return (
        <button
            disabled={btnDisabled}
            className={btnClass}
            onClick={btnClickHandler}
            type="button">
            {props.children}
        </button>
    );
}

export default ActionButton;

