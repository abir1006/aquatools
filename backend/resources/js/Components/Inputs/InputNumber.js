import React, {Component} from 'react';
import {number_format} from "../../Services/NumberServices";

class InputNumber extends Component {

    constructor(props) {
        super(props);
    }

    onlyNumbersWithSingleDot(value) {
        let val = value;

        // Remove multiple minus inside numbers keeping only beginning
        if ((val.split('-').length - 1) > 1) {
            val = val.replace('-', '');
            val = -val;
        }

        if (this.props.allowThousandSep !== undefined && this.props.allowThousandSep === true) {
            if ((val.split(' ').length - 1) > 1) {
                val = val.replace(' ', '');
            }
        }


        // Allow minus sign once at beginning
        if (val === '-') {
            return val;
        }

        if (isNaN(val)) {
            if (this.props.allowThousandSep !== undefined && this.props.allowThousandSep === true) {
                val = val.replace(/[^0-9\ .]/g, '');
            } else {
                val = val.replace(/[^0-9\.]/g, '');
            }
            if (val.split('.').length > 2)
                val = val.replace(/\.+$/, "");
        }

        //console.log(val);

        return val;
    }

    onChangeValue(e) {
        let value = e.target.value;

        // If field value type negative then convert value into negative automatically.
        if (this.props.fieldValueType !== undefined && value !== '' && this.props.fieldValueType === 'negative' && value > 0) {
            value = -1 * value;
            value = value.toString();
        }

        value = this.onlyNumbersWithSingleDot(value);
        // if (this.props.allowThousandSep !== undefined && this.props.allowThousandSep === true) {
        //     value = number_format(value, 0, '.', ' ');
        // }
        const name = e.target.name;
        this.props.fieldOnChange({name, value});
    }

    render() {

        let fieldClass = this.props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';

        return (
            <input
                type="text"
                disabled={this.props.isDisable === "true"}
                name={this.props.fieldName}
                className={fieldClass}
                id={this.props.fieldID}
                placeholder={this.props.fieldPlaceholder}
                value={this.props.fieldValue}
                onChange={e => this.onChangeValue(e)}/>
        );
    }
}

export default InputNumber;
