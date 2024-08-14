import React from 'react';

const ToggleUpDown = props => {
    if(props.toggle === 'asc') {
        return <i className="fa fa-sort-up ml-2" />
    }
    return <i className="fa fa-sort-down ml-2" />;
}

export default ToggleUpDown

