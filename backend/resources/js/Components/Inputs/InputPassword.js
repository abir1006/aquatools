import React from 'react';

export default function InputPassword(props) {
    const onChangeValue = (e) => {
        props.fieldOnChange(e.target);
    }

    let fieldClass = props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';

    return (
        <input
            type="password"
            name={props.fieldName}
            className={fieldClass}
            placeholder={props.fieldPlaceholder}
            value={props.fieldValue}
            onChange={onChangeValue}/>
    );
}

