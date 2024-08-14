import React, {Component} from 'react';
import {connect} from 'react-redux';
import {latestActivity, deleteActivity} from "../../../Store/Actions/UserActivityActions";
import './ActivityBlock.css';

import {Link} from "react-router-dom";
import {withTranslation} from 'react-i18next';

class ActivityBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statistics: null
        }
    }

    componentDidMount() {
        this.props.latestActivity();
    }

    activityDeleteHandler(activityID) {
        this.props.deleteActivity(activityID)
    }

    render() {

        let toSingular = {
            users: 'user',
            companies: 'company',
            at_materials_categories: 'at material category',
            at_materials_tags: 'at material tag',
            templates: 'template',
        }

        const {t, i18n} = this.props;
        const userLatestActivity = this.props.userLatestActivity === undefined ? [] : this.props.userLatestActivity;
        return (
            <div className="content-block activity_block">
                <h4>
                    <i className="fa fa-history mr-2" aria-hidden="true"></i> {t('my_activities')}
                </h4>
                <ul>
                    {
                        userLatestActivity.length > 0 && userLatestActivity.map(activity => {
                            let hyphen = ' - ';
                            let invertedComma1 = '"';
                            let invertedComma2 = '"';
                            let articles = '';
                            let from = '';
                            if (i18n.language === 'en') {
                                hyphen = ' ';
                            }
                            let screen = hyphen + t('screen').toLowerCase();
                            let screenName = '';
                            if (Boolean(activity.screen)) {
                                screenName = activity.screen.toLowerCase().split(' ').join('_');
                                if (screenName === 'templates') {
                                    screenName = 'template';
                                    if (Boolean(activity.type) && activity.type === 'Viewed') {
                                        screenName = 'templates';
                                    } else {
                                        invertedComma1 = '';
                                        invertedComma2 = '';
                                    }
                                }
                                if (screenName === 'template') {
                                    screen = '';
                                    articles = ' ' + t('a') + ' ';
                                }

                                // for AT material details
                                if (Boolean(activity.type) && activity.type !== 'Viewed' && activity.type.replace(' ', '_').toLowerCase().split(' ')[0] !== 'viewed_details') {
                                    invertedComma1 = '';
                                    invertedComma2 = '';
                                    screen = '';
                                }
                            }

                            if (Boolean(activity.type) && activity.type !== 'Viewed' && activity.type.replace(' ', '_').toLowerCase().split(' ')[0] !== 'viewed_details') {
                                screenName = Boolean(toSingular[screenName]) ? toSingular[screenName] : screenName;
                            }

                            let screenNameText = Boolean(activity.screen) ? invertedComma1 + t(screenName) + invertedComma2 + screen : '';


                            if (Boolean(activity.screen) && activity.screen.toLowerCase() === 'login') {
                                screenNameText = '';
                            }

                            if (Boolean(activity.type) && activity.type.search('Sent a') !== -1) {
                                screenNameText = '';
                            }

                            let desc1 = '';
                            let desc2 = '';

                            let type = '';

                            if (Boolean(activity.description)) {
                                desc1 = t(activity.description.substr(0, activity.description.indexOf(' ')).toLowerCase());
                                desc2 = activity.description.substr(activity.description.indexOf(' ') + 1);
                            }

                            if (Boolean(activity.type)) {
                                type = activity.type.replace(' ', '_').toLowerCase();
                                if (screenName === 'at_material' && type.split(' ').length > 1) {
                                    type = type.split(' ')[0];
                                } else if (screenName === 'at_materials_details' && type.split('_')[0] === 'downloaded') {
                                    type = type.split('_')[0];
                                    screenNameText = t('at_material')
                                } else if (screenName === 'reports' && type.split('_')[0] === 'downloaded') {
                                    type = type.split('_')[0];
                                    screenNameText = t('report')
                                } else {
                                    type = activity.type.toLowerCase().split(' ').join('_');
                                }
                                if (type === 'viewed') {
                                    articles = '';
                                }
                                if (type === 'changed_input') {
                                    articles = ' ' + t('in') + ' ';
                                }
                                if (type === 'removed_share') {
                                    from = ' ' + t('from') + ' ';
                                }
                                if (screenName === 'at_material' && type === 'viewed_details') {
                                    articles = ' ' + t('at') + ' ';
                                }
                                if (type === 'downloaded' || (desc1 !== '' || desc2 !== '')) {
                                    articles = ' ' + t('a') + ' ';
                                }
                            }


                            let logFullText = t('you_' + type) + from.toLowerCase() + articles + desc1.toLowerCase() + ' ' + desc2 + ' ' + screenNameText;

                            return (
                                <li key={activity.id}><span className="activity_date">{activity.created_at}</span>
                                    <br/> {logFullText}
                                    <i
                                        onClick={e => this.activityDeleteHandler(activity.id)}
                                        className="fa fa-times grey-stroke"></i></li>
                            )
                        })
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    userLatestActivity: state.activity.latestActivity,
});

export default connect(mapStateToProps, {
    latestActivity,
    deleteActivity
})(withTranslation()(ActivityBlock));

