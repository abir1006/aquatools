import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../popup.css';
import './PriceModulePopup.css';
import {hidePriceModulePopup} from "../../../Store/Actions/popupActions";
import DropdownList from "../../Inputs/DropdownList/DropdownList";
import ListAutoComplete from "../../Inputs/ListAutoComplete/ListAutoComplete";
import InputText from "../../Inputs/InputText";
import SubmitButton from "../../Inputs/SubmitButton";
import moment from 'moment';

import {
    setPriceModuleInputs,
    resetPriceModuleInputs,
    priceModuleResult,
    addMTBLaksePrice,
    reloadPriceModuleDefaultInputs,
    takePriceModuleCVFrom,
    takePriceModuleSnittvektFrom,
} from "../../../Store/Actions/PriceModuleActions";

import {setModelResult} from "../../../Store/Actions/MTBActions";
import {setFeedModelResult} from "../../../Store/Actions/FeedModelActions";
import {setVaccineModelResult} from "../../../Store/Actions/VaccineModelActions";
import {setCodModelResult} from "../../../Store/Actions/CodModelActions";
import {setOptModelResult} from "../../../Store/Actions/OptModelActions";
import {setGeneticsModelResult} from "../../../Store/Actions/GeneticsModelActions";
import NavService from "../../../Services/NavServices";
import InputNumber from "../../Inputs/InputNumber";
import {withTranslation} from 'react-i18next';

