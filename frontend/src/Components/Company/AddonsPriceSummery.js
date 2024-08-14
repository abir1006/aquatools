import React from 'react';
import {connect} from "react-redux";


const AdddonsPriceSummery = props => {

    let reportPrice = props.inputs.custom_report_price === '' ? 0 : props.inputs.custom_report_price;

    if (props.inputs.custom_report_price !== '') {
        reportPrice = reportPrice.toString().replace(',', '.');
    }

    reportPrice = parseFloat(reportPrice);

    const reportDiscount = parseFloat(props.inputs.custom_report_discount);

    if (reportDiscount > 0) {
        reportPrice = reportPrice - (reportPrice * (reportDiscount / 100));
    }

    if (props.inputs.custom_report_permission === '' || props.inputs.custom_report_permission === false) {
        reportPrice = 0;
    }

    if (props.inputs.custom_report_is_sent !== undefined && props.inputs.custom_report_is_sent === true) {
        reportPrice = 0;
    }

    let downloadTemplatePrice = props.inputs.download_template_price === '' ? 0 : props.inputs.download_template_price;

    if (props.inputs.download_template_price !== '') {
        downloadTemplatePrice = downloadTemplatePrice.toString().replace(',', '.');
    }

    downloadTemplatePrice = parseFloat(downloadTemplatePrice);

    const downloadTemplateDiscount = parseFloat(props.inputs.download_template_discount);

    if (downloadTemplateDiscount > 0) {
        downloadTemplatePrice = downloadTemplatePrice - (downloadTemplatePrice * (downloadTemplateDiscount / 100));
    }

    if (props.inputs.download_template_permission === '' || props.inputs.download_template_permission === false) {
        downloadTemplatePrice = 0;
    }

    if (props.inputs.download_template_is_sent !== undefined && props.inputs.download_template_is_sent === true) {
        downloadTemplatePrice = 0;
    }

    let shareTemplatePrice = props.inputs.share_template_price === '' ? 0 : props.inputs.share_template_price;

    if (props.inputs.share_template_price !== '') {
        shareTemplatePrice = shareTemplatePrice.toString().replace(',', '.');
    }

    shareTemplatePrice = parseFloat(shareTemplatePrice);

    const shareTemplateDiscount = parseFloat(props.inputs.share_template_discount);

    if (shareTemplateDiscount > 0) {
        shareTemplatePrice = shareTemplatePrice - (shareTemplatePrice * (shareTemplateDiscount / 100));
    }

    if (props.inputs.share_template_permission === '' || props.inputs.share_template_permission === false) {
        shareTemplatePrice = 0;
    }

    if (props.inputs.share_template_is_sent !== undefined && props.inputs.share_template_is_sent === true) {
        shareTemplatePrice = 0;
    }

    let saveTemplatePrice = props.inputs.save_template_price === '' ? 0 : props.inputs.save_template_price;

    if (props.inputs.save_template_price !== '') {
        saveTemplatePrice = saveTemplatePrice.toString().replace(',', '.');
    }

    saveTemplatePrice = parseFloat(saveTemplatePrice);

    const saveTemplateDiscount = parseFloat(props.inputs.save_template_discount);

    if (saveTemplateDiscount > 0) {
        saveTemplatePrice = saveTemplatePrice - (saveTemplatePrice * (saveTemplateDiscount / 100));
    }

    if (props.inputs.save_template_permission === '' || props.inputs.save_template_permission === false) {
        saveTemplatePrice = 0;
    }

    if (props.inputs.save_template_is_sent !== undefined && props.inputs.save_template_is_sent === true) {
        saveTemplatePrice = 0;
    }

    let saveCodPrice = props.inputs.save_cod_price === '' ? 0 : props.inputs.save_cod_price;

    if (props.inputs.save_cod_price !== '') {
        saveCodPrice = saveCodPrice.toString().replace(',', '.');
    }

    saveCodPrice = parseFloat(saveCodPrice);

    const saveCodDiscount = parseFloat(props.inputs.save_cod_discount);

    if (saveCodDiscount > 0) {
        saveCodPrice = saveCodPrice - (saveCodPrice * (saveCodDiscount / 100));
    }

    if (props.inputs.save_cod_permission === '' || props.inputs.save_cod_permission === false) {
        saveCodPrice = 0;
    }

    if (props.inputs.save_cod_is_sent !== undefined && props.inputs.save_cod_is_sent === true) {
        saveCodPrice = 0;
    }

    let addonsPriceSummery = reportPrice + downloadTemplatePrice + shareTemplatePrice + saveTemplatePrice + saveCodPrice;

    addonsPriceSummery = Number.isInteger(addonsPriceSummery) ? addonsPriceSummery : addonsPriceSummery.toFixed(2);

    if (props.inputs.currency === 'NOK') {
        addonsPriceSummery = addonsPriceSummery.toString().replace('.', ',');
    }

    const currencySymbolBefore = <span>{props.currencySymbols[props.inputs.currency]}</span>;

    return (
        <div className="price_summery pt-2 pb-2">
            <p className="label">Summery</p>
            <p className="price">{currencySymbolBefore}{addonsPriceSummery}</p>
        </div>
    )
}


const mapStateToProps = state => ({
    currencySymbols: state.company.currencySymbols,
    inputs: state.company.inputs,
    invoiceSettingsData: state.company.invoiceSettingsData,
});

export default connect(mapStateToProps)(AdddonsPriceSummery);
