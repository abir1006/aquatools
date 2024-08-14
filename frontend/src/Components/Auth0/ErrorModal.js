import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react'
import {withTranslation} from "react-i18next";

const ErrorModal = ({ error, t }) => {

    const { loginWithRedirect, logout } = useAuth0();

    const [modalState, setModalState] = useState(false);

    useEffect(() => {
        setModalState(true);
    }, [])

    const close = (e) => {
        setModalState(!modalState);
    }

    return (
        <div>
            <div className={"modal fade" + (modalState ? " show d-block" : " d-none")} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <br />
                            <p style={{color:'red'}}>{t(error?.error_description)}</p>

                        </div>
                        {/*<div className="modal-footer">*/}
                        {/*    <button type="button" className="btn btn-primary default-btn-atv2"*/}
                        {/*        onClick={e => {*/}
                        {/*            logout();*/}
                        {/*            loginWithRedirect({ prompt: 'login' })*/}
                        {/*        }*/}
                        {/*        }*/}
                        {/*    >Ok</button>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default (withTranslation()(ErrorModal))
