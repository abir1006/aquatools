import React, { Component } from 'react';
import { connect } from "react-redux";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";
import {
    userList,
    setUserByID,
    showEditUserForm,
    blockUnblockUser,
    showUserDeleteConfirmPopup,
    resetUserInputs,
    resetUserFieldsEmptyErrors,
    setUserInputsErrors,
} from "../../Store/Actions/userActions";
import {
    showTemplateSharingScreen,
    setSharedTemplate,
    myTemplateList,
    showTemplateDeleteConfirmPopup,
    myTemplateSearch,
} from "../../Store/Actions/TemplateActions";
import InputText from "../Inputs/InputText";
import InlineEdit from './InlineEdit';


class MyTemplateList extends Component {
    constructor(props) {
        super(props);
        this.props.userList();
        this.state = {
            myTemplateSearch: '',
            sortBy: '',
            sortOrder: ''
        }
    }

    componentDidMount() {
        this.props.myTemplateList(undefined, null, 'templates');
    }

    confirm(itemId) {
        this.props.showTemplateDeleteConfirmPopup(itemId);
    }

    handleShareTemplate(templateId, templateName, modelID, modelName) {
        this.props.setSharedTemplate(templateId, templateName, modelID, modelName);
        this.props.showTemplateSharingScreen();
    }

    myTemplateSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        })
        this.props.myTemplateSearch(value);
    }

    paginationChangeHandler(pageNumber) {

        const { sortBy, sortOrder } = this.state;
        if (Boolean(sortOrder)) {
            const sort = { sortBy: sortBy, sortOrder: sortOrder };
            this.props.myTemplateList(pageNumber, sort);
        } else
            this.props.myTemplateList(pageNumber);
    }

    sortByColumn(column) {
        let { sortOrder } = this.state;
        const order = sortOrder == 'desc' ? 'asc' : 'desc';
        const sort = { sortBy: column, sortOrder: order };
        this.setState(sort);
        this.props.myTemplateList(0, sort);
    }

    render() {

        const { t } = this.props;
        const currentRoute = this.props.page.currentRoute;

        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;

        const sectionTitle = t('my_templates');

        const myTemplates = this.props.myTemplates === undefined ? [] : this.props.myTemplates;
        const totalRecord = this.props.myTemplatesPaginationData === undefined ? 0 : this.props.myTemplatesPaginationData.totalRecord;
        const perPage = this.props.myTemplatesPaginationData === undefined ? 1 : this.props.myTemplatesPaginationData.perPage;

        const totalPage = Math.ceil(totalRecord / perPage);
        const currentPage = this.props.myTemplatesPaginationData === undefined ? 1 : this.props.myTemplatesPaginationData.currentPage;

        let countTemplates = 0;

        const showContentSpinner = this.props.myTemplateContentSpinner === undefined || this.props.myTemplateContentSpinner === false;

        return (
            <div className="content-block mb-3">
                <div className="table-responsive text-nowrap">
                    <ContentSpinner spinner={showContentSpinner} />
                    <div className="col- col-xl-12">
                        <div className="row">
                            <div className="col- col-xl-7 p-0">
                                <div className="tab_heading p-0">
                                    <h2>{sectionTitle}</h2>
                                </div>
                            </div>
                            <div className="col- col-xl-5 p-0">
                                {hasSearchPermission && <div className="content-block-grey p-1">
                                    <InputText
                                        fieldName="myTemplateSearch"
                                        fieldClass="own_template_search"
                                        fieldID="own_template_search"
                                        fieldPlaceholder={t('search_my_templates')}
                                        fieldValue={this.state.myTemplateSearch}
                                        fieldOnChange={this.myTemplateSearchHandler.bind(this)} />
                                </div>}
                            </div>
                        </div>
                    </div>
                    {myTemplates.length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th scope="col">{t('id')}</th>
                                <th scope="col" className="w-25" >{t('template')}</th>
                                <th scope="col">{t('type')}</th>
                                <th scope="col">{t('model')}</th>
                                <th style={{ cursor: 'pointer' }} scope="col" onClick={e => this.sortByColumn('created_at')}>
                                    {t('created_at')}
                                    {this.state.sortOrder == 'asc' && <i className="pl-2 fa fa-sort-up"></i>}
                                    {this.state.sortOrder == 'desc' && <i className="pl-2 fa fa-sort-down"></i>}
                                </th>
                                <th scope="col">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myTemplates.slice(0, perPage).map(template => {
                                    countTemplates++;
                                    const templateType = template.type === null ? 'Template' : template.type;
                                    return (
                                        <tr key={countTemplates}>
                                            <td>{template.id}</td>
                                            <td>
                                                <InlineEdit key={template.id} template={template} />
                                            </td>
                                            <td>{templateType}</td>
                                            <td>{template.tool.name}</td>
                                            <td>{DateTimeService.getDateTime(template.created_at)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={e => this.handleShareTemplate(template.id, template.name, template.tool_id , template.tool.name)}
                                                    className="btn btn-primary-outline at2-btn-no-bg">
                                                    <i className="fa fa-share" aria-hidden={true}></i>
                                                </button>
                                                {hasDeletePermission && <button
                                                    title={t('delete') + ' ' + t('template')}
                                                    type="button"
                                                    onClick={e => this.confirm(template.id)}
                                                    className="btn btn-primary-outline at2-btn-no-bg">
                                                    <img src="images/remove_icon.svg" />
                                                </button>}
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>}
                    {myTemplates.length === 0 && <p className="text-center">{t('no_template_found')}</p>}
                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        paginationLinkHandler={this.paginationChangeHandler.bind(this)} />

                </div>
            </div >
        )
    }
}


const mapStateToProps = state => ({
    page: state.page,
    auth: state.auth,
    myTemplates: state.template.myTemplates,
    myTemplatesPaginationData: state.template.myTemplatesPaginationData,
    myTemplateContentSpinner: state.template.myTemplateContentSpinner,
});

export default connect(mapStateToProps, {
    userList,
    setUserByID,
    showEditUserForm,
    blockUnblockUser,
    showUserDeleteConfirmPopup,
    resetUserInputs,
    resetUserFieldsEmptyErrors,
    setUserInputsErrors,
    showTemplateSharingScreen,
    myTemplateList,
    setSharedTemplate,
    showTemplateDeleteConfirmPopup,
    myTemplateSearch,
})(MyTemplateList);
