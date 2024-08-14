import React, { Component } from 'react';
import { connect } from "react-redux";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";
import {
    userList,
    setUserByID,
    showEditUserForm,
    showChangePasswordForm,
    blockUnblockUser,
    showUserDeleteConfirmPopup,
    resetUserInputs,
    resetUserFieldsEmptyErrors,
    setUserInputsErrors,
    userSearch,
    userListSort,
} from "../../Store/Actions/userActions";
import InputText from "../Inputs/InputText";
import ToggleUpDown from "../IconButton/ToggleUpDown";
import UserFilters from './UserFilters';


class UserList extends Component {
    constructor(props) {
        super(props);
        this.props.userList(undefined, 'users');
        this.state = {
            userSearch: '',
            sortingTypes: [],
            colSortBy: {},
            sortData: [],
            filters: {
                company: ''
            }
        }
    }

    paginationChangeHandler(pageNumber) {
        this.props.userListSort(this.state.sortData, pageNumber);
    }

    confirm(itemId) {
        this.props.showUserDeleteConfirmPopup(itemId);
    }

    userEditHandler(userId) {
        // scroll to top
        window.scrollTo(0, 0);
        this.props.resetUserFieldsEmptyErrors();
        this.props.setUserInputsErrors('');
        this.props.resetUserInputs();
        this.props.setUserByID(userId);
        this.props.showEditUserForm();
    }

    blockUnblockHandler(userID, status) {
        const userStatus = status === 0 ? 1 : 0;
        this.props.blockUnblockUser(userID, userStatus);
    }

    changePasswordHandler(userId) {
        // scroll to top
        window.scrollTo(0, 0);
        this.props.resetUserFieldsEmptyErrors();
        this.props.setUserInputsErrors('');
        this.props.resetUserInputs();
        this.props.setUserByID(userId);
        this.props.showChangePasswordForm();
    }

