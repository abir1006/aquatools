import React from 'react';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const ActionButton = props => {
    const btnClickHandler = e => {
        props.onClickHandler(e);
    }

    return (
        <button
            className="btn btn-primary default-btn-atv2"
            onClick={btnClickHandler}
            type="button" disabled={props.buttonDisabled || props.hasFormChange === undefined ? false : !props.hasFormChange}>
            <ButtonSpinner showSpinner={props.buttonDisabled} />
            {Boolean(props.faIcon) && <i class={'fa ' + props.faIcon} aria-hidden="true"></i>}
            {props.label}
            {props.children}
        </button>
    );
}

export default ActionButton;

