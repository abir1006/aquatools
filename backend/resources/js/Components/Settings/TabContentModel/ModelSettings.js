import React, { Component } from 'react';
import '../Settings.css';
import './ModelSettings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import CancelButton from "../../Inputs/CancelButton";

import {
    hideModelForms,
    setModelInputs,
    setModelInputEmptyErrors,
    resetModelInputEmptyErrors,
    setModelInputErrorMessage,
    updateModel,
} from "../../../Store/Actions/ModelActions";
import { resetModelBlockInputs } from "../../../Store/Actions/ModelBlockActions";
import { resetModuleInputs } from "../../../Store/Actions/ModuleActions";
import BlockSettings from "./BlockSettings";
import AddBlock from "./AddBlock";
import AddModule from "./AddModule";
import ModuleSettings from "./ModuleSettings";
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";

import { showBlockBulkDeleteConfirmPopup } from "../../../Store/Actions/popupActions";
import TokenService from "../../../Services/TokenServices";
import { bulkDeleteBlockData } from "../../../Store/Actions/ModelBlockActions";
import ButtonSpinner from "../../Spinners/ButtonSpinner";
import SuccessIcon from "../../IconButton/SuccessIcon";
import { withTranslation } from "react-i18next";


class ModelSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonDisabled: false,
            isFieldEmpty: false,
            errorMessage: null,
            selectedBlockIDs: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);

        //load all transla need in help text input fields
        this.props.i18n.reloadResources(this.props.languages.map(lang => lang.code));
    }

    componentDidUpdate() {

        // Action when blocks bulk delete confirmed yes
        if (Boolean(this.props.confirmBlockBulkDelete) && this.state.selectedBlockIDs.length > 0) {
            this.props.bulkDeleteBlockData(this.state.selectedBlockIDs);
            this.setState({
                ...this.state,
                selectedBlockIDs: []
            })
        }
    }

    deleteBlocksHandler() {
        const payloads = {
            itemIDs: this.state.selectedBlockIDs,
            message: 'Do you really want to delete selected block(s)?',
        }
        this.props.showBlockBulkDeleteConfirmPopup(payloads);
    }

    onChangeHandler(inputTargets) {
        const { name, value } = inputTargets;

        this.props.resetModelInputEmptyErrors();
        this.props.setModelInputEmptyErrors('');

        if (name === 'name') {
            this.props.setModelInputs({ name: value });
        }

    }

    async updateModelHandler() {

        this.props.resetModelInputEmptyErrors();
        this.props.setModelInputErrorMessage('');

        const { name, slug } = this.props.inputs;

        let fieldEmpty = false;

        if (name === '') {
            fieldEmpty = true;
            this.props.setModelInputEmptyErrors('isNameFieldEmpty');
        }

        if (fieldEmpty) {
            this.props.setModelInputErrorMessage('Field should not be empty');
            return false;
        }

        // proceed to model update API
        this.props.updateModel(this.props.inputs)

    }

    cancelHandler() {
        this.props.hideModelForms();
        this.props.resetModelBlockInputs();
        this.props.resetModuleInputs();
    }

    async selectedBlockHandler(tickStatus, blockID) {

        if (tickStatus === true) {
            await this.setState({
                ...this.state,
                selectedBlockIDs: [...this.state.selectedBlockIDs, blockID]
            });
        } else {
            await this.setState({
                ...this.state,
                selectedBlockIDs: this.state.selectedBlockIDs.filter(item => item !== blockID)
            })
        }

    }


    render() {

        const { t } = this.props;

        const blockList = this.props.blocks;
        const moduleList = this.props.modules;
        let countBlock = 0;
        let countModule = 0;

        const blockDeleteButtonDisable = Boolean(this.props.showBlockDeleteSpinner) || this.state.selectedBlockIDs.length === 0;
        const showBlockDeleteSpinner = Boolean(this.props.showBlockDeleteSpinner);

        return (
            <div className="content-block edit-block no-radius mb-lg-4" id="model_settings">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={this.props.inputs.name + ' ' + t('model_settings')}
                            tabSubHeading="" />
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                        <CancelButton
                            onClickHandler={this.cancelHandler.bind(this)}
                            name={t('cancel')}
                        />
                    </div>
                    <div className="col-lg-12">
                        <div className="section-block">
                            <div className="row">
                                <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <AddBlock t={t} />
                                </div>
                                <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <div className="content-block-grey no-radius">
                                        <strong>{t('all_blocks')} ({blockList.length})</strong>
                                        <div className="pull-right">
                                            <ButtonSpinner showSpinner={showBlockDeleteSpinner} />
                                            <SuccessIcon
                                                showSuccessIcon={Boolean(this.props.showBlockDeleteSuccess)} />
                                            <SaveButtonSmall buttonDisabled={blockDeleteButtonDisable}
                                                onClickHandler={this.deleteBlocksHandler.bind(this)}
                                                name="Delete" />
                                        </div>
                                    </div>
                                </div>
                                {
                                    blockList.map(block => {
                                        countBlock++;
                                        return <div key={countBlock}
                                            className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                            <BlockSettings
                                                blockData={block}
                                                selectedBlockCallback={this.selectedBlockHandler.bind(this)} />
                                        </div>
                                    })
                                }
                            </div>

                            {/*<div className="row">*/}
                            {/*    <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">*/}
                            {/*        <AddModule/>*/}
                            {/*    </div>*/}
                            {/*    <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12">*/}
                            {/*        <div className="content-block-grey no-radius">*/}
                            {/*            <strong>All Modules ({moduleList.length})</strong>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    {*/}
                            {/*        moduleList.map(module => {*/}
                            {/*            countModule++;*/}
                            {/*            return <div key={countModule}*/}
                            {/*                        className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12"><ModuleSettings*/}
                            {/*                moduleData={module}/></div>*/}
                            {/*        })*/}
                            {/*    }*/}
                            {/*</div>*/}

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    inputs: state.modelSettings.inputs,
    blocks: state.modelBlock.data,
    modules: state.module.data,
    confirmBlockBulkDelete: state.popup.confirmBlockBulkDelete,
    showBlockDeleteSpinner: state.modelBlock.showBlockDeleteSpinner,
    showBlockDeleteSuccess: state.modelBlock.showBlockDeleteSuccess,
    languages: state.translations.languages,
});

export default connect(mapStateToProps, {
    hideModelForms,
    setModelInputs,
    setModelInputEmptyErrors,
    setModelInputErrorMessage,
    resetModelInputEmptyErrors,
    resetModelBlockInputs,
    resetModuleInputs,
    updateModel,
    showBlockBulkDeleteConfirmPopup,
    bulkDeleteBlockData,
})(withTranslation()(ModelSettings));

