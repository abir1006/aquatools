import React, {Component} from 'react';
import './CheckBox.css'
import EditableField from "./EditableField/EditableField";
import DiscountField from "./DiscountField/DiscountField";

class CheckBoxPrice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tick: false,
            fieldValue: false,
        }
    }

    clickHandler() {
        const tickChanger = this.state.tick !== true;
        const fieldValueChanger = this.state.fieldValue !== true;
        this.setState({
            ...this.state,
            tick: tickChanger,
            fieldValue: fieldValueChanger,
        });
        this.props.checkUncheckHandler();
    }

    render() {
        const icon = this.state.tick === true ? <i className="fa fa-check fa-check-thin" aria-hidden="true"></i> : '';
        return (
            <div className="at2_check_box_block">
                <span
                    className="at2_check_box"
                    onClick={e => this.clickHandler()}>
                    {icon}
                </span>
                <span
                    className="checkbox_text"
                    onClick={e => this.clickHandler()}> {this.props.text}
                </span>
                <input type="hidden" name={this.props.fieldName} value={this.state.fieldValue}/>
            </div>
        );
    }
}

export default CheckBoxPrice;

