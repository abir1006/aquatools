import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchMaterialCategories, performSearch } from "../../Store/Actions/MaterialsActions";
import CheckBox from '../Inputs/CheckBox';
import DropdownList from '../Inputs/DropdownList/DropdownList';
import InputText from '../Inputs/InputText';
import ListAutoComplete from '../Inputs/ListAutoComplete/ListAutoComplete';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            category: 'all',
            is_paid: true,
            is_free: true,
            model: "",
            q: ""
        }

    }

    async componentDidMount() {
        this.props.fetchMaterialCategories();
    }

    componentDidUpdate(prevProps, prevState) {

        //perform search if any field updated
        if (prevState !== this.state)
            this.props.performSearch(this.state);
    }

    modelChangeHandler(name, id) {

        this.setState({ model: id });
    }

    categoryChangeHandler(name, id) {

        this.setState({ category: id });
    }

    paidChangeHandler(value) {

        this.setState({ is_paid: value });
    }

    freeChangeHandler(value) {

        this.setState({ is_free: value });
    }

    searchChangeHandler(inputTarget) {

        const { name, value } = inputTarget;
        this.setState({ q: value })
    }

    render() {

        const { t } = this.props;

        const categories = this.props.categories.map((item, i) => {
            return {
                id: item.id,
                name: item.name
            }
        });


        const permittedModels = [];

        this.props.permittedModels.forEach(slug => {
            const item = this.props.models.find(x => x.slug == slug);

            if (item?.id)
                permittedModels.push({ id: item?.id, name: item?.name });

        });

        permittedModels.unshift({ id: "", name: t('all') })


        categories.unshift({ id: 'all', name: t('all') });
        const selectedCategory = this.state.category;
        const selectedModel = this.state.model;

        return (
            <div className="row materials_filters justify-content-between">
                <div className="col-md-8">

                    <div className="row">
                        <div className="col-md-5">
                            <div className="row no-gutters">

                                <div className="col-md-4 align-self-center">{t('material_type')}</div>
                                <div className="col-md-7">
                                    <ListAutoComplete
                                        fullSearch={true}
                                        fieldName="category_id"
                                        fieldPlaceHolder={t('filter_category')}
                                        fieldOnClick={this.categoryChangeHandler.bind(this)}
                                        selectedItemId={selectedCategory}
                                        listData={categories} />

                                </div>


                            </div>
                        </div>


                        <div className="col-md-7">
                            <div className="d-flex justify-content-between">

                                <div>
                                    <CheckBox
                                        checkUncheckHandler={e => this.paidChangeHandler(e)}
                                        fieldValue={this.state.is_paid}
                                        fieldName="is_paid"
                                        text={t('paid')} />
                                </div>
                                <div>
                                    <CheckBox
                                        checkUncheckHandler={e => this.freeChangeHandler(e)}
                                        fieldValue={this.state.is_free}
                                        fieldName="is_free"
                                        text={t('free')} />
                                </div>

                                <div>
                                    <ListAutoComplete
                                        fullSearch={true}
                                        fieldName="mdoel_id"
                                        fieldPlaceHolder={t('model')}
                                        fieldOnClick={this.modelChangeHandler.bind(this)}
                                        selectedItemId={selectedModel}
                                        listData={permittedModels} />

                                </div>

                            </div>
                        </div>

                    </div>


                </div>


                <div className="col-md-4">
                    <InputText
                        fieldName="q"
                        fieldClass="company_search"
                        fieldID="q"
                        fieldPlaceholder={t('search_materials')}
                        fieldValue={this.state.q}
                        fieldOnChange={this.searchChangeHandler.bind(this)} />
                </div>



            </div>
        )
    }
}


const mapStateToProps = state => ({
    categories: state.materials.categories,
    permittedModels: state.auth.permittedModels,
    models: state.modelSettings.data
});

export default connect(mapStateToProps, {
    fetchMaterialCategories,
    performSearch
})(Filters);
