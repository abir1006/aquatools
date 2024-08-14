import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import ListAutoComplete from '../Inputs/ListAutoComplete/ListAutoComplete'
import {
    companyList
} from "../../Store/Actions/companyActions";

const UserFilters = ({ t, companies, filterHandler, filters, companyList }) => {

    useEffect(() => {
        if (!Array.isArray(companies)) {
            companyList();
        }
    }, [])

    let companyListData = companies.length > 0 ? [{ id: 0, name: 'All' }, ...companies.sort((a, b) => a.name.localeCompare(b.name))] : [];

    const companyChangeHandler = (name, value) => {
        filterHandler({ company: value });
    }
    return (
        <div>
            <ListAutoComplete
                disableListLocalState={!Boolean(filters.company)}
                fullSearch={true}
                fieldId="filter_company"
                fieldName="filter_company"
                fieldPlaceHolder={t('filter_by_company')}
                fieldOnClick={companyChangeHandler}
                listData={companyListData} />
        </div>
    )
}


const mapStateToProps = state => ({
    companies: state.company.data || [],
});

export default connect(mapStateToProps, {
    companyList
})(withTranslation()(UserFilters));
