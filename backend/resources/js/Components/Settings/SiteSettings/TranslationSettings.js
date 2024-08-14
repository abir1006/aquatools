import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import CheckBox from '../../Inputs/CheckBox';
import SaveButton from '../../Inputs/SaveButton';
import { saveTranslationSettings } from '../../../Store/Actions/SiteSettingsActions';
import { withTranslation } from 'react-i18next';

const TranslationSettings = (props) => {

    const { t, siteSettings } = props;
    const modelKeyNamePrefix = 'translation_language_model_';
    const models = [
        'genetics',
        'optimalisering',
        'cost_of_disease',
        'vaksinering',
        'mtb',
        'kn_for',
        'harvest'
    ];

    const defaultLangState = siteSettings?.translation_default_lang || 'no';
    const defaultIsHideState = Boolean(parseInt(siteSettings?.translation_hide_language_switcher));

    const [defaultLang, setDefaultLang] = useState(defaultLangState);
    const [modelsLang, setModelsLang] = useState({});
    const [isLangSwitcherHide, setIsLangSwitcherHide] = useState(defaultIsHideState);
    const [submitting, setSubmitting] = useState(false);


    useEffect(() => {
        setDefaultLang(defaultLangState);
        setIsLangSwitcherHide(defaultIsHideState);
        setModelDefaultLanguages();
    }, [props.siteSettings])

    const setModelDefaultLanguages = () => {
        const modelsDefauleLangs = {};
        models.forEach(x => {
            const TmpKeyName = modelKeyNamePrefix + x;
            if (typeof siteSettings[TmpKeyName] !== 'undefined')
                modelsDefauleLangs[TmpKeyName] = siteSettings[TmpKeyName];
        });
        setModelsLang(modelsDefauleLangs);
    }

    const setModelLang = (e) => {
        const { name, value } = e.target;
        modelsLang[name] = value;
        setModelsLang(modelsLang);
    }

    const saveSettings = () => {

        setSubmitting(true);
        const data = {
            translation_default_lang: defaultLang,
            translation_hide_language_switcher: isLangSwitcherHide
        }

        Object.keys(modelsLang).forEach(x => data[x] = modelsLang[x]);

        props.saveTranslationSettings(data).then(res => setSubmitting(false));
    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="tab_heading">
                        <h2>{t('translation_settings')}</h2>
                        <hr />
                    </div>
                </div>
            </div>
            <div className="ml-3">

                <div className="row">

                    <div className="col-md-3">{t('default_language')}</div>
                    <div className="col-md-1">:</div>
                    <div className="col-md-7">
                        {
                            props.languages.map((x, i) => {

                                return (
                                    <div className="form-check-inline" key={i}>
                                        <label className="form-check-label" htmlFor={"radio" + i}>
                                            <input
                                                id={"radio" + i}
                                                type="radio"
                                                className="form-check-input"
                                                name="translation_default_lang"
                                                value={x.code}
                                                onChange={e => setDefaultLang(x.code)}
                                                checked={x.code == defaultLang}
                                            />
                                            {x.name}
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>

                </div>
                <br />

                {
                    models.map(x => {

                        return (
                            <div className="row" >
                                <div className="col-md-3">{t('language_for_' + x)}</div>
                                <div className="col-md-1">:</div>
                                <div className="col-md-7">
                                    <select
                                        name={modelKeyNamePrefix + x}
                                        onChange={e => setModelLang(e)}
                                        className="form-control col-4"

                                    >
                                        <option value="inherit">Inherit</option>
                                        {
                                            props.languages.map((y, i) => <option selected={modelsLang[modelKeyNamePrefix + x] == y.code} value={y.code}>{y.name}</option>)

                                        }
                                    </select>
                                </div>
                            </div>
                        )
                    })
                }

                <br />
                <div className="row">
                    <div className="col-md-3">{t('hide_language_switcher')}</div>
                    <div className="col-md-1">:</div>
                    <div className="col-md-7">
                        <CheckBox
                            checkUncheckHandler={(value, name) => { setIsLangSwitcherHide(!isLangSwitcherHide) }}
                            fieldName="translation_hide_language_switcher"
                            fieldValue={isLangSwitcherHide}
                            text=""
                        />
                    </div>
                </div>


                <br />
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-1"></div>
                    <div className="col-md-7">
                        <SaveButton
                            onClickHandler={saveSettings}
                            name={t('save')}
                            buttonDisabled={submitting}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

const mapStateToProps = state => ({
    languages: state.translations.languages,
    siteSettings: state.siteSettings.settings || {}
})


export default connect(mapStateToProps, {
    saveTranslationSettings
})(withTranslation()(TranslationSettings));
