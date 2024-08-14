import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    fetchFeedLibrary,
    setFeedLibraryPagination,
    showEditFeedLibraryForm,
    hideFeedLibraryForms,
    setFeedDataByID,
    fetchFeedCustomFields,
    resetFeedLibraryInputs,
    feedSearch,
} from "../../Store/Actions/FeedLibraryActions";
import { showFeedLibraryDeleteConfirmPopup } from "../../Store/Actions/popupActions";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";
import InputText from "../Inputs/InputText";
import { withTranslation } from 'react-i18next';


class FeedList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feedSearch: '',
        }
    }

    paginationChangeHandler(pageNumber) {
        this.props.setFeedLibraryPagination(pageNumber, this.props.listFeedLibrary.length);
    }

    async feedEditHandler(feedID) {
        await this.props.resetFeedLibraryInputs();
        await this.props.hideFeedLibraryForms();
        await this.props.fetchFeedCustomFields({
            company_id: this.props.auth.data.user.company_id,
            type: 'feed_library',
        });
        await this.props.setFeedDataByID(feedID, this.props.listFeedLibrary);
        await this.props.showEditFeedLibraryForm();
    }

    feedSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        });

        this.props.feedSearch(value, this.props.listFeedLibrary);
    }

    confirm(itemId) {
        this.props.showFeedLibraryDeleteConfirmPopup(itemId);
    }

    render() {

        const { t } = this.props;

        let feedLibrary = this.props.listFeedLibrary === undefined ? [] : this.props.listFeedLibrary;

        if (this.props.feedSearchList !== undefined) {
            feedLibrary = this.props.feedSearchList;
        }

        const allDefaultFieldsData = this.props.feedLibraryFormSettingsData === undefined || this.props.feedLibraryFormSettingsData[0] === undefined ? [] : this.props.feedLibraryFormSettingsData[0]['Feed library form fields'];

        let tableMapping = [];
        let countHeading = 0;

        allDefaultFieldsData.slice(0, 8).map(field => {
            tableMapping[countHeading] = {
                id: countHeading + 1,
                heading: field.fieldLabel,
                fieldName: field.fieldName
            };
            countHeading++;
        });

        const totalRecord = this.props.paginationData === undefined ? 1 : this.props.paginationData.totalRecord;
        const paginationPerPage = this.props.paginationData === undefined ? 1 : this.props.paginationData.perPage;

        const totalPage = Math.ceil(totalRecord / paginationPerPage);
        const currentPage = this.props.paginationData === undefined ? 1 : this.props.paginationData.currentPage;
        const currentRoute = this.props.page.currentRoute;

        let countDefaultTD = 0;
        let countCostTypesTD = 0;

        let startRecord = paginationPerPage * (currentPage - 1);
        let showRecord = startRecord + paginationPerPage;


        return (
            <div className="content-block">
                <div className="col- col-xl-5 p-0" id="search_users">
                    <div className="content-block-grey p-1">
                        <InputText
                            fieldName="feedSearch"
                            fieldClass="feed_search"
                            fieldID="feed_search"
                            fieldPlaceholder={t('search_feed')}
                            fieldValue={this.state.feedSearch}
                            fieldOnChange={this.feedSearchHandler.bind(this)} />
                    </div>
                </div>
                <div className="table-responsive text-nowrap">
                    <ContentSpinner />
                    {feedLibrary.length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th>{t('id')}</th>
                                {
                                    tableMapping.map(table => {
                                        return <th key={table.id}>{t(table.heading)}</th>
                                    })
                                }
                                <th>{t('feed_cost')}</th>
                                <th>{t('created_at')}</th>
                                <th>{t('actions')}</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                feedLibrary.slice(startRecord, showRecord).map(feedLib => {
                                    return (
                                        <tr key={feedLib.id}>
                                            <td>{feedLib.id}</td>
                                            {
                                                tableMapping.map((row, key) => {
                                                    countDefaultTD++;
                                                    if (feedLib[row.fieldName] === undefined || feedLib[row.fieldName] === '') {
                                                        return (
                                                            <td key={countDefaultTD}></td>
                                                        )
                                                    }
                                                    return (
                                                        <td key={countDefaultTD}>{feedLib[row.fieldName]}</td>
                                                    )
                                                })

                                            }
                                            {feedLib.feed_cost === undefined && <td></td>}
                                            {feedLib.feed_cost !== undefined &&
                                                <td>{Object.keys(feedLib.feed_cost[0]).map(key => feedLib.feed_cost[0][key])}</td>}
                                            <td>{feedLib.created_at}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-primary-outline at2-btn-no-bg"
                                                    onClick={e => this.feedEditHandler(feedLib.id)}>
                                                    <img src="images/edit_icon.svg" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={e => this.confirm(feedLib.id)}
                                                    className="btn btn-primary-outline at2-btn-no-bg">
                                                    <img src="images/remove_icon.svg" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>}
                    {Object.keys(feedLibrary).length === 0 && <p className="text-center">No feed found.</p>}
                </div>
                <Pagination
                    totalPage={totalPage}
                    currentPage={currentPage}
                    paginationLinkHandler={this.paginationChangeHandler.bind(this)} />
            </div>
        )
    }
}


const mapStateToProps = state => ({
    page: state.page,
    auth: state.auth,
    listFeedLibrary: state.feedLibrary.data,
    feedLibraryFormSettingsData: state.feedLibrary.formSettingsData,
    paginationData: state.feedLibrary.paginationData,
    feedSearchList: state.feedLibrary.feedSearchList,
});

export default connect(mapStateToProps, {
    showEditFeedLibraryForm,
    fetchFeedLibrary,
    setFeedLibraryPagination,
    showFeedLibraryDeleteConfirmPopup,
    hideFeedLibraryForms,
    setFeedDataByID,
    fetchFeedCustomFields,
    resetFeedLibraryInputs,
    feedSearch
})(withTranslation()(FeedList));
