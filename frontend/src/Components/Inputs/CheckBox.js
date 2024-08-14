import React, {Component} from 'react';
import './CheckBox.css'

class CheckBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tick: false,
            fieldValue: false,
        }
    }

    clickHandler() {
        const fieldValueChanger = this.props.fieldValue === undefined || this.props.fieldValue === false || this.props.fieldValue === '' ? true : false;
        this.props.checkUncheckHandler(fieldValueChanger, this.props.fieldName, this.props.fieldID);
    }

    render() {
        const icon = this.props.fieldValue === undefined || this.props.fieldValue === false || this.props.fieldValue === '' ? '' :
            <i className="fa fa-check fa-check-thin" aria-hidden="true"></i>;
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
                <input type="hidden" name={this.props.fieldName} value={this.props.fieldValue}/>
            </div>
        );
    }
}

export default CheckBox;

