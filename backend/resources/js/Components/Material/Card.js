import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { showMaterialDeleteConfirmPopup } from "../../Store/Actions/MaterialsActions";
const Card = (props) => {

    const { t } = props;

    const card = props.card;
    const default_image = Boolean(card.default_resource_url) ? card.default_resource_url : (card.all_resources?.images?.length) ? card.all_resources.images[0].thumbnail : '';

    //check permissions
    const currentRoute = props.page.currentRoute;

    const hasEditPermission = props.auth.acl[currentRoute] !== undefined ? props.auth.acl[currentRoute].update : false;
    const hasDeletePermission = props.auth.acl[currentRoute] !== undefined ? props.auth.acl[currentRoute].delete : false;

    function confirm(itemId) {
        props.showMaterialDeleteConfirmPopup(itemId);
    }

    const renderTags = () => {
        return card.tags.map((tag, index) => (
            <div className="badge badge-gray mr-1 my-1" key={index}>
                {tag.name}
            </div>
        ))
    };

    const isUnread = (id) => {
        console.log('props.materialNotifications=', props.materialNotifications);
        return props.materialNotifications.find(x => x.data.id == id);
    }

    return (
        <div className={isUnread(card.id) ? 'border border-primary card  h-100 ' : 'card  h-100 '}>
            <div className="card-body">
                <h3 className="card-title">

                    <Link className="title" to={`/admin/at_materials/${card.id}`}>
                        {card.title}
                    </Link>
                </h3>
                <div className="d-flex flex-column flex-md-row">
                    <div className="" style={{ maxWidth: '170px' }}>
                        <div className="mr-2">
                            <div>
                                {!default_image && <img className="p-1 rounded" style={{ maxWidth: '160px', maxHeight: '110px', 'border': '1px solid #ddd' }} src="https://via.placeholder.com/150x100" />}
                                {default_image && <img className="p-1 rounded" style={{ maxWidth: '160px', maxHeight: '110px', 'border': '1px solid #ddd' }} src={default_image} />}
                            </div>
                            <div className="d-flex w-100 align-items-center flex-wrap">
                                <Link className="card-link btn mr-2 mt-2" style={{ 'backgroundColor': '#102640', 'color': '#fff' }} to={`/admin/at_materials/${card.id}`}>
                                    {t('details')}
                                </Link>

                                {Boolean(card.is_free) && <span className="mt-2 badge badge-free p-1">{t('free')}</span>}
                                {!Boolean(card.is_free) && <span className="mt-2 badge badge-paid p-1">{t('paid')}</span>}

                            </div>

                            {/* Tag */}
                            {
                                card.tags && card.tags.length > 0 &&
                                <div className="d-flex flex-wrap align-items-center">
                                    {renderTags()}
                                </div>
                            }

                            <div className="action_buttons mt-2">

                                {hasDeletePermission && <button
                                    type="button"
                                    onClick={e => confirm(card.id)}
                                    className="btn btn-primary-outline at2-btn-no-bg">
                                    <img src="images/remove_icon.svg" />
                                </button>
                                }

                                {hasEditPermission && < button
                                    type="button"
                                    onClick={e => props.editHandler(card.id)}
                                    className="btn btn-primary-outline at2-btn-no-bg">
                                    <img src="images/edit_icon.svg" />
                                </button>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="">

                        <div className="d-flex flex-column align-items-start h-100">
                            <div className="card-text">{(!Boolean(card.excerpt) || card.excerpt == 'null') ? '' : card.excerpt}</div>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}

const mapStateToProps = state => ({
    page: state.page,
    navigation: state.navigation,
    auth: state.auth,
    materialNotifications: state.materials.notifications || []
});

export default connect(mapStateToProps, {
    showMaterialDeleteConfirmPopup,
})(Card);