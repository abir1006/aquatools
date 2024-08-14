import React from 'react';

export default function InputEmail(props) {
    const onChangeValue = e => {
        props.fieldOnChange(e.target);
    }

    let fieldClass = props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';

    return (
        <input
            type="email"
            name={props.fieldName}
            className={fieldClass}
            placeholder={props.fieldPlaceholder}
            value={props.fieldValue}
            onChange={onChangeValue}/>
    );
}

