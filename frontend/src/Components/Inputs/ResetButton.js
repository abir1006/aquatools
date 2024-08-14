import React from 'react';
import ButtonSpinner from "../Spinners/ButtonSpinner";

const ResetButton = props => {
    return (
        <button
            className="btn btn-primary default-btn-atv2 at2-login-btn"
            type="submit" disabled={props.buttonDisabled}>
            <ButtonSpinner showSpinner={props.buttonDisabled} />

            {props.buttonName}

        </button>
    );
}

export default ResetButton;

