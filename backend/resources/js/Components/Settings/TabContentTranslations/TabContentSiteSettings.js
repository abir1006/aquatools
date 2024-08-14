import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import TranslationSettings from '../SiteSettings/TranslationSettings';
import { fetchSettings } from '../../../Store/Actions/SiteSettingsActions';
class TabContentSiteSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: ""
        }

    }
    componentDidMount() {
        this.props.fetchSettings();
    }


    render() {

        const { t } = this.props;

        // set acl permission for user add
        const hasEditPermission = this.props.auth.acl['site_settings'] !== undefined ? this.props.auth.acl.site_settings.update : false;
        const hasDeletePermission = this.props.auth.acl['site_settings'] !== undefined ? this.props.auth.acl.site_settings.delete : false;


        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">

                    <div className="row">
                        <div className="col">

                            <TranslationSettings />

                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page,
    popup: state.popup,
});

export default connect(mapStateToProps, {
    fetchSettings
})(withTranslation()(TabContentSiteSettings));

