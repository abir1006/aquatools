import React, { useState } from 'react'
import InputText from '../Inputs/InputText'
import useSimplePagination from '../Pagination/useSimplePagination';
import SimplePagination from './SimplePagination';

const TagList = (props) => {

    const { t } = props;
    const allItems = props.items;
    const { page, setpage, paginatedItems, totalPages, perPage } = useSimplePagination(allItems);

    const handlePrev = (e) => {
        e.preventDefault();
        page > 1 && setpage(page - 1);
    };
    const handleNext = (e) => {
        e.preventDefault();
        page < totalPages && setpage(page + 1);
    };

    const gotoPage = (e, page) => {
        e.preventDefault();
        setpage(page);
    };

    return (
        <div>
            <div className="content-block">
                <div className="col- col-xl-5 p-0" id="search_users">
                    <div className="content-block-grey p-1">
                        <InputText
                            fieldName="catSearch"
                            fieldClass="cat_search"
                            fieldID="cat_search"
                            fieldPlaceholder={t('search')}
                            fieldOnChange={props.searchHandler}
                        />
                    </div>
                </div>
                <div className="table-responsive text-nowrap">
                    {paginatedItems.length > 0 &&
                        <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">{t('id')}</th>
                                    <th className="sortable" scope="col">{t('name')}</th>

                                    <th scope="col">{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    paginatedItems.map((item, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>
                                                    <button
                                                        title={t('edit') + ' ' + t('category')}
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => props.editHandler(item.id)}
                                                    >
                                                        <img src="images/edit_icon.svg" />
                                                    </button>
                                                    <button
                                                        title={t('delete') + ' ' + t('category')}
                                                        type="button"
                                                        onClick={e => props.confirmHandler(item.id)}
                                                        className="btn btn-primary-outline at2-btn-no-bg">
                                                        <img src="images/remove_icon.svg" />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    }
                    {
                        paginatedItems.length == 0 &&

                        <div className="text-center ">{t('no_data_found')}</div>

                    }


                </div>
                <div className="d-flex justify-content-center align-items-center">
                    {/* {<span className="mr-3"> {t('total_items')} : {allItems.length}</span>} */}
                    {totalPages > 1 && <SimplePagination totalPages={totalPages} pageNo={page} gotoPageHandler={gotoPage} handleNext={handleNext} handlePrev={handlePrev} />}
                </div>
            </div>

        </div>
    )
}

export default TagList
