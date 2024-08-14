import React, {Component} from 'react';
import {connect} from "react-redux";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";
import {
    userList,
    setUserByID,
    showEditUserForm,
    blockUnblockUser,
    showUserDeleteConfirmPopup,
    resetUserInputs,
    resetUserFieldsEmptyErrors,
    setUserInputsErrors,
} from "../../Store/Actions/userActions";
import InputText from "../Inputs/InputText";
import CheckBox from "../Inputs/CheckBox";
import ListAutoComplete from "../Inputs/ListAutoComplete/ListAutoComplete";
import SaveButton from "../Inputs/SaveButton";

import {
    templateUserList,
    hideTemplateSharingScreen,
    templateUserSearch,
    shareTemplate,
    companyListByToolAccess,
} from "../../Store/Actions/TemplateActions";
import BackButton from "../Inputs/BackButton";


class TemplateSharingScreen extends Component {
    constructor(props) {
        super(props);
        this.props.userList();
        this.state = {
            templateUserSearch: '',
            sharedCompanyId: undefined,
            isCompanyFieldEmpty: false,
            isUserSelected: false,
            sharedUserID: [],
            selectedSharedOption: "0",
            shareWithUsers: true,
            shareWithAllUsers: false,
            shareWithOtherUsers: false,
            shareWithThisCompany: false,
            errorMessage: '',
            checkBoxDisable: false,
            inputShareUser: []
        }
    }


    componentDidMount() {
        this.props.templateUserList(this.props.sharedTemplateData.id);
        this.props.companyListByToolAccess(this.props.sharedTemplateData.modelID)
    }

    confirm(itemId) {
    }

    handleShareTemplate() {

        const shareData = {};

        // when user chose first sharing option

        if (parseInt(this.state.selectedSharedOption) === 0) {
            if (this.state.sharedUserID.length === 0) {
                this.setState({
                    ...this.state,
                    errorMessage: 'No users are selected'
                })

                return false;
            }

            shareData.template_id = this.props.sharedTemplateData.id;
            shareData.users = this.state.sharedUserID;
            shareData.share_type = 'specific_users';
        } else if (parseInt(this.state.selectedSharedOption) === 1) {
            shareData.company_id = this.props.currentUserRole !== 'super_admin' ? this.props.auth.data.user.company.id : '';
            shareData.template_id = this.props.sharedTemplateData.id;
            shareData.share_type = 'all_users';
            if (this.props.currentUserRole === 'super_admin') {
                delete shareData.company_id;
            }
        } else {
            if (this.state.sharedCompanyId === '') {
                this.setState({
                    ...this.state,
                    errorMessage: 'No company is selected'
                });

                return false;
            }
            shareData.company_id = this.state.sharedCompanyId;
            shareData.template_id = this.props.sharedTemplateData.id;
            shareData.share_type = 'all_users';
        }


        if (Object.keys(shareData).length === 0) {
            this.setState({
                ...this.state,
                errorMessage: 'No sharing options or data found'
            });

            return false;
        }

        const currentPageNo = this.props.templateUsersPaginationData.currentPage;

        shareData.write_access = Boolean(this.state.templateWriteAccess);

        this.props.shareTemplate(shareData, currentPageNo);

        // reset sharing user list selection
        this.setState({
            ...this.state,
            templateWriteAccess: undefined,
            sharedUserID: []
        })

    }

    userSearchHandler(inputTarget) {
        const {name, value} = inputTarget;
        this.setState({
            ...this.state,
            [name]: value
        })
        this.props.templateUserSearch(this.props.sharedTemplateData.id, value);
    }

    async companySelectHandler(name, id) {
        await this.setState({
            ...this.state,
            sharedCompanyId: id
        })

        await this.props.templateUserList(this.props.sharedTemplateData.id, id);
    }

    selectUserHandler(tickStatus, fieldName, userID) {

        this.state.inputShareUser[userID] = tickStatus;

        if (tickStatus === true) {
            this.setState({
                ...this.state,
                errorMessage: '',
                inputShareUser: this.state.inputShareUser,
                sharedUserID: [...this.state.sharedUserID, { user_id: userID }]
            });
        } else {
            this.setState({
                ...this.state,
                errorMessage: '',
                inputShareUser: this.state.inputShareUser,
                sharedUserID: this.state.sharedUserID.filter(item => item.user_id !== userID)
            })
        }
    }

    selectAllUsersHandler() {
    }