class PriceModulePopup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            priceModulePopupHeight: 0,
            currentModel: '',
            historicEndLocalState: false,
            forwardEndLocalState: false,
        }
    }

    componentDidMount() {
        const caseNumbers = this.props.currentModelSlug === undefined || this.props.currentModelSlug === 'kn_for' ? [1] : this.props.caseNumbers;
        let priceModuleInputs = this.props.priceModuleInputs;
        let defaultSnittvekt = this.props.defaultSnittvekt;

        let defaultCV = this.props.defaultCV;

        // Iterate cases and set price module input default value if previously no value added
        caseNumbers.map(caseNo => {
            if (!Boolean(priceModuleInputs['lakse_pris_percentage_case' + caseNo])) {
                priceModuleInputs['lakse_pris_percentage_case' + caseNo] = 100;
            }
            priceModuleInputs['price_module_cv_case' + caseNo] = (Boolean(defaultCV) && Boolean(defaultCV['Case' + caseNo])) ? defaultCV['Case' + caseNo] : 22;
            priceModuleInputs['price_module_snittvekt_case' + caseNo] = (Boolean(defaultSnittvekt) && Boolean(defaultSnittvekt['Case' + caseNo])) ? defaultSnittvekt['Case' + caseNo] : 4.74;
        });

        let date = new Date();
        let currentYear = parseInt(date.getFullYear());
        let currentMonth = parseInt(date.getMonth()) + 1;
        let monthAfterYear = parseInt(moment().add(12, 'months').month()) + 1;
        let yearAfter12Months = parseInt(moment().add(12, 'months').year());
        let historicSelectedStart = '2020-09';
        let historicSelectedEnd = '2021-09';
        let forwardSelectedStart = currentYear + '-' + (currentMonth < 10 ? '0' + currentMonth : currentMonth);
        let forwardSelectedEnd = yearAfter12Months + '-' + (monthAfterYear < 10 ? '0' + monthAfterYear : monthAfterYear);

        priceModuleInputs.historic_period_start = priceModuleInputs?.historic_period_start || historicSelectedStart;
        priceModuleInputs.historic_period_end = priceModuleInputs?.historic_period_end || historicSelectedEnd;
        priceModuleInputs.forward_period_start = priceModuleInputs?.forward_period_start || forwardSelectedStart;
        priceModuleInputs.forward_period_end = priceModuleInputs?.forward_period_end || forwardSelectedEnd;

        this.props.setPriceModuleInputs({'historic_period_start': priceModuleInputs.historic_period_start});
        this.props.setPriceModuleInputs({'historic_period_end': priceModuleInputs.historic_period_end});
        this.props.setPriceModuleInputs({'forward_period_start': priceModuleInputs.forward_period_start});
        this.props.setPriceModuleInputs({'forward_period_end': priceModuleInputs.forward_period_end});
        this.props.priceModuleResult(priceModuleInputs, caseNumbers, NavService.getCurrentRoute());

        this.setState({
            ...this.state,
            currentModel: NavService.getCurrentRoute(),
            priceModulePopupHeight: document.getElementById('at2_price_module_popup').offsetHeight
        })
    }

    priceTypeChangeHandler(selectedValue) {
        let priceModuleInputs = this.props.priceModuleInputs;

        let date = new Date();
        let currentYear = parseInt(date.getFullYear());
        let currentMonth = parseInt(date.getMonth()) + 1;
        let monthAfterYear = parseInt(moment().add(12, 'months').month()) + 1;
        let yearAfter12Months = parseInt(moment().add(12, 'months').year());

        let historicEndYear = this.props?.outputs?.historic_end_year || '';
        let historicEndWeek = this.props?.outputs?.historic_end_week || '';

        let historicSelectedStart = (historicEndYear - 1) + '-' + ("0" + historicEndWeek).slice(-2)
        let historicSelectedEnd = historicEndYear + '-' + ("0" + historicEndWeek).slice(-2);

        let forwardSelectedStart = currentYear + '-' + (currentMonth < 10 ? '0' + currentMonth : currentMonth);
        let forwardSelectedEnd = yearAfter12Months + '-' + (monthAfterYear < 10 ? '0' + monthAfterYear : monthAfterYear);

        if (selectedValue === 'Forward') {
            priceModuleInputs.historic_period_start = historicSelectedStart;
            priceModuleInputs.historic_period_end = historicSelectedEnd;
            priceModuleInputs.forward_period_start = forwardSelectedStart;
            priceModuleInputs.forward_period_end = forwardSelectedEnd;
            this.props.setPriceModuleInputs({
                historic_period_start: historicSelectedStart
            });
            this.props.setPriceModuleInputs({
                historic_period_end: historicSelectedEnd
            });
            this.props.setPriceModuleInputs({
                forward_period_start: forwardSelectedStart
            });
            this.props.setPriceModuleInputs({
                forward_period_end: forwardSelectedEnd
            });
        } else {
            priceModuleInputs.historic_period_start = historicSelectedStart;
            priceModuleInputs.historic_period_end = historicSelectedEnd;
            this.props.setPriceModuleInputs({
                historic_period_start: historicSelectedStart
            });
            this.props.setPriceModuleInputs({
                historic_period_end: historicSelectedEnd
            });
        }

        priceModuleInputs.price_type = selectedValue;

        this.props.setPriceModuleInputs({
            price_type: selectedValue
        });

        this.props.priceModuleResult(priceModuleInputs, this.props.caseNumbers, NavService.getCurrentRoute());
    }

    forwardPeriodStart(name, id) {
        let priceModuleInputs = this.props.priceModuleInputs;

        priceModuleInputs.forward_period_start = name;

        const selectedYear = parseInt(name.split('-')[0]);
        const selectedMonth = parseInt(name.split('-')[1]);

        let nextMonth = (selectedMonth + 11) > 12 ? ((selectedMonth + 11) - 12) : (selectedMonth + 11);
        let nextYear = (selectedMonth + 11) > 12 ? (selectedYear + 1) : selectedYear;

        this.setState({
            ...this.state,
            forwardEndLocalState: true
        });

        this.props.setPriceModuleInputs({
            forward_period_start: name
        });

        this.props.setPriceModuleInputs({
            forward_period_end: nextYear + '-' + (nextMonth < 10 ? '0' + nextMonth : nextMonth)
        });

        priceModuleInputs.forward_period_end = nextYear + '-' + (nextMonth < 10 ? '0' + nextMonth : nextMonth)

        this.props.priceModuleResult(priceModuleInputs, this.props.caseNumbers, NavService.getCurrentRoute());
    }


    forwardPeriodEnd(name, id) {

        let priceModuleInputs = this.props.priceModuleInputs;

        priceModuleInputs.forward_period_end = name;

        this.setState({
            ...this.state,
            forwardEndLocalState: undefined
        });

        this.props.setPriceModuleInputs({
            forward_period_end: name
        });

        this.props.priceModuleResult(priceModuleInputs, this.props.caseNumbers, NavService.getCurrentRoute());
    }

    historicPeriodStart(name, id) {
        let historicEndYear = this.props.outputs?.historic_end_year;
        let historicEndWeek = this.props.outputs?.historic_end_week;
        let currentWeek = parseInt(moment().week());
        let priceModuleInputs = this.props.priceModuleInputs;
        priceModuleInputs.historic_period_start = name;
        const selectedYear = name.split('-')[0];
        let selectedWeek = name.split('-')[1];

        this.setState({
            ...this.state,
            historicEndLocalState: true
        });

        this.props.setPriceModuleInputs({
            historic_period_start: name
        });

        let historicPeriodEnd = (parseInt(selectedYear) + 1) + '-' + selectedWeek;

        if ((historicEndYear - selectedYear) == 0) {
            historicPeriodEnd = historicEndYear + '-' + ("0" + historicEndWeek).slice(-2);
        }

        if ((historicEndYear - selectedYear) == 1 && parseInt(selectedWeek) - historicEndWeek > 0) {
            historicPeriodEnd = historicEndYear + '-' + ("0" + historicEndWeek).slice(-2);
        }

        this.props.setPriceModuleInputs({
            historic_period_end: historicPeriodEnd
        });

        priceModuleInputs.historic_period_end = historicPeriodEnd;

        this.props.priceModuleResult(priceModuleInputs, this.props.caseNumbers, NavService.getCurrentRoute());
    }

    async historicPeriodEnd(name, id) {
        let priceModuleInputs = this.props.priceModuleInputs;
        priceModuleInputs.historic_period_end = name;
        await this.setState({
            ...this.state,
            historicEndLocalState: undefined
        });
        this.props.setPriceModuleInputs({
            historic_period_end: name
        });
        this.props.priceModuleResult(priceModuleInputs, this.props.caseNumbers, NavService.getCurrentRoute());
    }

    inputChangeHandler(inputTargets) {
        const {name, value} = inputTargets;
        let tmpInputs = this.props.priceModuleInputs;
        tmpInputs[name] = value;
        this.props.setPriceModuleInputs(
            {
                [name]: value
            }
        );

        let nameWithoutCase = name.slice(0, -1);

        if ('price_module_cv_case' === nameWithoutCase) {
            this.props.takePriceModuleCVFrom('input');
        }

        if ('price_module_snittvekt_case' === nameWithoutCase) {
            this.props.takePriceModuleSnittvektFrom('input');
        }


        if ('lakse_pris_percentage_case1' === name) {
            this.props.caseNumbers.slice(1, this.props.caseNumbers.length).map(caseNo => {
                tmpInputs['lakse_pris_percentage_case' + caseNo] = value;
                this.props.setPriceModuleInputs(
                    {
                        ['lakse_pris_percentage_case' + caseNo]: value
                    }
                );
            })
        }

        this.props.priceModuleResult(tmpInputs, this.props.caseNumbers, NavService.getCurrentRoute());
    }

    async addPriceHandler(e) {
        e.preventDefault();

        await this.props.addMTBLaksePrice(this.props.outputs, this.props.caseNumbers, NavService.getCurrentRoute(), this.props.priceModuleInputs);

        if (NavService.getCurrentRoute() === 'cost_of_disease') {
            await this.props.setCodModelResult(this.props.modelInputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);
        }

        if (NavService.getCurrentRoute() === 'vaksinering') {
            await this.props.setVaccineModelResult(this.props.modelInputs, this.props.caseNumbers, this.props.cvFrom, this.props.snittvektFrom);
        }
        if (NavService.getCurrentRoute() === 'mtb') {
            await this.props.setModelResult(this.props.modelInputs, this.props.caseNumbers, this.props.snittvektFrom);
        }
        if (NavService.getCurrentRoute() === 'optimalisering') {
            await this.props.setOptModelResult(this.props.modelInputs, this.props.caseNumbers, this.props.snittvektFrom);
        }
        if (NavService.getCurrentRoute() === 'kn_for') {
            await this.props.setFeedModelResult(this.props.modelInputs, this.props.caseNumbers);
        }
        if (NavService.getCurrentRoute() === 'genetics') {
            await this.props.setGeneticsModelResult(this.props.modelInputs, this.props.caseNumbers);
        }
        this.props.hidePriceModulePopup();
    }

    closePriceModulePopup() {
        this.props.hidePriceModulePopup();
    }

    render() {

        const {t} = this.props;

        const priceTypes = ['Historic', 'Forward'];

        let date = new Date();
        let currentYear = parseInt(date.getFullYear());
        let currentMonth = parseInt(date.getMonth()) + 1;

        let historicStartYear = parseInt(this.props?.outputs?.historic_start_year) || '';
        let historicEndYear = parseInt(this.props?.outputs?.historic_end_year) || '';
        let historicEndWeek = parseInt(this.props?.outputs?.historic_end_week) || '';

        let forwardEndYear = parseInt(this.props?.outputs?.forward_end_year) || (currentYear + 4);
        let forwardEndMonth = parseInt(this.props?.outputs?.forward_end_month) || 12;

        let historicSelectedStart = (historicEndYear - 1) + '-' + ("0" + historicEndWeek).slice(-2);
        let historicSelectedEnd = historicEndYear + '-' + ("0" + historicEndWeek).slice(-2);
        let forwardSelectedStart = currentYear + '-' + ("0" + currentMonth).slice(-2);
        let forwardSelectedEnd = (currentYear + 1) + '-' + ("0" + currentMonth).slice(-2);

        let years1 = [];
        let years2 = [];


        for (let y = historicStartYear; y <= historicEndYear; y++) {
            years1.push({id: y.toString(), name: y.toString()});
            years2.push({id: y.toString(), name: y.toString()});
        }

        let yearWeek1 = [];
        let yearWeek2 = [];

        years1.map((y, kn1) => {
            const year = parseInt(y.name);
            const endWeek = (year == historicEndYear) ? historicEndWeek : 52;
            for (let w = 1; w <= endWeek; w++) {
                w = w < 10 ? '0' + w : w;
                yearWeek1.push({id: y.name + '-' + w, name: y.name + '-' + w});
                yearWeek2.push({id: y.name + '-' + w, name: y.name + '-' + w});
            }
        })


        let forwardYears1 = [];
        let forwardYears2 = [];

        for (let y = currentYear; y <= forwardEndYear; y++) {
            forwardYears1.push({id: y.toString(), name: y.toString()});
            forwardYears2.push({id: y.toString(), name: y.toString()});
        }

        let yearMonths1 = [];
        let yearMonths2 = [];

        forwardYears1.map((y, keyNumber1) => {
            let cm1 = keyNumber1 === 0 ? currentMonth : 1;
            for (let m = cm1; m <= forwardEndMonth; m++) {
                m = m < 10 ? '0' + m : m;
                yearMonths1.push({id: y.name + '-' + m, name: y.name + '-' + m});
                yearMonths2.push({id: y.name + '-' + m, name: y.name + '-' + m});
            }
        })

        const inputPriceType = this.props?.priceModuleInputs?.price_type && this.props.priceModuleInputs.price_type || 'Historic';
        const inputForwardPeriodStart = this.props?.priceModuleInputs?.forward_period_start && this.props.priceModuleInputs.forward_period_start || forwardSelectedStart;
        const inputForwardPeriodEnd = this.props?.priceModuleInputs?.forward_period_end && this.props.priceModuleInputs.forward_period_end || forwardSelectedEnd;
        const inputHistoricPeriodStart = this.props?.priceModuleInputs?.historic_period_start && this.props.priceModuleInputs.historic_period_start || historicSelectedStart;
        const inputHistoricPeriodEnd = this.props?.priceModuleInputs?.historic_period_end && this.props.priceModuleInputs.historic_period_end || historicSelectedEnd;


        //const caseNumbers = this.props.caseNumbers;
        const caseNumbers = this.props.currentModelSlug === undefined || this.props.currentModelSlug === 'kn_for' ? [1] : this.props.caseNumbers;
        const popupTopMargin = this.state.priceModulePopupHeight / 2;

        const historicLabel = inputPriceType === 'Forward' ? t('historic_distribution_period') : t('historic');

        const averageSalmonPrice = this.props.outputs === undefined || this.props.outputs.price_module_avg_lakse_price === undefined ? '' : this.props.outputs.price_module_avg_lakse_price;
        const forwardSalmonPrice = this.props.outputs === undefined || this.props.outputs.price_module_forward_lakse_price === undefined ? '' : this.props.outputs.price_module_forward_lakse_price;
        const adjustForwardSalmonPrice = this.props.outputs === undefined || this.props.outputs.price_module_justert_forward_lakse_price === undefined ? '' : this.props.outputs.price_module_justert_forward_lakse_price;

        const popUpClass = inputPriceType === 'Forward' ? 'popup_box price_module_popup forward_popup' : 'popup_box price_module_popup';

        return (
            <div id="at2_popup">
                <div id="at2_price_module_popup" className={popUpClass}
                     style={{marginTop: -popupTopMargin + 'px'}}>
                    <form onSubmit={e => this.addPriceHandler(e)}>
                        <h3>{t('add_historic_or_forward_price')}</h3>
                        <div className="form-row mb-4">
                            <div className="col-6 col-xl-2 col-lg-2">
                                <label className="col-form-label mt-3" htmlFor="">
                                    <b>{t('select_price_type')}</b>
                                </label>
                            </div>
                            <div className="col-6 col-xl-4 col-lg-4">
                                <DropdownList
                                    fieldName="price_type"
                                    data={priceTypes}
                                    selectedData={inputPriceType}
                                    listChangeHandler={this.priceTypeChangeHandler.bind(this)}/>
                            </div>
                        </div>
                        <div className="form-row">
                            {inputPriceType === 'Forward' && <div className="col-12 col-xl-6 col-lg-6 col-md-6">
                                <div className="period_group">
                                    <div className="period_group_label">{t('forward')}</div>
                                    <div className="form-row">
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                <b>{t('period_start')}</b>
                                            </label>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <div className="mt-3">
                                                <ListAutoComplete
                                                    fieldId="forward_period_start"
                                                    fieldName="forward_period_start"
                                                    fieldPlaceHolder=""
                                                    fieldOnClick={this.forwardPeriodStart.bind(this)}
                                                    selectedItemId={inputForwardPeriodStart}
                                                    listData={yearMonths1}/>
                                            </div>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                {t('year_month')}
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                <b>{t('period_end')}</b>
                                            </label>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <div className="mt-3">
                                                <ListAutoComplete
                                                    disableListLocalState={this.state.forwardEndLocalState}
                                                    fieldId="forward_period_end"
                                                    fieldName="forward_period_end"
                                                    fieldPlaceHolder=""
                                                    fieldOnClick={this.forwardPeriodEnd.bind(this)}
                                                    selectedItemId={inputForwardPeriodEnd}
                                                    listData={yearMonths2}/>
                                            </div>
                                        </div>
                                        <div className="col-4 col-xl-3 col-lg-3">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                {t('year_month')}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            }
                            <div className="col-12 col-xl-6 col-lg-6 col-md-6">
                                <div className="period_group">
                                    <div className="period_group_label">{historicLabel}</div>
                                    <div className="form-row">
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                <b>{t('week_start')}</b>
                                            </label>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <div className="mt-3">
                                                <ListAutoComplete
                                                    fieldId="historic_period_start"
                                                    fieldName="historic_period_start"
                                                    fieldPlaceHolder=""
                                                    fieldOnClick={this.historicPeriodStart.bind(this)}
                                                    selectedItemId={inputHistoricPeriodStart}
                                                    listData={yearWeek1}/>
                                            </div>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                {t('year_week')}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                <b>{t('week_end')}</b>
                                            </label>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <div className="mt-3">
                                                <ListAutoComplete
                                                    disableListLocalState={this.state.historicEndLocalState}
                                                    fieldId="historic_period_end"
                                                    fieldName="historic_period_end"
                                                    fieldPlaceHolder=""
                                                    fieldOnClick={this.historicPeriodEnd.bind(this)}
                                                    selectedItemId={inputHistoricPeriodEnd}
                                                    listData={yearWeek2}/>
                                            </div>
                                        </div>
                                        <div className="col-4 col-xl-4 col-lg-4">
                                            <label className="col-form-label mt-3" htmlFor="">
                                                {t('year_week')}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col-12 col-xl-12 col-lg-12 text-left">
                                <label className="col-form-label mt-2 pb-2" htmlFor="">
                                    {inputPriceType === 'Historic' &&
                                    <b>{t('average_salmon_price')}: {averageSalmonPrice}</b>}
                                    {inputPriceType === 'Forward' &&
                                    <b>{t('forward_salmon_price')}: {forwardSalmonPrice}
                                        <br/> {t('adjusted_forward_salmon_price')}: {adjustForwardSalmonPrice}</b>}
                                </label>
                            </div>
                        </div>

                        <hr/>

                        <div className="form-row">
                            <div className="col-12 col-xl-12 col-lg-12">
                                <div className="row">
                                    <div className="col-2 col-xl-2 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            <b>{t('cases')}</b>
                                        </label>
                                    </div>
                                    <div className="col-3 col-xl-2 col-lg-3">
                                        <label className="col-form-label" htmlFor="">
                                            <b>{t('average_weight')}</b>
                                        </label>
                                    </div>
                                    <div className="col-3 col-xl-2 col-lg-3">
                                        <label className="col-form-label" htmlFor="">
                                            <b>{t('cv_percentage')}</b>
                                        </label>
                                    </div>
                                    <div className="col-2 col-xl-2 col-lg-2">
                                        <label className="col-form-label" htmlFor="">
                                            <b>{t('salmon_price')} %</b>
                                        </label>
                                    </div>
                                    <div className="col-2 col-xl-2 col-lg-2 pl-1 pr-1">
                                        <label className="col-form-label" htmlFor="">
                                            <b>{t('average_price')}</b>
                                        </label>
                                    </div>
                                    <div className="col-2 col-xl-2 col-lg-2 pl-1 pr-1">
                                        <label className="col-form-label" htmlFor="">
                                            <b>{t('delta_value')}</b>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {
                                caseNumbers.map(caseNo => {
                                    return (
                                        <div key={caseNo} className="col-12 col-xl-12 col-lg-12">
                                            <div className="row">
                                                <div className="col-2 col-xl-2 col-lg-2">
                                                    <label className="col-form-label" htmlFor="">
                                                        <b>{this.props.screenSize >= 768 && 'Case '}{caseNo}</b>
                                                    </label>
                                                </div>
                                                <div className="col-2 col-xl-2 col-lg-2">
                                                    <InputNumber
                                                        fieldOnChange={this.inputChangeHandler.bind(this)}
                                                        fieldName={'price_module_snittvekt_case' + caseNo}
                                                        fieldClass={'price_module_snittvekt_case' + caseNo}
                                                        fieldID={'price_module_snittvekt_case' + caseNo}
                                                        fieldPlaceholder=""
                                                        fieldValue={this.props.priceModuleInputs !== undefined && this.props.priceModuleInputs['price_module_snittvekt_case' + caseNo]}/>
                                                </div>
                                                <div className="col-2 col-xl-2 col-lg-2">
                                                    <InputNumber
                                                        fieldOnChange={this.inputChangeHandler.bind(this)}
                                                        fieldName={'price_module_cv_case' + caseNo}
                                                        fieldClass={'price_module_cv_case' + caseNo}
                                                        fieldID={'price_module_cv_case' + caseNo}
                                                        fieldPlaceholder=""
                                                        fieldValue={this.props.priceModuleInputs !== undefined && this.props.priceModuleInputs['price_module_cv_case' + caseNo]}/>
                                                </div>
                                                <div className="col-2 col-xl-2 col-lg-2">
                                                    <InputNumber
                                                        fieldOnChange={this.inputChangeHandler.bind(this)}
                                                        fieldName={'lakse_pris_percentage_case' + caseNo}
                                                        fieldClass={'lakse_pris_percentage_case' + caseNo}
                                                        fieldID={'lakse_pris_percentage_case' + caseNo}
                                                        fieldPlaceholder=""
                                                        fieldValue={this.props.priceModuleInputs !== undefined && this.props.priceModuleInputs['lakse_pris_percentage_case' + caseNo]}/>
                                                </div>
                                                <div className="col-2 col-xl-2 col-lg-2 pl-1 pr-1">
                                                    <label className="col-form-label" htmlFor="">
                                                        <b>{this.props.outputs !== undefined && this.props.outputs['price_module_snittpris_case' + caseNo]}</b>
                                                    </label>
                                                </div>
                                                <div className="col-2 col-xl-2 col-lg-2 pl-1 pr-1">
                                                    {
                                                        this.props.outputs !== undefined && caseNo > 1 &&
                                                        <label className="col-form-label" htmlFor="">
                                                            <b> {this.props.outputs['price_module_verdi_case' + caseNo]}
                                                            </b>
                                                        </label>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <hr/>

                        <div className="form-row">
                            <div className="col-6 col-xl-6 col-lg-6">
                                <div className="text-left">
                                    <button
                                        style={{marginRight: '15px'}}
                                        onClick={e => this.closePriceModulePopup(e)}
                                        className="btn btn-primary default-btn-atv2">
                                        {t('close')}
                                    </button>
                                </div>
                            </div>
                            <div className="col-6 col-xl-6 col-lg-6">
                                <div className="text-right">
                                    <SubmitButton btnText={t('add_price')}/>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    priceModuleInputs: state.priceModule.inputs,
    defaultInputs: state.priceModule.defaultInputs,
    modelInputs: state.modelScreen.inputs,
    outputs: state.priceModule.outputs,
    caseNumbers: state.modelScreen.caseNumbers,
    screenSize: state.page.screenWidth,
    currentModelSlug: state.priceModule.currentModelSlug,
    cvFrom: state.priceModule.cvFrom,
    snittvektFrom: state.priceModule.snittvektFrom,
    defaultSnittvekt: state.priceModule.defaultSnittvekt,
    defaultCV: state.priceModule.defaultCV,
});

export default connect(mapStateToProps, {
    hidePriceModulePopup,
    setPriceModuleInputs,
    resetPriceModuleInputs,
    priceModuleResult,
    addMTBLaksePrice,
    setModelResult,
    setFeedModelResult,
    setOptModelResult,
    reloadPriceModuleDefaultInputs,
    setCodModelResult,
    setVaccineModelResult,
    setGeneticsModelResult,
    takePriceModuleCVFrom,
    takePriceModuleSnittvektFrom,
})(withTranslation()(PriceModulePopup));
