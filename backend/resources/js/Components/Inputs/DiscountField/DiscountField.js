import React, {Component} from 'react';
import InputText from "../InputText";
import './DiscountField.css';

class DiscountField extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showInput: false,
            showEditIcon: true,
            showCloseIcon: false,
            showText: true,
            inputValue: 0,
            enableLocalState: false,
        }
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            inputValue: this.props.fieldValue === undefined || this.props.fieldValue === '' ? 0 : this.props.fieldValue
        })
    }

    onMouseOutHandler() {
        this.setState({
            ...this.state,
            showEditIcon: false,
        })
    }

    onClickEditHandler() {
        this.setState({
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
        let value = e.target.value.replace(/[^\d]+/g, '');
        value = value > 100 ? 100 : value;
        this.setState({
            ...this.state,
            enableLocalState: true,
            inputValue: value
        })

        this.props.fieldOnChange(value, this.props.fieldName);
    }

    render() {
        const fieldValue = this.state.enableLocalState === true ? this.state.inputValue : this.props.fieldValue
        return (
            <span className="discount_block" alt="Add Discount"
                  style={{width: this.state.showInput === true ? this.props.inputSize + 'px' : 'auto'}}
            >
                {
                    this.state.showInput &&

                    <input
                        type="text"
                        className="form-control"
                        value={fieldValue}
                        onChange={e => this.onChangeHandler(e)}/>

                } {this.state.showInput && <span className="discount_percentage"> % </span>}
                {
                    this.state.showEditIcon &&
                    <i
                        onClick={e => this.onClickEditHandler(e)}
                        className="fa fa-percent"
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


export default DiscountField;
