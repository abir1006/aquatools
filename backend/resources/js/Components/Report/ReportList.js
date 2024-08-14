import React, {Component} from 'react';
import {connect} from "react-redux";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";

import {reportList, reportSearch, downloadFile, clickToDownload} from "../../Store/Actions/ReportActions";
import {companyListAll, getAllTools} from "../../Store/Actions/companyActions";
import {userListAll} from "../../Store/Actions/userActions";
import {showReportDeleteConfirmPopup} from "../../Store/Actions/popupActions";

import ListAutoComplete from "../Inputs/ListAutoComplete/ListAutoComplete";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';


class ReportList extends Component {
    constructor(props) {
        super(props);
        this.props.reportList(undefined, 'reports');
        this.props.companyListAll();
        this.props.getAllTools();
        this.props.userListAll();
        this.state = {
            searchData: {},
            filterByDateRange: '',
            resetValue: false,
        }
    }

    paginationChangeHandler(pageNumber) {
        if (Object.keys(this.state.searchData).length > 0) {
            this.props.reportSearch(this.state.searchData, pageNumber);
        } else {
            this.props.reportList(pageNumber);
        }


    }

    confirm(itemId) {
        this.props.showReportDeleteConfirmPopup(itemId)
    }

    reportDownloadHandler(fileUrl, fileName) {
        this.props.downloadFile(fileName, 'Reports');
        this.props.clickToDownload(fileUrl);
    }

    reportFilterByModelHandler(name, id) {
        const searchData = this.state.searchData;
        searchData.tool_id = id;
        this.setState({
            ...this.state,
            searchData: {...this.state.searchData, tool_id: id},
        });

        this.props.reportSearch(searchData);
    }

    reportFilterByCompanyHandler(name, id) {
        const searchData = this.state.searchData;
        searchData.company_id = id;
        this.setState({
            ...this.state,
            searchData: {...this.state.searchData, company_id: id},
        });

        this.props.reportSearch(searchData);
    }

    reportFilterByUserHandler(name, id) {
        const searchData = this.state.searchData;
        searchData.user_id = id;
        this.setState({
            ...this.state,
            searchData: {...this.state.searchData, user_id: id},
        });

        this.props.reportSearch(searchData);
    }

    reportFilterByDateRangeHandler(event, picker) {
        const startDate = picker.startDate.format("DD/MM/YYYY");
        const endDate = picker.endDate.format("DD/MM/YYYY");
        const searchData = this.state.searchData;
        searchData.start_date = startDate;
        searchData.end_date = endDate;
        this.setState({
            ...this.state,
            searchData: {
                ...this.state.searchData,
                start_date: startDate,
                end_date: endDate,
            },
        });

        this.props.reportSearch(searchData);
    }

    filterResetHandler() {
        this.setState({
            ...this.state,
            searchData: {},
        });

        this.props.reportList(1);

    }

