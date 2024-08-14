import React, {Component} from 'react';
import {connect} from "react-redux";
import '../Settings.css';
import ListAutoComplete from "../../Inputs/ListAutoComplete/ListAutoComplete";
import {deleteUserLogs} from "../../../Store/Actions/UserActivityActions";
import {setConfirmLogsBulkDelete, showLogsBulkDeleteConfirmPopup} from "../../../Store/Actions/popupActions";

class DeleteUserLogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            deleteByOptions: {}
        }
        this.props.setConfirmLogsBulkDelete(undefined);
    }

    deleteOptionHandler(name, id) {
        let options = this.state.deleteByOptions;
        options['delete_option'] = id;
        options['id'] = Boolean(this.props.selectedLogIDs) ? this.props.selectedLogIDs : [];

        if (id === 1 && this.props.selectedLogIDs.length === 0) {
            options = {}
        }

        this.setState({
            ...this.state,
            deleteByOptions: options
        })
    }

    deleteLogsHandler() {
        let options = this.state.deleteByOptions;
        options['id'] = this.props.selectedLogIDs;
        if (!Boolean(options['delete_option']) && this.props.selectedLogIDs.length > 0) {
            options['delete_option'] = 1;
        }
        this.props.deleteUserLogs(options);
        this.setState({
            ...this.state,
            deleteByOptions: {}
        });
        this.props.callBackResetLogIDs();
    }

    confirmLogsDelete() {
        const {t} = this.props;
        const confirmMessage = t('are_you_sure_delete_user_logs')
        this.props.showLogsBulkDeleteConfirmPopup(confirmMessage)
    }

    componentDidUpdate() {
        // Confirm user logs bulk delete
        if (Boolean(this.props.confirmLogsBulkDelete)) {
            this.deleteLogsHandler();
            this.props.setConfirmLogsBulkDelete(undefined);
        }
    }

    render() {
        const {t} = this.props;
        const options = [
            {
                id: 2,
                name: t('delete_last_one_week_records')
            },
            {
                id: 3,
                name: t('delete_last_one_month_records')
            },
            {
                id: 4,
                name: t('delete_last_six_month_records')
            },
            {
                id: 5,
                name: t('delete_all_records')
            }
        ];

        const deleteButtonDisable = this.props.selectedLogIDs.length === 0 && Object.keys(this.state.deleteByOptions).length === 0;

        return <div className="content-block-grey mt-3" id="search_panel">
            <div className="row">
                <div className="col- col-xl-8 col-lg-8 col-md-8 col-sm-12" id="user_logs_delete_option">
                    <ListAutoComplete
                        disableListLocalState={Object.keys(this.state.deleteByOptions).length === 0}
                        fieldId="logs_delete_options"
                        fieldName="logs_delete_options"
                        fieldPlaceHolder={t('delete_logs_by')}
                        fieldOnClick={this.deleteOptionHandler.bind(this)}
                        listData={options}/>
                </div>

                <div className="col- col-xl-4 col-lg-4 col-md-4 col-sm-12">
                    <button
                        disabled={deleteButtonDisable}
                        onClick={e => this.confirmLogsDelete(e)}
                        className="btn btn-primary default-btn-atv2"> {t('delete')}
                    </button>
                </div>
            </div>
        </div>
    }

}

const mapStateToProps = state => ({
    auth: state.auth,
    confirmLogsBulkDelete: state.popup.confirmLogsBulkDelete,
});

export default connect(mapStateToProps, {
    deleteUserLogs,
    showLogsBulkDeleteConfirmPopup,
    setConfirmLogsBulkDelete,
})(DeleteUserLogs);

