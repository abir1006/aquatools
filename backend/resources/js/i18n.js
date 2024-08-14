import i18n from 'i18next'
import Backend from 'i18next-xhr-backend'
import { initReactI18next } from 'react-i18next'

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        backend: {
            /* translation file path */
            loadPath: '/api/translations/fetch/{{lng}}'
        },
        fallbackLng: 'no',
        debug: false,
        /* can have multiple namespace, in case you want to divide a huge translation into smaller pieces and load them on demand */
        ns: ['translations'],
        defaultNS: 'translations',
        keySeparator: false,
        interpolation: {
            escapeValue: false,
            formatSeparator: ','
        },
        react: {
            wait: true
        }
    },
        (err, t) => {
            if (err) return console.log('something went wrong loading', err);
        }
    )

i18n.on('loaded', function (loaded) {
    // const data = i18n.getDataByLanguage('no');
    // console.log('loaded===>', data);
});
i18n.on('failedLoading', function (lng, ns, msg) {
    const data = i18n.getDataByLanguage('no');
    if (typeof data === 'undefined') {
        window.location.reload();
    }
})

export default i18n
