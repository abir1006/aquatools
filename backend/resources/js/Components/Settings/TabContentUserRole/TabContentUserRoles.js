import React, { Component } from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import AddButton from "../../Inputs/AddButton";
import { connect } from 'react-redux';
import AddRole from "./AddRole";
import EditRole from "./EditRole";
import DateTimeService from "../../../Services/DateTimeServices";
import ContentSpinner from "../../Spinners/ContentSpinner";

import { showRoleDeleteConfirmPopup } from "../../../Store/Actions/popupActions";
import {
    showAddRoleForm,
    showEditRoleForm,
    setSelectedRoleId,
    setEditedRoleData,
    hideRoleForms,
} from "../../../Store/Actions/UserRolesActions";
import { withTranslation } from 'react-i18next';

class TabContentUserRoles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                role: {}
            },
            deleteRole: false,
            selectedRoleId: null,
        }

        this.props.hideRoleForms();
    }

    addRoleHandler() {
        this.props.showAddRoleForm();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    editRoleHandler(roleId) {
        const selectedRole = this.props.data.filter(role => role.id === roleId);
        this.props.setEditedRoleData({
            name: selectedRole[0].name,
            slug: selectedRole[0].slug,
        });
        this.props.setSelectedRoleId(roleId);
        this.props.showEditRoleForm();
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
    }

    confirm(itemId) {
        this.props.showRoleDeleteConfirmPopup(itemId);
    }

    render() {

        const { t } = this.props;

        const roles = this.props.data;
        const showAddRoleForm = this.props.addRole;
        const showEditRoleForm = this.props.editRole;


        // set acl permission for user add
        const hasAddPermission = this.props.auth.acl['roles'] !== undefined ? this.props.auth.acl.roles.save : false;
        const hasEditPermission = this.props.auth.acl['roles'] !== undefined ? this.props.auth.acl.roles.update : false;
        const hasDeletePermission = this.props.auth.acl['roles'] !== undefined ? this.props.auth.acl.roles.delete : false;


        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col- col-xl-9 col-lg-9 col-md-8 col-sm-7">
                            <TabHeading
                                tabHeading={t('user_roles_settings')}
                                tabSubHeading={t('user_roles_tab_subheading')} />
                        </div>
                        <div className="col- col-xl-3 col-lg-3 col-md-4 col-sm-5 pt-lg-2 text-right">
                            {hasAddPermission && <AddButton
                                onClickHandler={this.addRoleHandler.bind(this)}
                                name={t('add') + ' ' + t('role')}
                            />}
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <ContentSpinner />
                        <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">{t('id')}</th>
                                    <th scope="col">{t('role_name')}</th>
                                    <th scope="col">{t('slug')}</th>
                                    <th scope="col">{t('status')}</th>
                                    <th scope="col">{t('created')}</th>
                                    <th scope="col">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(roles).map(index => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{roles[index].id}</th>
                                                <td>{roles[index].name}</td>
                                                <td>{roles[index].slug}</td>
                                                <td><i className="fa fa-check white-stroke color-green"></i></td>
                                                <td>{DateTimeService.getDateTime(roles[index].created_at)}</td>
                                                <td>
                                                    {!hasEditPermission && !hasDeletePermission && '-'}
                                                    {
                                                        roles[index].id !== 1 && hasEditPermission === true && <button
                                                            type="button"
                                                            className="btn btn-primary-outline at2-btn-no-bg"
                                                            onClick={e => this.editRoleHandler(roles[index].id)}>
                                                            <img src="images/edit_icon.svg" />
                                                        </button>
                                                    }
                                                    {
                                                        (roles[index].id !== 1 && !showEditRoleForm) && hasDeletePermission && <button
                                                            type="button"
                                                            onClick={e => this.confirm(roles[index].id)}
                                                            className="btn btn-primary-outline at2-btn-no-bg">
                                                            <img src="images/remove_icon.svg" />
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                {showAddRoleForm && <AddRole />}
                {showEditRoleForm && <EditRole />}

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page,
    data: state.role.data,
    addRole: state.role.addRole,
    editRole: state.role.editRole,
    popup: state.popup,
});

export default connect(mapStateToProps, {
    showRoleDeleteConfirmPopup,
    showAddRoleForm,
    showEditRoleForm,
    setSelectedRoleId,
    setEditedRoleData,
    hideRoleForms,
})(withTranslation()(TabContentUserRoles));

