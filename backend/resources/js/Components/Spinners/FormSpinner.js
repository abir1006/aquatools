import React from 'react';
import './FormSpinner.css';
import {connect} from 'react-redux';

const FormSpinner = props => {
    if (props.formSpinner === undefined || props.formSpinner === false) {
        return null;
    }
    return (
        <div className="form_spinner">
            <i className="fa fa-refresh fa-spin" role="status" aria-hidden="true"></i>
        </div>
    );
}

const mapStateToProps = state => (
    {
        formSpinner: state.spinner.formSpinner
    }
)

export default connect(mapStateToProps)(FormSpinner);
