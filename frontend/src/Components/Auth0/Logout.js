import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Loader from "../Loader";

const Logout = () => {

    const { logout } = useAuth0();

    useEffect(() => {
        logout({returnTo: window.location.origin})
    }, [])

    return <Loader />
};

export default Logout;