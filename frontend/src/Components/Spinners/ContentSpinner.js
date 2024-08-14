import React from 'react';
import {connect} from 'react-redux';

const ContentSpinner = props => {
    if (props.spinner === undefined || props.spinner === false) {
        return null;
    }
    return (
        <div className="content_spinner">
            <i className="fa fa-refresh fa-spin" role="status" aria-hidden="true"></i>
        </div>
    );
}

const mapStateToProps = state => (
    {
        spinner: state.spinner.contentSpinner
    }
)

export default connect(mapStateToProps)(ContentSpinner);
