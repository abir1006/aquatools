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
    templateListAll,
    setSharedTemplate,
    showTemplateDeleteConfirmPopup,
    allTemplateSearch,
} from "../../Store/Actions/TemplateActions";
import InputText from "../Inputs/InputText";

class AllTemplateList extends Component {
    constructor(props) {
        super(props);
        this.props.userList();
        this.state = {
            allTemplateSearch: '',
            sortBy: '',
            sortOrder: ''
        }
    }

    componentDidMount() {
        this.props.templateListAll();
    }

    confirm(itemId) {
        this.props.showTemplateDeleteConfirmPopup(itemId);
    }

    handleShareTemplate(templateId, templateName, modelID, modelName) {
        this.props.setSharedTemplate(templateId, templateName, modelID, modelName);
        this.props.showTemplateSharingScreen();
    }

    allTemplateSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        })
        this.props.allTemplateSearch(value);
    }

    paginationChangeHandler(pageNumber) {
        const { sortBy, sortOrder } = this.state;
        if (Boolean(sortOrder)) {
            const sort = { sortBy: sortBy, sortOrder: sortOrder };
            this.props.templateListAll(pageNumber, sort);
        } else
            this.props.templateListAll(pageNumber);
    }

    sortByColumn(column) {
        let { sortOrder } = this.state;
        const order = sortOrder == 'desc' ? 'asc' : 'desc';
        const sort = { sortBy: column, sortOrder: order };
        this.setState(sort);
        this.props.templateListAll(0, sort);
    }
    render() {

        const { t } = this.props;

        const currentRoute = this.props.page.currentRoute;

        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;

        const sectionTitle = t('all_templates');

        const allTemplates = this.props.allTemplates === undefined ? [] : this.props.allTemplates;

        const totalRecord = this.props.allTemplatesPaginationData === undefined ? 0 : this.props.allTemplatesPaginationData.totalRecord;
        const perPage = this.props.allTemplatesPaginationData === undefined ? 1 : this.props.allTemplatesPaginationData.perPage;

        const totalPage = Math.ceil(totalRecord / perPage);
        const currentPage = this.props.allTemplatesPaginationData === undefined ? 1 : this.props.allTemplatesPaginationData.currentPage;

        let countTemplates = 0;

        const showContentSpinner = !Boolean(this.props.allTemplateContentSpinner);

        const noDataFound = showContentSpinner && allTemplates.length === 0;

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
                                        fieldName="allTemplateSearch"
                                        fieldClass="all_template_search"
                                        fieldID="all_template_search"
                                        fieldPlaceholder={t('search_templates')}
                                        fieldValue={this.state.allTemplateSearch}
                                        fieldOnChange={this.allTemplateSearchHandler.bind(this)} />
                                </div>}
                            </div>
                        </div>
                    </div>
                    {allTemplates.length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th scope="col">{t('id')}</th>
                                <th scope="col">{t('template')}</th>
                                <th scope="col">{t('company')}</th>
                                <th scope="col">{t('model')}</th>
                                <th scope="col">{t('created_by')}</th>
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
                                allTemplates.slice(0, perPage).map(template => {
                                    countTemplates++;
                                    const firstName = template.user.first_name;
                                    const lastName = template.user.last_name === null ? '' : template.user.last_name;
                                    const company = Boolean(template.user.company.name) ? template.user.company.name : '';
                                    const email = Boolean(template.user.email) ? template.user.email : '';
                                    return (
                                        <tr key={countTemplates}>
                                            <td>{template.id}</td>
                                            <td>{template.name}</td>
                                            <td>{company}</td>
                                            <td>{template.tool.name}</td>
                                            <td>{firstName + ' ' + lastName + ' (' + email + ')'}</td>
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
                    {noDataFound && <p className="text-center">{t('no_template_found')}</p>}
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
    allTemplates: state.template.allTemplates,
    allTemplatesPaginationData: state.template.allTemplatesPaginationData,
    allTemplateContentSpinner: state.template.allTemplateContentSpinner,
    allCompanies: state.company.data,
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
    templateListAll,
    setSharedTemplate,
    showTemplateDeleteConfirmPopup,
    allTemplateSearch,
})(AllTemplateList);
