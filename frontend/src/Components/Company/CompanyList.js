import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    companyList,
    setCompanyByID,
    showEditCompanyForm,
    searchCompany,
    showCompanyDeleteConfirmPopup,
    blockUnblockCompany,
} from "../../Store/Actions/companyActions";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import InputText from "../Inputs/InputText";
import ContentSpinner from "../Spinners/ContentSpinner";
import CompanyFilters from './CompanyFilters';


class CompanyList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companySearch: '',
            filters: {
                company: ''
            }
        }
    }

    componentDidMount() {
        this.props.companyList();
    }

    editCompanyHandler(companyId) {
        // scroll to top
        window.scrollTo(0, 0);
        this.props.setCompanyByID(companyId, this.props.toolsData, this.props.addonsData);
        this.props.showEditCompanyForm();
    }

    paginationChangeHandler(pageNumber) {
        this.props.companyList(pageNumber);
    }

    confirm(itemId) {
        this.props.showCompanyDeleteConfirmPopup(itemId);
    }

    blockUnblockHandler(companyID, status) {
        const companyStatus = status === 0 ? 1 : 0;
        this.props.blockUnblockCompany(companyID, companyStatus);
    }

    companySearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            companySearch: value,
            filters: {}
        });

        const searchData = {
            search: value
        };

        this.props.searchCompany(searchData);
    }

    companyFilterHandler({ company }) {

        this.setState(
            { ...this.state, filters: { ...this.state.filters, company: company } },
            () => {

                const { companySearch, filters } = this.state;
                const searchData = {
                    search: companySearch,
                    filters: filters
                }

                this.props.searchCompany(searchData);
            }
        );
    }

    render() {
        const { t } = this.props;

        // set acl permission for company update, delete, block
        const currentRoute = this.props.page.currentRoute;
        const hasEditPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].update : false;
        const hasBlockPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].block : false;
        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;
        const companies = this.props.data;
        const totalPage = Math.ceil(this.props.paginationData.totalRecord / this.props.paginationData.perPage);
        const currentPage = this.props.paginationData.currentPage;
        return (
            <div className="content-block">
                {hasSearchPermission &&
                    <div className="content-block-grey">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="w-50">
                                <InputText
                                    fieldName="company_search"
                                    fieldClass="company_search"
                                    fieldID="company_search"
                                    fieldPlaceholder={t('search_company')}
                                    fieldValue={this.state.companySearch}
                                    fieldOnChange={this.companySearchHandler.bind(this)} />
                            </div>
                            <div style={{ width: '15%' }}>
                                <CompanyFilters filters={this.state.filters} filterHandler={this.companyFilterHandler.bind(this)} />
                            </div>
                        </div>

                    </div>}
                <div className="table-responsive text-nowrap">
                    <ContentSpinner />
                    {Object.keys(companies).length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th scope="col">{t('id')}</th>
                                <th scope="col">{t('company_name')}</th>
                                <th scope="col">{t('contact_person')}</th>
                                <th scope="col">{t('contact_email')}</th>
                                <th scope="col">{t('phone')}</th>
                                <th scope="col">{t('created')}</th>
                                <th scope="col">{t('status')}</th>
                                <th scope="col">{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                Object.keys(companies).slice(0, this.props.paginationData.perPage).map(index => {
                                    const contactPersonFirstName = companies[index].contact_person;
                                    const contactPersonLastName = Boolean(companies[index].contact_person_last_name) ? ' ' + companies[index].contact_person_last_name : '';
                                    const contactPersonFullName = contactPersonFirstName + contactPersonLastName;
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{companies[index].id}</th>
                                            <td>{companies[index].name}</td>
                                            <td>{contactPersonFullName}</td>
                                            <td>{companies[index].email}</td>
                                            <td>{companies[index].contact_number}</td>
                                            <td>{DateTimeService.getDateTime(companies[index].created_at)}</td>
                                            <td>
                                                {companies[index].status === 1 &&
                                                    <i className="fa fa-check white-stroke color-green" title={t('active')}></i>}
                                                {companies[index].status !== 1 && <i className="fa fa-times" title={t('blocked')}></i>}
                                            </td>
                                            <td>{!hasEditPermission && !hasBlockPermission && !hasDeletePermission && '-'}
                                                {hasEditPermission && <button
                                                    type="button"
                                                    className="btn btn-primary-outline at2-btn-no-bg"
                                                    onClick={e => this.editCompanyHandler(companies[index].id)}>
                                                    <img src="images/edit_icon.svg" />
                                                </button>}
                                                {companies[index].id !== 1 &&
                                                    hasBlockPermission &&
                                                    <button title={companies[index].status === 1 ? 'Block' : 'Unblock'}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.blockUnblockHandler(companies[index].id, companies[index].status)}>
                                                        {companies[index].status === 1 &&
                                                            <i className="fa fa-ban block-unblock"></i>}
                                                        {companies[index].status === 0 &&
                                                            <i className="fa fa-check white-stroke block-unblock"></i>}
                                                    </button>}
                                                {companies[index].id !== 1 && hasDeletePermission && <button
                                                    type="button"
                                                    onClick={e => this.confirm(companies[index].id)}
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
                    {Object.keys(companies).length === 0 && <p className="text-center">{t('no_data_found')}</p>}
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
    data: state.company.data,
    searchResult: state.company.searchResult,
    addCompany: state.company.addCompany,
    paginationData: state.company.paginationData,
    toolsData: state.company.toolsData,
    addonsData: state.company.addonsData,
});

export default connect(mapStateToProps, {
    companyList,
    setCompanyByID,
    showEditCompanyForm,
    searchCompany,
    showCompanyDeleteConfirmPopup,
    blockUnblockCompany,
})(CompanyList);
