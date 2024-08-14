import React, {Component} from 'react';
import './EditableField.css';
import {connect} from "react-redux";
import {setCompanyInputs, setModelTrialErrors} from "../../../Store/Actions/companyActions";

class EditableField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            showEditIcon: true,
            showCloseIcon: false,
            showText: true,
            inputValue: '',
            enableLocalState: false,
        }
    }

    onMouseOutHandler() {
        this.setState({
            ...this.state,
            showEditIcon: false,
        })
    }

    async onClickEditHandler() {
        await this.setState({
            ...this.state,
            showInput: true,
            showText: false,
            showEditIcon: false,
            showCloseIcon: true,
        })
    }

    onClickCloseHandler() {
        this.setState({
            ...this.state,
            showInput: false,
            showText: true,
            showEditIcon: true,
            showCloseIcon: false,
        })
    }

    onChangeHandler(e) {
        // remove first comma
        const inputs = e.target.value.replace(/^[,+.]/, '');
        // only price with comma and dot accepted
        const expression = this.props.invoiceSettingsData.currency === 'NOK' ? /[^\d^,\d]+/g : /[^\d^.\d]+/g;
        let value = inputs.replace(expression, '');
        const modelSlug = this.props.fieldName.replace('_price','');
        if (value > 0 && Boolean(this.props.modelTrialErrors) && Boolean(this.props.modelTrialErrors[modelSlug])) {
            delete this.props.modelTrialErrors[modelSlug];
            this.props.setModelTrialErrors(this.props.modelTrialErrors);
        }
        this.props.setCompanyInputs({[this.props.fieldName]: value});
    }

    render() {

        let fieldValue = this.props.inputs[this.props.fieldName] === undefined ? '' : this.props.inputs[this.props.fieldName];

        return (
            <span className="editable_block"
                  style={{width: this.state.showInput === true ? this.props.inputSize + 'px' : 'auto'}}
            >
                {this.state.showText && fieldValue}
                {
                    this.state.showInput &&
                    <input
                        className="form-control"
                        type="text"
                        value={fieldValue}
                        onChange={e => this.onChangeHandler(e)}/>
                }
                {
                    this.state.showEditIcon &&
                    <i
                        onClick={e => this.onClickEditHandler(e)}
                        className="fa fa-pencil"
                        aria-hidden="true"></i>
                }

                {
                    this.state.showCloseIcon &&
                    <i
                        onClick={e => this.onClickCloseHandler(e)}
                        className="fa fa-times"
                        aria-hidden="true"></i>
                }
            </span>
        );
    }
}


const mapStateToProps = state => ({
    invoiceSettingsData: state.company.invoiceSettingsData,
    inputs: state.company.inputs,
    modelTrialErrors: state.company.modelTrialErrors,
})


export default connect(mapStateToProps, {
    setCompanyInputs,
    setModelTrialErrors,
})(EditableField);
