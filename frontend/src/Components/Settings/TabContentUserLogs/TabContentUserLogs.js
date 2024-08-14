import React, {Component} from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import {connect} from 'react-redux';
import DateTimeService from "../../../Services/DateTimeServices";
import ContentSpinner from "../../Spinners/ContentSpinner";

import {allActivityLogs} from "../../../Store/Actions/UserActivityActions";

import {withTranslation} from 'react-i18next';
import Pagination from "../../Pagination/Pagination";
import InputText from "../../Inputs/InputText";
import FilterUserLogs from "./FilterUserLogs";
import {companyListAll} from "../../../Store/Actions/companyActions";
import {getAllTools} from "../../../Store/Actions/companyActions";
import DeleteUserLogs from "./DeleteUserLogs";
import CheckBox from "../../Inputs/CheckBox";
import ExportUserLogs from "./ExportUserLogs";

class TabContentUserLogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filterData: {},
            selectedLogIDs: [],
            inputUserLogs: []
        }
        this.props.companyListAll();
        this.props.getAllTools();
    }

    componentDidMount() {
        this.props.allActivityLogs();
    }

    paginationChangeHandler(pageNumber) {
        this.props.allActivityLogs(pageNumber, this.state.filterData);
    }

    callBackFilterDataHandler(filterData) {
        this.setState({
            ...this.state,
            filterData: filterData
        })
    }

    selectUserLogsHandler(tickStatus, fieldName, logID) {
        this.state.inputUserLogs[logID] = tickStatus;

        if (tickStatus === true) {
            this.setState({
                ...this.state,
                inputUserLogs: this.state.inputUserLogs,
                selectedLogIDs: [...this.state.selectedLogIDs, logID],
                selectAllLogs: false,
            });
        } else {
            this.setState({
                ...this.state,
                inputUserLogs: this.state.inputUserLogs,
                selectedLogIDs: this.state.selectedLogIDs.filter(item => item !== logID),
                selectAllLogs: false,
            })
        }
    }

    selectAllLogsHandler(tickStatus, fieldName, logID) {
        const userLogsData = Boolean(this.props.data) ? this.props.data : [];
        let selectedLogs = [];
        let inputUserLogs = [];
        userLogsData.map((log, key) => {
            selectedLogs[key] = log.id;
            inputUserLogs[log.id] = tickStatus;
        });

        if (tickStatus === true) {
            this.setState({
                ...this.state,
                selectAllLogs: tickStatus,
                selectedLogIDs: selectedLogs,
                inputUserLogs: inputUserLogs,
            })
        }

        if (tickStatus === false) {
            this.setState({
                ...this.state,
                selectAllLogs: tickStatus,
                selectedLogIDs: [],
                inputUserLogs: []
            })
        }

    }

    callBackResetLogIDsHandler() {
        this.setState({
            ...this.state,
            selectAllLogs: false,
            selectedLogIDs: [],
            inputUserLogs: []

        })
    }

    render() {

        const {t} = this.props;

        const userLogs = Boolean(this.props.data) ? this.props.data : [];

        let totalRecord = 0;
        let totalPage = 0;
        let currentPage = 1;
        let perPage = 1;
        if (userLogs.length > 0) {
            totalRecord = Boolean(this.props.paginationData) ? this.props.paginationData.totalRecord : 0;
            perPage = Boolean(this.props.paginationData) ? this.props.paginationData.perPage : 1;
            totalPage = Math.ceil(totalRecord / perPage);
            currentPage = Boolean(this.props.paginationData) ? this.props.paginationData.currentPage : 1;
        }

        // set acl permission for delete action
        const hasDeletePermission = this.props.auth.acl['user_logs'] !== undefined ? this.props.auth.acl['user_logs'].delete : false;
        const hasSearchPermission = this.props.auth.acl['user_logs'] !== undefined ? this.props.auth.acl['user_logs'].search : false;
        const hasExportPermission = this.props.auth.acl['user_logs'] !== undefined ? this.props.auth.acl['user_logs'].export : false;

        const allCompanies = this.props.companies;
        const allModels = this.props.allModels;

        const selectedLogIDs = this.state.selectedLogIDs;

        const selectAllLogsCheckboxValue = Boolean(this.state.selectAllLogs);

        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col- col-xl-9 col-lg-9 col-md-8 col-sm-7">
                            <TabHeading
                                tabHeading={t('user_activity_logs')}
                                tabSubHeading={t('user_activity_logs_sub_heading')}/>
                        </div>
                    </div>

                    {hasSearchPermission && <FilterUserLogs
                        callBackFilterData={this.callBackFilterDataHandler.bind(this)}
                        allModels={allModels}
                        companies={allCompanies} t={t}/>}

                    {totalRecord > perPage && <p className="text-right"> <b>{perPage}</b> of total: <b>{totalRecord}</b> logs</p>}
                    {totalRecord <= perPage && <p className="text-right"> Total: <b>{totalRecord}</b> logs</p>}

                    <div className="table-responsive text-nowrap">
                        <ContentSpinner/>
                        {userLogs.length > 0 && <table className="table table-borderless table-striped">
                            <thead>
                            <tr>
                                <th style={{width: '50px'}} scope="col">
                                    <CheckBox fieldName={'select_all_logs'}
                                              fieldValue={selectAllLogsCheckboxValue}
                                              fieldID={'select_all_logs'}
                                              checkUncheckHandler={this.selectAllLogsHandler.bind(this)}/>
                                </th>
                                <th scope="col">{t('id')}</th>
                                <th scope="col">{t('company')}</th>
                                {/*<th scope="col">{t('user')}</th>*/}
                                <th scope="col">{t('action')}</th>
                                <th scope="col">{t('screen')}</th>
                                <th scope="col">{t('created')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                userLogs.slice(0, perPage).map(log => {
                                    const companyName = Boolean(log.company) ? log.company.name : '';
                                    const screenName = Boolean(log.screen) ? log.screen : '';
                                    let checkFieldValue = !Boolean(this.state.inputUserLogs[log.id]) ? '' : this.state.inputUserLogs[log.id];
                                    return (
                                        <tr key={log.id}>
                                            <td className="pt-0">
                                                <CheckBox fieldName={'log_' + log.id}
                                                          fieldValue={checkFieldValue}
                                                          fieldID={log.id}
                                                          checkUncheckHandler={this.selectUserLogsHandler.bind(this)}/>
                                            </td>
                                            <td>{log.id}</td>
                                            <td>{companyName}</td>
                                            {/*<td>Anonymous</td>*/}
                                            <td>{log.type}</td>
                                            <td>{screenName}</td>
                                            <td>{DateTimeService.getDateTime(log.created_at)}</td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>}
                        {userLogs.length === 0 && <p className="text-center">{t('no_data_found')}</p>}
                        <Pagination
                            totalPage={totalPage}
                            currentPage={currentPage}
                            paginationLinkHandler={this.paginationChangeHandler.bind(this)}/>
                    </div>
                    <div className="row">
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            {hasDeletePermission && <DeleteUserLogs
                                callBackResetLogIDs={this.callBackResetLogIDsHandler.bind(this)}
                                selectedLogIDs={selectedLogIDs}
                                t={t}/>}
                        </div>
                        <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            {hasExportPermission && <ExportUserLogs
                                filterData={this.state.filterData}
                                t={t}/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page,
    data: state.activity.data,
    popup: state.popup,
    paginationData: state.activity.userLogsPaginationData,
    allModels: state.company.toolsData,
    companies: state.company.data,
});

export default connect(mapStateToProps, {
    allActivityLogs,
    companyListAll,
    getAllTools
})(withTranslation()(TabContentUserLogs));

