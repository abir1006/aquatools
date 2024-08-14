import React, { Component } from 'react';
import SettingsIcon from "../../MainNavigation/Images/menu_settings_icon.svg";
import EditBlockInput from "./EditBlockInput";
import axios from "axios";
import TokenServices from "../../../Services/TokenServices";
import CheckBox from "../../Inputs/CheckBox";
import { withTranslation } from 'react-i18next';

class BlockInputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInputSettings: false,
            inputsStatus: []
        }
    }

    showInputSettingsHandler() {

        this.setState({
            ...this.state,
            inputsStatus: this.state.inputsStatus.filter((item, key) => key !== this.props.blockInput.id),
            showInputSettings: true,
        });

        this.props.selectedInputsCallback(false, this.props.blockInput.id);
    }

    updateBlockInputHandler(updatedInputData) {
        this.props.updateBlockInputState(updatedInputData);
    }

    cancelHandler() {
        this.setState({
            ...this.state,
            showInputSettings: false,
        })
    }

    onMouseDownHandler(index) {
        this.props.onDragIconCallback(index);
    }

    onMouseUpHandler(index) {
        this.props.onDropIconCallback(index);
    }

    selectInputHandler(tickStatus, fieldName, inputID) {
        this.state.inputsStatus[inputID] = tickStatus;
        this.props.selectedInputsCallback(tickStatus, inputID);
    }

    render() {

        const { t } = this.props;

        const blockInput = this.props.blockInput;
        const checkFieldValue = this.state.inputsStatus[blockInput.id] === undefined ? '' : this.state.inputsStatus[blockInput.id];

        const blockInputClass = this.state.showInputSettings === true ? 'content-block-grey no-radius block_inputs block_inputs_expanded' : 'content-block-grey no-radius block_inputs block_inputs_collapsed';

        return (
            <div className={blockInputClass}>
                {this.state.showInputSettings === false && <i
                    onMouseDown={e => this.onMouseDownHandler(this.props.inputIndex)}
                    onMouseUp={e => this.onMouseUpHandler(this.props.inputIndex)}
                    className="fa fa-arrows" aria-hidden="true" />}
                {this.state.showInputSettings === false && t(this.props.blockInput.name)}
                <div className="action_buttons">
                    {this.state.showInputSettings === false && <button
                        type="button"
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3"
                        onClick={e => this.showInputSettingsHandler()}>
                        <img height="14" className="svg-dark-icon" src={SettingsIcon}
                            alt="Title Icon" />
                    </button>}
                    {this.state.showInputSettings && <button
                        type="button"
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3"
                        onClick={e => this.cancelHandler()}>
                        <i className="fa fa-minus grey-stroke mr-0" aria-hidden="true"></i>
                    </button>}
                    {this.state.showInputSettings === false &&
                        <CheckBox fieldValue={checkFieldValue}
                            fieldID={blockInput.id}
                            checkUncheckHandler={this.selectInputHandler.bind(this)} />}
                </div>
                {this.state.showInputSettings && <EditBlockInput
                    updateBlockInput={this.updateBlockInputHandler.bind(this)}
                    blockInput={blockInput} />}
            </div>
        );
    }
}


export default withTranslation()(BlockInputField);

