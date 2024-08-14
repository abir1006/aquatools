import React from 'react';

class NavServices {
    getCurrentRoute(){
        const routeName = window.location.pathname.split('/');
        return routeName.pop();
    }
}

const NavService = new NavServices();

export default NavService;
