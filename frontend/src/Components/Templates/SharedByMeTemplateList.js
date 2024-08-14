import React, { Component } from 'react';
import { connect } from "react-redux";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";

import {
    allSharedByMeTemplatesData,
    sharedByMeTemplateSearch,
    removeSharedByMe,
} from "../../Store/Actions/TemplateActions";

import { showSharedByMeRemoveConfirmPopup } from "../../Store/Actions/popupActions";

import InputText from "../Inputs/InputText";


class SharedByMeTemplateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mySharedTemplateSearch: '',
            sortBy: '',
            sortOrder: ''
        }
    }

    componentDidMount() {
        this.props.allSharedByMeTemplatesData();
    }

    handleRemoveShare(itemId) {
        this.props.showSharedByMeRemoveConfirmPopup(itemId);
    }

    sharedByMeTemplateSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        });
        this.props.sharedByMeTemplateSearch(value);
    }

    paginationChangeHandler(pageNumber) {

        const { sortBy, sortOrder } = this.state;
        if (Boolean(sortOrder)) {
            const sort = { sortBy: sortBy, sortOrder: sortOrder };
            this.props.allSharedByMeTemplatesData(pageNumber, sort);
        } else
            this.props.allSharedByMeTemplatesData(pageNumber);

    }

    sortByColumn(column) {

        let { sortOrder } = this.state;
        const order = sortOrder == 'desc' ? 'asc' : 'desc';
        const sort = { sortBy: column, sortOrder: order };
        this.setState(sort);
        this.props.allSharedByMeTemplatesData(0, sort);
    }

    render() {

        const { t } = this.props;

        const currentRoute = this.props.page.currentRoute;

        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;

        const sectionTitle = t('my_shared_templates');

        const allSharedByMeTemplates = this.props.allSharedByMeTemplates === undefined ? [] : this.props.allSharedByMeTemplates;

        const totalRecord = this.props.allSharedByMePaginationData === undefined ? 0 : this.props.allSharedByMePaginationData.totalRecord;
        const perPage = this.props.allSharedByMePaginationData === undefined ? 1 : this.props.allSharedByMePaginationData.perPage;

        const totalPage = Math.ceil(totalRecord / perPage);
        const currentPage = this.props.allSharedByMePaginationData === undefined ? 1 : this.props.allSharedByMePaginationData.currentPage;

        const showContentSpinner = this.props.sharedByMeTemplateContentSpinner === undefined || this.props.sharedByMeTemplateContentSpinner === false;

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
                                        fieldName="mySharedTemplateSearch"
                                        fieldClass="shared_template_search"
                                        fieldID="shared_template_search"
                                        fieldPlaceholder={t('search_templates')}
                                        fieldValue={this.state.mySharedTemplateSearch}
                                        fieldOnChange={this.sharedByMeTemplateSearchHandler.bind(this)} />
                                </div>}
                            </div>
                        </div>
                    </div>
                    {allSharedByMeTemplates.length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th scope="col">{t('id') + ' ' + t('share')}</th>
                                <th scope="col">{t('template') + ' ' + t('id')}</th>
                                <th scope="col">{t('template')}</th>
                                <th scope="col">{t('company')}</th>
                                <th scope="col">{t('model')}</th>
                                <th scope="col">{t('shared_with')}</th>
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
                                allSharedByMeTemplates.map(shared => {
                                    const firstName = shared.user.first_name;
                                    const lastName = shared.user.last_name === null ? '' : shared.user.last_name;
                                    const company = Boolean(shared.user.company.name) ? shared.user.company.name : '';
                                    const email = Boolean(shared.user.email) ? shared.user.email : '';
                                    return (
                                        <tr key={shared.id}>
                                            <td>{shared.id}</td>
                                            <td>{shared.template.id}</td>
                                            <td>{shared.template.name}</td>
                                            <td>{company}</td>
                                            <td>{shared.template.tool.name}</td>
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
                    {allSharedByMeTemplates.length === 0 && <p className="text-center">{t('no_template_found')}</p>}
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
    allSharedByMeTemplates: state.template.allSharedByMeTemplates,
    allSharedByMePaginationData: state.template.allSharedByMePaginationData,
    sharedByMeTemplateContentSpinner: state.template.sharedByMeTemplateContentSpinner,
});

export default connect(mapStateToProps, {
    allSharedByMeTemplatesData,
    sharedByMeTemplateSearch,
    removeSharedByMe,
    showSharedByMeRemoveConfirmPopup,
})(SharedByMeTemplateList);
