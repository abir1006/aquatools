import React, { Component } from 'react';
import './InputNumberFloatingLabel.css';

class InputNumberFloatingLabel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            placeholder: '',
            floatLabel: '',
            showFloatingLabel: false,
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            placeholder: this.props.fieldPlaceholder,
            floatLabel: this.props.fieldPlaceholder
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fieldPlaceholder !== this.props.fieldPlaceholder)
            this.setState({
                ...this.state,
                placeholder: this.props.fieldPlaceholder,
                floatLabel: this.props.fieldPlaceholder
            })
    }


    onlyNumbersWithSingleDot(value) {
        let val = value;
        if (isNaN(val)) {
            val = val.replace(/[^0-9\.]/g, '');
            if (val.split('.').length > 2)
                val = val.replace(/\.+$/, "");
        }
        return val;
    }

    onChangeValue(e) {
        let value = this.onlyNumbersWithSingleDot(e.target.value);
        const name = e.target.name;
        this.props.fieldOnChange({ name, value });
    }

    onFocusHandler(e) {
        document.addEventListener('click', e => this.handleOutsideClick(e), false);
        this.setState({
            ...this.state,
            placeholder: '',
            showFloatingLabel: true,
        })
    }

    async handleOutsideClick(e) {

        if (this.node === null) {
            return;
        }

        // ignore clicks on the component itself

        if (this.node.contains(e.target)) {
            return;
        }

        await this.setState({
            ...this.state,
            placeholder: this.props.fieldPlaceholder,
            showFloatingLabel: false,
        });
    }

    render() {

        const fieldClass = this.props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';
        const showFloatingLabel = this.state.showFloatingLabel === true || this.props.fieldValue !== '';

        return (
            <div
                ref={node => {
                    this.node = node;
                }}
                className="input_floating_label">
                <input
                    type="text"
                    disabled={this.props.isDisable === "true"}
                    name={this.props.fieldName}
                    className={fieldClass}
                    id={this.props.fieldID}
                    placeholder={this.state.placeholder}
                    value={this.props.fieldValue}
                    onFocus={e => this.onFocusHandler(e)}
                    onChange={e => this.onChangeValue(e)} />

                {showFloatingLabel === true &&
                    <span className="floating_label">{this.state.floatLabel}</span>}
            </div>
        );
    }
}

export default InputNumberFloatingLabel;