    userSearchHandler(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        },
            () => {

                const { userSearch, filters } = this.state;
                const searchData = {
                    search: userSearch,
                    filters: filters
                }

                this.props.userSearch(searchData);
            }
        );
    }

    userFilterHandler({ company }) {

        this.setState(
            { ...this.state, filters: { ...this.state.filters, company: company } },
            () => {

                const { userSearch, filters } = this.state;
                const searchData = {
                    search: userSearch,
                    filters: filters
                }

                this.props.userSearch(searchData);
            }
        );
    }


    userColumnSortingHandler(sortBy, pageNo) {

        let sortingTypes = { [sortBy]: this.state.sortingTypes[sortBy] !== undefined && this.state.sortingTypes[sortBy] === 'desc' ? 'asc' : 'desc' }
        const colsSortBy = !Boolean(this.state.colSortBy) ? [] : this.state.colSortBy;

        const sortData = {
            sort_by: sortBy,
            sort_type: sortingTypes[sortBy]
        }

        this.setState({
            ...this.state,
            sortingTypes: sortingTypes,
            colSortBy: { [sortBy]: this.state.sortingTypes[sortBy] !== undefined && this.state.sortingTypes[sortBy] === 'desc' ? 'asc' : 'desc' },
            sortData: sortData,
            userSearch: '',
            filters: {}
        }
        )

        this.props.userListSort(sortData, 1);
    }

    render() {

        const { t } = this.props;

        const currentUserRole = this.props.auth.data?.user?.roles[0].slug;

        const users = this.props.data;
        const totalPage = Math.ceil(this.props.paginationData.totalRecord / this.props.paginationData.perPage);
        const currentPage = this.props.paginationData.currentPage;
        const currentRoute = this.props.page.currentRoute;
        const hasEditPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].update : false;
        const hasBlockPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].block : false;
        let hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;
        let hasChangePasswordPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute]['change-password'] : false;


        return (
            <div className="content-block">
                <div className="w-100" id="search_users">
                    {hasSearchPermission &&
                        <div className="content-block-grey p-3 ">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="w-50">
                                    <InputText
                                        fieldName="userSearch"
                                        fieldClass="user_search"
                                        fieldID="user_search"
                                        fieldPlaceholder={t('search_user_by')}
                                        fieldValue={this.state.userSearch}
                                        fieldOnChange={this.userSearchHandler.bind(this)} />
                                </div>
                                <div style={{ width: '15%' }}>
                                    {currentUserRole === 'super_admin' && <UserFilters filters={this.state.filters} filterHandler={this.userFilterHandler.bind(this)} />}
                                </div>
                            </div>
                        </div>}
                </div>
                <div className="table-responsive text-nowrap">
                    <ContentSpinner />
                    {Object.keys(users).length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                            <tr>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('id', currentPage)}>
                                    {t('id')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['id']) ? this.state.colSortBy['id'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('first_name', currentPage)}>
                                    {t('first_name')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['first_name']) ? this.state.colSortBy['first_name'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('last_name', currentPage)}>
                                    {t('last_name')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['last_name']) ? this.state.colSortBy['last_name'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('email', currentPage)}>
                                    {t('email')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['email']) ? this.state.colSortBy['email'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('company_name', currentPage)}>
                                    {t('company')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['company_name']) ? this.state.colSortBy['company_name'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('role', currentPage)}>
                                    {t('role')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['role']) ? this.state.colSortBy['role'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('created_at', currentPage)}>
                                    {t('created_at')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['created_at']) ? this.state.colSortBy['created_at'] : 'asc'} />
                                </th>
                                <th className="sortable" scope="col"
                                    onClick={e => this.userColumnSortingHandler('status', currentPage)}>
                                    {t('status')}
                                    <ToggleUpDown
                                        toggle={Boolean(this.state.colSortBy['status']) ? this.state.colSortBy['status'] : 'asc'} />
                                </th>
                                <th scope="col">  {t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                users.slice(0, this.props.paginationData.perPage).map(user => {
                                    if (user.company === undefined) return null;
                                    if (user.roles === undefined) return null;
                                    const enableDeleteIcon = user.company.email !== user.email;
                                    const roleName = Boolean(user.roles[0]) ? user.roles[0].name : ''
                                    return (
                                        <tr key={user.id}>
                                            <th scope="row">{user.id}</th>
                                            <td>{user.first_name}</td>
                                            <td>{user.last_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.company.name || ''}</td>
                                            <td>{roleName}</td>
                                            <td>{DateTimeService.getDateTime(user.created_at)}</td>
                                            <td>
                                                {user.status === 1 &&
                                                    <i className="fa fa-check white-stroke color-green"></i>}
                                                {user.status === 0 && <i className="fa fa-times"></i>}
                                            </td>
                                            <td>{!hasEditPermission && !hasBlockPermission && !hasDeletePermission && '-'}
                                                {hasEditPermission && <button
                                                    title={t('edit') + ' ' + t('user')}
                                                    type="button"
                                                    className="btn btn-primary-outline at2-btn-no-bg"
                                                    onClick={e => this.userEditHandler(user.id)}>
                                                    <img src="images/edit_icon.svg" />
                                                </button>}
                                                {(hasChangePasswordPermission && user.id === this.props.auth.data.user.id) &&
                                                    <button
                                                        title={t('change_password')}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg disabled" disabled
                                                        onClick={e => this.changePasswordHandler(user.id)}>
                                                        <i className="fa fa-key"></i>
                                                    </button>}
                                                {(hasChangePasswordPermission && user.id !== this.props.auth.data.user.id) &&
                                                    <button
                                                        title={t('change_password')}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.changePasswordHandler(user.id)}>
                                                        <i className="fa fa-key"></i>
                                                    </button>}
                                                {hasBlockPermission &&
                                                    <button title={user.status === 1 ? 'Block' : 'Unblock'}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.blockUnblockHandler(user.id, user.status)}>
                                                        {user.status === 1 &&
                                                            <i className="fa fa-ban block-unblock"></i>}
                                                        {user.status === 0 &&
                                                            <i className="fa fa-check white-stroke block-unblock"></i>}
                                                    </button>}
                                                {(hasDeletePermission && enableDeleteIcon) && <button
                                                    title={t('delete') + ' ' + t('user')}

                                                    type="button"
                                                    onClick={e => this.confirm(user.id)}
                                                    className="btn btn-primary-outline at2-btn-no-bg">
                                                    <img src="images/remove_icon.svg" />
                                                </button>}

                                                {(hasDeletePermission && !enableDeleteIcon) && <button
                                                    title={'Can not be delete, this user is company contact person'}
                                                    type="button"
                                                    className="btn btn-primary-outline at2-btn-no-bg disabled" disabled>
                                                    <img src="images/remove_icon.svg" />
                                                </button>}
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>}
                    {Object.keys(users).length === 0 && <p className="text-center">{t('no_data_found')}</p>}
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
    addUser: state.user.addUser,
    paginationData: state.user.paginationData,
});

export default connect(mapStateToProps, {
    userList,
    setUserByID,
    showEditUserForm,
    showChangePasswordForm,
    blockUnblockUser,
    showUserDeleteConfirmPopup,
    resetUserInputs,
    resetUserFieldsEmptyErrors,
    setUserInputsErrors,
    userSearch,
    userListSort,
})(UserList);
