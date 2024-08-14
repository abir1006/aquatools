import React from 'react';

const ButtonSpinner = props => {
    if (props.showSpinner === undefined || props.showSpinner === false) {
        return null;
    }
    return <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"/>;
}

export default ButtonSpinner;
