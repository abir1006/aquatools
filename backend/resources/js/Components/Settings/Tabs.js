import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import NavService from "../../Services/NavServices";

import './Settings.css';

const Tabs = props => {

    const { t } = props;

    const currentRoute = NavService.getCurrentRoute();
    return (
        <div className="settings_tabs">
            <ul>
                {props.acl.roles !== undefined && props.acl.roles.list === true &&
                    <li className={currentRoute === 'user-roles' ? 'active' : ''}>
                        <Link to="/admin/settings/user-roles">{t('user_roles')}</Link>
                    </li>}
                {props.acl.permissions !== undefined && props.acl.permissions.list === true && <li className={currentRoute === 'acl' ? 'active' : ''}>
                    <Link to="/admin/settings/acl">{t('access_control_list')}</Link>
                </li>}
                {props.acl.invoice_settings !== undefined && props.acl.invoice_settings.list === true && <li className={currentRoute === 'invoice' ? 'active' : ''}>
                    <Link to="/admin/settings/invoice">{t('invoice')}</Link>
                </li>}
                {props.acl.models !== undefined && props.acl.models.list === true && <li className={currentRoute === 'models' ? 'active' : ''}>
                    <Link to="/admin/settings/models">{t('models')}</Link>
                </li>}
                {props.acl.feed_settings !== undefined && props.acl.feed_settings.list === true && <li className={currentRoute === 'feed-library' ? 'active' : ''}>
                    <Link to="/admin/settings/feed-library">{t('feed_library')}</Link>
                </li>}

                {props.acl.translations !== undefined && props.acl.translations.list === true && <li className={currentRoute === 'translations' ? 'active' : ''}>
                    <Link to="/admin/settings/translations">{t('translation')}</Link>
                </li>}

                {props.acl.site_settings !== undefined && props.acl.site_settings.list === true && <li className={currentRoute === 'site_settings' ? 'active' : ''}>
                    <Link to="/admin/settings/site_settings">{t('site_settings')}</Link>
                </li>}

                {props.acl.user_logs !== undefined && props.acl.user_logs.list === true && <li className={currentRoute === 'user_logs' ? 'active' : ''}>
                    <Link to="/admin/settings/user_logs">{t('user_logs')}</Link>
                </li>}


            </ul>
        </div>
    );
}

const mapStateToProps = state => ({
    acl: state.auth.acl,
});

export default connect(mapStateToProps)(withTranslation()(Tabs));

