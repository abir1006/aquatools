import React, {Component} from 'react';
import './InputPassword.css';

class InputPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPassword: false
        }
    }

    showHidePassword(){
        this.setState({
            ...this.state,
            showPassword: this.state.showPassword === false
        })
    }
    onChangeValue(e){
        this.props.fieldOnChange(e.target);
    }

    render() {
        let fieldClass = this.props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';
        const iconClass = this.state.showPassword === true ? 'fa fa-eye-slash' : 'fa fa-eye';
        const type = this.state.showPassword === true ? 'text' : 'password';
        return (
            <div className="input-password">
                <input
                    type={type}
                    name={this.props.fieldName}
                    className={fieldClass}
                    placeholder={this.props.fieldPlaceholder}
                    value={this.props.fieldValue}
                    onChange={e => this.onChangeValue(e)}/>
                <i onClick={ e => this.showHidePassword(e)} className={iconClass}></i>
            </div>
        );
    }
}

export default InputPassword;

