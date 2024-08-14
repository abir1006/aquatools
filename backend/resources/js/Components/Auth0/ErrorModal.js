import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react'

const ErrorModal = ({ error }) => {

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
                            <div className="d-flex justify-content-center">
                                <i class="fa fa-times-circle-o fa-4x text-danger" aria-hidden="true"></i>
                            </div>
                            <br />
                            <p>{error?.error_description}</p>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary"
                                onClick={e => {
                                    logout();
                                    loginWithRedirect({ prompt: 'login' })
                                }
                                }
                            >Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorModal
