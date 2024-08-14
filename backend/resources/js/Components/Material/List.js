import React, { Component } from 'react';
import { connect } from "react-redux";
import DateTimeService from "../../Services/DateTimeServices";
import Pagination from "../Pagination/Pagination";
import ContentSpinner from "../Spinners/ContentSpinner";
import { fetchMaterials, fetchMaterialCategories } from "../../Store/Actions/MaterialsActions";
import InputText from "../Inputs/InputText";
import Card from "./Card";
import FeaturedMaterials from './FeaturedMaterials';

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            featuredMaterials: []
        }
    }

    confirm(itemId) {
        this.props.showMaterialDeleteConfirmPopup(itemId);
    }

    paginationChangeHandler(pageNumber) {
        this.props.fetchMaterials(pageNumber);
    }

    render() {

        const { t } = this.props;

        //others materials
        const cards = [];
        this.props.materials.forEach((item, i) => {

            cards.push(

                <div key={i} className="col mb-4">
                    <Card t={t} card={item} editHandler={this.props.editHandler} />
                </div>

            );

        });

        const totalPage = Math.ceil(this.props.paginationData.totalRecord / this.props.paginationData.perPage);
        const currentPage = this.props.paginationData.currentPage;


        return (

            <>

                {

                    this.props.materials.length != 0 &&

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                        {cards}
                    </div>
                }
                {
                    this.props.materials.length != 0 &&

                    <Pagination
                        totalPage={totalPage}
                        currentPage={currentPage}
                        paginationLinkHandler={this.paginationChangeHandler.bind(this)} />
                }

                {
                    this.props.materials.length == 0 &&
                    <div className="row">
                        <div className="text-center col">{t('no_data_found')}</div>
                    </div>
                }



            </>
        )
    }
}


const mapStateToProps = state => ({
    materials: state.materials.materials || [],
    categories: state.materials.categories,
    paginationData: state.materials.paginationData
});

export default connect(mapStateToProps, {
    fetchMaterials,
    fetchMaterialCategories
})(List);
