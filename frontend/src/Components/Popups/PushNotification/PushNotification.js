import React, {Component} from 'react';
import './PushNotification.css';
import {connect} from 'react-redux';
import TokenService from "../../../Services/TokenServices";
import {withTranslation} from "react-i18next";

class PushNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications: []
        }
    }

    componentDidMount() {
        window.Echo.connector.options.auth.headers['Authorization'] = `Bearer ${TokenService.getToken()}`;
        const currentUserID = this.props.currentUserID;
        window.Echo.private(`notification.${currentUserID}`).listen('TemplateShared', (data) => {
            this.setTemplateSharedNotificationData(data);
        }).listen('TemplateUpdated', (data) => {
            this.setTemplateUpdateNotificationData(data);
        });
    }

    setTemplateSharedNotificationData(data) {
        const {t, i18n} = this.props;
        const lastName = data.user.last_name === undefined || data.user.last_name === null || data.user.last_name === '' ? '' : ' ' + data.user.last_name;
        const userFullName = data.user.first_name + lastName;

        let modelName = data.template[0].tool.name;

        if (i18n.language === 'en') {
            modelName = 'the ' + modelName + ' ';
        } else {
            modelName = modelName + '-';
        }

        this.setState({
            ...this.state,
            notifications: [...this.state.notifications, {
                id: this.state.notifications.length,
                message: userFullName + ' ' + t('has_shared') + ' ' + modelName + t('model_template') + ' "' + data.template[0].name + '" ' + t('with_you')
            }]
        })

        setTimeout(() => {
            this.setState({
                ...this.state,
                notifications: []
            })
        }, 5000);
    }

    setTemplateUpdateNotificationData(data) {
        const {t, i18n} = this.props;
        let lastName = !Boolean(data.updatedUser.last_name) ? '' : ' ' + data.updatedUser.last_name;
        let userFullName = data.updatedUser.first_name + lastName;

        let sharedUsers = [];
        let countUsers = 0;
        data.sharedUsers.map(user => {
            sharedUsers[countUsers] = user.user_id;
            countUsers++;
        })

        let messageLastPart = t('which_is_shared_with_you');

        // If template updates other user, then remove current auth user id from notifiable sharedUsers list
        if (Boolean(data.template.updated_by) && data.template.updated_by === this.props.currentUserID) {
            sharedUsers = sharedUsers.filter(id => id !== this.props.currentUserID);
        }

        // If template updates other users, then add template creator's user id in notifiable sharedUsers list
        if (Boolean(data.template.updated_by) && data.template.updated_by !== data.template.user_id && data.template.user_id === this.props.currentUserID) {
            sharedUsers[countUsers] = data.template.user_id;
            countUsers++;
            messageLastPart = t('which_is_created_by_you');
        }

        let modelName = '';

        let templateToolID = data.template.tool_id;

        if (Boolean(this.props.models)) {
            const resultedModel = this.props.models.find(model => model.id === templateToolID);
            modelName = resultedModel['name'];
        }

        if (modelName !== '') {
            if (i18n.language === 'en') {
                modelName = 'the ' + modelName + ' ';
            } else {
                modelName = modelName + '-';
            }
        }

        if (sharedUsers.includes(this.props.currentUserID)) {
            this.setState({
                ...this.state,
                notifications: [...this.state.notifications, {
                    id: this.state.notifications.length,
                    message: userFullName + ' ' + t('has_updated') + ' ' + modelName + t('model_template') + ' "' + data.template.name + '" ' + messageLastPart
                }]
            })

            setTimeout(() => {
                this.setState({
                    ...this.state,
                    notifications: []
                })
            }, 5000);
        }
    }

    closePushNotification(id) {
        this.setState({
            ...this.state,
            notifications: this.state.notifications.filter(notification => notification.id !== id)
        })
    }

    render() {

        const {t} = this.props;

        const notifyPopupClass = this.state.notifications.length === 0 ? 'hide' : '';

        return (
            <div id="at2_push_notification_popup" className={notifyPopupClass}>
                {
                    this.state.notifications.map(notification => {
                        return (
                            <div key={notification.id} id={notification.id} className="at2_push_notification">
                                <i onClick={e => this.closePushNotification(notification.id)}
                                   className="fa fa-times"></i>
                                <p>{notification.message}</p>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = state => (
    {
        popup: state.popup,
        currentUserID: state.auth.data.user.id,
        models: state.modelSettings.data,
    }
);

export default connect(mapStateToProps)(withTranslation()(PushNotification));