    render() {

        const {t} = this.props;

        const reports = this.props.reports === undefined ? {} : this.props.reports;

        const paginationPerPage = this.props.paginationData === undefined ? 1 : this.props.paginationData.perPage;

        const paginationTotalRecord = this.props.paginationData === undefined ? 0 : this.props.paginationData.totalRecord;

        const permittedModels = this.props.auth.permittedModels;

        const currentUserRole = this.props.auth.data.user.roles === undefined ? '' : this.props.auth.data.user.roles[0].slug;

        let allModels = [];
        let count = 0;
        if (currentUserRole === 'super_admin') {
            this.props.allModels.map(model => {
                allModels[count] = {id: model.id, name: model.name};
                count++;
            });
        } else {
            this.props.allModels.map(model => {
                if (permittedModels.includes(model.slug)) {
                    allModels[count] = {id: model.id, name: model.name};
                    count++;
                }
            });
        }

        const models = allModels;

        const companies = this.props.companies.length > 0 ? [{ id: 0, name: 'All' }, ...this.props.companies.sort((a, b) => a.name.localeCompare(b.name))] : [];

        let users = [];
        let uCount = 0;

        this.props.users.map(user => {
            users[uCount] = {id: user.id, name: user.first_name + ' ' + user.last_name + ' [' + user.email + ']'}
            uCount++;
        });

        const totalPage = Math.ceil(paginationTotalRecord / paginationPerPage);

        const currentPage = this.props.paginationData === undefined ? 1 : this.props.paginationData.currentPage;

        let dateRangeLabel = '';
        let start = this.state.searchData.start_date === undefined ? '' : this.state.searchData.start_date;
        let end = this.state.searchData.end_date === undefined ? '' : this.state.searchData.end_date;
        dateRangeLabel = start + ' - ' + end;

        if (start === end) {
            dateRangeLabel = start;
        }

        // reset all filter sections

        const modelFilterReset = !Boolean(this.state.searchData.tool_id);
        const companyFilterReset = !Boolean(this.state.searchData.company_id);
        const userFilterReset = !Boolean(this.state.searchData.user_id);

        return (
            <div className="content-block">
                <div className="content-block-grey" id="search_panel">
                    <div className="row">
                        <div className="col- col-xl-2 col-lg-2 col-md-6 col-sm-6">
                            <div id="report_date_range_picker_panel">
                                <DateRangePicker
                                    initialSettings={{parentEl: "#report_date_range_picker_panel"}}
                                    autoUpdateInput={false}
                                    onApply={this.reportFilterByDateRangeHandler.bind(this)}>
                                    <input type="text" placeholder={t('filter_by_date_range')} value={dateRangeLabel}
                                           className="form-control"/>
                                </DateRangePicker>
                            </div>
                        </div>
                        <div className="col- col-xl-2 col-lg-2 col-md-6 col-sm-6">
                            <ListAutoComplete
                                disableListLocalState={modelFilterReset}
                                fieldId="report_model"
                                fieldName="report_model"
                                fieldPlaceHolder={t('filter_by_model')}
                                fieldOnClick={this.reportFilterByModelHandler.bind(this)}
                                listData={models}/>
                        </div>

                        {currentUserRole === 'super_admin' && <div className="col- col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <ListAutoComplete
                                disableListLocalState={companyFilterReset}
                                fieldId="report_company"
                                fieldName="report_company"
                                fieldPlaceHolder={t('filter_by_company')}
                                fieldOnClick={this.reportFilterByCompanyHandler.bind(this)}
                                listData={companies}/>
                        </div>}

                        {currentUserRole !== 'company_user' &&
                        <div className="col- col-xl-3 col-lg-3 col-md-6 col-sm-6">
                            <ListAutoComplete
                                disableListLocalState={userFilterReset}
                                fieldId="report_user"
                                fieldName="report_user"
                                fieldPlaceHolder={t('filter_by_user')}
                                fieldOnClick={this.reportFilterByUserHandler.bind(this)}
                                listData={users}/>
                        </div>}

                        <div className="col- col-xl-2 col-lg-2 col-md-12 col-sm-12">
                            <button
                                onClick={e => this.filterResetHandler()}
                                className="btn btn-primary default-btn-atv2 report_reset_btn"> {t('reset')}
                            </button>
                        </div>

                    </div>
                </div>
                <div className="table-responsive text-nowrap">
                    <ContentSpinner/>
                    {Object.keys(reports).length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                        <tr>
                            <th>{t('id')}</th>
                            <th>{t('date')}</th>
                            <th>{t('user')}</th>
                            <th>{t('company')}</th>
                            <th>{t('model')}</th>
                            <th>{t('file_name')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            reports.slice(0, paginationPerPage).map(report => {
                                const downloadLink = report.file_type + '/models/' + report.file_name;
                                const firstName = report.user.first_name === null ? '' : report.user.first_name;
                                const lastName = report.user.last_name === null ? '' : report.user.last_name;
                                const userName = firstName + ' ' + lastName;
                                return (
                                    <tr key={report.id}>
                                        <td>{report.id}</td>
                                        <td>{DateTimeService.getDateTime(report.created_at)}</td>
                                        <td>{userName}</td>
                                        <td>{report.company.name}</td>
                                        <td>{report.tool.name}</td>
                                        <td>{report.file_name}</td>
                                        <td>
                                            <button
                                                onClick={e => this.reportDownloadHandler(downloadLink, report.file_name)}
                                                type="button"
                                                className="btn btn-primary-outline at2-btn-no-bg">
                                                <i className="fa fa-download" aria-hidden="true"></i>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={e => this.confirm(report.id)}
                                                className="btn btn-primary-outline at2-btn-no-bg">
                                                <img src="images/remove_icon.svg"/>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>}
                    {Object.keys(reports).length === 0 && <p className="text-center">{t('no_data_found')}</p>}
                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        paginationLinkHandler={this.paginationChangeHandler.bind(this)}/>

                </div>
            </div>
        )
    }
}


const mapStateToProps = state => ({
    page: state.page,
    auth: state.auth,
    paginationData: state.report.paginationData,
    reports: state.report.data,
    allModels: state.company.toolsData,
    companies: state.company.data,
    users: state.user.data,
});

export default connect(mapStateToProps, {
    reportList,
    reportSearch,
    companyListAll,
    getAllTools,
    userListAll,
    showReportDeleteConfirmPopup,
    downloadFile,
    clickToDownload
})(ReportList);