    shareOptionsHandler(e) {
        if (this.state.sharedCompanyId !== undefined) {
            this.props.templateUserList(this.props.sharedTemplateData.id);
        }
        const optionValue = e.target.value;
        let allSharedUserID = [];
        let checkBoxDisable = this.state.checkBoxDisable;

        if (optionValue !== '0') {
            checkBoxDisable = true;
            let countSharedUser = 0;
            this.props.templateUsers.map(user => {
                this.state.inputShareUser[user.id] = true;
                allSharedUserID[countSharedUser] = {user_id: user.id}
                countSharedUser++;
            });
        } else {
            this.state.inputShareUser = [];
            checkBoxDisable = false;
        }

        this.setState({
            ...this.state,
            errorMessage: '',
            inputShareUser: this.state.inputShareUser,
            selectedSharedOption: optionValue,
            sharedUserID: allSharedUserID,
            checkBoxDisable: checkBoxDisable,
            sharedCompanyId: optionValue !== '2' ? '' : this.state.sharedCompanyId
        });
    }

    async paginationChangeHandler(pageNumber) {
        const companyID = this.state.sharedCompanyId === '' ? '' : this.state.sharedCompanyId;
        await this.props.templateUserList(this.props.sharedTemplateData.id, companyID, pageNumber);
        let allSharedUserID = [];
        if (this.state.selectedSharedOption !== '0') {
            this.props.templateUsers.map(user => {
                this.state.inputShareUser[user.id] = true;
            });
        } else {
            this.state.inputShareUser = [];
        }

        this.setState({
            ...this.state,
            inputShareUser: this.state.inputShareUser,
        });
    }

    backHandler() {
        this.props.hideTemplateSharingScreen();
    }

    templateWriteAccessHandler(tickStatus, fieldName) {
        this.setState({
            ...this.state,
            templateWriteAccess: !Boolean(this.state.templateWriteAccess)
        })
    }


