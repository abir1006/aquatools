import React from 'react';
import {connect, useDispatch} from 'react-redux';
import axios from "axios";
import TokenServices from "../../Services/TokenServices";
import {companyList} from "../../Store/Actions/companyActions";
import {fetchMaterialCategories, fetchMaterials, fetchMaterialTags} from "../../Store/Actions/MaterialsActions";
import {userList} from "../../Store/Actions/userActions";
import {reportList} from "../../Store/Actions/ReportActions";
import {feedSettingsList} from "../../Store/Actions/FeedSettingsActions";
import {fetchFeedLibrary} from "../../Store/Actions/FeedLibraryActions";
import {
    templateList,
    templateListAll,
    myTemplateList,
    showAllTemplateContentSpinner,
    hideAllTemplateContentSpinner,
    showMyTemplateContentSpinner,
    hideMyTemplateContentSpinner,
    showSharedByMeTemplateContentSpinner,
    hideSharedByMeTemplateContentSpinner,
    showSharedWithMeTemplateContentSpinner,
    hideSharedWithMeTemplateContentSpinner,
    allSharedByMeTemplatesData,
    allSharedWithMeTemplatesData, setSelectedTemplate,
} from "../../Store/Actions/TemplateActions";
import './popup.css';
import NavService from "../../Services/NavServices";
import {
    setConfirmAccountDelete,
    setConfirmBlockBulkDelete,
    setConfirmInputBulkDelete,
    setConfirmLogsBulkDelete,
    setConfirmNavigationSwitch,
    setConfirmYes,
    setIsDirty, unsetIsDirty
} from "../../Store/Actions/popupActions";
import {fetchItems} from '../../Store/Actions/TranslationsActions';

import {setModelScreenInputs, setModelResult} from "../../Store/Actions/MTBActions";
import {setVaccineModelResult} from "../../Store/Actions/VaccineModelActions";
import {setCodModelResult} from "../../Store/Actions/CodModelActions";
import {setOptModelResult} from "../../Store/Actions/OptModelActions";
import {setGeneticsModelResult} from "../../Store/Actions/GeneticsModelActions";
import {setFeedModelResult} from "../../Store/Actions/FeedModelActions";
import {withTranslation} from "react-i18next";

