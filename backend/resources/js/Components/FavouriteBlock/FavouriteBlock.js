import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './FavouriteBlock.css';

import adminNavigationsObj from "../MainNavigation/MainMenus";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showInfoPopup } from '../../Store/Actions/popupActions';
import { getModelList, getModelDetails } from '../../Store/Actions/ModelActions';

const FavouriteBlock = props => {

    const { t } = useTranslation();
    const [loading, setLoading] = useState('');

    const onClickHandler = e => {
        e.preventDefault();
    };

    const viewHelpTextHandler = async (e, slug) => {
        setLoading(slug);
        const model = await props.getModelDetails(slug);
        const helpText = model?.data?.details;
        const text = Boolean(helpText) ? helpText : '<center>' + t('no_information_found') + '</center>';
        props.popupHandler(e, text);
        setLoading('');
    }

    useEffect(() => {
        if (props.models.length == 0)
            props.getModelList();
    }, [])

    let countMenu = 0;

    const modelSubMenus = adminNavigationsObj.tools.subMenus;

    const currentUserRole = props.data.length === 0 || props.data.user.roles === undefined ? '' : props.data.user.roles[0].slug;
    const permittedModels = props.permittedModels;

    return (
        <div className="content-block favourite-block">
            <ul>
                <span className="block-name">{t('models')}</span>
                {
                    Object.keys(modelSubMenus).map(index => {
                        countMenu++;
                        // check if user not super admin and have model permission
                        // if (currentUserRole !== 'super_admin' && permittedModels !== undefined && permittedModels.indexOf(index) === -1) {
                        //     return null;
                        // }

                        const hasPermission = Boolean(permittedModels) && permittedModels.indexOf(index) !== -1;
                        const helpText = props.models.find(x => x.slug === index)?.details;


                        return (
                            <li key={countMenu} className={Boolean(hasPermission) ? 'active' : 'inactive'}>

                                {hasPermission && <Link to={modelSubMenus[index].link}>
                                    <div>
                                        {t(modelSubMenus[index].name)}
                                        <span className="d-block status"> {t('active')} </span>
                                    </div>


                                    <i className="fa fa-arrow-right" aria-hidden="true"></i>
                                </Link>
                                }

                                {!hasPermission && <div>

                                    {t(modelSubMenus[index].name)}

                                    <button onClick={e => viewHelpTextHandler(e, index)} type="button" id="model-mtb-info" className="btn btn-primary-outline at2-btn-no-bg at2-info-icon-btn">
                                        {(loading !== index) && 'i'}
                                        {loading == index && <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />}
                                    </button>
                                </div>
                                }

                            </li>)
                    })
                }
            </ul>



        </div>
    );
}

const mapStateToProps = state => ({
    permittedModels: state.auth.permittedModels,
    data: state.auth.data,
    popup: state.popup,
    models: state.modelSettings.data || []
});

export default connect(mapStateToProps, {
    showInfoPopup,
    getModelList,
    getModelDetails
})(FavouriteBlock);

