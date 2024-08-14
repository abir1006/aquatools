import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import NavService from "../../Services/NavServices";

import './Settings.css';

const Tabs = props => {
    const currentRoute = NavService.getCurrentRoute();
    return (
        <div className="settings_tabs">
            <ul>
                {props.acl.roles !== undefined && props.acl.roles.list === true &&
                <li className={currentRoute === 'profiles' ? 'active' : ''}>
                    <Link to="/admin/profiles">Profile Info</Link>
                </li>}
                {props.acl.permissions !== undefined && props.acl.permissions.list === true && <li className={currentRoute === 'acl' ? 'active' : ''}>
                    <Link to="/admin/profiles-">Change Avatar</Link>
                </li>}
                {props.acl.invoice_settings !== undefined && props.acl.invoice_settings.list === true && <li className={currentRoute === 'invoice' ? 'active' : ''}>
                    <Link to="/admin/profiles-">Change Password</Link>
                </li>}

            </ul>
        </div>
    );
}

const mapStateToProps = state => ({
    acl: state.auth.acl,
});

export default connect(mapStateToProps)(Tabs);

