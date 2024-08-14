import React from 'react';

const CancelButton = props => {
    const btnClickHandler = e => {
        props.onClickHandler();
    }

    return (
        <button
            className="btn btn-primary default-btn-atv2"
            onClick={btnClickHandler}
            type="button">
            <i
                className="fa fa-times blue-stroke"
                aria-hidden="true"></i>
            <span className="btn-span">{props.name}</span>
        </button>
    );
}

export default CancelButton;

