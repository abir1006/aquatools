import React from 'react';

export default function InputText(props) {
    const onChangeValue = (e) => {
        props.fieldOnChange(e.target);
    }

    let fieldClass = props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';

    return (
        <input
            type="text"
            disabled={props.isDisable === "true"}
            name={props.fieldName}
            className={fieldClass}
            id={props.fieldID}
            placeholder={props.fieldPlaceholder}
            value={props.fieldValue}
            onChange={onChangeValue}/>
    );
}

