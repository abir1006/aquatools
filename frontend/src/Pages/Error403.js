import React from 'react'
import {useSelector} from "react-redux";
import BlankNavigation from "../Components/MainNavigation/BlankNavigation";
import {withTranslation} from "react-i18next";

const Error403 = ({loadedUser, errorText='', t}) => {
    const navigation = useSelector(state => state.navigation);
    const navColClass = navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
    const contentClass = navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
    return (
        <div className="container-fluid h-100">
            <div className="row mt-3">
                <div className={navColClass} id="sidebar">
                    <BlankNavigation t={t} loadedUser={loadedUser} />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-md-12">
                            <div
                                className="text-center"
                                style={{height: 'calc(100vh - 30px)', lineHeight: 'calc(100vh - 30px)'}}>
                                <p style={{fontSize: 20}}>{t(errorText)}</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default (withTranslation()(Error403))
