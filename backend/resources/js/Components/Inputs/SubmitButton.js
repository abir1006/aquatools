import React from 'react';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const SubmitButton = props => {
    return (
        <button
            className="btn btn-primary default-btn-atv2"
            type="submit" disabled={props.buttonDisabled}>
            <ButtonSpinner showSpinner={props.buttonDisabled}/>
            {props.btnText}
        </button>
    );
}

export default SubmitButton;

