import React from 'react';
import {connect} from 'react-redux';
import {setCompanyInputs} from "../../Store/Actions/companyActions";
import CheckBox from "../Inputs/CheckBox";
import AdddonsPriceSummery from "./AddonsPriceSummery";
import EditableField from "../Inputs/EditableField/EditableField";
import DiscountField from "../Inputs/DiscountField/DiscountField";

const PermissionAddonsFields = props => {

    // Custom Report permission and price change handler

    const customReportCheckUncheck = permission => {
        props.setCompanyInputs({custom_report_permission: permission});
    }

    const customReportDiscountChangeHandler = discount => {
        props.setCompanyInputs({custom_report_discount: discount === '' ? 0 : discount})
    }


    // Download Template permission and price change handler

    const downloadTemplateCheckUncheck = permission => {
        props.setCompanyInputs({download_template_permission: permission});
    }

    const downloadTemplateDiscountChangeHandler = discount => {
        props.setCompanyInputs({download_template_discount: discount === '' ? 0 : discount})
    }


    // Share Template permission and price change handler

    const shareTemplateCheckUncheck = permission => {
        props.setCompanyInputs({share_template_permission: permission});
    }

    const shareTemplateDiscountChangeHandler = discount => {
        props.setCompanyInputs({share_template_discount: discount === '' ? 0 : discount})
    }


    // Save Template permission and price change handler

    const saveTemplateCheckUncheck = permission => {
        props.setCompanyInputs({save_template_permission: permission});
    }

    const saveTemplateDiscountChangeHandler = discount => {
        props.setCompanyInputs({save_template_discount: discount === '' ? 0 : discount})
    }


    // Save COD disease permission and price change handler

    const saveCodCheckUncheck = permission => {
        props.setCompanyInputs({save_cod_permission: permission});
    }

    const saveCodDiscountChangeHandler = discount => {
        props.setCompanyInputs({save_cod_discount: discount === '' ? 0 : discount})
    }

    const currencySymbolBefore = props.currencySymbols[props.inputs.currency];

    const crInputBlockClass = props.inputs.custom_report_is_sent === undefined || props.inputs.custom_report_is_sent === false ? 'input-block':'input-block input-disable';
    const dtInputBlockClass = props.inputs.download_template_is_sent === undefined || props.inputs.download_template_is_sent === false ? 'input-block':'input-block input-disable';
    const stInputBlockClass = props.inputs.share_template_is_sent === undefined || props.inputs.share_template_is_sent === false ? 'input-block':'input-block input-disable';
    const svtInputBlockClass = props.inputs.save_template_is_sent === undefined || props.inputs.save_template_is_sent === false ? 'input-block':'input-block input-disable';
    const svcodInputBlockClass = props.inputs.save_cod_is_sent === undefined || props.inputs.save_cod_is_sent === false ? 'input-block':'input-block input-disable';

    return (
        <div className="content-block-grey">
            <div className="row">
                <div className="col-9 col-xl-10 col-lg-9 col-md-10 col-sm-9">
                    <div className="form_sub_heading pb-0">Permissions Add-ons</div>
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <div className={crInputBlockClass}>
                                <CheckBox
                                    checkUncheckHandler={customReportCheckUncheck}
                                    fieldName="permission_custom_report"
                                    fieldValue={props.inputs.custom_report_permission}
                                    text="Custom Report"/>
                                <span className="each_model_price">
                                    <div className="editableWrapper">
                                        <span className="currency">(+{currencySymbolBefore}</span>
                                        <EditableField
                                            fieldValue={props.inputs.custom_report_price}
                                            fieldName="custom_report_price"
                                            inputSize="25"/>
                                        <span>)</span>
                                    </div>
                                    <DiscountField
                                        fieldValue="0"
                                        fieldOnChange={customReportDiscountChangeHandler}
                                        inputSize="23"/>
                                </span>
                            </div>
                            <div className={dtInputBlockClass}>
                                <CheckBox
                                    checkUncheckHandler={downloadTemplateCheckUncheck}
                                    fieldName="permission_download_template"
                                    fieldValue={props.inputs.download_template_permission}
                                    text="Download Template"/>
                                <span className="each_model_price">
                                    <div className="editableWrapper">
                                        <span className="currency">(+{currencySymbolBefore}</span>
                                        <EditableField
                                            fieldValue={props.inputs.download_template_price}
                                            fieldName="download_template_price"
                                            inputSize="25"/>
                                        <span>)</span>
                                    </div>
                                    <DiscountField
                                        fieldValue="0"
                                        fieldOnChange={downloadTemplateDiscountChangeHandler}
                                        inputSize="23"/>
                                </span>
                            </div>


                            <div className={stInputBlockClass}>
                                <CheckBox
                                    checkUncheckHandler={shareTemplateCheckUncheck}
                                    fieldName="permission_share_template"
                                    fieldValue={props.inputs.share_template_permission}
                                    text="Share Template"/>
                                <span className="each_model_price">
                                    <div className="editableWrapper">
                                        <span className="currency">(+{currencySymbolBefore}</span>
                                        <EditableField
                                            fieldValue={props.inputs.share_template_price}
                                            fieldName="share_template_price"
                                            inputSize="25"/>
                                        <span>)</span>
                                    </div>
                                    <DiscountField
                                        fieldValue="0"
                                        fieldOnChange={shareTemplateDiscountChangeHandler}
                                        inputSize="23"/>
                                </span>
                            </div>
                        </div>
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                            <div className={svtInputBlockClass}>
                                <CheckBox
                                    checkUncheckHandler={saveTemplateCheckUncheck}
                                    fieldName="permission_save_template"
                                    fieldValue={props.inputs.save_template_permission}
                                    text="Save Template"/>
                                <span className="each_model_price">
                                    <div className="editableWrapper">
                                        <span className="currency">(+{currencySymbolBefore}</span>
                                        <EditableField
                                            fieldValue={props.inputs.save_template_price}
                                            fieldName="save_template_price"
                                            inputSize="25"/>
                                        <span>)</span>
                                    </div>
                                    <DiscountField
                                        fieldValue="0"
                                        fieldOnChange={saveTemplateDiscountChangeHandler}
                                        inputSize="23"/>
                                </span>
                            </div>
                            <div className={svcodInputBlockClass}>
                                <CheckBox
                                    checkUncheckHandler={saveCodCheckUncheck}
                                    fieldName="permission_save_disease_cod"
                                    fieldValue={props.inputs.save_cod_permission}
                                    text="Save disease, COD"/>
                                <span className="each_model_price">
                                    <div className="editableWrapper">
                                        <span className="currency">(+{currencySymbolBefore}</span>
                                        <EditableField
                                            fieldValue={props.inputs.save_cod_price}
                                            fieldName="save_cod_price"
                                            inputSize="25"/>
                                        <span>)</span>
                                    </div>
                                    <DiscountField
                                        fieldValue="0"
                                        fieldOnChange={saveCodDiscountChangeHandler}
                                        inputSize="23"/>
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="col-3 col-xl-2 col-lg-3 col-md-2 col-sm-3">
                    <AdddonsPriceSummery/>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    inputs: state.company.inputs,
    currencySymbols: state.company.currencySymbols,
    invoiceSettingsData: state.company.invoiceSettingsData,
})


export default connect(mapStateToProps, {setCompanyInputs})(PermissionAddonsFields);
