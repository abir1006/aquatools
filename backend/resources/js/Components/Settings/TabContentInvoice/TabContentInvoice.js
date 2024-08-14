import React, { Component } from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import { connect } from 'react-redux';
import EditInvoiceSettings from "./EditInvoiceSettings";
import AddButton from "../../Inputs/AddButton";
import AddInvoiceSettings from "./AddInvoiceSettings";

import { showInvoiceSettingsConfirmPopup } from "../../../Store/Actions/popupActions";
import {
    showAddInvoiceSettingsForm,
    hideInvoiceSettingsForms,
    showEditInvoiceSettingsForm,
    getInvoiceSettingsData,
    setSelectedInvoiceID,
    setInvoiceSettingsInputs,
    setCurrencyData,
    setInvoiceDurationData,
} from "../../../Store/Actions/invoiceSettingsActions";
import DateTimeService from "../../../Services/DateTimeServices";
import { withTranslation } from 'react-i18next';

class TabContentInvoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSettingsId: null,
        }

        this.props.hideInvoiceSettingsForms();
    }

    componentDidMount() {
        this.props.getInvoiceSettingsData();
        this.props.setCurrencyData();
        this.props.setInvoiceDurationData();
    }

    addInvoiceSettingsHandler() {
        this.props.showAddInvoiceSettingsForm();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    editInvoiceSettingsHandler(invoiceSettingsId) {
        this.props.showEditInvoiceSettingsForm();
        this.props.setSelectedInvoiceID(invoiceSettingsId);

        // find selected Invoice settings data
        let selectedSettings = {};
        Object.keys(this.props.data).forEach(key => {
            if (this.props.data[key].id === invoiceSettingsId) {
                selectedSettings = this.props.data[key];
                return false;
            }
        });

        // set selected invoice settings data in redux states for edit/ update

        for (let index in selectedSettings) {
            this.props.setInvoiceSettingsInputs({
                [index]: selectedSettings[index]
            });
        }

        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    confirm(itemId) {
        this.props.showInvoiceSettingsConfirmPopup(itemId);
    }

    render() {

        const { t } = this.props;

        const showAddInvoiceSettingsForm = this.props.addInvoiceSettings;
        const showEditInvoiceSettingsForm = this.props.editInvoiceSettings;
        const invoiceSettingsData = this.props.data;

        // set acl permission for user add
        const hasAddPermission = this.props.auth.acl.invoice_settings !== undefined ? this.props.auth.acl.invoice_settings.save : false;
        const hasEditPermission = this.props.auth.acl.invoice_settings !== undefined ? this.props.auth.acl.invoice_settings.update : false;
        const hasDeletePermission = this.props.auth.acl.invoice_settings !== undefined ? this.props.auth.acl.invoice_settings.delete : false;

        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col- col-xl-9 col-lg-7 col-md-6 col-sm-6">
                            <TabHeading
                                tabHeading={t('invoice_settings')}
                                tabSubHeading={t('invoice_settings_subheading')} />
                        </div>
                        <div className="col- col-xl-3 col-lg-5 col-md-6 col-sm-6 pt-lg-2 text-right">
                            {hasAddPermission && <AddButton
                                onClickHandler={this.addInvoiceSettingsHandler.bind(this)}
                                name={t('add' + ' ' + t('settings'))}
                            />}
                        </div>

                    </div>

                    <div className="table-responsive text-nowrap">
                        <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">{t('id')}</th>
                                    <th scope="col">{t('currency')}</th>
                                    <th scope="col">{t('subscription_duration')}</th>
                                    <th scope="col">{t('status')}</th>
                                    <th scope="col">{t('created')}</th>
                                    <th scope="col">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    Object.keys(invoiceSettingsData).map(index => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{invoiceSettingsData[index].id}</th>
                                                <td>{invoiceSettingsData[index].currency}</td>
                                                <td>{invoiceSettingsData[index].type}</td>
                                                <td>
                                                    {invoiceSettingsData[index].status === 1 && <i className="fa fa-check white-stroke color-green"></i>}
                                                    {invoiceSettingsData[index].status !== 1 && <i className="fa fa-times"></i>}
                                                </td>
                                                <td>{DateTimeService.getDateTime(invoiceSettingsData[index].created_at)}</td>
                                                <td>
                                                    {hasEditPermission && <button
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.editInvoiceSettingsHandler(invoiceSettingsData[index].id)}>
                                                        <img src="images/edit_icon.svg" />
                                                    </button>}
                                                    {hasDeletePermission && <button
                                                        type="button"
                                                        onClick={e => this.confirm(invoiceSettingsData[index].id)}
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

                {showAddInvoiceSettingsForm && <AddInvoiceSettings />}
                {showEditInvoiceSettingsForm &&
                    <EditInvoiceSettings selectedSettingsId={this.state.selectedSettingsId} />}

            </div>
        );
    }
}

const mapStateToProps = state => ({
    popup: state.popup,
    editInvoiceSettings: state.invoiceSettings.editInvoiceSettings,
    addInvoiceSettings: state.invoiceSettings.addInvoiceSettings,
    data: state.invoiceSettings.data,
    auth: state.auth,
});

export default connect(mapStateToProps, {
    showInvoiceSettingsConfirmPopup,
    showAddInvoiceSettingsForm,
    showEditInvoiceSettingsForm,
    hideInvoiceSettingsForms,
    getInvoiceSettingsData,
    setSelectedInvoiceID,
    setInvoiceSettingsInputs,
    setCurrencyData,
    setInvoiceDurationData,
})(withTranslation()(TabContentInvoice));

