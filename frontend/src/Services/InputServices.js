import React from 'react';

class InputServices {
    slug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.replace('%', ''); // trim %
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "åãàáäâẽèéëêìíïîðõòóöôùúüûñç·_,:;";
        var to = "aaaaaaeeeeeiiiioooooouuuunc-----";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '_') // collapse whitespace and replace by -
            .replace(/-+/g, '_') // collapse dashes
            .replace(/_+$/, '');


        return str;
    };

    validateEmail(email) {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(String(email).toLowerCase());
    }

    ucFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

}

const InputService = new InputServices();

export default InputService;
