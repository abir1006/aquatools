import React, {Component} from 'react';
import {connect} from 'react-redux';
import './ModelToolBar.css';
import IconButton from "../../IconButton/IconButton";
import ListAutoComplete from "../../Inputs/ListAutoComplete/ListAutoComplete";
import {
    showTemplateNamePopup,
    setModelScreenCases,
    setModelScreenAllInputs,
    setModelResult,
    setModelScreenBlockStatus,
    changeOutputColumns,
    setModelCaseText,
    unsetModelCaseText
} from "../../../Store/Actions/MTBActions";
import {
    setFeedModelResult,
    resetFeedModelError,
    setFeedTableInputBlockErrors,
    resetFeedModelOutput
} from "../../../Store/Actions/FeedModelActions";
import {resetFeedTable, resetFeedTableCases, resetFeedTimeline} from "../../../Store/Actions/FeedLibraryActions";
import {templateList} from "../../../Store/Actions/TemplateActions";
import {
    setVaccineModelResult,
    setVaccineNames,
    addVaccineNames,
    setVaccineCaseLabels
} from "../../../Store/Actions/VaccineModelActions";
import {setCodCaseLabels, setCodModelResult} from "../../../Store/Actions/CodModelActions";
import {setOptModelResult} from "../../../Store/Actions/OptModelActions";
import {setGeneticsModelResult} from "../../../Store/Actions/GeneticsModelActions";
import {
    showTemplateNotesPopup,
    showPDFPopup,
    showPPTPopup,
    showTemplateUpdateConfirmPopup
} from "../../../Store/Actions/popupActions";
import NavService from "../../../Services/NavServices";
import {withTranslation} from 'react-i18next';
import {setSelectedTemplate} from "../../../Store/Actions/TemplateActions";

class ModelToolBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            templates: [],
            selectedTemplateName: '',
            selectedTemplateID: ''
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props?.template?.selectedTemplate?.action === 'model_input_reset') {
            this.setState({
                listLocalState: true,
                selectedTemplateID: undefined
            });
            this.props.setSelectedTemplate({})
        }
        if (this.props?.template?.selectedTemplate?.action === 'template_saved') {
            this.setState({
                ...this.state,
                listLocalState: true,
                selectedTemplateName: this.props.template.selectedTemplate.name,
                selectedTemplateID: this.props.template.selectedTemplate.id,
                selectedTemplateUserID: this.props.template.selectedTemplate.user_id,
                templateWriteAccess: this.props?.template?.selectedTemplate?.user_id || false
            });
            // this.templateSelectHandler(this.props.template.selectedTemplate.name, this.props.template.selectedTemplate.id)
            this.props.setSelectedTemplate({})
        }
    }

    showPDFPopupHandler() {
        this.props.showPDFPopup();
    }

    showPPTPopupHandler() {
        this.props.showPPTPopup();
    }

    loadTemplateHandler() {
        if (this.state.selectedTemplateName !== '' && this.state.selectedTemplateID) {
            this.templateSelectHandler(this.state.selectedTemplateName, this.state.selectedTemplateID);
        }
    }

    confirmTemplateUpdate(templateID) {
        const {t} = this.props;
        this.props.showTemplateUpdateConfirmPopup(templateID, t('do_you_really_want_to_replace_this_template'))
    }

    templateSelectHandler(name, id) {

        // reload the template list in feed model only
        if (NavService.getCurrentRoute() === 'kn_for') {
            const modelID = this.props.tool_id;
            const authUserId = this.props.auth.data.user.id;
            this.props.templateList(modelID, authUserId);
        }

        this.setState({
            ...this.state,
            listLocalState: false,
            selectedTemplateName: name,
            selectedTemplateID: id,
        });


        const modelTemplates = this.props.modelTemplates;
        let allTemplates = [];
        let countT = 0;
        //let selectedTemplate = [];
        Object.keys(modelTemplates).map(index => {
            modelTemplates[index].map(template => {
                allTemplates[countT] = template;
                countT++;
            })
        });

        let selectedTemplate = allTemplates.filter(template => template.id === id);

        // identify if the selected template is created by own
        this.setState({
            ...this.state,
            selectedTemplateUserID: selectedTemplate[0].user_id,
            templateWriteAccess: selectedTemplate[0].write_access,
        })

        this.props.setSelectedTemplate({
            id: id,
            name: name,
            hasWriteAccess: this.state?.selectedTemplateUserID || this.state?.templateWriteAccess
        })

        let selectedTemplateCaseNumbers = selectedTemplate[0].template_data.caseNumbers;


        //delete selectedTemplate[0].template_data.caseNumbers;

        let selectedTemplateData = selectedTemplate[0].template_data;

        // To handle NaN for input mtb_per_kons
        if (NavService.getCurrentRoute() === 'mtb' && selectedTemplateData.mtb_selskap_mtb_per_kons_case1 === undefined) {
            const mtbPerKonsDefaultData = this.props.blockData[0].block_inputs[1].default_data;
            selectedTemplateData.mtb_selskap_mtb_per_kons_case1 = mtbPerKonsDefaultData;
        }

        if (NavService.getCurrentRoute() === 'kn_for') {
            this.props.resetFeedModelError();
            this.props.setFeedTableInputBlockErrors({});
            this.props.resetFeedTable();
            this.props.resetFeedTableCases();
            // this.props.resetFeedTimeline();
            // this.props.resetFeedModelOutput();
            const feedLibrary = this.props.feedLibrary;
            selectedTemplateData.caseNumbers.map(caseNo => {
                if (selectedTemplateData['feed_table_case' + caseNo] === undefined) {
                    selectedTemplateCaseNumbers = selectedTemplateCaseNumbers.filter(item => item !== caseNo);
                }
                if (selectedTemplateData['feed_table_case' + caseNo] !== undefined) {
                    selectedTemplateData['feed_table_case' + caseNo].map(feed => {
                        // check if template saved feed is exist in feed library, if not exist, then delete that feed from template
                        const hasFeed = feedLibrary.find(item => item.id === feed.feed_id);
                        if (hasFeed === undefined) {
                            delete selectedTemplateData['feed_table_case' + caseNo];
                            selectedTemplateCaseNumbers = selectedTemplateCaseNumbers.filter(item => item !== caseNo);
                        }
                    });
                }
            });
        }

        // set different cases from saved template
        this.props.setModelScreenCases(selectedTemplateCaseNumbers);

        // Check if mtb Variabel drifstkost per kons/ dag NOK found in template, then replace from default value
        for (let i = 1; i <= selectedTemplateCaseNumbers.length; i++) {
            if (Boolean(selectedTemplateData['mtb_priser_variabel_drifstkost_per_kons_dag_nok_case' + i])) {
                selectedTemplateData['mtb_priser_variabel_drifstkost_per_kons_dag_nok_case' + i] = this.props.inputs['mtb_priser_variabel_drifstkost_per_kons_dag_nok_case1'];
            }
        }

        // load input data from saved template
        this.props.setModelScreenAllInputs(selectedTemplateData);

        let saveTemplateInputs = selectedTemplateData;

        // update graph with selected template
        if (NavService.getCurrentRoute() === 'mtb') {
            this.props.unsetModelCaseText()
            if (selectedTemplateData?.modelCaseText) {
                this.props.setModelCaseText(selectedTemplateData?.modelCaseText);
                delete selectedTemplate['modelCaseText']
            }

            // Check if priser snittvekt deadfisk found from template, then replace
            for (let i = 1; i <= selectedTemplateCaseNumbers.length; i++) {
                if (Boolean(saveTemplateInputs['mtb_priser_snittvekt_ddfisk_av_snittvekt_case' + i])) {
                    saveTemplateInputs['mtb_biologi_snittvekt_ddfisk_av_snittvekt_case' + i] = saveTemplateInputs['mtb_priser_snittvekt_ddfisk_av_snittvekt_case' + i];
                }
            }

            if (selectedTemplateCaseNumbers.length > 4 && this.props.outputColumns === 3) {
                this.props.changeOutputColumns();
            }
            if (selectedTemplateCaseNumbers.length <= 4 && this.props.outputColumns === 2 && this.props.screenSize >= 1367) {
                this.props.changeOutputColumns();
            }

            if (selectedTemplateData['mtb_investering_block'] !== undefined) {
                this.props.setModelScreenBlockStatus('mtb_investering', selectedTemplateData['mtb_investering_block']);
            }

            this.props.setModelResult(saveTemplateInputs, selectedTemplateCaseNumbers);
        }

        if (NavService.getCurrentRoute() === 'kn_for') {
            if (selectedTemplateCaseNumbers.length > 3 && this.props.outputColumns === 3) {
                this.props.changeOutputColumns();
            }

            if (selectedTemplateCaseNumbers.length <= 3 && this.props.outputColumns === 2 && this.props.screenSize >= 1367) {
                this.props.changeOutputColumns();
            }
            if (selectedTemplateData['kn_for_kvalitet_block'] !== undefined) {
                this.props.setModelScreenBlockStatus('kn_for_kvalitet', selectedTemplateData['kn_for_kvalitet_block']);
            }
            this.props.setFeedModelResult(saveTemplateInputs, selectedTemplateCaseNumbers);
        }

        if (NavService.getCurrentRoute() === 'vaksinering') {

            this.props.setVaccineCaseLabels(saveTemplateInputs['budget_name'], saveTemplateInputs['block_sjukdom_name']);

            if (selectedTemplateCaseNumbers.length > 4 && this.props.outputColumns === 3) {
                this.props.changeOutputColumns();
            }

            if (selectedTemplateCaseNumbers.length <= 4 && this.props.outputColumns === 2 && this.props.screenSize >= 1367) {
                this.props.changeOutputColumns();
            }

            this.props.setVaccineNames([{name: 'A'}]);
            for (let i = 4; i <= selectedTemplateCaseNumbers.length; i++) {
                this.props.addVaccineNames();
            }

            if (parseFloat(saveTemplateInputs['vaksinering_effekter_sjukdom_redusert_slaktevekt_kg_case1']) > 0.0) {
                saveTemplateInputs['vaksinering_effekter_sjukdom_redusert_slaktevekt_kg_case1'] = -1 * saveTemplateInputs['vaksinering_effekter_sjukdom_redusert_slaktevekt_kg_case1'];
            }

            selectedTemplateCaseNumbers.slice(2, selectedTemplateCaseNumbers.length).map(caseNo => {
                if (parseFloat(saveTemplateInputs['vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' + caseNo]) > 0.0) {
                    saveTemplateInputs['vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' + caseNo] = -1 * saveTemplateInputs['vaksinering_effekter_av_vaksine_tilvekst_kg_bi_effekt_case' + caseNo];
                }
            });

            this.props.setVaccineModelResult(saveTemplateInputs, selectedTemplateCaseNumbers);
        }

        if (NavService.getCurrentRoute() === 'cost_of_disease') {

            this.props.setCodCaseLabels(saveTemplateInputs['budget_name'], saveTemplateInputs['block_sjukdom_name']);


            if (parseFloat(saveTemplateInputs['cost_of_disease_effekter_sjukdom_redusert_slaktevekt_kg_case1']) > 0.0) {
                saveTemplateInputs['cost_of_disease_effekter_sjukdom_redusert_slaktevekt_kg_case1'] = -1 * saveTemplateInputs['cost_of_disease_effekter_sjukdom_redusert_slaktevekt_kg_case1'];
            }

            this.props.setCodModelResult(saveTemplateInputs, selectedTemplateCaseNumbers);
        }


        if (NavService.getCurrentRoute() === 'optimalisering') {

            if (selectedTemplateCaseNumbers.length > 4 && this.props.outputColumns === 3) {
                this.props.changeOutputColumns();
            }

            if (selectedTemplateCaseNumbers.length <= 4 && this.props.outputColumns === 2 && this.props.screenSize >= 1367) {
                this.props.changeOutputColumns();
            }

            if (selectedTemplateData['optimalisering_kvalitet_block'] !== undefined) {
                this.props.setModelScreenBlockStatus('optimalisering_kvalitet', selectedTemplateData['optimalisering_kvalitet_block']);
            }
            if (selectedTemplateData['optimalisering_tiltak_block'] !== undefined) {
                this.props.setModelScreenBlockStatus('optimalisering_tiltak', selectedTemplateData['optimalisering_tiltak_block']);
            }
            this.props.setOptModelResult(saveTemplateInputs, selectedTemplateCaseNumbers);
        }

        if (NavService.getCurrentRoute() === 'genetics') {
            if (selectedTemplateData['genetics_kvalitet_block'] !== undefined) {
                this.props.setModelScreenBlockStatus('genetics_kvalitet', selectedTemplateData['genetics_kvalitet_block']);
            }
            if (selectedTemplateData['genetics_tiltak_block'] !== undefined) {
                this.props.setModelScreenBlockStatus('genetics_tiltak', selectedTemplateData['genetics_tiltak_block']);
            }
            this.props.setGeneticsModelResult(saveTemplateInputs, selectedTemplateCaseNumbers);
        }
    }

    render() {

        const {t} = this.props;

        let modelTemplates = this.props.modelTemplates;
        let templateListAll = [];
        let countList = 0;

        Object.keys(modelTemplates).map(index => {
            templateListAll[countList] = {id: 'group', name: index};
            countList++;
            if (modelTemplates[index].length > 0) {
                modelTemplates[index].map(list => {
                    templateListAll[countList] = list;
                    countList++;
                })
            }

        });

        const showReportButton = this.props.tableViewData === undefined;
        const canUpdateSavedTemplate = this.state.selectedTemplateID !== '' && (this.state.selectedTemplateUserID !== undefined || Boolean(this.state.templateWriteAccess));

        return (
            <div>
                <div className="row" id="model_tool_bar">
                    <div className="col-12 col-xl-9 col-lg-9 col-md-9 col-sm-9">
                        <div className="row">
                            <div className="col-7 col-xl-7 col-lg-7 col-md-7 col-sm-8">
                                <ListAutoComplete
                                    disableListLocalState={this?.state?.listLocalState || false}
                                    selectedItemId={this.state.selectedTemplateID}
                                    fieldName="search_template"
                                    fieldPlaceHolder={t('search_template')}
                                    fieldOnClick={this.templateSelectHandler.bind(this)}
                                    listData={templateListAll}/>
                            </div>
                            <div className="col-2 col-xl-2 col-lg-2 col-md-2 col-sm-2 pl-0 pr-0">
                                <button
                                    style={{minWidth: '100%'}}
                                    className="btn btn-primary default-btn-atv2"
                                    onClick={e => this.loadTemplateHandler(e)}>{t('load')}
                                </button>
                            </div>
                            <div className="col-3 col-xl-3 col-lg-3 col-md-3 col-sm-2 p-0">
                                <IconButton
                                    style={{marginLeft: 10}}
                                    btnDisabled={showReportButton}
                                    title={t('save_template')}
                                    onClickHandler={this.props.showTemplateNamePopup}>
                                    <img src="/images/save_icon.svg"/>
                                </IconButton>
                                {canUpdateSavedTemplate && <IconButton
                                    style={{marginLeft: 10}}
                                    title={t('update_template')}
                                    onClickHandler={e => this.confirmTemplateUpdate(this.state.selectedTemplateID)}>
                                    <img className="svg-dark-icon" src="/images/edit_icon.svg"/>
                                </IconButton>}

                                {(this.props?.tableViewData && this.state?.selectedTemplateID) && <IconButton
                                    style={{marginLeft: 10}}
                                    title={t('add_notes')}
                                    onClickHandler={e => this.props.showTemplateNotesPopup(true)}>
                                    <i className="fa fa-sticky-note-o fa-2x"/>
                                </IconButton>}
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-xl-3 col-lg-3 col-md-3 col-sm-3">
                        <div className="reports_panel float-right">
                            <IconButton
                                btnDisabled={showReportButton}
                                title={t('generate_pdf_report')}
                                onClickHandler={this.showPDFPopupHandler.bind(this)}>
                                {t('pdf')}
                            </IconButton>
                            <IconButton
                                btnDisabled={showReportButton}
                                title={t('generate_ppt_report')}
                                onClickHandler={this.showPPTPopupHandler.bind(this)}>
                                {t('ppt')}
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    modelTemplates: state.template.modelTemplates,
    inputs: state.modelScreen.inputs,
    caseNumbers: state.modelScreen.caseNumbers,
    tableViewData: state.modelScreen.pdfOutput,
    blockData: state.modelScreen.blockData,
    feedTimeline: state.feedModelScreen.feedTimeline,
    feedLibrary: state.feedLibrary.data,
    outputColumns: state.modelScreen.outputColumns,
    auth: state.auth,
    tool_id: state.modelScreen.tool_id,
    template: state.template,
})

export default connect(mapStateToProps, {
    showTemplateNamePopup,
    setModelScreenCases,
    setModelScreenAllInputs,
    setModelResult,
    setFeedModelResult,
    setVaccineModelResult,
    setOptModelResult,
    setGeneticsModelResult,
    showPDFPopup,
    showPPTPopup,
    showTemplateUpdateConfirmPopup,
    setModelScreenBlockStatus,
    addVaccineNames,
    setVaccineNames,
    changeOutputColumns,
    setCodCaseLabels,
    setCodModelResult,
    setVaccineCaseLabels,
    resetFeedModelError,
    setFeedTableInputBlockErrors,
    resetFeedTable,
    resetFeedTableCases,
    resetFeedTimeline,
    resetFeedModelOutput,
    templateList,
    showTemplateNotesPopup,
    setSelectedTemplate,
    setModelCaseText,
    unsetModelCaseText
})(withTranslation()(ModelToolBar));

