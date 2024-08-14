import React, { Component } from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import AddButton from "../../Inputs/AddButton";
import { connect } from 'react-redux';
import DateTimeService from "../../../Services/DateTimeServices";
import ContentSpinner from "../../Spinners/ContentSpinner";
import AddModel from "./AddModel";
import EditModel from "./EditModel";

import {
    setModelByID,
    hideModelForms,
    showAddModelForm,
    showEditModelForm,
    showModelSettingsForm,
} from "../../../Store/Actions/ModelActions";
import { resetModelBlockInputs } from "../../../Store/Actions/ModelBlockActions";
import { modelBlockList } from "../../../Store/Actions/ModelBlockActions";
import { showModelDeleteConfirmPopup } from "../../../Store/Actions/popupActions";
import { companyListAll } from "../../../Store/Actions/companyActions";
import SettingsIcon from "../../MainNavigation/Images/menu_settings_icon.svg";
import ModelSettings from "./ModelSettings";
import { withTranslation } from 'react-i18next';

class TabContentModels extends Component {
    constructor(props) {
        super(props);
        this.props.hideModelForms();
    }

    addModelHandler() {
        this.props.hideModelForms();
        this.props.resetModelBlockInputs();
        this.props.showAddModelForm();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    editModelHandler(modelId) {
        this.props.hideModelForms();
        this.props.resetModelBlockInputs();
        this.props.setModelByID(modelId, this.props.data);
        this.props.showEditModelForm();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    changeSettingsHandler(modelId) {
        this.props.companyListAll();
        this.props.setModelByID(modelId, this.props.data);
        this.props.modelBlockList(modelId);
        this.props.showModelSettingsForm();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    confirm(itemId) {
        this.props.showModelDeleteConfirmPopup(itemId);
    }

    render() {

        const { t } = this.props;

        const models = this.props.data;
        const showAddModelForm = this.props.addModel;
        const showEditModelForm = this.props.editModel;
        const showModelSettingsBlock = this.props.modelSettings;

        // set acl permission for user add
        const hasAddPermission = this.props.acl.models !== undefined ? this.props.acl.models.save : false;
        const hasEditPermission = this.props.acl.models !== undefined ? this.props.acl.models.update : false;
        const hasDeletePermission = this.props.acl.models !== undefined ? this.props.acl.models.delete : false;

        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col- col-xl-9 col-lg-9 col-md-8 col-sm-7">
                            <TabHeading
                                tabHeading={t('all_models')}
                                tabSubHeading={t('model_settings_subheading')} />
                        </div>
                        <div className="col- col-xl-3 col-lg-3 col-md-4 col-sm-5 pt-lg-2 text-right">
                            {hasAddPermission && <AddButton
                                onClickHandler={this.addModelHandler.bind(this)}
                                name={t('add') + ' ' + t('model')}
                            />}
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <ContentSpinner />
                        <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">{t('id')}</th>
                                    <th scope="col">{t('name')}</th>
                                    <th scope="col">{t('slug')}</th>
                                    <th scope="col">{t('status')}</th>
                                    <th scope="col">{t('created')}</th>
                                    <th scope="col">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    models.map(model => {
                                        return (
                                            <tr key={model.id}>
                                                <th scope="row">{model.id}</th>
                                                <td>{model.name}</td>
                                                <td>{model.slug}</td>
                                                <td><i className="fa fa-check white-stroke color-green"></i></td>
                                                <td>{DateTimeService.getDateTime(model.created_at)}</td>
                                                <td>{!hasEditPermission && !hasDeletePermission && '-'}
                                                    {hasEditPermission && <button
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.editModelHandler(model.id)}>
                                                        <img src="images/edit_icon.svg" />
                                                    </button>}

                                                    {hasEditPermission && <button
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.changeSettingsHandler(model.id)}>
                                                        <img className="svg-dark-icon" src={SettingsIcon}
                                                            alt={t('title') + ' ' + t('icon')} />
                                                    </button>}
                                                    {hasDeletePermission && <button
                                                        type="button"
                                                        onClick={e => this.confirm(model.id)}
                                                        className="btn btn-primary-outline at2-btn-no-bg">
                                                        <img src="images/remove_icon.svg" />
                                                    </button>}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {showAddModelForm && <AddModel t={t} />}
                {showEditModelForm && <EditModel t={t} />}
                {showModelSettingsBlock && <ModelSettings t={t} />}

            </div>
        );
    }
}

const mapStateToProps = state => ({
    data: state.modelSettings.data,
    addModel: state.modelSettings.addModel,
    editModel: state.modelSettings.editModel,
    modelSettings: state.modelSettings.modelSettings,
    popup: state.popup,
    acl: state.auth.acl,
});

export default connect(mapStateToProps, {
    setModelByID,
    hideModelForms,
    resetModelBlockInputs,
    showAddModelForm,
    showEditModelForm,
    showModelSettingsForm,
    showModelDeleteConfirmPopup,
    modelBlockList,
    companyListAll,
})(withTranslation()(TabContentModels));

