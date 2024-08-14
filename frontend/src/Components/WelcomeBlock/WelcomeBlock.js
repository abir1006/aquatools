import React from 'react';
import './WelcomeBlock.css';
import { useTranslation, withTranslation } from 'react-i18next'

const WelcomeBlock = props => {

    const { t } = useTranslation();

    const blockTitle = props.title === null || props.title === undefined ? 'User!' : props.title + '!';
    const blockText = props.text === null || props.text === undefined ? 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.' : props.text;

    return (
        <div className="content-block welcome-block">
            <h1>{t('hello') + ' ' + blockTitle}</h1>
            <p>{t('welcome.text')}</p>
        </div>
    );
}

export default WelcomeBlock

