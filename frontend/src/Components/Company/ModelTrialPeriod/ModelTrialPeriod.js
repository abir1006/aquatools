import React from "react";
import './ModelTrialPeriod.css'
import moment from "moment";

const ModelTrialPeriod = props => {
    const onChangeValue = e => {
        props.fieldOnChange(e.target.value, props.modelSlug);
    }

    const trialEndText = Boolean(props.fieldValue) ? ', ends on: ' + props.modelTrialEnd : '';

    return (
        <div className="model_trial_period">
            <span className="label">trial</span>
            <input
                type="text"
                disabled={props.isDisable === "true"}
                name={props.fieldName}
                className="form-control"
                id={props.fieldID}
                placeholder={props.fieldPlaceholder}
                value={props.fieldValue}
                onChange={onChangeValue}/>
            <span className="duration_text">days{trialEndText}</span>
        </div>
    )
}

export default ModelTrialPeriod;
