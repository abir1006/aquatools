import React, {useState} from 'react';
import {connect} from "react-redux";
import '../Settings.css';
import axios from "axios";
import TokenService from "../../../Services/TokenServices";
import DateTimeService from "../../../Services/DateTimeServices";

const ExportUserLogs = props => {
    const {t} = props;

    const exportExcelHandler = e => {
        e.preventDefault();
        try {
            axios({
                url: 'api/user/activity/export',
                method: 'POST',
                responseType: 'blob', // important
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: props.filterData
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'logs_'+DateTimeService.getCurrentDateTimeForPDF()+'.xlsx'); //or any other extension
                document.body.appendChild(link);
                link.click();
            });;
        } catch (error) {
            console.log(error);

        }
    }

    return <div className="content-block text-right" id="user_logs_export">
        <i
            onClick={exportExcelHandler}
            className="fa fa-file-excel-o mt-3 fa-2x ml-2"
            title={t('export_as_excel')}
            aria-hidden="true"/>
    </div>
}

const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {
})(ExportUserLogs);

