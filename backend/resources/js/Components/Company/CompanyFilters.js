import React, { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import ListAutoComplete from '../Inputs/ListAutoComplete/ListAutoComplete'
import { allCompanies } from "../../Store/Actions/companyActions";

const CompanyFilters = ({ t, filterHandler, filters, allCompanies, company }) => {

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        allCompanies().then(res => setCompanies(res.data.data));
        console.log('called');
    }, [company]);


    let companyList = [{ id: 0, name: 'All' }, ...companies.sort((a, b) => a.name.localeCompare(b.name))];

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
                listData={companyList} />
        </div>
    )
}


const mapStateToProps = state => ({
    company: state.company.data
});

export default connect(mapStateToProps, {
    allCompanies
})(withTranslation()(CompanyFilters));
