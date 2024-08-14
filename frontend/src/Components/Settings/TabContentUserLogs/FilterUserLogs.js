import React, { useState } from 'react';
import { connect } from "react-redux";
import '../Settings.css';
import InputText from "../../Inputs/InputText";
import DateRangePicker from "react-bootstrap-daterangepicker";
import ListAutoComplete from "../../Inputs/ListAutoComplete/ListAutoComplete";
import { allActivityLogs } from "../../../Store/Actions/UserActivityActions";
import adminNavigationsObj from "../../MainNavigation/MainMenus";
import InputService from "../../../Services/InputServices";

const FilterUserLogs = props => {
    const { t } = props;
    const [filterData, setFilterData] = useState({});
    const hasSearchPermission = true;
    const companies = props.companies?.length > 0 ? props.companies.sort((a, b) => a.name.localeCompare(b.name)) : [];

    const screens = [];
    let screenID = 0;

    Object.keys(adminNavigationsObj).map(key => {
        let menuName = adminNavigationsObj[key].name;
        if (menuName === 'at_materials') {
            menuName = 'AT Materials'
        }
        screens[screenID] = { id: screenID + 1, name: InputService.ucFirst(menuName) }
        screenID++;
    });

    const models = props.allModels;
    const filterByCompanyHandler = (name, id) => {
        const filterDataState = filterData;
        filterDataState['company_id'] = id;
        setFilterData(filterDataState);
        props.callBackFilterData({ filter_data: filterData });
        props.allActivityLogs(undefined, { filter_data: filterData });
    }
    const filterByScreenHandler = (name, id) => {
        const filterDataState = filterData;
        filterDataState['screen'] = name;
        setFilterData(filterDataState);
        props.callBackFilterData({ filter_data: filterData });
        props.allActivityLogs(undefined, { filter_data: filterData });
    }

    const filterByModelHandler = (name, id) => {
        const filterDataState = filterData;
        filterDataState['model'] = name;
        setFilterData(filterDataState);
        props.callBackFilterData({ filter_data: filterData });
        props.allActivityLogs(undefined, { filter_data: filterData });
    }

    const filterByActionHandler = (name, id) => {
        const filterDataState = filterData;
        filterDataState['action_name'] = name;
        setFilterData(filterDataState);
        props.callBackFilterData({ filter_data: filterData });
        props.allActivityLogs(undefined, { filter_data: filterData });
    }

    const userLogsFilterByDateRangeHandler = (event, picker) => {
        const startDate = picker.startDate.format("DD/MM/YYYY");
        const endDate = picker.endDate.format("DD/MM/YYYY");
        const filterDataState = filterData;
        console.log(filterData);
        filterDataState['start_date'] = startDate;
        filterDataState['end_date'] = endDate;
        setFilterData(filterDataState);
        props.callBackFilterData({ filter_data: filterData });
        props.allActivityLogs(undefined, { filter_data: filterData });

    }

    const filterResetHandler = e => {
        props.callBackFilterData({});
        setFilterData({});
        props.allActivityLogs(undefined, {});
    }

    let dateRangeLabel = '';
    let start = filterData.start_date === undefined ? '' : filterData.start_date;
    let end = filterData.end_date === undefined ? '' : filterData.end_date;

    dateRangeLabel = start + ' - ' + end;

    if (start === end) {
        dateRangeLabel = start;
    }

    const actionList = [
        { id: 1, name: 'Created' },
        { id: 6, name: 'Changed input'},
        {id: 12, name: 'Changed password'},
        {id: 17, name: 'Changed status'},
        {id: 2, name: 'Deleted' },
        { id: 3, name: 'Downloaded' },
        {id: 5, name: 'Details'},
        {id: 15, name: 'Logged in'},
        { id: 16, name: 'Logged out'},
        {id: 11, name: 'Removed share'},
        {id: 13, name: 'Sent a PDF' },
        { id: 14, name: 'Sent a PPT' },
        { id: 7, name: 'Searched' },
        { id: 8, name: 'Shared' },
        { id: 9, name: 'Updated' },
        { id: 10, name: 'Viewed' },
    ];

    return <div className="content-block-grey" id="search_panel">
        <div className="row">
            <div className="col- col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <div id="user_logs_date_range_picker_panel">
                    <DateRangePicker
                        initialSettings={{ parentEl: "#user_logs_date_range_picker_panel" }}
                        autoUpdateInput={false}
                        onApply={userLogsFilterByDateRangeHandler}>
                        <input type="text" placeholder={t('filter_by_date_range')} value={dateRangeLabel}
                            className="form-control" />
                    </DateRangePicker>
                </div>
            </div>
            <div className="col- col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <ListAutoComplete
                    disableListLocalState={!Boolean(filterData.company_id)}
                    fieldId="logs_company"
                    fieldName="logs_company"
                    fieldPlaceHolder={t('filter_by_company')}
                    fieldOnClick={filterByCompanyHandler}
                    listData={companies} />
            </div>

            <div className="col- col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <ListAutoComplete
                    disableListLocalState={!Boolean(filterData.screen)}
                    fieldId="logs_screens"
                    fieldName="logs_screens"
                    fieldPlaceHolder={t('filter_by_screen')}
                    fieldOnClick={filterByScreenHandler}
                    listData={screens} />
            </div>

            <div className="col- col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <ListAutoComplete
                    disableListLocalState={!Boolean(filterData.model)}
                    fieldId="logs_models"
                    fieldName="logs_models"
                    fieldPlaceHolder={t('filter_by_model')}
                    fieldOnClick={filterByModelHandler}
                    listData={models} />
            </div>
            <div className="col- col-xl-2 col-lg-2 col-md-2 col-sm-6">
                <ListAutoComplete
                    disableListLocalState={!Boolean(filterData.action_name)}
                    fieldId="logs_actions"
                    fieldName="logs_actions"
                    fieldPlaceHolder={t('filter_by_actions')}
                    fieldOnClick={filterByActionHandler}
                    listData={actionList} />
            </div>

            <div className="col- col-xl-2 col-lg-2 col-md-12 col-sm-12">
                <button
                    onClick={filterResetHandler}
                    className="btn btn-primary default-btn-atv2 report_reset_btn"> {t('reset')}
                </button>
            </div>
        </div>
    </div>
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {
    allActivityLogs
})(FilterUserLogs);

