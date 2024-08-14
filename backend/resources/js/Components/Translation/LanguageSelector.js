import React, { useEffect, useState } from 'react'

import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { setSelectedLang } from "../../Store/Actions/TranslationsActions";

const LanguageSelector = (props) => {
    const [loaded, setloaded] = useState(false);
    const { t, i18n } = useTranslation();
    let { languages, selectedLang, siteSettings } = props;


    const changeLanguage = (event) => {
        const code = event.target.dataset.code;
        props.setSelectedLang(code);
        i18n.changeLanguage(code);
        addLanguageClassToApp(i18n.language);
    }

    const addLanguageClassToApp = (lang) => {
        document.getElementById('app').className = lang;
    }

    const setModelsLang = () => {
        //set model wise language
        const pathParts = window.location.pathname.split('/');
        const currentUri = pathParts.pop();
        const models = [
            'genetics',
            'optimalisering',
            'cost_of_disease',
            'vaksinering',
            'mtb',
            'kn_for',
            'harvest'
        ];

        if (models.includes(currentUri)) {
            const langKey = 'translation_language_model_' + currentUri;
            const modelLang = (typeof siteSettings[langKey] != 'undefined' && siteSettings[langKey] != 'inherit') ? siteSettings[langKey] : (i18n.language || siteSettings.translation_default_lang);

            if (selectedLang !== modelLang) {
                i18n.changeLanguage(modelLang, (err, t) => {
                    addLanguageClassToApp(modelLang);
                    // load all resources
                    i18n.reloadResources();
                });
            }
        }
    }

    if (selectedLang && !loaded) {

        setloaded(true);
        i18n.changeLanguage(selectedLang, (err, t) => {
            addLanguageClassToApp(selectedLang);
        });

        setModelsLang();
    }

    //hide langage switcher
    if (Boolean(parseInt(props.hideLanguageSwitcher)))
        return '';

    return (
        <div className={'languages my-2 ' + props.class}>
            {
                languages.map((x, i) => {
                    const url = '/images/' + x.code + '.png';
                    return (
                        <img
                            key={'language_' + i}
                            style={{ cursor: 'pointer' }}
                            className={'ml-2' + (x.code == selectedLang ? ' border border-white' : '')}
                            onClick={changeLanguage}
                            src={url}
                            alt={x.name}
                            data-code={x.code}
                        />
                    )
                })
            }

        </div>
    )
}

const mapStateToProps = state => ({
    selectedLang: state.translations.selectedLang,
    languages: state.translations.languages,
    hideLanguageSwitcher: state.siteSettings.settings?.translation_hide_language_switcher,
    siteSettings: state.siteSettings.settings
})

export default connect(mapStateToProps, {
    setSelectedLang
})(LanguageSelector);