const ConfirmPopup = props => {

    const {t} = props;
    const dispatch = useDispatch();

    const successMessage = t('successfully_updated');
    const deleteSuccessMessage = t('successfully_deleted');
    const resetSuccessMessage = t('successfully_reset_to_default');
    const failedMessage = t('action_failed_try_again');
    const removeSuccessMessage = t('successfully_removed');

    const confirmOperation = async () => {

        // Model screen reset to default popup
        if (props.popup.confirmItemName === 'modelScreen') {

            dispatch(setSelectedTemplate({
                action: 'model_input_reset'
            }))

            let modelInputs = {};
            props.blocks.map(block => {
                block.block_inputs.map(input => {
                    props.caseNumbers.map(caseNo => {
                        modelInputs[input.slug + '_case' + caseNo] = input.default_data;
                        // set default value to input section
                        let inputObj = {};
                        if (input.slug !== 'mtb_priser_smoltpris_per_kg') {
                            inputObj[input.slug + '_case' + caseNo] = input.default_data;
                            if (
                                input.slug === 'vaksinering_general_navn' ||
                                input.slug === 'optimalisering_general_navn' ||
                                input.slug === 'kn_for_generell_navn' ||
                                input.slug === 'cost_of_disease_general_navn' ||
                                input.slug === 'genetics_general_navn'
                            ) {
                                const firstName = props.auth.data.user.first_name;
                                const lastName = !Boolean(props.auth.data.user.last_name) ? '' : props.auth.data.user.last_name;
                                const fullName = firstName + ' ' + lastName;
                                inputObj[input.slug + '_case' + caseNo] = fullName;
                            }
                            if (input.slug === 'kn_for_grunnforutsetning_temperaturmodell') {
                                inputObj[input.slug + '_case' + caseNo] = props.modelScreenInputs['kn_for_grunnforutsetning_temperaturmodell_case' + caseNo];
                            }
                            if (input.slug === 'kn_for_grunnforutsetning_utsettsdato') {
                                inputObj[input.slug + '_case' + caseNo] = props.modelScreenInputs['kn_for_grunnforutsetning_utsettsdato_case' + caseNo];
                            }
                            if (input.slug === 'kn_for_grunnforutsetning_harvest_date') {
                                inputObj[input.slug + '_case' + caseNo] = props.modelScreenInputs['kn_for_grunnforutsetning_harvest_date_case' + caseNo];
                            }
                            props.setModelScreenInputs(inputObj);
                        }
                    });
                })
            });

            // for MTB re calculate smoltpris_per_kg from default value
            if (props.popup.confirmItemId === 'mtb') {
                props.caseNumbers.map(caseNo => {
                    const smoltprisPerFisk = modelInputs['mtb_priser_smoltpris_per_fisk_case' + caseNo];
                    const smoltvektGram = modelInputs['mtb_produksjon_smoltvekt_gram_case' + caseNo];
                    modelInputs['mtb_priser_smoltpris_per_kg_case' + caseNo] = (smoltprisPerFisk * 1000) / smoltvektGram;
                })
            }

            // for Feed model add dates, the feed table and temperature module data
            if (props.popup.confirmItemId === 'kn_for') {
                modelInputs['caseNumbers'] = props.caseNumbers;
                props.caseNumbers.map(caseNo => {
                    modelInputs['kn_for_grunnforutsetning_harvest_date_case' + caseNo] = props.modelScreenInputs['kn_for_grunnforutsetning_harvest_date_case' + caseNo];
                    modelInputs['kn_for_grunnforutsetning_utsettsdato_case' + caseNo] = props.modelScreenInputs['kn_for_grunnforutsetning_utsettsdato_case' + caseNo];
                    modelInputs['feed_table_case' + caseNo] = props.modelScreenInputs['feed_table_case' + caseNo];
                });
                modelInputs['temperature_module'] = props.modelScreenInputs.temperature_module;
            }

            // render output with default inputs
            await props.setAllModelResult(modelInputs, props.caseNumbers, props.popup.confirmItemId);
            props.showSuccessMessage(resetSuccessMessage);
        }


        // For navigation prompt
        if (props.popup.confirmItemName === 'navigation_prompt') {
            props.setConfirmYes(props.popup.confirmItemId.pathname);
            props.setConfirmNavigationSwitch(true);
        }


        // Feed settings delete operation after confirm = YES
        if (props.popup.confirmItemName === 'feed library') {
            const feedLibraryID = props.popup.confirmItemId;
            await axios.delete('api/feed/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: feedLibraryID
                }
            }).then(response => {
                // adjust pagination
                // let currentPage = props.feedPaginationData.currentPage;
                // const totalPage = Math.ceil(props.feedPaginationData.totalRecord / props.feedPaginationData.perPage);
                // if (totalPage < currentPage) {
                //     currentPage = currentPage - 1;
                // }
                props.reloadFeedLibraryList();
                props.hideContentSpinner();
                props.showSuccessMessage(successMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }

        // Feed settings delete operation after confirm = YES
        if (props.popup.confirmItemName === 'feed settings') {
            const feedSettingsID = props.popup.confirmItemId;
            await axios.delete('api/feed_settings/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: feedSettingsID
                }
            }).then(response => {
                props.reloadFeedSettingsList();
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }


        // Report delete operation after confirm = YES
        if (props.popup.confirmItemName === 'report') {
            const reportID = props.popup.confirmItemId;
            axios.delete('api/report/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: reportID
                }
            }).then(response => {
                // adjust pagination
                let currentPage = props.reportPaginationData.currentPage;
                const totalPage = Math.ceil(props.reportPaginationData.totalRecord / props.reportPaginationData.perPage);
                if (totalPage < currentPage) {
                    currentPage = currentPage - 1;
                }
                props.reloadReportList(currentPage);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }

        // Template update operation after confirm = YES
        if (props.popup.confirmItemName === 'template update') {
            const templateID = props.popup.confirmItemId;
            const modelInputs = props.modelScreenInputs;
            modelInputs['modelCaseText'] = props?.modelCaseText || undefined
            axios.put('api/template/update', {
                id: templateID,
                updated_by: props.auth.data.user.id,
                template_data: modelInputs
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            }).then(response => {
                const modelID = response.data.data.tool_id;
                //const userID = response.data.data.user_id;
                const userID = props.auth.data.user.id;
                props.reloadSearchTemplateList(modelID, userID);
                props.showSuccessMessage(successMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }

        // Template shared by me remove operation after confirm = YES
        if (props.popup.confirmItemName === 'template shared with you') {
            props.showSharedWithMeTemplateContentSpinner();
            const sharedId = props.popup.confirmItemId;
            axios.delete('api/template/remove_share', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: sharedId
                }
            }).then(response => {
                // adjust shared with me templates pagination
                let sharedWithMeTemplateCurrentPage = 1;
                if (props.allSharedWithMePaginationData !== undefined) {
                    sharedWithMeTemplateCurrentPage = props.allSharedWithMePaginationData.currentPage;
                    const sharedWithMeTemplatesTotalPage = Math.ceil(props.allSharedWithMePaginationData.totalRecord / props.allSharedWithMePaginationData.perPage);
                    if (sharedWithMeTemplatesTotalPage < sharedWithMeTemplateCurrentPage) {
                        sharedWithMeTemplateCurrentPage = sharedWithMeTemplateCurrentPage - 1;
                    }
                }
                props.reloadSharedWithMeTemplateList(sharedWithMeTemplateCurrentPage);
                props.hideSharedWithMeTemplateContentSpinner();
                props.showSuccessMessage(removeSuccessMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.hideSharedWithMeTemplateContentSpinner();
                props.showFailedMessage(failedMessage);
            });
        }

        // Template shared by me remove operation after confirm = YES
        if (props.popup.confirmItemName === 'template shared by you') {
            props.showSharedByMeTemplateContentSpinner();
            const sharedId = props.popup.confirmItemId;
            axios.delete('api/template/remove_share', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: sharedId
                }
            }).then(response => {
                // adjust my shared templates pagination
                let sharedByMeTemplateCurrentPage = 1;
                if (props.allSharedByMePaginationData !== undefined) {
                    sharedByMeTemplateCurrentPage = props.allSharedByMePaginationData.currentPage;
                    const sharedByMeTemplatesTotalPage = Math.ceil(props.allSharedByMePaginationData.totalRecord / props.allSharedByMePaginationData.perPage);
                    if (sharedByMeTemplatesTotalPage < sharedByMeTemplateCurrentPage) {
                        sharedByMeTemplateCurrentPage = sharedByMeTemplateCurrentPage - 1;
                    }
                }
                props.reloadSharedByMeTemplateList(sharedByMeTemplateCurrentPage);
                props.hideSharedByMeTemplateContentSpinner();
                props.showSuccessMessage(removeSuccessMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.hideSharedByMeTemplateContentSpinner();
                props.showFailedMessage(failedMessage);
            });
        }

        // Template delete operation after confirm = YES
        if (props.popup.confirmItemName === 'template') {
            props.showTemplateContentSpinner();
            const templateId = props.popup.confirmItemId;
            axios.delete('api/template/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: templateId
                }
            }).then(response => {
                // adjust all templates pagination
                let allTemplateCurrentPage = 1;
                if (props.allTemplatesPaginationData !== undefined) {
                    allTemplateCurrentPage = props.allTemplatesPaginationData.currentPage;
                    const allTemplatesTotalPage = Math.ceil(props.allTemplatesPaginationData.totalRecord / props.allTemplatesPaginationData.perPage);
                    if (allTemplatesTotalPage < allTemplateCurrentPage) {
                        allTemplateCurrentPage = allTemplateCurrentPage - 1;
                    }
                }
                props.reloadAllTemplateList(allTemplateCurrentPage);

                // adjust my templates pagination
                let myTemplateCurrentPage = 1;
                if (props.myTemplatesPaginationData !== undefined) {
                    myTemplateCurrentPage = props.myTemplatesPaginationData.currentPage;
                    const myTemplatesTotalPage = Math.ceil(props.myTemplatesPaginationData.totalRecord / props.myTemplatesPaginationData.perPage);
                    if (myTemplatesTotalPage < myTemplateCurrentPage) {
                        myTemplateCurrentPage = myTemplateCurrentPage - 1;
                    }
                }

                props.reloadMyTemplateList(myTemplateCurrentPage);

                // adjust my shared templates pagination
                let sharedByMeTemplateCurrentPage = 1;
                if (props.allSharedByMePaginationData !== undefined) {
                    sharedByMeTemplateCurrentPage = props.allSharedByMePaginationData.currentPage;
                    const sharedByMeTemplatesTotalPage = Math.ceil(props.allSharedByMePaginationData.totalRecord / props.allSharedByMePaginationData.perPage);
                    if (sharedByMeTemplatesTotalPage < sharedByMeTemplateCurrentPage) {
                        sharedByMeTemplateCurrentPage = sharedByMeTemplateCurrentPage - 1;
                    }
                }

                props.reloadSharedByMeTemplateList(sharedByMeTemplateCurrentPage);


                // adjust shared with me templates pagination

                let sharedWithMeTemplateCurrentPage = 1;
                if (props.allSharedWithMePaginationData !== undefined) {
                    sharedWithMeTemplateCurrentPage = props.allSharedWithMePaginationData.currentPage;
                    const sharedWithMeTemplatesTotalPage = Math.ceil(props.allSharedWithMePaginationData.totalRecord / props.allSharedWithMePaginationData.perPage);
                    if (sharedWithMeTemplatesTotalPage < sharedWithMeTemplateCurrentPage) {
                        sharedWithMeTemplateCurrentPage = sharedWithMeTemplateCurrentPage - 1;
                    }
                }

                props.reloadSharedWithMeTemplateList(sharedWithMeTemplateCurrentPage);
                props.hideTemplateContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.hideTemplateContentSpinner();
                props.showFailedMessage(failedMessage);
            });
        }

        // Model delete operation after confirm = YES
        if (props.popup.confirmItemName === 'model') {
            props.showContentSpinner();
            const modelId = props.popup.confirmItemId;
            axios.delete('api/tool/delete',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenServices.getToken()}`
                    },
                    data: {
                        id: modelId
                    }
                }).then(response => {
                // dispatch action for delete model
                props.deleteModelData(modelId);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                props.hideContentSpinner();
                props.showFailedMessage(failedMessage);
            });
        }

        if (props.popup.confirmItemName === 'modelBlock') {

            props.confirmDeleteBlocks(true);
        }

        // Translation delete operation after confirm = YES
        if (props.popup.confirmItemName === 'translation') {
            props.showContentSpinner();
            const id = props.popup.confirmItemId;
            axios.delete('api/translations/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: id
                },
            }).then(response => {
                // adjust pagination
                let currentPage = props.translationPaginationData.currentPage;
                const totalPage = Math.ceil(props.translationPaginationData.totalRecord / props.translationPaginationData.perPage);
                if (totalPage < currentPage) {
                    currentPage = currentPage - 1;
                }
                props.reloadTranslations(currentPage);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log(error);
                props.hideContentSpinner();
                props.showFailedMessage(failedMessage);
            });
        }

        // Material delete operation after confirm = YES
        if (props.popup.confirmItemName === 'material') {
            const id = props.popup.confirmItemId;
            axios.delete('api/material/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: id
                },
            }).then(response => {
                // adjust pagination
                let currentPage = props.materialPaginationData.currentPage;
                const totalPage = Math.ceil(props.materialPaginationData.totalRecord / props.materialPaginationData.perPage);
                if (totalPage < currentPage) {
                    currentPage = currentPage - 1;
                }
                props.reloadFeaturedMaterials();
                props.reloadMaterials(currentPage);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }

        // Tag delete operation after confirm = YES
        if (props.popup.confirmItemName === 'tag') {
            const id = props.popup.confirmItemId;
            axios.delete('api/tags/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: id

                }
            }).then(response => {

                props.reloadTags(1);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }


        // Category delete operation after confirm = YES
        if (props.popup.confirmItemName === 'category') {
            const id = props.popup.confirmItemId;
            axios.delete('api/categories/' + id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: id

                }
            }).then(response => {

                props.reloadCategories(1);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }


        // Company delete operation after confirm = YES
        if (props.popup.confirmItemName === 'company') {
            const companyId = props.popup.confirmItemId;
            axios.delete('api/company/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: companyId
                },
            }).then(response => {
                // adjust pagination
                let currentPage = props.companyPaginationData.currentPage;
                const totalPage = Math.ceil(props.companyPaginationData.totalRecord / props.companyPaginationData.perPage);
                if (totalPage < currentPage) {
                    currentPage = currentPage - 1;
                }
                props.reloadCompanyList(currentPage);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }

        // Company delete operation after confirm = YES
        if (props.popup.confirmItemName === 'user') {
            const userId = props.popup.confirmItemId;
            axios.post('api/user/delete', {
                id: userId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                }
            }).then(response => {
                // adjust pagination
                let currentPage = props.userPaginationData.currentPage;
                const totalPage = Math.ceil(props.userPaginationData.totalRecord / props.userPaginationData.perPage);
                if (totalPage < currentPage) {
                    currentPage = currentPage - 1;
                }
                props.reloadUserList(currentPage);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                console.log('error found');
                console.log(error);
                props.showFailedMessage(failedMessage);
            });
        }

        // Role delete operation after confirm = YES
        if (props.popup.confirmItemName === 'role') {
            props.showContentSpinner();
            const roleId = props.popup.confirmItemId;
            axios.post('api/role/delete', {
                    id: roleId
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenServices.getToken()}`
                    }
                }).then(response => {
                // dispatch action for delete role
                props.deleteRoleData(roleId);
                props.hideContentSpinner();
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                props.hideContentSpinner();
                props.showFailedMessage(failedMessage);
            });
        }

        // Invoice Settings delete operation after confirm = YES
        if (props.popup.confirmItemName === 'invoice_settings') {
            const invoiceSettingsId = props.popup.confirmItemId;
            axios.delete('api/invoice_setting/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenServices.getToken()}`
                },
                data: {
                    id: invoiceSettingsId
                },
            }).then(response => {
                // dispatch action for delete invoice settings
                props.deleteInvoiceSettingsData(invoiceSettingsId);
                props.showSuccessMessage(deleteSuccessMessage);

            }).catch(error => {
                props.showFailedMessage(failedMessage);
            });
        }

        // Block input bulk delete operation after confirm = YES
        if (props.popup.confirmItemName === 'delete_block_inputs') {
            props.confirmDeleteBlockInput(true);
        }

        // User logs bulk delete operation after confirm = YES
        if (props.popup.confirmItemName === 'delete_user_logs') {
            props.confirmDeleteUserLogs(true);
        }

        // User account delete operation after confirm = YES
        if (props.popup.confirmItemName === 'remove_account') {
            props.confirmRemoveAccount(true);
        }

        props.hideConfirmPopup();

    }

    const handleConfirmNo = () => {
        props.confirmRemoveAccount(undefined);
        props.confirmDeleteUserLogs(undefined);
        props.confirmDeleteBlockInput(undefined);
        props.confirmDeleteBlocks(undefined);
        props.setConfirmNavigationSwitch(undefined);
        props.hideConfirmPopup();
    }

    return (
        <div id="at2_popup">
            <div className="popup_box confirm_popup_box">
                <div>
                    {props.popup.confirmItemMessage === undefined &&
                    <h5>{t('do_you_want_to_delete')} {props.popup.confirmItemName} {t('id_no')}: <b>{props.popup.confirmItemId}</b>?
                    </h5>}
                    {props.popup.confirmItemMessage !== undefined && <h5>{props.popup.confirmItemMessage}</h5>}
                    <button
                        onClick={handleConfirmNo}
                        className="btn btn-primary default-btn-atv2">
                        {t('no')}
                    </button>
                    <button
                        onClick={confirmOperation}
                        className="btn btn-primary default-btn-atv2">
                        {t('yes')}
                    </button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => (
    {
        auth: state.auth,
        popup: state.popup,
        pageHistory: state.page.pageHistory,
        companyPaginationData: state.company.paginationData,
        materialPaginationData: state.materials.paginationData,
        translationPaginationData: state.translations.paginationData,
        userPaginationData: state.user.paginationData,
        reportPaginationData: state.report.paginationData,
        allTemplatesPaginationData: state.template.allTemplatesPaginationData,
        myTemplatesPaginationData: state.template.myTemplatesPaginationData,
        allSharedByMePaginationData: state.template.allSharedByMePaginationData,
        allSharedWithMePaginationData: state.template.allSharedWithMePaginationData,
        modelScreenInputs: state.modelScreen.inputs,
        caseNumbers: state.modelScreen.caseNumbers,
        modelCaseText: state.modelScreen.modelCaseText,
        feedPaginationData: state.feedLibrary.paginationData,
        blocks: state.modelScreen.blockData,
        page: state.page,
        modelID: state.modelScreen.tool_id,
    }
);

const mapDispatchToProps = dispatch => {
    return {
        reloadSearchTemplateList: (modelID, userID) => {
            dispatch(templateList(modelID, userID));
        },
        reloadTranslations: pageNo => {
            dispatch(fetchItems(pageNo));
        },
        reloadTags: pageNo => {
            dispatch(fetchMaterialTags(pageNo));
        },
        reloadCategories: pageNo => {
            dispatch(fetchMaterialCategories(pageNo));
        },
        reloadFeaturedMaterials: () => {
            dispatch(fetchMaterials(null, true, true));
        },
        reloadMaterials: pageNo => {
            dispatch(fetchMaterials(pageNo));
        },
        reloadCompanyList: pageNo => {
            dispatch(companyList(pageNo));
        },
        reloadUserList: pageNo => {
            dispatch(userList(pageNo));
        },
        reloadReportList: pageNo => {
            dispatch(reportList(pageNo));
        },
        reloadFeedLibraryList: () => {
            dispatch(fetchFeedLibrary());
        },
        reloadAllTemplateList: pageNo => {
            dispatch(templateListAll(pageNo));
        },
        reloadMyTemplateList: pageNo => {
            dispatch(myTemplateList(pageNo));
        },
        reloadFeedSettingsList: () => {
            dispatch(feedSettingsList());
        },
        reloadSharedByMeTemplateList: pageNo => {
            dispatch(allSharedByMeTemplatesData(pageNo))
        },
        reloadSharedWithMeTemplateList: pageNo => {
            dispatch(allSharedWithMeTemplatesData(pageNo))
        },
        hideConfirmPopup: () => {
            dispatch({type: 'HIDE_CONFIRM_POPUP'})
        },
        deleteRoleData: role_id => {
            dispatch({type: 'DELETE_ROLE_DATA', payload: role_id})
        },
        deleteModelData: modelID => {
            dispatch({type: 'DELETE_MODEL_DATA', payload: modelID})
        },
        deleteTemplateData: templateID => {
            dispatch({type: 'DELETE_TEMPLATE_DATA', payload: templateID})
        },
        deleteModelBlockData: blockID => {
            dispatch({type: 'DELETE_MODEL_BLOCK_DATA', payload: blockID})
        },
        deleteInvoiceSettingsData: invoiceSettingsId => {
            dispatch({type: 'DELETE_INVOICE_SETTINGS_DATA', payload: invoiceSettingsId})
        },
        showSuccessMessage: message => {
            dispatch({type: 'SHOW_NOTIFICATION_POPUP', payload: message});
            setTimeout(() => {
                dispatch({type: 'HIDE_NOTIFICATION_POPUP'})
            }, 3000);
        },
        showFailedMessage: message => {
            dispatch({type: 'SHOW_NOTIFICATION_POPUP', payload: message})
            setTimeout(() => {
                dispatch({type: 'HIDE_NOTIFICATION_POPUP'})
            }, 3000);
        },
        showContentSpinner: () => {
            dispatch({type: 'SHOW_CONTENT_SPINNER'})
        },
        hideContentSpinner: () => {
            dispatch({type: 'HIDE_SPINNER'})
        },
        showTemplateContentSpinner: () => {
            dispatch(showAllTemplateContentSpinner());
            dispatch(showMyTemplateContentSpinner());
        },
        hideTemplateContentSpinner: () => {
            dispatch(hideAllTemplateContentSpinner());
            dispatch(hideMyTemplateContentSpinner());
        },
        showSharedByMeTemplateContentSpinner: () => {
            dispatch(showSharedByMeTemplateContentSpinner());
        },
        hideSharedByMeTemplateContentSpinner: () => {
            dispatch(hideSharedByMeTemplateContentSpinner());
        },
        showSharedWithMeTemplateContentSpinner: () => {
            dispatch(showSharedWithMeTemplateContentSpinner());
        },
        hideSharedWithMeTemplateContentSpinner: () => {
            dispatch(hideSharedWithMeTemplateContentSpinner());
        },
        doLogout: () => {
            dispatch({type: 'DO_LOGOUT'})
        },
        setConfirmYes: (url) => {
            dispatch(setConfirmYes(url));
        },
        unsetIsDirty: () => {
            dispatch(unsetIsDirty());
        },
        confirmDeleteBlockInput: status => {
            dispatch(setConfirmInputBulkDelete(status));
        },
        setModelScreenInputs: inputObj => {
            dispatch(setModelScreenInputs(inputObj));
        },
        setAllModelResult: (inputs, caseNumbers, modelSlug) => {
            if (modelSlug === 'mtb') {
                dispatch(setModelResult(inputs, caseNumbers));
            }
            if (modelSlug === 'vaksinering') {
                dispatch(setVaccineModelResult(inputs, caseNumbers));
            }
            if (modelSlug === 'cost_of_disease') {
                dispatch(setCodModelResult(inputs, caseNumbers));
            }
            if (modelSlug === 'optimalisering') {
                dispatch(setOptModelResult(inputs, caseNumbers));
            }
            if (modelSlug === 'genetics') {
                dispatch(setGeneticsModelResult(inputs, caseNumbers));
            }
            if (modelSlug === 'kn_for') {
                dispatch(setFeedModelResult(inputs, caseNumbers));
            }
        },
        confirmDeleteBlocks: status => {
            dispatch(setConfirmBlockBulkDelete(status));
        },
        confirmDeleteUserLogs: status => {
            dispatch(setConfirmLogsBulkDelete(status));
        },
        confirmRemoveAccount: status => {
            dispatch(setConfirmAccountDelete(status));
        },
        setConfirmNavigationSwitch: status => {
            dispatch(setConfirmNavigationSwitch(status));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ConfirmPopup));
