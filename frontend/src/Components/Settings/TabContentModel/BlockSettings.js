import React, { Component } from 'react';
import '../Settings.css';
import './ModelSettings.css';
import { connect } from 'react-redux';
import {
    showModelBlockSettingsForm,
    hideModelBlockForms,
    setModelBlockInputs,
    setModelBlockInputEmptyErrors,
    resetModelBlockInputEmptyErrors,
    setModelBlockInputErrorMessage,
} from "../../../Store/Actions/ModelBlockActions";

import { showBlockBulkDeleteConfirmPopup } from "../../../Store/Actions/popupActions";
import EditBlock from "./EditBlock";
import SettingsIcon from "../../MainNavigation/Images/menu_settings_icon.svg";
import { withTranslation } from 'react-i18next';
import CheckBox from "../../Inputs/CheckBox";

class BlockSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showBlockSettings: false,
            blockStatus: []
        }
    }

    showBlockSettingsHandler() {
        this.setState({
            ...this.state,
            blockStatus: this.state.blockStatus.filter((item, key) => key !== this.props.blockData.id),
            showBlockSettings: true,
        })

        // unselect that block when expand block settings area
        this.props.selectedBlockCallback(false, this.props.blockData.id);
    }

    cancelBlockSettings() {
        this.setState({
            ...this.state,
            showBlockSettings: false,
        })
    }

    selectBlockHandler(tickStatus, fieldName, blockID) {
        this.state.blockStatus[blockID] = tickStatus;
        this.props.selectedBlockCallback(tickStatus, blockID);
    }


    render() {

        const { t } = this.props;

        const showBlockSettingsForm = this.state.showBlockSettings;
        const block = this.props.blockData;
        const checkFieldValue = this.state.blockStatus[block.id] === undefined ? '' : this.state.blockStatus[block.id];
        const modelBlocksClass = showBlockSettingsForm === true ? 'content-block-grey no-radius model_blocks model_blocks_expand' : 'content-block-grey no-radius model_blocks model_blocks_collapsed';

        return (
            <div className={modelBlocksClass}>
                {!showBlockSettingsForm && t(block.name)}
                <div className="block_action_buttons">
                    {showBlockSettingsForm === false && <button
                        type="button"
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3"
                        onClick={e => this.showBlockSettingsHandler()}>
                        <img height="14" className="svg-dark-icon" src={SettingsIcon}
                            alt={t('title') + ' ' + t('icon')} />
                    </button>}
                    {showBlockSettingsForm && <button
                        type="button"
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3"
                        onClick={e => this.cancelBlockSettings()}>
                        <i className="fa fa-minus grey-stroke mr-0" aria-hidden="true"></i>
                    </button>}
                    {showBlockSettingsForm === false && <CheckBox fieldValue={checkFieldValue}
                        fieldID={block.id}
                        checkUncheckHandler={this.selectBlockHandler.bind(this)} />}
                    {/*{showBlockSettingsForm === false && <button*/}
                    {/*    type="button"*/}
                    {/*    onClick={e => this.confirm(block.id)}*/}
                    {/*    className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3">*/}
                    {/*    <img height="14" src="images/remove_icon.svg" />*/}
                    {/*</button>}*/}
                </div>
                {showBlockSettingsForm && <EditBlock blockData={block} />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    inputs: state.modelBlock.inputs,
    blockSettings: state.modelBlock.blockSettings,
});


export default connect(mapStateToProps, {
    showModelBlockSettingsForm,
    hideModelBlockForms,
    setModelBlockInputs,
    setModelBlockInputEmptyErrors,
    resetModelBlockInputEmptyErrors,
    setModelBlockInputErrorMessage,
    showBlockBulkDeleteConfirmPopup,
})(withTranslation()(BlockSettings));

