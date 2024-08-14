import React from 'react';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const SaveButtonSmall = props => {
    const btnClickHandler = e => {
        props.onClickHandler();
    }

    return (
        <button
            className="btn btn-primary default-btn-atv2 btn-small ml-2"
            onClick={btnClickHandler}
            type="button" disabled={props.buttonDisabled}>
            {props.name}
        </button>
    );
}

export default SaveButtonSmall;

