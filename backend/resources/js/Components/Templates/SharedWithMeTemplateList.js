import React, { Component } from 'react';
import { connect } from "react-redux";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";
import InputText from "../Inputs/InputText";
import {
    allSharedWithMeTemplatesData,
    sharedWithMeTemplateSearch,
    removeSharedWithMe
} from "../../Store/Actions/TemplateActions";

import { showSharedWithMeRemoveConfirmPopup } from "../../Store/Actions/popupActions";


class SharedWithMeTemplateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sharedWithMeSearch: '',
            sortBy: '',
            sortOrder: ''
        }
    }

    componentDidMount() {
        this.props.allSharedWithMeTemplatesData();
    }

    handleRemoveShare(itemId) {
        this.props.showSharedWithMeRemoveConfirmPopup(itemId);
    }

    sharedWithMeSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        });
        this.props.sharedWithMeTemplateSearch(value);
    }

    paginationChangeHandler(pageNumber) {

        const { sortBy, sortOrder } = this.state;
        if (Boolean(sortOrder)) {
            const sort = { sortBy: sortBy, sortOrder: sortOrder };
            this.props.allSharedWithMeTemplatesData(pageNumber, sort);
        } else
            this.props.allSharedWithMeTemplatesData(pageNumber);

    }

    sortByColumn(column) {
        let { sortOrder } = this.state;
        const order = sortOrder == 'desc' ? 'asc' : 'desc';
        const sort = { sortBy: column, sortOrder: order };
        this.setState(sort);
        this.props.allSharedWithMeTemplatesData(0, sort);
    }

    render() {

        const { t } = this.props;

        const currentRoute = this.props.page.currentRoute;

        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;

        const sectionTitle = t('templates_shared_with_me');

        const allSharedWithMeTemplates = this.props.allSharedWithMeTemplates === undefined ? [] : this.props.allSharedWithMeTemplates;

        const totalRecord = this.props.allSharedWithMePaginationData === undefined ? 0 : this.props.allSharedWithMePaginationData.totalRecord;
        const perPage = this.props.allSharedWithMePaginationData === undefined ? 1 : this.props.allSharedWithMePaginationData.perPage;

        const totalPage = Math.ceil(totalRecord / perPage);
        const currentPage = this.props.allSharedWithMePaginationData === undefined ? 1 : this.props.allSharedWithMePaginationData.currentPage;

        const showContentSpinner = this.props.sharedWithMeTemplateContentSpinner === undefined || this.props.sharedWithMeTemplateContentSpinner === false;

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
                                        fieldName="sharedWithMeSearch"
                                        fieldClass="shared_others_template_search"
                                        fieldID="shared_others_template_search"
                                        fieldPlaceholder={t('search_templates')}
                                        fieldValue={this.state.sharedWithMeSearch}
                                        fieldOnChange={this.sharedWithMeSearchHandler.bind(this)} />
                                </div>}
                            </div>
                        </div>
                    </div>
                    {allSharedWithMeTemplates.length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th scope="col">{t('id') + ' ' + t('share')}</th>
                                <th scope="col">{t('template') + ' ' + t('id')}</th>
                                <th scope="col">{t('template')}</th>
                                <th scope="col">{t('model')}</th>
                                <th scope="col">{t('company')}</th>
                                <th scope="col">{t('shared_by')}</th>
                                <th style={{ cursor: 'pointer' }} scope="col" onClick={e => this.sortByColumn('created_at')}>
                                    {t('shared_at')}
                                    {this.state.sortOrder == 'asc' && <i className="pl-2 fa fa-sort-up"></i>}
                                    {this.state.sortOrder == 'desc' && <i className="pl-2 fa fa-sort-down"></i>}
                                </th>
                                <th scope="col">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allSharedWithMeTemplates.map(shared => {
                                    const firstName = shared.shared_by.first_name;
                                    const lastName = shared.shared_by.last_name === null ? '' : shared.shared_by.last_name;
                                    const company = Boolean(shared.template.user.company.name) ? shared.template.user.company.name : '';
                                    const email = Boolean(shared.template.user.email) ? shared.template.user.email : '';
                                    return (
                                        <tr key={shared.id}>
                                            <td>{shared.id}</td>
                                            <td>{shared.template.id}</td>
                                            <td>{shared.template.name}</td>
                                            <td>{shared.template.tool.name}</td>
                                            <td>{company}</td>
                                            <td>{firstName + ' ' + lastName + ' (' + email + ')'}</td>
                                            <td>{DateTimeService.getDateTime(shared.created_at)}</td>
                                            <td>
                                                <button
                                                    title={t('remove') + ' ' + t('share')}
                                                    type="button"
                                                    onClick={e => this.handleRemoveShare(shared.id)}
                                                    className="btn btn-primary-outline at2-btn-no-bg">
                                                    <i className="fa fa-times" aria-hidden={true}></i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>}
                    {allSharedWithMeTemplates.length === 0 && <p className="text-center">{t('no_template_found')}</p>}
                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        paginationLinkHandler={this.paginationChangeHandler.bind(this)} />

                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    page: state.page,
    auth: state.auth,
    data: state.user.data,
    allSharedWithMeTemplates: state.template.allSharedWithMeTemplates,
    allSharedWithMePaginationData: state.template.allSharedWithMePaginationData,
    sharedWithMeTemplateContentSpinner: state.template.sharedWithMeTemplateContentSpinner,
});

export default connect(mapStateToProps, {
    allSharedWithMeTemplatesData,
    sharedWithMeTemplateSearch,
    removeSharedWithMe,
    showSharedWithMeRemoveConfirmPopup,
})(SharedWithMeTemplateList);
