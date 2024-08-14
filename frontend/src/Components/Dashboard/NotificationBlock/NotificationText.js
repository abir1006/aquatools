import React from 'react';

const NotificationText = props => {

    const {t, i18n} = props;
    const firstName = props.notification.data.user.first_name;
    const lastName = Boolean(props.notification.data.user.last_name) ? ' ' + props.notification.data.user.last_name : '';
    const userName = firstName + lastName;
    const eventType = props.notification.type;
    const itemName = props.notification.data.name;
    const updated_by = props.notification.data.updated_by;
    const created_by = props.notification.data.created_by;
    const at2Models = {
        'Genetics': t('model_genetics'),
        'MTB': t('model_mtb'),
        'Optimization': t('model_optimization'),
        'Vaccination': t('model_vaccination'),
        'Cost of Disease': t('model_cod'),
        'Feed C/B': t('model_feed'),
        'Harvest': t('model_harvest')
    }
    let modelName = Boolean(props.notification.data.model_name) ? at2Models[props.notification.data.model_name] : '';
    if (i18n.language === 'en') {
        modelName = 'the ' + modelName + ' '
    } else {
        modelName = modelName + '-';
    }
    let text = '';

    // Template shared
    if (eventType === 'App\\Notifications\\NotifyUsersForTemplateShared') {
        text = userName + ' ' + t('has_shared') + ' ' + modelName + t('model_template').toLowerCase() + ' "' + itemName + '" ' + t('with_you');
    }

    // Template update
    if (eventType === 'App\\Notifications\\NotifyUsersForTemplateUpdate') {
        let messageLastPart = t('which_is_shared_with_you');
        const userID = props?.auth?.data?.user?.id || false
        if (Boolean(userID) && updated_by !== created_by && created_by === props?.auth?.data?.user?.id) {
            messageLastPart = t('which_is_created_by_you');
        }
        text = userName + ' ' + t('has_updated') + ' ' + modelName + t('model_template').toLowerCase() + ' "' + itemName + '" ' + messageLastPart;
    }


    return text;
}

export default NotificationText;

