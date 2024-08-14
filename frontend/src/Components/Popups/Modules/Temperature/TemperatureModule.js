import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../../popup.css';
import './TemperatureModule.css';
import NavService from "../../../../Services/NavServices";
import SaveButton from "../../../Inputs/SaveButton";
import InputText from "../../../Inputs/InputText";
import ListAutoComplete from "../../../Inputs/ListAutoComplete/ListAutoComplete";
import { hideTemperatureModulePopup } from "../../../../Store/Actions/popupActions";
import {
    setTemperatureModuleInputs,
    fetchTemperatureFromBarentsWatch,
    saveTemperatureAsTemplate,
    listTemperatureTemplates,
    resetTemperatureModule,
    setTemperatureModuleError,
} from "../../../../Store/Actions/TemperatureModuleActions";
import { setModelScreenInputs } from "../../../../Store/Actions/MTBActions";
import { setFeedModelResult } from "../../../../Store/Actions/FeedModelActions";
import axios from "axios";
import InputNumber from '../../../Inputs/InputNumber';
import successIcon from '../../Images/at2_success_icon.svg';
import TokenService from '../../../../Services/TokenServices';
import {withTranslation} from "react-i18next";

class TemperatureModule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modulePopupHeight: 0,
            currentModel: '',
            isEmptyStartYear: false,
            isEmptyEndYear: false,
            isEmptyLocationID: false,
            isEmptyTemplateNameField: false,
            isEmptyTemperatureDataField: false,
            isTemplateNameExist: false,
            errorMessage: '',
            locationIDList: [],
            manullyAddedAvgValue: [],
            noAvgTmpValueCount: 0,
            success: false,
            successMessage: null,
            selectedTemplate: null,
            resetSelect: true,
            spinner: false,
            isEmptytemplateEditNameField: false,
            locationFieldDisable: true,
            loaded: false
        }
    }

    async fetchLocationID() {
        try {

            const data = {};
            await axios.post(
                'api/temperature/token', data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                }).then(response => {
                    const accessToken = response.data.data.access_token;
                    axios.get('https://www.barentswatch.no/bwapi/v1/geodata/fishhealth/localities',
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': `Bearer ${accessToken}`
                            }
                        }).then(locationIDResponse => {

                            let locationIDList = [];
                            let countLocation = 0;
                            locationIDResponse.data.map(location => {
                                locationIDList[countLocation] = {
                                    id: location.localityNo,
                                    name: location.localityNo + ' (' + location.name + ')'
                                };
                                countLocation++;
                            });
                            this.setState({
                                ...this.state,
                                locationIDList: locationIDList,
                                locationFieldDisable: false
                            })

                        });


                });


        } catch (error) {
            //console.log(error.response.data);
        }
    }

    async componentDidMount() {
        this.props.listTemperatureTemplates();
        this.setState({
            ...this.state,
            currentModel: NavService.getCurrentRoute(),
            modulePopupHeight: document.getElementById('at2_temperature_module_popup').offsetHeight
        });

        await this.fetchLocationID();

        // if model = Feed model

        let startYear = '';
        let endYear = '';

        // if (NavService.getCurrentRoute() === 'kn_for') {
        //     let startDate = this.props.modelScreenInputs === undefined || this.props.modelScreenInputs.kn_for_grunnforutsetning_utsettsdato_case1 === null ? '' : this.props.modelScreenInputs.kn_for_grunnforutsetning_utsettsdato_case1;
        //
        //     if (startDate !== undefined && startDate !== '') {
        //         startDate = startDate.split('/');
        //         startYear = parseInt(startDate[2]);
        //     }
        //
        //     let endDate = this.props.modelScreenInputs === undefined || this.props.modelScreenInputs.kn_for_grunnforutsetning_harvest_date_case1 === null ? '' : this.props.modelScreenInputs.kn_for_grunnforutsetning_harvest_date_case1;
        //
        //     if (endDate !== undefined && endDate !== '') {
        //         endDate = endDate.split('/');
        //         endYear = parseInt(endDate[2]);
        //     }
        // }

        this.props.setTemperatureModuleInputs({
            start_year: startYear
        });

        this.props.setTemperatureModuleInputs({
            end_year: endYear
        });

        this.props.setTemperatureModuleInputs({
            location_id: ''
        });

    }

    locationIDHandler(name, id) {
        this.props.setTemperatureModuleError('');
        this.setState({
            ...this.state,
            isEmptyStartYear: false,
            isEmptyEndYear: false,
            isEmptyLocationID: false,
            isEmptyTemplateNameField: false,
            isEmptyTemperatureDataField: false,
            errorMessage: '',
        });

        this.props.setTemperatureModuleInputs({
            location_id: id
        })
    }

    templateNameHandler(inputTargets) {
        const { name, value } = inputTargets;
        this.props.setTemperatureModuleError('');
        this.setState({
            ...this.state,
            isEmptyStartYear: false,
            isEmptyEndYear: false,
            isEmptyLocationID: false,
            isEmptyTemplateNameField: false,
            isEmptyTemperatureDataField: false,
            isTemplateNameExist: this.props.temperatureTemplates?.some(x => x.name == value.trim()),
            errorMessage: '',
        });

        this.props.setTemperatureModuleInputs({
            [name]: value
        });
    }

    temperatureFromYearHandler(name) {
        this.props.setTemperatureModuleError('');
        this.setState({
            ...this.state,
            isEmptyStartYear: false,
            isEmptyEndYear: false,
            isEmptyLocationID: false,
            isEmptyTemplateNameField: false,
            isEmptyTemperatureDataField: false,
            errorMessage: '',
        });

        let tempModuleInputs = this.props.inputs;

        tempModuleInputs.start_year = name;

        this.props.setTemperatureModuleInputs({
            start_year: name
        });

        let dateObj = new Date();
        dateObj.getFullYear();

        const endYear = Boolean(tempModuleInputs.end_year) ? tempModuleInputs.end_year : name + 1;
        this.props.setTemperatureModuleInputs({
            end_year: name >= dateObj.getFullYear() ? dateObj.getFullYear() : endYear
        });
    }

    temperatureToYearHandler(name) {
        this.props.setTemperatureModuleError('');
        this.setState({
            ...this.state,
            isEmptyStartYear: false,
            isEmptyEndYear: false,
            isEmptyLocationID: false,
            isEmptyTemplateNameField: false,
            isEmptyTemperatureDataField: false,
            errorMessage: '',
        });

        let tempModuleInputs = this.props.inputs;

        tempModuleInputs.end_year = name;

        this.props.setTemperatureModuleInputs({
            end_year: name
        });
    }

    async fetchFromBarentsWatch() {

        const {t} = this.props;

        const {i18n} = this.props;

        this.setState({
            ...this.state,
            loaded: false,
            noAvgTmpValueCount: 0,
            manullyAddedAvgValue: []
        });

        this.props.setTemperatureModuleError('');

        let hasError = false;

        if (this.props.inputs.location_id === '') {
            await this.setState({
                ...this.state,
                isEmptyLocationID: true,
            });

            hasError = true;
        }

        if (this.props.inputs.start_year === '') {
            await this.setState({
                ...this.state,
                isEmptyStartYear: true,
            });

            hasError = true;
        }

        if (this.props.inputs.end_year === '') {

            await this.setState({
                ...this.state,
                isEmptyEndYear: true,
            });

            hasError = true;
        }

        if (hasError === true) {
            return false;
        }

        let inputStartYear = '';
        let inputStartDate = this.props.modelScreenInputs.kn_for_grunnforutsetning_utsettsdato_case1 === null ? '' : this.props.modelScreenInputs.kn_for_grunnforutsetning_utsettsdato_case1;

        if (inputStartDate !== '') {
            inputStartDate = inputStartDate.split('/');
            inputStartYear = parseInt(inputStartDate[2]);
        }

        let inputEndYear = '';
        let inputEndDate = this.props.modelScreenInputs.kn_for_grunnforutsetning_harvest_date_case1 === null ? '' : this.props.modelScreenInputs.kn_for_grunnforutsetning_harvest_date_case1;

        if (inputEndDate !== '') {
            inputEndDate = inputEndDate.split('/');
            inputEndYear = parseInt(inputEndDate[2]);
        }

        let hasMisMatchError = false;

        if (parseInt(this.props.inputs.start_year) > parseInt(this.props.inputs.end_year)) {

            await this.setState({
                ...this.state,
                errorMessage: t('end_year_must_be_equal_or_greater_than'),
            });

            return false;
        }

        // if (inputStartYear !== '' && inputStartYear !== this.props.inputs.start_year) {
        //     this.setState({
        //         ...this.state,
        //         errorMessage: 'Input years range and temperature years range did not match',
        //     });
        //
        //     hasMisMatchError = true;
        // }
        //
        // if (inputEndYear !== '' && inputEndYear !== this.props.inputs.end_year) {
        //     this.setState({
        //         ...this.state,
        //         errorMessage: 'Input years range and temperature years range did not match',
        //     });
        //     hasMisMatchError = true;
        // }

        if (hasMisMatchError === true) {
            return false;
        }

        let inputsData = {...this.props.inputs};
        inputsData.lang = i18n.language;

        // when all validation passed then send request to barents watch server
        await this.props.fetchTemperatureFromBarentsWatch(inputsData);

        await this.setState({
            ...this.state,
            modulePopupHeight: document.getElementById('at2_temperature_module_popup').offsetHeight
        });

        // check avg value
        const tmpOutput = this.props.outputs;
        const noAvgValue = Object.values(tmpOutput.temperature_data).filter((item) => !Boolean(item['Avg.']));

        if (noAvgValue.length > 0) {
            await this.setState({
                ...this.state,
                noAvgTmpValueCount: noAvgValue.length,
                loaded: true
            });

            return false;
        }


    }

    async temperatureTemplateSelectHandler(name, id) {

        this.setState({
            isEmptytemplateEditNameField: false
        });

        await axios.get(`api/temperature/${id}`,

            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then((temperatureResponse) => {

                this.setState({
                    selectedTemplate: temperatureResponse.data.data
                });

            });
    }

    async temperatureTemplateEditHandler(e, id) {

        let value = this.state.selectedTemplate.name.trim();
        if (!Boolean(value)) {
            this.setState({
                isEmptytemplateEditNameField: true
            });
            return false;
        }

        this.setState({
            spinner: true
        });

        await axios.put(`api/temperature/template/${id}`,
            { name: value },

            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then((temperatureResponse) => {


                this.setState({
                    success: true,
                    successMessage: temperatureResponse.data.message,
                    resetSelect: Math.random(),
                    spinner: false,
                    selectedTemplate: null
                });

                setTimeout(() => {
                    this.setState({
                        success: false,
                        successMessage: null
                    });
                }, 5000)

                // reset template dropdown values
                this.props.listTemperatureTemplates();
            });

    }

    async temperatureTemplateDeleteHandler(e, id) {

        this.setState({
            spinner: true
        });

        await axios.delete(`api/temperature/template/${id}`,

            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then((temperatureResponse) => {


                this.setState({
                    success: true,
                    spinner: false,
                    successMessage: temperatureResponse.data.message,
                    selectedTemplate: null,
                    resetSelect: Math.random()
                });

                setTimeout(() => {
                    this.setState({
                        success: false,
                        successMessage: null
                    });
                }, 5000)

                // reset template dropdown values
                this.props.listTemperatureTemplates();
            });
    }


    manuallyAddingAvgTmperature(inputTargets) {
        const { name, value } = inputTargets;
        const weekNumber = name;


        let { manullyAddedAvgValue } = this.state;
        const tmpValue = (value.slice(-1) === '.' || value.slice(-1) === '0') ? value : parseFloat(value)
        const item = { weekNumber: weekNumber, val: tmpValue };

        const foundIndex = manullyAddedAvgValue.findIndex(x => x.weekNumber == weekNumber);
        if (foundIndex !== -1) {
            manullyAddedAvgValue.splice(foundIndex, 1);
            this.setState({
                manullyAddedAvgValue: manullyAddedAvgValue
            })
        }
        if (!isNaN(parseFloat(value))) {
            manullyAddedAvgValue = [...manullyAddedAvgValue, item];

            this.setState({
                ...this.state,
                manullyAddedAvgValue: manullyAddedAvgValue
            }, () => {

            })
        }




    }

    async saveTemperatureTemplate() {
        const hasErrors = false;
        const {t} = this.props;

        if (this.props.inputs.temperature_template_name === undefined || this.props.inputs.temperature_template_name.trim() === '') {

            await this.setState({
                ...this.state,
                isEmptyTemplateNameField: true
            });

            return false;
        }

        if (this.props.outputs.temperature_data === undefined || this.props.outputs.temperature_data === '') {

            await this.setState({
                ...this.state,
                isEmptyTemperatureDataField: true
            });

            return false;
        }
        // Name unique
        if (this.props.temperatureTemplates?.some(x => x.name === this.props.inputs.temperature_template_name.trim())) {

            await this.setState({
                ...this.state,
                isTemplateNameExist: true
            });

            return false;
        }

        this.setState({
            spinner: true
        });

        const saveData = {
            name: this.props.inputs.temperature_template_name,
            user_id: this.props.currentUserID,
            company_id: this.props.currentUserCompanyID,
            tool_id: '',
            template_data: this.props.outputs.temperature_data
        }

        await this.props.saveTemperatureAsTemplate(saveData);

        this.setState({
            success: true,
            spinner: false,
            successMessage: t('template_saved_successfully')
        });

        setTimeout(() => {
            this.setState({
                success: false,
                successMessage: null
            });
        }, 5000)

    }

    temperatureTemplateNameUpdateHandler(inputTargets) {
        const { name, value } = inputTargets;

        const fieldValue = value.trim();

        this.setState({
            ...this.state,
            isTemplateNameExist: this.props.temperatureTemplates?.some(x => x.name == fieldValue),
            isEmptytemplateEditNameField: !Boolean(fieldValue)
        });


        this.setState(prevState => {
            let selectedTemplate = Object.assign({}, prevState.selectedTemplate);
            selectedTemplate.name = value;
            return { selectedTemplate };
        })
    }

    applyTemperatureIntoModel() {
        this.setTemperatureAsModelInput();
        this.props.hideTemperatureModulePopup();
        this.props.resetTemperatureModule();
    }

    saveAndApplyTemperatureIntoModel() {

        if (this.props.inputs.temperature_template_name === undefined || this.props.inputs.temperature_template_name.trim() === '') {

            this.setState({
                isEmptyTemplateNameField: true
            });

            return false;
        }

        // Name unique
        if (this.props.temperatureTemplates?.some(x => x.name == this.props.inputs.temperature_template_name.trim())) {

            this.setState({
                ...this.state,
                isTemplateNameExist: true
            });

            return false;
        }


        //save template
        this.saveTemperatureTemplate();
        //apply to model
        this.setTemperatureAsModelInput();

        //hide popup
        this.props.hideTemperatureModulePopup();
        this.props.resetTemperatureModule();
    }

    async setTemperatureAsModelInput() {
        let temperatureModule = [];
        let count = 0;
        if (this.props.outputs !== undefined && this.props.outputs.temperature_data !== undefined) {

            const temperatureData = this.props.outputs.temperature_data;

            Object.keys(temperatureData).map(key => {

                let avgValue = temperatureData[key]['Avg.'];

                //if there is manually added avg tmp value, then update output data accordingly

                if (!Boolean(avgValue) && this.state.manullyAddedAvgValue.some(x => x.weekNumber === key)) {
                    avgValue = this.state.manullyAddedAvgValue.find(x => x.weekNumber === key).val;

                }

                temperatureModule[count] = { 'week': key, 'avgTmp': avgValue }
                count++;
            })


            //const caseNumbers = this.props.caseNumbers;
            let modelInputs = this.props.modelInputs;
            modelInputs.temperature_module = temperatureModule;
            this.props.setModelScreenInputs({
                temperature_module: temperatureModule
            });

            // update timeline, graph output as soon as input changed
            this.props.setFeedModelResult(modelInputs, this.props.caseNumbers);
        }
    }

    closePopupHandler() {
        this.props.hideTemperatureModulePopup();
        this.props.resetTemperatureModule();
    }


    render() {

        const {t} = this.props;

        const popupTopMargin = this.state.modulePopupHeight / 2;

        const locationIDList = this.state.locationIDList;

        const temperatureTemplates = [];
        let countTemplates = 0;
        if (this.props.temperatureTemplates !== undefined) {
            Object.keys(this.props.temperatureTemplates).map(key => {
                temperatureTemplates[countTemplates] = {
                    id: this.props.temperatureTemplates[key].id,
                    name: this.props.temperatureTemplates[key].name
                }
                countTemplates++;
            });
        }

        let d = new Date();
        let currentYear = d.getFullYear();

        let years = [];

        for (let y = 2010; y <= currentYear; y++) {
            years.push({ id: y, name: y });
        }

        const inputLocationID = this.props.inputs === undefined ? '' : this.props.inputs.location_id;
        const inputStartYear = this.props.inputs === undefined ? '' : this.props.inputs.start_year;
        let inputEndYear = this.props.inputs === undefined ? '' : this.props.inputs.end_year;

        const temperatureData = this.props.outputs === undefined || this.props.outputs.temperature_data === undefined ? undefined : this.props.outputs.temperature_data;

        let temperatureDataHeader = [];
        let tmpHeadCount = 0;
        if (temperatureData !== undefined) {
            temperatureDataHeader[tmpHeadCount] = t('week');
            for (let prp in temperatureData[1]) {
                if (prp !== 'count' && prp !== 'total') {
                    tmpHeadCount++;
                    temperatureDataHeader[tmpHeadCount] = prp;
                }
            }
        }

        const tempTableClass = 'temperature_table column' + (tmpHeadCount + 1);

        let countColKey = 0;

        const avgItemErrors = this.state.noAvgTmpValueCount - this.state.manullyAddedAvgValue.length;
        const inputTemperatureTemplateName = this.props.outputs === undefined || this.props.inputs.temperature_template_name === undefined ? '' : this.props.inputs.temperature_template_name;

        return (
            <div id="at2_popup">
                <div id="at2_temperature_module_popup" className="popup_box temperature_module_popup"
                    style={{ marginTop: -popupTopMargin + 'px' }}>
                    <i
                        className="fa fa-times temperature_popup_close"
                        onClick={e => this.closePopupHandler()}></i>

                    {this.state.spinner &&
                        <p className="text-center"><b>Working...</b></p>}

                    {this.state.success &&
                        <p className="text-center" style={{ 'color': 'green' }}>
                            <b>{this.state.successMessage ? this.state.successMessage : t('saved_successfully')}</b>
                        </p>
                    }


                    <form>
                        <h3>{t('temperature_module')}</h3>

                        <div className="form-row mt-3">
                            <div className="col-6 col-xl-4 col-lg-4">
                                <ListAutoComplete
                                    fullSearch={true}
                                    isFieldEmpty={this.state.isEmptyLocationID}
                                    fieldName="location_id"
                                    fieldPlaceHolder={t('location_id')}
                                    fieldOnClick={this.locationIDHandler.bind(this)}
                                    selectedItemId={inputLocationID}
                                    listData={locationIDList} />
                            </div>
                            <div className="col-6 col-xl-4 col-lg-4">
                                <ListAutoComplete
                                    isFieldEmpty={this.state.isEmptyStartYear}
                                    fieldName="start_year"
                                    fieldPlaceHolder={t('from_years')}
                                    fieldOnClick={this.temperatureFromYearHandler.bind(this)}
                                    selectedItemId={inputStartYear}
                                    listData={years} />
                            </div>
                            <div className="col-6 col-xl-4 col-lg-4">
                                <ListAutoComplete
                                    isFieldEmpty={this.state.isEmptyEndYear}
                                    fieldName="end_year"
                                    fieldPlaceHolder={t('to_years')}
                                    fieldOnClick={this.temperatureToYearHandler.bind(this)}
                                    selectedItemId={inputEndYear}
                                    listData={years} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="col- col-xl-6 col-lg-6">
                                {this.state.errorMessage !== '' &&
                                    <p className="at2_error_text">{this.state.errorMessage}</p>}
                                {this.props.errorMessage !== undefined && this.props.errorMessage !== '' &&
                                    <p className="at2_error_text">{this.props.errorMessage}</p>}

                                {avgItemErrors > 0 &&
                                    <p className="at2_error_text">{avgItemErrors} {t('items_have_no_agg_value')}</p>}

                                {avgItemErrors === 0 && this.state.loaded &&
                                    <p className="at2_harvest_date_text">{t('items_those_have_no_avg_temperature')}</p>}

                            </div>
                            <div className="col- col-xl-6 col-lg-6">
                                <div className="text-right">
                                    <SaveButton
                                        onClickHandler={this.fetchFromBarentsWatch.bind(this)}
                                        name={t('fetch_from_barents_watch')} />
                                </div>
                            </div>
                        </div>
                        <hr />
                        {this.props.temperatureSpinner !== undefined &&
                            <p className="text-center"><b>{t('fetching_data_from_barents_watch')}...</b></p>}
                        {this.props.temperatureSpinner === undefined && temperatureData !== undefined && <div>
                            <div className="form-row">
                                <div className="col- col-xl-7 col-lg-7">
                                    <div className={tempTableClass}>
                                        <ul key={0} className="temperature_table_row">
                                            {
                                                temperatureDataHeader.map(head => {
                                                    countColKey++;
                                                    return <li key={countColKey}><b>{head}</b></li>
                                                })
                                            }
                                        </ul>

                                        {
                                            Object.keys(temperatureData).map(weekNumber => {
                                                return (
                                                    <ul key={weekNumber} className="temperature_table_row">
                                                        <li>{weekNumber}</li>
                                                        {
                                                            Object.keys(temperatureData[weekNumber]).map(key => {
                                                                if (key === 'total' || key === 'count') {
                                                                    return null;
                                                                }
                                                                const temp = temperatureData[weekNumber][key] === null || temperatureData[weekNumber][key] === '' || temperatureData[weekNumber][key] === 0 ? '-' : temperatureData[weekNumber][key].toFixed(2);

                                                                countColKey++;
                                                                if (key == 'Avg.' && temp == '-') {

                                                                    if (!this.state.loaded) {
                                                                        let tmpValue;

                                                                        for (let index = 1; index < weekNumber; index++) {

                                                                            if (temperatureData[weekNumber - index][key] !== '-') {

                                                                                tmpValue = temperatureData[weekNumber - index][key];
                                                                                break;
                                                                            }

                                                                        }

                                                                        //update manuallyAddedTempValue state array

                                                                        const foundIndex = this.state.manullyAddedAvgValue.findIndex(x => x.weekNumber == weekNumber);

                                                                        if (foundIndex === -1) {
                                                                            const item = { weekNumber: weekNumber, val: parseFloat(tmpValue) };
                                                                            let manullyAddedAvgValue = [...this.state.manullyAddedAvgValue, item];
                                                                            this.state.manullyAddedAvgValue = manullyAddedAvgValue;
                                                                        }
                                                                    }

                                                                    //console.log(this.state.manullyAddedAvgValue);
                                                                    const index = this.state.manullyAddedAvgValue.findIndex(x => x.weekNumber == weekNumber);

                                                                    return (<li key={countColKey}>
                                                                        <div style={{ width: '45px', margin: '0 auto' }}>
                                                                            <InputNumber
                                                                                fieldOnChange={this.manuallyAddingAvgTmperature.bind(this)}
                                                                                fieldName={weekNumber}
                                                                                fieldID={'tmpAvgValue_' + weekNumber}
                                                                                fieldPlaceholder=""
                                                                                fieldValue={this.state.manullyAddedAvgValue[index]?.val}


                                                                            />
                                                                        </div>

                                                                    </li>)
                                                                }
                                                                else
                                                                    return <li key={countColKey}>{temp}</li>
                                                            })
                                                        }
                                                    </ul>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                                <div className="col- col-xl-5 col-lg-5">
                                    <InputText
                                        fieldOnChange={this.templateNameHandler.bind(this)}
                                        fieldName="temperature_template_name"
                                        fieldClass="temperature_template_name"
                                        fieldID="temperature_template_name"
                                        fieldPlaceholder="Template Name"
                                        isFieldEmpty={this.state.isEmptyTemplateNameField}
                                        fieldValue={inputTemperatureTemplateName} />
                                    {this.state.isEmptyTemplateNameField === true &&
                                        <p className="at2_error_text">{t('fields_empty_message')}</p>}
                                    {this.state.isEmptyTemperatureDataField === true &&
                                        <p className="at2_error_text">{t('temperature_data_not_found')}</p>}
                                    {this.state.isTemplateNameExist === true &&
                                        <p className="at2_error_text">{t('template_name_already_exist')}</p>}
                                </div>
                            </div>
                            <hr />
                            {avgItemErrors == 0 &&
                                <div className="form-row">
                                    <div className="col-6 col-xl-4 col-lg-4">
                                        <div className="text-left">
                                            <SaveButton
                                                onClickHandler={this.saveTemperatureTemplate.bind(this)}
                                                name={t('save_as_template')} />
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-4 col-lg-4">
                                        <div className="text-center">
                                            <SaveButton
                                                onClickHandler={this.saveAndApplyTemperatureIntoModel.bind(this)}
                                                name={t('save_and_apply_to_model')} />
                                        </div>
                                    </div>
                                    <div className="col-6 col-xl-4 col-lg-4">
                                        <div className="text-right">
                                            <SaveButton
                                                onClickHandler={this.applyTemperatureIntoModel.bind(this)}
                                                name={t('apply_to_model')} />
                                        </div>
                                    </div>
                                </div>}

                            <hr />
                        </div>}
                        <div className="form-row">
                            <div className="col- col-xl-4 col-lg-4">
                                <div className="mt-1" id="select_temperature_templates">
                                    <ListAutoComplete
                                        key={this.state.resetSelect}
                                        fieldName="select_temperature_templates"
                                        fieldPlaceHolder={t('select_temperature_module')}
                                        fieldOnClick={this.temperatureTemplateSelectHandler.bind(this)}
                                        listData={temperatureTemplates} />
                                </div>
                            </div>
                            <div className="col- col-xl-8 col-lg-8">
                                <div className="table-responsive text-nowrap">
                                    {this.state.selectedTemplate &&
                                        <table className="table table-borderless table-striped">
                                            <tbody>
                                                <tr>
                                                    <td>

                                                        <InputText
                                                            fieldOnChange={this.temperatureTemplateNameUpdateHandler.bind(this)}
                                                            fieldName="temperature_template_name_update"
                                                            fieldID="temperature_template_name_update"
                                                            isDisable={false}
                                                            fieldValue={this.state.selectedTemplate.name} />
                                                        {this.state.isEmptytemplateEditNameField === true &&
                                                            <p className="at2_error_text">{t('input_required')}</p>}
                                                        {this.state.isTemplateNameExist === true &&
                                                            <p className="at2_error_text">{t('template_name_already_exist')}</p>}

                                                    </td>
                                                    <td>{this.state.selectedTemplate.company.name}</td>
                                                    <td>{this.state.selectedTemplate.user.first_name + ' ' + (Boolean(this.state.selectedTemplate.user.last_name) ? this.state.selectedTemplate.user.last_name : '')}</td>
                                                    <td></td>
                                                    <td>
                                                        {(!this.state.isEmptytemplateEditNameField && !this.state.isTemplateNameExist) &&
                                                            <button

                                                                type="button"
                                                                className="btn btn-primary-outline at2-btn-no-bg"
                                                                onClick={e => this.temperatureTemplateEditHandler(e, this.state.selectedTemplate.id)}>
                                                                <img src="images/black_save_icon.svg" title={t('save')} />
                                                            </button>
                                                        }

                                                        <button
                                                            type="button"
                                                            onClick={e => this.temperatureTemplateDeleteHandler(e, this.state.selectedTemplate.id)}
                                                            className="btn btn-primary-outline at2-btn-no-bg">
                                                            <img src="images/remove_icon.svg" title={t('delete')} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    }
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
    caseNumbers: state.modelScreen.caseNumbers,
    screenSize: state.page.screenWidth,
    modelScreenInputs: state.modelScreen.inputs,
    inputs: state.temperatureModule.inputs,
    outputs: state.temperatureModule.outputs,
    errorMessage: state.temperatureModule.errorMessage,
    showSuccess: state.popup.showSuccess,
    modelInputs: state.modelScreen.inputs,
    temperatureSpinner: state.temperatureModule.temperatureSpinner,
    temperatureTemplates: state.temperatureModule.temperatureTemplates,
    currentUserID: state.auth.data.user.id,
    currentUserCompanyID: state.auth.data.user.company.id,
});

export default connect(mapStateToProps, {
    hideTemperatureModulePopup,
    setTemperatureModuleInputs,
    fetchTemperatureFromBarentsWatch,
    saveTemperatureAsTemplate,
    listTemperatureTemplates,
    resetTemperatureModule,
    setModelScreenInputs,
    setTemperatureModuleError,
    setFeedModelResult,
})(withTranslation()(TemperatureModule));
