import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import AddButton from "../../Components/Inputs/AddButton";
import { connect } from "react-redux";

import './ATMaterials.css';
import NotificationPopup from "../../Components/Popups/NotificationPopup";
import NavService from "../../Services/NavServices";
import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";

import AddMaterialForm from "../../Components/Material/Add";
import EditMaterialForm from "../../Components/Material/Edit";
import ListMaterial from "../../Components/Material/List";
import Filters from "../../Components/Material/Filters";

import { getModelList } from "../../Store/Actions/ModelActions";
import CancelButton from '../../Components/Inputs/CancelButton';
import { withTranslation } from 'react-i18next';
import ActionButton from '../../Components/ActionButton/ActionButton';
import ReorderView from '../../Components/Material/ReorderView';
import { saveMaterialsOrder, fetchMaterials } from "../../Store/Actions/MaterialsActions";
import FeaturedMaterials from '../../Components/Material/FeaturedMaterials';
import ContentSpinner from '../../Components/Spinners/ContentSpinner';
import { showContentSpinner, hideContentSpinner } from "../../Store/Actions/spinnerActions";
import { showSuccessMessage } from "../../Store/Actions/popupActions";

class ATMaterials extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            editItemId: "",
            reorder: false,
            reorderedItems: []
        }

        this.editClickHandler = this.editClickHandler.bind(this);
    }

    async componentDidMount() {
        this.checkAuthAndRouteAccess();

        // store tools/models list to state
        if (this.props.models.length == 0) {
            this.props.getModelList();
        }

        //fetch featured materials
        await this.props.fetchMaterials(null, true, true);
        // fetch others materials
        await this.props.fetchMaterials();


    }

    async checkAuthAndRouteAccess() {
        await this.props.getAuthUser(this.props.history);
        // check if have route access
        const currentRoute = this.props.location.pathname.split('/').pop();
        const action = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].list : false;
        await this.props.checkRouteAccess(this.props.history, action, currentRoute);

        this.props.handleWindowResize();
        window.addEventListener('resize', () => {
            this.props.handleWindowResize()
        });
    }

    addHandler() {
        this.setState({ showForm: true, reorder: false });
    }

    async cancelHandler() {
        this.setState({ showForm: false, editItemId: "", reorder: false });
        this.props.showContentSpinner();
        await this.props.fetchMaterials();
        this.props.hideContentSpinner();
    }
    editClickHandler(id) {
        this.setState({ editItemId: id })
    }

    updateReorderedItems(items) {

        this.setState({ reorderedItems: items });
    }

    async reorderHandler() {
        const { reorder, reorderedItems } = this.state;
        this.setState({ reorder: !reorder })
        if (reorder) {
            this.props.showContentSpinner();
            await this.props.saveMaterialsOrder(reorderedItems);
            await this.props.fetchMaterials();
            await this.props.fetchMaterials(null, true, true);
            this.props.showSuccessMessage('Material successfully Reordered!');
            this.props.hideContentSpinner();


        } else {
            this.setState({ showForm: false, editItemId: "" });
        }
    }
    render() {
        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const showAddButton = !this.state.showForm;
        const showCancelButton = this.state.showForm || this.state.editItemId || this.state.reorder;

        //check permissions
        const currentRoute = this.props.location.pathname.split('/').pop();
        const hasAddPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].save : false;
        const hasEditPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].update : false;
        const hasDeletePermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].delete : false;
        const hasSearchPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].search : false;
        const hasReorderPermission = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].reorder : false;

        const { reorder } = this.state;

        return (
            <div className="row mt-3" id="users_page">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={t('at_materials')}
                                    iconClass="materials-icon" />
                                <div className="add_button_block">
                                    {showCancelButton && <CancelButton
                                        name={t("cancel")}
                                        onClickHandler={this.cancelHandler.bind(this)} />}
                                    {!showCancelButton && hasAddPermission && <AddButton
                                        onClickHandler={this.addHandler.bind(this)}
                                        name={t('add') + ' ' + t('new')} />}

                                    {hasReorderPermission && <ActionButton
                                        onClickHandler={this.reorderHandler.bind(this)}
                                        btnClass="ml-2">
                                        {reorder ? <i className="fa fa-check blue-stroke" aria-hidden="true"></i> : <i className="fa fa-refresh blue-stroke" aria-hidden="true"></i>}
                                        {reorder ? t('save') : t('reorder')}
                                    </ActionButton>
                                    }
                                </div>
                            </div>
                            <NotificationPopup />
                            {this.state.showForm && hasAddPermission && <AddMaterialForm t={t} history={this.props.history} />}
                            {this.state.editItemId && hasEditPermission && <EditMaterialForm t={t} itemId={this.state.editItemId} history={this.props.history} />}

                            {hasSearchPermission && !reorder && <div className="content-block-grey">
                                <Filters t={t} />
                            </div>
                            }
                            <div className="content-block">
                                <ContentSpinner />

                                {!reorder &&
                                    <>
                                        <FeaturedMaterials editHandler={this.editClickHandler} />
                                        <hr />
                                        <ListMaterial t={t} editHandler={this.editClickHandler} />
                                    </>
                                }

                                {hasReorderPermission && reorder && <ReorderView t={t} reorderedItemsHandler={this.updateReorderedItems.bind(this)} />}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
}


const mapStateToProps = state => ({
    page: state.page,
    navigation: state.navigation,
    auth: state.auth,
    models: state.modelSettings.data
});

export default connect(mapStateToProps, {
    getAuthUser,
    checkRouteAccess,
    getModelList,
    handleWindowResize,
    setCurrentRoute,
    saveMaterialsOrder,
    fetchMaterials,
    showContentSpinner,
    hideContentSpinner,
    showSuccessMessage

})(withTranslation()(ATMaterials));
