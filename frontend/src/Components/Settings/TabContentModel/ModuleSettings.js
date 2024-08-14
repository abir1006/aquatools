import React, {Component} from 'react';
import '../Settings.css';
import './ModelSettings.css';
import {connect} from 'react-redux';

class ModuleSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModuleEdit: false,
        }
    }

    showModuleEditHandler() {
        this.setState({
            ...this.state,
            showModuleEdit: true,
        })

        // Block inputs API call
    }

    confirm(itemId) {
        this.props.showBlockDeleteConfirmPopup(itemId);
    }

    cancelBlockSettings() {
        this.setState({
            ...this.state,
            showModuleEdit: false,
        })
    }


    render() {

        const showModuleEditForm = this.state.showModuleEdit;
        const module = this.props.moduleData;

        return (
            <div className="content-block-grey no-radius model_blocks">
                {!showModuleEditForm && module.name}
                <div className="block_action_buttons">
                    {showModuleEditForm === false && <button
                        type="button"
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3"
                        onClick={e => this.showModuleEditHandler()}>
                        <img height="14" src="images/edit_icon.svg"/>
                    </button>}
                    {showModuleEditForm && <button
                        type="button"
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3"
                        onClick={e => this.cancelBlockSettings()}>
                        <i className="fa fa-times grey-stroke mr-0" aria-hidden="true"></i>
                    </button>}
                    <button
                        type="button"
                        onClick={e => this.confirm(module.id)}
                        className="btn btn-primary-outline at2-btn-no-bg mr-0 ml-3">
                        <img height="14" src="images/remove_icon.svg"/>
                    </button>
                </div>
                {/*{showModuleEditForm && <EditBlock blockData={block} />}*/}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    inputs: state.modelBlock.inputs,
    blockSettings: state.modelBlock.blockSettings,
});


export default connect(mapStateToProps)(ModuleSettings);

