import React from 'react';
import { Link } from 'react-router-dom';

const LinkButton = props => {
    const url = props.url === undefined || props.url === '' ? '' : props.url;
    return (
        <Link to={url}>
            <button
                className="btn btn-primary default-btn-atv2"
                type="button">
                {props.btnText}
            </button>
        </Link>
    );
}

export default LinkButton;

