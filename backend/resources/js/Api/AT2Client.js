import axios from 'axios'
import TokenService from '../Services/TokenServices';
import store from '../Store/index';

// configuration
const AT2Client = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    data: { lang: 'en' }
})
store.subscribe(listener)
function listener() {
    AT2Client.defaults.headers.common['lang'] = store.getState().translations.selectedLang;
    AT2Client.defaults.headers.common['Authorization'] = `Bearer ${TokenService.getToken()}`;
}

const addToken = (token) => {
    console.log(token);
}

export default AT2Client