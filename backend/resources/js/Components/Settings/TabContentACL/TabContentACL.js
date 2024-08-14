import React, { Component } from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import { connect } from 'react-redux';
import SettingsIcon from "../../MainNavigation/Images/menu_settings_icon.svg";
import EditPermission from "./EditPermission";
import { showEditPermission } from "../../../Store/Actions/ACLActions";
import { withTranslation } from 'react-i18next';

class TabContentACL extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                role: {}
            },
            deleteRole: false,
            selectedRoleId: null,
        }
    }

    editPermissionHandler(roleId) {
        window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);
        this.props.showEditPermission();
        this.setState({
            ...this.state,
            selectedRoleId: roleId,
        });
    }

    render() {

        const { t } = this.props;

        const roles = this.props.data;

        const showEditPermission = this.props.editPermissions;

        const hasEditPermission = this.props.auth.acl.permissions !== undefined ? this.props.auth.acl.permissions.update : false;

        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col- col-lg-12">
                            <TabHeading
                                tabHeading={t('access_control_list_settings')}
                                tabSubHeading={t('acl_settings_subheading')} />
                        </div>
                    </div>

                    <div className="table-responsive text-nowrap">
                        <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">{t('id')}</th>
                                    <th scope="col">{t('role_name')}</th>
                                    <th scope="col">{t('slug')}</th>
                                    <th scope="col">{t('status')}</th>
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
                                                <td>
                                                    {!hasEditPermission && '-'}
                                                    {
                                                        roles[index].id !== 1 && hasEditPermission === true && <button
                                                            type="button"
                                                            className="btn btn-primary-outline at2-btn-no-bg ml-3"
                                                            onClick={e => this.editPermissionHandler(roles[index].id)}>
                                                            <img className="svg-dark-icon" src={SettingsIcon}
                                                                alt={t('title') + ' ' + t('icon')} />
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

                {showEditPermission && <EditPermission selectedRoleId={this.state.selectedRoleId} />}

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    data: state.role.data,
    editPermissions: state.permission.editPermissions,
    popup: state.popup,
});

export default connect(mapStateToProps, {
    showEditPermission,
})(withTranslation()(TabContentACL));

