import React, {Component} from 'react';
import {connect} from 'react-redux';
import '../Settings.css';
import axios from "axios";
import TokenService from "../../../Services/TokenServices";


class ActionList extends Component {
    constructor(props) {
        super(props);
    }

    async permissionActionHandler(e, actionName) {
        const actionsData = this.props.data.actions;
        actionsData[actionName] = actionsData[actionName] !== true;

        let apiUrl = 'api/permission/update';
        let requestData = {
            id: this.props.data.permission_id,
            name: this.props.permissionName,
            description: '',
            slug: actionsData
        }

        // if permission ID not found, call save API, otherwise update API

        if (this.props.data.permission_id === null) {
            apiUrl = 'api/permission/save';
            requestData = {
                role_id: this.props.roleId,
                name: this.props.permissionName,
                description: '',
                slug: actionsData
            }
        }

        const token = TokenService.getToken();

        try {
            const actionSaveResponse = await axios.post(
                apiUrl,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

            // response

            const updatedActionsData = {
                permission_id: actionSaveResponse.data.data.id,
                actions: actionSaveResponse.data.data.slug
            }

            this.props.updatePermissionActionsData(updatedActionsData);

        } catch (error) {
        }

    }

    render() {
        const showActionList = this.props.permissionName === this.props.clickedPermissionName ? 'permission_actions show' : 'permission_actions';
        const data = this.props.data;
        if (data.actions === undefined || data.actions === null) {
            return null;
        }

        const aclActionList = [];

        let count = 0;

        for (let actionName in data.actions) {

            count++;

            const actionIcon = data.actions[actionName] === true ?
                <i className="fa fa-check white-stroke color-green" aria-hidden="true"></i> : <i className="fa fa-times" aria-hidden="true"></i>

            const actionListing = <span onClick={e => this.permissionActionHandler(e, actionName)} key={count}
                                        data-value={data.actions[actionName]}>{actionIcon} {actionName}</span>;

            aclActionList.push(actionListing);
        }

        return (
            <div className={showActionList}>
                {aclActionList}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    data: state.permissionActions.data
});

const mapDispatchToProps = dispatch => {
    return {
        updatePermissionActionsData: updatedData => {
            dispatch({type: 'SET_PERMISSION_ACTIONS_DATA', payload: updatedData});
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionList);

