import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { handleWindowResize, setCurrentRoute } from "../../Store/Actions/pageActions";
import AddButton from "../../Components/Inputs/AddButton";
import { connect } from "react-redux";

import NotificationPopup from "../../Components/Popups/NotificationPopup";

import { getAuthUser, checkRouteAccess } from "../../Store/Actions/authActions";
import NavService from "../../Services/NavServices";

import { fetchMaterialCategories, saveMaterialCategory, showCategoryDeleteConfirmPopup, updateMaterialCategory } from "../../Store/Actions/MaterialsActions";
import CategoryList from '../../Components/Material/CategoryList';
import CategoryAdd from '../../Components/Material/CategoryAdd';
import { withTranslation } from 'react-i18next';

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            error: "",
            showForm: false,
            editItemId: "",
            selectedItem: {},
            name: "",
            q: ""
        }

        this.onChnageName = this.onChnageName.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.confirm = this.confirm.bind(this);
        this.doSearch = this.doSearch.bind(this);
        this.editClickHandler = this.editClickHandler.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
    }

    async componentDidMount() {

        this.checkAuthAndRouteAccess();
        this.props.fetchMaterialCategories('category');

    }

    async checkAuthAndRouteAccess() {

        // check if have route access
        const currentRoute = this.props.location.pathname.split('/').pop();
        const action = this.props.auth.acl[currentRoute] !== undefined ? this.props.auth.acl[currentRoute].list : false;

        const currentUserRole = this.props.data.length === 0 || this.props.data.user.roles === undefined ? '' : this.props.data.user.roles[0].slug;

        if (currentUserRole !== 'super_admin')
            await this.props.checkRouteAccess(this.props.history, action, currentRoute);

        this.props.handleWindowResize();
        window.addEventListener('resize', () => {
            this.props.handleWindowResize()
        });
    }

    onChnageName(inputTarget) {
        const { name, value } = inputTarget;
        let error = "";

        if (!Boolean(value))
            error = "Please enter a name";

        const categoryExist = this.props.categories.filter(item => {
            return (item.name.toLowerCase() === value.trim().toLowerCase()) && (item.id !== this.state.editItemId)
        });

        if (categoryExist.length > 0)
            error = "Category already exist.";

        this.setState({ name: value, error: error });
    }

    createCategory(e) {
        e.preventDefault();

        const { name, editItemId } = this.state;
        const data = {
            name: name
        }
        if (Boolean(editItemId))
            data.id = editItemId

        if ('id' in data) {
            this.props.updateMaterialCategory(data).then(response => {

            }).catch(err => {
                console.log(err);
            });
        } else {
            this.props.saveMaterialCategory(data);
        }

        //update state

        this.setState({ name: "", editItemId: "" });
        this.cancelHandler();
    }

    deleteCategory(e, id) {
        e.preventDefault();

        this.props.deleteMaterialCategory(id).then(response => {

        }).catch(err => {
            console.log(err);
        });
    }

    editClickHandler(id) {
        const selectedItem = this.props.categories.find(item => item.id === id);
        this.setState({ editItemId: id, name: selectedItem.name })
    }

    updateCategory(id) {
        const selectedItem = this.props.categories.find(item => item.id === id);
        this.setState({ editItemId: id, name: selectedItem.name })
    }


    confirm(itemId) {
        this.props.showCategoryDeleteConfirmPopup(itemId);
    }

    addHandler() {
        this.setState({ showForm: true, name: "", error: "" });
    }

    cancelHandler() {
        this.setState({ showForm: false, editItemId: "", name: "", error: "" });
    }

    doSearch(inputTarget) {
        const { name, value } = inputTarget;
        this.setState({ q: value });
    }


    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';
        const currentRoute = this.props.location.pathname.split('/').pop();

        // set acl permission for user add
        const showCancelButton = this.state.showForm || this.state.editItemId;
        const { q } = this.state;
        const categories = this.props.categories.filter(item => {
            return item.name.toLowerCase().includes(q.toLowerCase());
        });


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
                                    title={t('all_materials_categories')}
                                    iconClass="user-icon" />
                                <div className="add_button_block">
                                    {showCancelButton && <AddButton
                                        name={t('cancel')}
                                        onClickHandler={this.cancelHandler.bind(this)} />}
                                    {!showCancelButton && <AddButton
                                        onClickHandler={this.addHandler.bind(this)}
                                        name={t('add_new')} />}
                                </div>
                            </div>
                            <NotificationPopup />
                            {this.state.showForm && <CategoryAdd t={t} stateParams={this.state} nameChangeHandler={this.onChnageName} createHandler={this.createCategory} />}
                            {this.state.editItemId && <p><CategoryAdd t={t} stateParams={this.state} nameChangeHandler={this.onChnageName} createHandler={this.createCategory} /></p>}
                            <CategoryList t={t} items={categories} confirmHandler={this.confirm} searchHandler={this.doSearch} editHandler={this.editClickHandler} />

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
    categories: state.materials.categories,
    data: state.auth.data,
    auth: state.auth
});

export default connect(mapStateToProps, {
    checkRouteAccess,
    handleWindowResize,
    setCurrentRoute,
    fetchMaterialCategories,
    saveMaterialCategory,
    showCategoryDeleteConfirmPopup,
    updateMaterialCategory
})(withTranslation()(Categories));
