import React from 'react';

const SuccessIcon = props => {
    if (!Boolean(props.showSuccessIcon)) {
        return null;
    }
    return <i className="fa fa-check color-green white-stroke" aria-hidden="true"/>

}

export default SuccessIcon;

