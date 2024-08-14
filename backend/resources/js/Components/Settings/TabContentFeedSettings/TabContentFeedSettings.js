import React, { Component } from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import AddButton from "../../Inputs/AddButton";
import { connect } from 'react-redux';

import AddFeedSettings from "./AddFeedSettings";
import SettingsIcon from "../../MainNavigation/Images/menu_settings_icon.svg";
import ChangeFeedSettings from "./ChangeFeedSettings";

import {
    setFeedFormFieldsData,
    feedSettingsList,
    resetFeedFieldSettings,
    showFeedFieldsSettingsForm,
    showEditFeedSettingsForm,
    hideFeedFieldsSettingsForm,
    showAddFeedSettingsForm,
    setFeedSettingsName,
} from "../../../Store/Actions/FeedSettingsActions";

import { showFeedSettingsDeleteConfirmPopup } from "../../../Store/Actions/popupActions";
import EditFeedSettings from "./EditFeedSettings";
import { withTranslation } from 'react-i18next';

class TabContentFeedSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settingsID: ''
        }
        this.props.resetFeedFieldSettings();
        this.props.hideFeedFieldsSettingsForm();

    }

    componentDidMount() {
        this.props.feedSettingsList();
    }

    addFeedSettingsHandler() {
        this.props.hideFeedFieldsSettingsForm();
        this.props.showAddFeedSettingsForm();
    }

    editFeedSettingHandler(settingsID) {
        this.props.resetFeedFieldSettings();
        this.props.hideFeedFieldsSettingsForm();
        this.setState({
            ...this.state,
            settingsID: settingsID
        });

        const selectedFeedSettingsData = this.props.feedSettingsData.find(settingsData => settingsData.id === settingsID);

        this.props.setFeedSettingsName(selectedFeedSettingsData.name);
        this.props.showEditFeedSettingsForm();
    }

    feedLibraryChangeSettingsHandler(settingsID) {
        this.props.resetFeedFieldSettings();
        this.props.hideFeedFieldsSettingsForm();
        this.setState({
            ...this.state,
            settingsID: settingsID
        })

        const selectedFeedSettingsData = this.props.feedSettingsData.find(settingsData => settingsData.id === settingsID);

        if (selectedFeedSettingsData.fields_data === null) {
            this.props.setFeedFormFieldsData([]);
        } else {
            this.props.setFeedFormFieldsData(selectedFeedSettingsData.fields_data);
        }
        this.props.showFeedFieldsSettingsForm();
    }

    confirm(itemId) {
        this.props.showFeedSettingsDeleteConfirmPopup(itemId);
    }

    render() {

        const { t } = this.props;

        const feedSettingsData = this.props.feedSettingsData === undefined ? [] : this.props.feedSettingsData;
        const showAddRoleForm = this.props.addRole;
        const showEditRoleForm = this.props.editRole;


        // set acl permission for user add
        const hasAddPermission = this.props.auth.acl['roles'] !== undefined ? this.props.auth.acl.roles.save : false;
        const hasEditPermission = this.props.auth.acl['roles'] !== undefined ? this.props.auth.acl.roles.update : false;
        const hasDeletePermission = this.props.auth.acl['roles'] !== undefined ? this.props.auth.acl.roles.delete : false;

        const showFeedLibraryFieldsSettingsForm = this.props.showFeedLibraryFieldsSettingsForm === undefined ? false : this.props.showFeedLibraryFieldsSettingsForm;
        const showAddFeedSettingsForm = this.props.addFeedSettingsForm === undefined ? false : this.props.addFeedSettingsForm;
        const showEditFeedSettingsForm = this.props.editFeedSettingsForm === undefined ? false : this.props.editFeedSettingsForm;

        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col- col-xl-9 col-lg-9 col-md-8 col-sm-7">
                            <TabHeading
                                tabHeading={t('feed_settings')}
                                tabSubHeading={t('feed_settings_subheading')} />
                        </div>
                        <div className="col- col-xl-3 col-lg-3 col-md-4 col-sm-5 pt-lg-2 text-right">
                            {hasAddPermission && <AddButton
                                onClickHandler={this.addFeedSettingsHandler.bind(this)}
                                name={t('add_new_settings')}
                            />}
                        </div>
                    </div>
                    <div className="table-responsive text-nowrap">
                        {feedSettingsData.length > 0 && <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">{t('id')}</th>
                                    <th scope="col">{t('settings_name')}</th>
                                    <th scope="col">{t('action')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    feedSettingsData.map(settingsData => {
                                        return (
                                            <tr key={settingsData.id}>
                                                <th scope="row">{settingsData.id}</th>
                                                <td>{settingsData.name}</td>
                                                <td>
                                                    <button
                                                        title={t('edit') + ' ' + t('settings')}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.editFeedSettingHandler(settingsData.id)}>
                                                        <img src="images/edit_icon.svg" />
                                                    </button>
                                                    <button
                                                        title={t('change') + ' ' + t('settings')}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.feedLibraryChangeSettingsHandler(settingsData.id)}>
                                                        <img
                                                            className="svg-dark-icon"
                                                            src={SettingsIcon}
                                                            alt={t('settings')} />
                                                    </button>
                                                    <button
                                                        title={t('delete') + ' ' + t('settings')}
                                                        type="button"
                                                        onClick={e => this.confirm(settingsData.id)}
                                                        className="btn btn-primary-outline at2-btn-no-bg">
                                                        <img src="images/remove_icon.svg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                        }
                    </div>
                </div>

                {showFeedLibraryFieldsSettingsForm === true && <ChangeFeedSettings settingsID={this.state.settingsID} />}
                {showAddFeedSettingsForm === true && <AddFeedSettings />}
                {showEditFeedSettingsForm === true && <EditFeedSettings settingsID={this.state.settingsID} />}

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page,
    feedSettingsData: state.feedSettings.feedSettingsData,
    popup: state.popup,
    showFeedLibraryFieldsSettingsForm: state.feedSettings.feedLibraryFieldsSettingsForm,
    addFeedSettingsForm: state.feedSettings.addFeedSettingsForm,
    editFeedSettingsForm: state.feedSettings.editFeedSettingsForm,
});

export default connect(mapStateToProps, {
    showFeedSettingsDeleteConfirmPopup,
    feedSettingsList,
    showFeedFieldsSettingsForm,
    hideFeedFieldsSettingsForm,
    resetFeedFieldSettings,
    setFeedFormFieldsData,
    showAddFeedSettingsForm,
    showEditFeedSettingsForm,
    setFeedSettingsName,
})(withTranslation()(TabContentFeedSettings));

