import React from 'react';

class TokenServices {
    saveToken(token) {
        return localStorage.setItem('atv2.token', token);
    }

    getToken() {
        return localStorage.getItem('atv2.token');
    }

    removeToken() {
        return localStorage.removeItem('atv2.token');
    }

    removeStorage() {
        return localStorage.clear();
    }
}

const TokenService = new TokenServices();

export default TokenService;
