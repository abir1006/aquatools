import React from 'react';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const RemoveButton = props => {
    const btnClickHandler = e => {
        props.onClickHandler();
    }

    return (
        <button
            className="btn default-btn-atv2 btn-danger"
            onClick={btnClickHandler}
            type="button" disabled={props.buttonDisabled || props.hasFormChange === undefined ? false : !props.hasFormChange}>
            <ButtonSpinner showSpinner={props.buttonDisabled}/>
            {props.name}
        </button>
    );
}

export default RemoveButton;

