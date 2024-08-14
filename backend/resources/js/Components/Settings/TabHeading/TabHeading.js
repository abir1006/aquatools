import React from 'react';

import '../Settings.css';

const TabHeading = props => {
    return (
        <div className="tab_heading">
            <h2>{props.tabHeading}</h2>
            <p>{props.tabSubHeading}</p>
            {props.child}
        </div>
    );
}

export default TabHeading;

