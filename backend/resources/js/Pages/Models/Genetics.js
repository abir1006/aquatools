import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import { connect } from "react-redux";
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import PageTitle from "../../Components/PageTitle/PageTitle";
import adminNavigationsObj from "../../Components/MainNavigation/MainMenus";
import ModelToolBar from "../../Components/Model/ModelToolBar/ModelToolBar";
import BlockScreenSetup from "../../Components/Model/BlockScreenSetup/BlockScreenSetup";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import {
    handleSubMenuOpen,
    setNavCollapse,
    setNavExpand
} from "../../Store/Actions/NavigationActions";
import { handleWindowResize } from "../../Store/Actions/pageActions";
import {
    templateList,
    setTemplateNameErrorMessage,
    resetTemplateNameErrorMessage,
} from "../../Store/Actions/TemplateActions";
import {
    mtbBlockList,
    resetModelScreen,
    setModelScreenInputs,
    hideTemplateNamePopup,
    changeModelOutputView,
    setModelScreenCases,
} from "../../Store/Actions/MTBActions";
import {
    setPriceModuleCurrentModel,
    takePriceModuleCVFrom,
    takePriceModuleSnittvektFrom,
    setPriceModuleInputs
} from "../../Store/Actions/PriceModuleActions";
import {
    hideInfoPopup,
    hidePDFPopup,
    hidePPTPopup,
    hidePriceModulePopup,
    hideConfirmPopup
} from "../../Store/Actions/popupActions";
import ModelActionTabs from "../../Components/Model/Genetics/ModelActionTabs/ModelActionTabs";
import BlocksInputs from "../../Components/Model/Genetics/BlocksInputs/BlocksInputs";
import InputFormPopup from "../../Components/Popups/InputFormPopup";
import InputText from "../../Components/Inputs/InputText";

import { saveTemplate } from "../../Store/Actions/TemplateActions";
import ModelOutput from "../../Components/Model/Genetics/ModelOutput/ModelOutput";
import InfoPopup from "../../Components/Popups/InfoPopup/InfoPopup";
import axios from "axios";
import TokenService from "../../Services/TokenServices";
import ButtonSpinner from "../../Components/Spinners/ButtonSpinner";
import DateTimeService from "../../Services/DateTimeServices";
import InputService from "../../Services/InputServices";
import NavService from "../../Services/NavServices";
import PriceModulePopup from "../../Components/Popups/Modules/PriceModulePopup";
import NavigationPrompt from '../../Components/NavigationPrompt/NavigationPrompt';
import moment from "moment";
import {
    setIsDirty, unsetIsDirty
} from "../../Store/Actions/popupActions";
import { withTranslation } from "react-i18next";
import PdfPptDownloadForm from '../../Components/Popups/PdfPptDownloadForm';

class GeneticsModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRouteName: null,
            isTemplateNameFieldEmpty: false,
            showPdfBtnSpinner: false,
            pdfEmail: '',
            isPdfEmailEmpty: false,
            pdfResponse: '',
            isDirty: false,
            leavingAlertMessage: "Are you sure you want to leave this model-screen? If you leave, you will lose all your added values!"
        }

        this.props.hidePriceModulePopup();
        this.props.resetModelScreen();
        this.props.hideTemplateNamePopup();
        this.props.hideTemplateNamePopup();
        this.props.hideInfoPopup();
        this.props.hidePDFPopup();
        this.props.hidePPTPopup();
        this.props.changeModelOutputView('graph');

        // set price module initial inputs
        this.props.takePriceModuleCVFrom(undefined);
        this.props.takePriceModuleSnittvektFrom(undefined);
        this.props.setPriceModuleInputs({ 'price_type': 'Historic' });

        let date = new Date();
        let currentYear = parseInt(date.getFullYear());
        let currentMonth = parseInt(date.getMonth()) + 1;
        let currentWeek = parseInt(moment().week());
        let weekNumberBefore12Months = parseInt(moment().subtract(12, 'months').week());
        let monthAfterYear = parseInt(moment().add(12, 'months').month());
        let yearAfter12Months = parseInt(moment().add(12, 'months').year());

        let historicSelectedStart = (currentYear - 1) + '-' + ((weekNumberBefore12Months < 10 ? '0' + weekNumberBefore12Months : weekNumberBefore12Months));
        let historicSelectedEnd = currentYear + '-' + ((currentWeek < 10 ? '0' + currentWeek : currentWeek));
        let forwardSelectedStart = currentYear + '-' + (currentMonth < 10 ? '0' + currentMonth : currentMonth);
        let forwardSelectedEnd = yearAfter12Months + '-' + (monthAfterYear < 10 ? '0' + monthAfterYear : monthAfterYear);

        this.props.setPriceModuleInputs({ 'historic_period_start': historicSelectedStart });
        this.props.setPriceModuleInputs({ 'historic_period_end': historicSelectedEnd });
        this.props.setPriceModuleInputs({ 'forward_period_start': forwardSelectedStart });
        this.props.setPriceModuleInputs({ 'forward_period_end': forwardSelectedEnd });

        const caseNumbers = [1, 2];

        caseNumbers.map(caseNo => {
            this.props.setPriceModuleInputs({ ['lakse_pris_percentage_case' + caseNo]: 100 });
        });
    }

    // call API to check if the token is valid
    async componentDidMount() {
        await this.checkAuthAndRouteAccess();
        const currentCompanyID = this.props.data.user.company_id;
        // Communicate with pusher channel if user has model permission
        Echo.private(`modelPermission.${currentCompanyID}`).listen('CompanyModelUpdated', async () => {
            // Update the access data again
            console.log('route access 2')
            await this.checkAuthAndRouteAccess();
        });
    }

    async checkAuthAndRouteAccess() {
        await this.props.getAuthUser(this.props.history);

        //check if user has Genetics model access
        const currentUserRole = this.props.data.user.roles === undefined ? '' : this.props.data.user.roles[0].slug;
        const currentRoute = this.props.location.pathname.split('/').pop();
        let hasModelPermission = currentUserRole === 'super_admin' || (this.props.permittedModels !== undefined && this.props.permittedModels.indexOf(currentRoute) !== -1);

        if (hasModelPermission === false) {
            this.props.unsetIsDirty();
            this.props.hideConfirmPopup();
        }

        if (currentRoute === 'genetics') {
            await this.props.checkRouteAccess(this.props.history, hasModelPermission, currentRoute);
        }

        if (hasModelPermission) {
            this.props.setPriceModuleCurrentModel(currentRoute);
            this.props.handleWindowResize();
            if (this.props.page.screenSize <= 767) {
                this.props.setNavExpand();
            }
            if (this.props.page.screenSize >= 768) {
                this.props.setNavCollapse();
            }
            window.addEventListener('resize', () => {
                this.props.handleWindowResize();
                if (this.props.page.screenSize <= 767) {
                    this.props.setNavExpand();
                }
                if (this.props.page.screenSize >= 768) {
                    this.props.setNavCollapse();
                }
            });
        }
    }

    //check dirty

    checkDirty(oldValus, newValus) {

        const isUpdated = (oldValues, newValues) => Object.keys(oldValues).filter(key => {

            if (key.includes('_navn_') || key.includes('_kvalitet_prod_'))
                return false;

            return JSON.stringify(oldValues[key]) !== JSON.stringify(newValues[key]);
        });

        if (Object.keys(newValus).length == Object.keys(oldValus).length) {
            isUpdated(oldValus, newValus).length && this.props.setIsDirty();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.checkDirty(prevProps.inputs, this.props.inputs);
    }

    titleClickHandler(e) {
        const modelSubMenus = adminNavigationsObj.tools.subMenus;
        this.props.handleSubMenuOpen(e, modelSubMenus, 'models');
    }

    templateNameOnChangeHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.props.resetTemplateNameErrorMessage();
        this.props.setModelScreenInputs({
            [name]: value
        })
    }

    async templateSaveHandler(e) {
        e.preventDefault();
        if (this.props.inputs.template_name === undefined || this.props.inputs.template_name === '') {
            this.props.setTemplateNameErrorMessage('');
            return false;
        }

        const templateName = this.props.inputs.template_name;

        delete this.props.inputs.template_name;

        const saveTemplateData = {
            name: templateName,
            tool_id: this.props.tool_id,
            user_id: this.props.data.user.id,
            template_data: this.props.inputs,
        }

        saveTemplateData.template_data.caseNumbers = this.props.caseNumbers;
        await this.props.saveTemplate(saveTemplateData);
        if (this.props.isTemplateNameFieldEmpty === true) {
            return false;
        }
        this.popUpCloseHandler();
    }

    popUpCloseHandler() {
        this.props.resetTemplateNameErrorMessage();
        this.props.setModelScreenInputs({
            template_name: ''
        });
        this.props.hideTemplateNamePopup();
    }

    pdfEmailChangeHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            isPdfEmailEmpty: false,
            showPdfBtnSpinner: false,
            pdfResponse: '',
            [name]: value,
        })
    }

    async pdfDownloadHandler(sendToEmail = false, sendToMe = false) {

        const { i18n } = this.props;

        await this.setState({
            ...this.state,
            pdfResponse: '',
        });

        if (sendToEmail === true && (this.state.pdfEmail === '' || InputService.validateEmail(this.state.pdfEmail) === false)) {

            await this.setState({
                ...this.state,
                isPdfEmailEmpty: true
            });

            return false;
        }

        this.setState({
            ...this.state,
            isPdfEmailEmpty: false,
            showPdfBtnSpinner: true
        });

        try {
            const pdfResponse = await axios({
                url: 'api/genetics/download-pdf',
                method: 'POST',
                data: {
                    toolID: this.props.tool_id,
                    sendToEmail: sendToEmail,
                    sendToMe: sendToMe,
                    pdfEmail: this.state.pdfEmail,
                    caseNumbers: this.props.caseNumbers,
                    tableViewResult: this.props.tableViewResult,
                    graphResult: this.props.graphResult,
                    graphBaseValue: this.props.graphBaseValue,
                    inputs: this.props.inputs,
                    lang: i18n.language
                },
                responseType: sendToEmail === true || sendToMe === true ? '' : 'blob', // important
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

            this.setState({
                ...this.state,
                showPdfBtnSpinner: false,
            });

            if (sendToEmail === true || sendToMe === true) {
                this.setState({
                    ...this.state,
                    showPdfBtnSpinner: false,
                    pdfEmail: '',
                    pdfResponse: pdfResponse.data.email + '!',
                });

            }

            if (sendToEmail === false && sendToMe === false) {
                // response
                const pdfUrl = window.URL.createObjectURL(new Blob([pdfResponse.data]));
                const link = document.createElement('a');
                link.href = pdfUrl;
                link.setAttribute('download', 'Genetics_' + this.props.auth.data.user.id + '_' + this.props.auth.data.user.company.id + '_' + DateTimeService.getCurrentDateTimeForPDF() + '.pdf');
                document.body.appendChild(link);
                link.click();
                this.props.hidePDFPopup()
            }

        } catch (error) {
            console.log('Error');
            this.setState({
                ...this.state,
                showPdfBtnSpinner: false,
                pdfEmail: '',
                pdfResponse: 'Failed'
            })
        }
    }

    async pptDownloadHandler(sendToEmail = false, sendToMe = false) {

        const { i18n } = this.props;

        await this.setState({
            ...this.state,
            pdfResponse: '',
        });

        if (sendToEmail === true && (this.state.pdfEmail === '' || InputService.validateEmail(this.state.pdfEmail) === false)) {

            await this.setState({
                ...this.state,
                isPdfEmailEmpty: true
            });

            return false;
        }

        this.setState({
            ...this.state,
            isPdfEmailEmpty: false,
            showPdfBtnSpinner: true
        });

        try {
            const pptResponse = await axios({
                url: 'api/genetics/download-ppt',
                method: 'POST',
                data: {

                    toolID: this.props.tool_id,
                    sendToEmail: sendToEmail,
                    sendToMe: sendToMe,
                    pdfEmail: this.state.pdfEmail,
                    caseNumbers: this.props.caseNumbers,
                    tableViewResult: this.props.tableViewResult,
                    graphResult: this.props.graphResult,
                    graphBaseValue: this.props.graphBaseValue,
                    inputs: this.props.inputs,
                    lang: i18n.language
                },
                responseType: sendToEmail === true || sendToMe === true ? '' : 'blob', // important
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

            this.setState({
                ...this.state,
                showPdfBtnSpinner: false,
            });

            if (sendToEmail === true || sendToMe === true) {
                this.setState({
                    ...this.state,
                    showPdfBtnSpinner: false,
                    pdfEmail: '',
                    pdfResponse: pptResponse.data.email + '!',
                });

            }

            if (sendToEmail === false && sendToMe === false) {
                // response
                const pptUrl = window.URL.createObjectURL(new Blob([pptResponse.data]));
                const link = document.createElement('a');
                link.href = pptUrl;
                link.setAttribute('download', 'Genetics_' + this.props.auth.data.user.id + '_' + this.props.auth.data.user.company.id + '_' + DateTimeService.getCurrentDateTimeForPDF() + '.pptx');
                document.body.appendChild(link);
                link.click();
                this.props.hidePPTPopup();
            }

        } catch (error) {
            console.log('Error');
            this.setState({
                ...this.state,
                showPdfBtnSpinner: false,
                pdfEmail: '',
                pdfResponse: 'Failed'
            })
        }
    }

    reportPopUpCloseHandler() {
        this.setState({
            ...this.state,
            isPdfEmailEmpty: false,
            showPdfBtnSpinner: false,
            pdfEmail: '',
            pdfResponse: '',
        });
        this.props.hidePDFPopup();
        this.props.hidePPTPopup();
    }

    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';

        return (
            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                    <NavigationPrompt message={t('model_change_leaving_alert_message')} />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <NotificationPopup />
                            <div className="content-block title-block mb-0">
                                <div className="row">
                                    <div className="col- col-xl-6 col-lg-4 col-md-2">
                                        <button
                                            onClick={e => this.titleClickHandler(e)}
                                            className="btn btn-primary-outline at2-btn-no-bg at2-btn-down-angle">
                                            <i className="fa fa-angle-down"></i>
                                        </button>
                                        <PageTitle
                                            title={t('model_genetics')}
                                            iconClass="" />
                                    </div>
                                    <div className="col- col-xl-6 col-lg-8 col-md-10">
                                        <ModelToolBar />
                                    </div>
                                </div>
                            </div>
                            <div className="section-block mt-0">
                                <div className="row">
                                    <div className="col- col-xl-5 col-lg-5 col-md-5 col-sm-12 pr-xl-2 pr-lg-2 pr-md-2">
                                        <BlockScreenSetup />
                                        <BlocksInputs />
                                    </div>

                                    <div className="col- col-xl-7 col-lg-7 col-md-7 col-sm-12 pl-xl-2 pl-lg-2 pl-md-2">
                                        <ModelActionTabs />
                                        <ModelOutput />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.props.popup.showTemplateNamePopup && <InputFormPopup>
                    <div className="pl-4 pr-4">
                        <form onSubmit={e => this.templateSaveHandler(e)}>
                            {this.props.templateNameErrorMessage !== '' &&
                                <p className="at2_error_text">{this.props.templateNameErrorMessage}</p>}
                            <InputText
                                fieldName="template_name"
                                fieldID="template_name"
                                isFieldEmpty={this.props.isTemplateNameFieldEmpty}
                                fieldPlaceholder={t('enter_template_name')}
                                fieldOnChange={this.templateNameOnChangeHandler.bind(this)}
                            />
                            <button
                                type="button"
                                onClick={e => this.popUpCloseHandler()}
                                className="btn btn-primary default-btn-atv2">
                                {t('close')}
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary default-btn-atv2">
                                {t('save')}
                            </button>
                        </form>
                    </div>
                </InputFormPopup>}
                {this.props.popup.showPDFPopup && <InputFormPopup maxWidth={450}>
                    <i
                        className="fa fa-times popup_close"
                        onClick={e => this.reportPopUpCloseHandler()}></i>
                    <div className="pl-4 pr-4">
                        <PdfPptDownloadForm
                            showSpinner={this.state.showPdfBtnSpinner}
                            isEmailEmpty={this.state.isPdfEmailEmpty}
                            emailValue={this.state.pdfEmail}
                            emailOnChangeHandler={this.pdfEmailChangeHandler.bind(this)}
                            downloadHandler={this.pdfDownloadHandler.bind(this)}
                        />
                        <p style={{ marginTop: '15px' }}>
                            {this.state.showPdfBtnSpinner &&
                                <ButtonSpinner showSpinner={this.state.showPdfBtnSpinner} />}
                            {this.state.showPdfBtnSpinner && t('processing')}
                            {this.state.pdfResponse}
                        </p>
                    </div>
                </InputFormPopup>}
                {this.props.popup.showPPTPopup && <InputFormPopup maxWidth={450}>
                    <i
                        className="fa fa-times popup_close"
                        onClick={e => this.reportPopUpCloseHandler()}></i>
                    <div className="pl-4 pr-4">
                        <PdfPptDownloadForm
                            showSpinner={this.state.showPdfBtnSpinner}
                            isEmailEmpty={this.state.isPdfEmailEmpty}
                            emailValue={this.state.pdfEmail}
                            emailOnChangeHandler={this.pdfEmailChangeHandler.bind(this)}
                            downloadHandler={this.pptDownloadHandler.bind(this)}
                        />

                        <p style={{ marginTop: '15px' }}>
                            {this.state.showPdfBtnSpinner &&
                                <ButtonSpinner showSpinner={this.state.showPdfBtnSpinner} />}
                            {this.state.showPdfBtnSpinner && t('processing')}
                            {this.state.pdfResponse}
                        </p>
                    </div>
                </InputFormPopup>}
                {this.props.popup.showInfoPopup && <InfoPopup
                    xPosition={this.props.popup.xPosition}
                    yPosition={this.props.popup.yPosition}>
                    <p>{this.props.popup.infoText}</p>
                </InfoPopup>}
                {this.props.popup.showPriceModulePopup !== undefined && this.props.popup.showPriceModulePopup === true &&
                    <PriceModulePopup />}
            </div>
        );

    }
}


const mapStateToProps = state => ({
    page: state.page,
    navigation: state.navigation,
    auth: state.auth,
    data: state.auth.data,
    popup: state.popup,
    inputs: state.modelScreen.inputs,
    tool_id: state.modelScreen.tool_id,
    caseNumbers: state.modelScreen.caseNumbers,
    isTemplateNameFieldEmpty: state.template.isTemplateNameFieldEmpty,
    templateNameErrorMessage: state.template.errorMessage,
    tableViewResult: state.modelScreen.pdfOutput,
    graphResult: state.modelScreen.graphOutput,
    permittedModels: state.auth.permittedModels,
    graphBaseValue: state.modelScreen.graphBaseValue,
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    handleWindowResize,
    handleSubMenuOpen,
    setNavCollapse,
    setNavExpand,
    templateList,
    mtbBlockList,
    setModelScreenInputs,
    resetModelScreen,
    hideTemplateNamePopup,
    saveTemplate,
    changeModelOutputView,
    setTemplateNameErrorMessage,
    resetTemplateNameErrorMessage,
    hideInfoPopup,
    hidePDFPopup,
    hidePPTPopup,
    hidePriceModulePopup,
    setPriceModuleCurrentModel,
    setModelScreenCases,
    takePriceModuleCVFrom,
    setPriceModuleInputs,
    takePriceModuleSnittvektFrom,
    hideConfirmPopup,
    setIsDirty,
    unsetIsDirty
})(withTranslation()(GeneticsModel));
