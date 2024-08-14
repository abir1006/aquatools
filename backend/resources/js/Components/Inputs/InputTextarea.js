import React from 'react';

export default function InputTextarea(props) {
    const onChangeValue = (e) => {
        props.fieldOnChange(e.target);
    }

    let fieldClass = props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';
    let rows = rows in props ? props.rows : 3;
    let cols = cols in props ? props.cols : 10;

    return (
        <textarea
            disabled={props.isDisable === "true"}
            name={props.fieldName}
            className={fieldClass}
            id={props.fieldID}
            placeholder={props.fieldPlaceholder}
            value={props.fieldValue}
            onChange={onChangeValue} >

        </textarea>
    );
}

