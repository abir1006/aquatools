import React from 'react';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const SaveButton = props => {
    const btnClickHandler = e => {
        props.onClickHandler();
    }

    return (
        <button
            className="btn btn-primary default-btn-atv2"
            onClick={btnClickHandler}
            type="button" disabled={props.buttonDisabled || props.hasFormChange === undefined ? false : !props.hasFormChange}>
            <ButtonSpinner showSpinner={props.buttonDisabled}/>
            {props.name}
        </button>
    );
}

export default SaveButton;

