import React from 'react';
import { connect } from "react-redux";


const TotalPriceSummery = props => {

    const { t } = props;

    const subscriptionPeriod = props.inputs.type === 'Yearly' ? t('total_annual_cost') : t('total_monthly_cost');


    let geneticsPrice = parseFloat(props.inputs.genetics_price);

    const geneticDiscount = parseFloat(props.inputs.genetics_discount);

    if (geneticDiscount > 0) {
        geneticsPrice = geneticsPrice - (geneticsPrice * (geneticDiscount / 100));
    }

    if (props.inputs.genetics_permission === '' || props.inputs.genetics_permission === false) {
        geneticsPrice = 0;
    }

    if (props.inputs.genetics_is_sent !== undefined && props.inputs.genetics_is_sent === true) {
        geneticsPrice = 0;
    }

    let codPrice = parseFloat(props.inputs.cost_of_disease_price);

    const codDiscount = parseFloat(props.inputs.cost_of_disease_discount);

    if (codDiscount > 0) {
        codPrice = codPrice - (codPrice * (codDiscount / 100));
    }

    if (props.inputs.cost_of_disease_permission === '' || props.inputs.cost_of_disease_permission === false) {
        codPrice = 0;
    }

    if (props.inputs.cost_of_disease_is_sent !== undefined && props.inputs.cost_of_disease_is_sent === true) {
        codPrice = 0;
    }

    let slaktemodelPrice = parseFloat(props.inputs.slaktmodel_price);

    const slaktemodelDiscount = parseFloat(props.inputs.slaktmodel_discount);

    if (slaktemodelDiscount > 0) {
        slaktemodelPrice = slaktemodelPrice - (slaktemodelPrice * (slaktemodelDiscount / 100));
    }

    if (props.inputs.slaktmodel_permission === '' || props.inputs.slaktmodel_permission === false) {
        slaktemodelPrice = 0;
    }

    if (props.inputs.slaktmodel_is_sent !== undefined && props.inputs.slaktmodel_is_sent === true) {
        slaktemodelPrice = 0;
    }

    let vaksPrice = parseFloat(props.inputs.vaksinering_price);

    const vaksDiscount = parseFloat(props.inputs.vaksinering_discount);

    if (vaksDiscount > 0) {
        vaksPrice = vaksPrice - (vaksPrice * (vaksDiscount / 100));
    }

    if (props.inputs.vaksinering_permission === '' || props.inputs.vaksinering_permission === false) {
        vaksPrice = 0;
    }

    if (props.inputs.vaksinering_is_sent !== undefined && props.inputs.vaksinering_is_sent === true) {
        vaksPrice = 0;
    }

    let optimaliseringPrice = parseFloat(props.inputs.optimalisering_price);

    const optimaliseringDiscount = parseFloat(props.inputs.optimalisering_discount);

    if (optimaliseringDiscount > 0) {
        optimaliseringPrice = optimaliseringPrice - (optimaliseringPrice * (optimaliseringDiscount / 100));
    }

    if (props.inputs.optimalisering_permission === '' || props.inputs.optimalisering_permission === false) {
        optimaliseringPrice = 0;
    }

    if (props.inputs.optimalisering_is_sent !== undefined && props.inputs.optimalisering_is_sent === true) {
        optimaliseringPrice = 0;
    }

    let mtbPrice = parseFloat(props.inputs.mtb_price);

    const mtbDiscount = parseFloat(props.inputs.mtb_discount);

    if (mtbDiscount > 0) {
        mtbPrice = mtbPrice - (mtbPrice * (mtbDiscount / 100));
    }

    if (props.inputs.mtb_permission === '' || props.inputs.mtb_permission === false) {
        mtbPrice = 0;
    }

    if (props.inputs.mtb_is_sent !== undefined && props.inputs.mtb_is_sent === true) {
        mtbPrice = 0;
    }

    let knforPrice = parseFloat(props.inputs.kn_for_price);

    const knforDiscount = parseFloat(props.inputs.kn_for_discount);

    if (knforDiscount > 0) {
        knforPrice = knforPrice - (knforPrice * (knforDiscount / 100));
    }

    if (props.inputs.kn_for_permission === '' || props.inputs.kn_for_permission === false) {
        knforPrice = 0;
    }

    if (props.inputs.kn_for_is_sent !== undefined && props.inputs.kn_for_is_sent === true) {
        knforPrice = 0;
    }

    let reportPrice = parseFloat(props.inputs.custom_report_price);

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

    let downloadTemplatePrice = parseFloat(props.inputs.download_template_price);

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

    let shareTemplatePrice = parseFloat(props.inputs.share_template_price);

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

    let saveTemplatePrice = parseFloat(props.inputs.save_template_price);

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

    let saveCodPrice = parseFloat(props.inputs.save_cod_price);

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

    let usersPrice = parseFloat(props.inputs.users_price);

    let totalPriceSummery = geneticsPrice + codPrice + slaktemodelPrice + vaksPrice + optimaliseringPrice + mtbPrice + knforPrice + reportPrice + downloadTemplatePrice + shareTemplatePrice + saveTemplatePrice + saveCodPrice + usersPrice;


    totalPriceSummery = Number.isInteger(totalPriceSummery) ? totalPriceSummery : totalPriceSummery.toFixed(2);

    if (props.inputs.currency === 'NOK') {
        totalPriceSummery = totalPriceSummery.toString().replace('.', ',');
    }

    const currencySymbolBefore = <span className="nok_symbol">{props.currencySymbols[props.inputs.currency]}</span>;

    return (
        <div className="content-block content-block-light-blue" id="total_price_section">
            <div className="row">
                <div className="col- col-xl-5 col-lg-5 col-md-5 col-sm-12">
                    <p className="total_price_heading">
                        {subscriptionPeriod}
                    </p>
                </div>
                <div className="col- col-xl-7 col-lg-7 col-md-7 col-sm-12">
                    <p className="total_price_amount"><span
                        className="vat_text">{t('excluding_vat')}</span>{currencySymbolBefore}{totalPriceSummery}</p>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    currencySymbols: state.company.currencySymbols,
    inputs: state.company.inputs,
    invoiceSettingsData: state.company.invoiceSettingsData,
});

export default connect(mapStateToProps)(TotalPriceSummery);
