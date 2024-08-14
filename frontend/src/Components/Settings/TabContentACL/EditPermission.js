import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import axios from "axios";
import TokenServices from "../../../Services/TokenServices";
import ActionList from "./ActionList";
import { withTranslation } from 'react-i18next';

class EditPermission extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clickedPermissionName: null,
            data: {}
        }
    }

    async permissionClickHandler(e, name) {
        const token = TokenServices.getToken();
        const role_id = this.props.selectedRoleId;
        if (this.state.clickedPermissionName === name) {
            return false;
        }
        try {
            const actionListResponse = await axios.post('api/permission/actions', {
                role_id,
                name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // response

            this.setState({
                ...this.state,
                clickedPermissionName: name
            });

            this.props.setPermissionActionsData(actionListResponse.data.data)

        } catch (error) {
        }
    }

    async componentDidMount() {

        const token = TokenServices.getToken();

        if (!token) {
            this.props.doLogout();
        }

        try {
            const permissionsResponse = await axios.post('api/permission/features', {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            // response

            this.props.setPermissionsData(permissionsResponse.data.data);

            window.scrollTo(0, document.getElementById('table-listing-block').offsetHeight);


        } catch (error) {
        }
    }

    onChangeHandler() {
    }

    savePermissionHandler() {
    }


    render() {

        const { t } = this.props;

        const selectedRole = this.props.data.filter(role => role.id === this.props.selectedRoleId);
        const tabHeadingText = t('edit_permision_for_role') + ' ' + selectedRole[0].name;
        const permissionData = this.props.permissionData;
        return (
            <div className="content-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <TabHeading
                            tabHeading={tabHeadingText}
                            tabSubHeading="" />
                    </div>
                    {/*<div className="col-6 col-xl-2 col-lg-3 col-md-4 col-sm-5 pb-lg-2 text-right">*/}
                    {/*    <SaveButton*/}
                    {/*        onClickHandler={this.savePermissionHandler.bind(this)}*/}
                    {/*        name="Back"*/}
                    {/*    />*/}
                    {/*</div>*/}

                    <div className="col-lg-12">
                        <div className="content-block pl-0 pr-0">
                            <form>
                                {
                                    Object.keys(permissionData).map(index => {
                                        return (
                                            <div
                                                key={index}
                                                className="permission_name word_capitalize"
                                            >
                                                <span
                                                    className="permission_label"
                                                    onClick={e => this.permissionClickHandler(e, permissionData[index])}>
                                                    {permissionData[index].replace('_', ' ')}
                                                </span>
                                                <ActionList
                                                    roleId={this.props.selectedRoleId}
                                                    permissionName={permissionData[index]}
                                                    clickedPermissionName={this.state.clickedPermissionName}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    data: state.role.data,
    permissionData: state.permission.data
});

const mapDispatchToProps = dispatch => {
    return {
        showSuccessMessage: message => {
            dispatch({ type: 'SHOW_NOTIFICATION_POPUP', payload: message });
            setTimeout(() => {
                dispatch({ type: 'HIDE_NOTIFICATION_POPUP' })
            }, 3000);
        },
        setPermissionsData: permissionsData => {
            dispatch({ type: 'SET_PERMISSIONS_DATA', payload: permissionsData });
        },
        setPermissionActionsData: permissionActionsData => {
            dispatch({ type: 'SET_PERMISSION_ACTIONS_DATA', payload: permissionActionsData });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(EditPermission));

