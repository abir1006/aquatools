import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from "react-redux";


const ModelsPriceSummery = props => {

    const { t } = props;

    let geneticsPrice = props.inputs.genetics_price === '' ? 0 : props.inputs.genetics_price;

    if (props.inputs.genetics_price !== '' || props.inputs.genetics_price !== 0) {
        geneticsPrice = geneticsPrice.toString().replace(',', '.');
    }

    geneticsPrice = parseFloat(geneticsPrice);

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

    let codPrice = props.inputs.cost_of_disease_price === '' ? 0 : props.inputs.cost_of_disease_price;

    if (props.inputs.cost_of_disease_price !== '') {
        codPrice = codPrice.toString().replace(',', '.');
    }

    codPrice = parseFloat(codPrice);

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

    let slaktemodelPrice = props.inputs.slaktmodel_price === '' ? 0 : props.inputs.slaktmodel_price;

    if (props.inputs.slaktmodel_price !== '') {
        slaktemodelPrice = slaktemodelPrice.toString().replace(',', '.');
    }

    slaktemodelPrice = parseFloat(slaktemodelPrice);

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

    let vaksPrice = props.inputs.vaksinering_price === '' ? 0 : props.inputs.vaksinering_price;

    if (props.inputs.vaksinering_price !== '') {
        vaksPrice = vaksPrice.toString().replace(',', '.');
    }

    vaksPrice = parseFloat(vaksPrice);

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

    let optimaliseringPrice = props.inputs.optimalisering_price === '' ? 0 : props.inputs.optimalisering_price;

    if (props.inputs.optimalisering_price !== '') {
        optimaliseringPrice = optimaliseringPrice.toString().replace(',', '.');
    }

    optimaliseringPrice = parseFloat(optimaliseringPrice);

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

    let mtbPrice = props.inputs.mtb_price === '' ? 0 : props.inputs.mtb_price;

    if (props.inputs.mtb_price !== '') {
        mtbPrice = mtbPrice.toString().replace(',', '.');
    }

    mtbPrice = parseFloat(mtbPrice);

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

    let knforPrice = props.inputs.kn_for_price === '' ? 0 : props.inputs.kn_for_price;

    if (props.inputs.kn_for_price !== '') {
        knforPrice = knforPrice.toString().replace(',', '.');
    }

    knforPrice = parseFloat(knforPrice);

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

    let modelsPriceSummery = geneticsPrice + codPrice + slaktemodelPrice + vaksPrice + optimaliseringPrice + mtbPrice + knforPrice;

    // If set trial period then total price should be zero
    if (Boolean(props.inputs.trial_period)) {
        modelsPriceSummery = 0;
    }

    modelsPriceSummery = Number.isInteger(modelsPriceSummery) ? modelsPriceSummery : modelsPriceSummery.toFixed(2);

    if (props.inputs.currency === 'NOK') {
        modelsPriceSummery = modelsPriceSummery.toString().replace('.', ',');
    }

    const currencySymbolBefore = <span>{props.currencySymbols[props.inputs.currency]}</span>;

    return (
        <div className="price_summery pt-2 pb-2">
            <p className="label">{t('summary')}</p>
            <p className="price">{currencySymbolBefore}{modelsPriceSummery}</p>
        </div>
    )
}


const mapStateToProps = state => ({
    currencySymbols: state.company.currencySymbols,
    inputs: state.company.inputs,
    invoiceSettingsData: state.company.invoiceSettingsData,
});

export default connect(mapStateToProps)(withTranslation()(ModelsPriceSummery));
