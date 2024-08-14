import React from 'react';
import './PageTitle.css';
import CompanyIcon from '../MainNavigation/Images/menu_company_icon.svg';
import SettingsIcon from '../MainNavigation/Images/menu_settings_icon.svg';
import UserIcon from '../MainNavigation/Images/menu_user_icon.svg';
import TemplateIcon from '../MainNavigation/Images/menu_template_icon.svg';
import ReportIcon from '../MainNavigation/Images/menu_report_icon.svg';
import MaterialIcon from '../MainNavigation/Images/menu_materials_icon.svg';

const PageTitle = props => {
    if (props.title === null) {
        return null;
    }

    const capitalizedFirstLetter = inputString => inputString.charAt(0).toUpperCase() + inputString.slice(1);

    const pageTitle = capitalizedFirstLetter(props.title);

    let TitleIconImage = null;

    if (props.iconClass === 'company-icon') {
        TitleIconImage = <img className="title-block-icon" src={CompanyIcon} alt="Title Icon" />;
    }

    if (props.iconClass === 'settings-icon') {
        TitleIconImage = <img className="title-block-icon" src={SettingsIcon} alt="Title Icon" />;
    }

    if (props.iconClass === 'user-icon') {
        TitleIconImage = <img className="title-block-icon" src={UserIcon} alt="Title Icon" />;
    }

    if (props.iconClass === 'template-icon') {
        TitleIconImage = <img className="title-block-icon" src={TemplateIcon} alt="Title Icon" />;
    }

    if (props.iconClass === 'report-icon') {
        TitleIconImage = <img className="title-block-icon" src={ReportIcon} alt="Title Icon" />;
    }

    if (props.iconClass === 'materials-icon') {
        TitleIconImage = <img className="title-block-icon" src={MaterialIcon} alt="AT Materials" />;
    }

    return (
        <div className="page-heading-text">
            <h1>{TitleIconImage}{pageTitle}</h1>
        </div>
    );
}

export default PageTitle;