    render() {

        const {t} = this.props;

        const currentRoute = this.props.page.currentRoute;

        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;

        const allCompanies = this.state.selectedSharedOption === '2' ? this.props.allCompanies.sort((a, b) => a.name.localeCompare(b.name)) : [];
        const sharedCompanyId = this.state.sharedCompanyId === undefined ? '' : this.state.sharedCompanyId;

        const sectionTitle = '"' + this.props.sharedTemplateData.name + '" ' + t('template_sharing') + ' (' + this.props.sharedTemplateData.modelName + ')';

        const templateUsers = this.props.templateUsers === undefined ? [] : this.props.templateUsers;


        const totalRecord = this.props.templateUsersPaginationData === undefined ? 0 : this.props.templateUsersPaginationData.totalRecord;
        const perPage = this.props.templateUsersPaginationData === undefined ? 1 : this.props.templateUsersPaginationData.perPage;

        const totalPage = Math.ceil(totalRecord / perPage);
        const currentPage = this.props.templateUsersPaginationData === undefined ? 1 : this.props.templateUsersPaginationData.currentPage;

        let countTemplateUsers = 0;

        const companyFieldDisable = this.state.selectedSharedOption !== '2';
        const selectedItem = this.state.selectedSharedOption !== '2' ? '' : '';

        const templateWriteAccess = Boolean(this.state.templateWriteAccess);

        return (
            <div className="content-block mb-3" id="template_sharing_component">
                <div className="tab_heading p-0">
                    <h2>{sectionTitle}</h2>
                </div>
                <div className="content-block-grey">
                    <div className="row">
                        <div className="col- col-xl-3">
                            <label htmlFor="share_with_users">
                                <input
                                    id="share_with_users"
                                    onChange={e => this.shareOptionsHandler(e)}
                                    name="share_with_options"
                                    value="0"
                                    checked={this.state.selectedSharedOption === "0"}
                                    type="radio"/>
                                {t('with_specific_users')}
                            </label>
                        </div>
                        <div className="col- col-xl-2">
                            <label htmlFor="share_with_this_company">
                                <input
                                    onChange={e => this.shareOptionsHandler(e)}
                                    id="share_with_this_company"
                                    name="share_with_options"
                                    value="1"
                                    checked={this.state.selectedSharedOption === "1"}
                                    type="radio"/>{t('with_all_users')}
                            </label>
                        </div>
                        {this.props.currentUserRole === 'super_admin' && <div className="col- col-xl-5">
                            <div className="row">
                                <div className="col- col-xl-5">
                                    <label htmlFor="share_with_other_company">
                                        <input
                                            onChange={e => this.shareOptionsHandler(e)}
                                            id="share_with_other_company"
                                            name="share_with_options"
                                            value="2"
                                            checked={this.state.selectedSharedOption === "2"}
                                            type="radio"/> {t('with_selected_company')}
                                    </label>
                                </div>
                                <div className="col- col-xl-6">
                                    <ListAutoComplete
                                        disableListLocalState={this.state.selectedSharedOption !== "2" || sharedCompanyId === ''}
                                        fieldDisabled={companyFieldDisable}
                                        fieldId="company_id"
                                        fieldName="company_id"
                                        fieldPlaceHolder={t('select_company')}
                                        fieldOnClick={this.companySelectHandler.bind(this)}
                                        isFieldEmpty={this.state.isCompanyFieldEmpty}
                                        listData={allCompanies}
                                        selectedItemId={sharedCompanyId}
                                    />
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
                <div className="row">
                    <div className="col- col-xl-12">
                        <div className="content-block-grey p-1">
                            <InputText
                                fieldName="templateUserSearch"
                                fieldClass="template_user_search"
                                fieldID="template_user_search"
                                fieldPlaceholder="Search user by name, email or company"
                                fieldValue={this.state.templateUserSearch}
                                fieldOnChange={this.userSearchHandler.bind(this)}/>
                        </div>
                    </div>
                </div>
                <div className="table-responsive text-nowrap">
                    <ContentSpinner/>
                    {templateUsers.length > 0 && <table className="table table-borderless table-striped">
                        <thead>
                        <tr>
                            <th style={{width: '50px'}} scope="col"></th>
                            <th scope="col">{t('id')}</th>
                            <th scope="col">{t('first_name')}</th>
                            <th scope="col">{t('last_name')}</th>
                            <th scope="col">{t('email')}</th>
                            <th scope="col">{t('company')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            templateUsers.map(user => {
                                countTemplateUsers++;
                                const classStr = this.state.checkBoxDisable === true ? 'pt-0 input-disable' : 'pt-0';
                                let checkFieldValue = this.state.selectedSharedOption === '2' || (this.state.inputShareUser[user.id] === undefined ? '' : this.state.inputShareUser[user.id]);
                                return (
                                    <tr key={user.id}>
                                        <td className={classStr}>
                                            <CheckBox
                                                fieldName={'shareUser' + user.id}
                                                fieldValue={checkFieldValue}
                                                fieldID={user.id}
                                                checkUncheckHandler={this.selectUserHandler.bind(this)}/>
                                        </td>
                                        <td>{user.id}</td>
                                        <td>{user.first_name}</td>
                                        <td>{user.last_name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.company.name}</td>
                                    </tr>
                                )
                            })
                        }

                        </tbody>
                    </table>}
                    {templateUsers.length === 0 &&
                    <p className="text-center">{t('no_more_users_found_for_sharing')}.</p>}
                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        paginationLinkHandler={this.paginationChangeHandler.bind(this)}/>

                    {this.state.errorMessage !== '' &&
                    <p className="at2_error_text">{this.state.errorMessage}</p>}
                </div>
                <div className="col- col-xl-12">
                    <div className="row">
                        <div className="input-block template_share_access">
                            <CheckBox
                                fieldName="template_write_access"
                                fieldValue={templateWriteAccess}
                                fieldID="template_write_access"
                                text={t('give_write_access_to_this_template')}
                                checkUncheckHandler={this.templateWriteAccessHandler.bind(this)}/>
                        </div>
                    </div>
                </div>
                <div className="col- col-xl-12">
                    <div className="row">
                        <span style={{display: 'inline-block', marginRight: '15px'}}>
                            <BackButton
                                name={t('back')}
                                onClickHandler={this.backHandler.bind(this)}/>
                        </span>
                        {templateUsers.length > 0 && <SaveButton
                            buttonDisabled={this.props.shareBtnSpinner}
                            onClickHandler={this.handleShareTemplate.bind(this)}
                            name={t('share')}/>}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    page: state.page,
    auth: state.auth,
    data: state.user.data,
    currentUserRole: state.auth.data.user.roles[0].slug,
    addUser: state.user.addUser,
    paginationData: state.user.paginationData,
    allCompanies: state.company.data,
    templateUsers: state.template.users,
    templateUsersPaginationData: state.template.templateUsersPaginationData,
    sharedTemplateData: state.template.sharedTemplateData,
    shareBtnSpinner: state.template.shareBtnSpinner,
});

export default connect(mapStateToProps, {
    userList,
    setUserByID,
    showEditUserForm,
    blockUnblockUser,
    showUserDeleteConfirmPopup,
    resetUserInputs,
    resetUserFieldsEmptyErrors,
    setUserInputsErrors,
    templateUserList,
    hideTemplateSharingScreen,
    templateUserSearch,
    shareTemplate,
    companyListByToolAccess,
})(TemplateSharingScreen);
