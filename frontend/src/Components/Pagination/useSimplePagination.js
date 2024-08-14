import React, { useEffect, useState } from 'react'

const useSimplePagination = (items, defaultPerpage = 10) => {


    const [page, setpage] = useState(1);
    const [perPage, setperPage] = useState(defaultPerpage);

    let paginatedItems;
    const paginate = (array, page_size, page_number) => array.slice((page_number - 1) * page_size, page_number * page_size);;
    paginatedItems = paginate(items, perPage, page) || [];
    const totalPages = Math.ceil(items.length / perPage);


    return { page, setpage, paginatedItems, totalPages, perPage }

}

export default useSimplePagination
