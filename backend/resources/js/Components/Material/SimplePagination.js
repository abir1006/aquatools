import React from 'react'
import { withTranslation } from 'react-i18next';

const SimplePagination = (props) => {

    const { totalPages, pageNo, handlePrev, handleNext, gotoPageHandler, t } = props;

    const prevDisable = pageNo <= 1 ? 'disabled' : '';
    const nextDisable = pageNo >= totalPages ? 'disabled' : '';

    const links = [];
    for (let i = 1; i <= totalPages; i++) {
        links.push(
            <li className={"page-item " + (pageNo == i ? 'active' : '')}>
                <a onClick={e => gotoPageHandler(e, i)} class="page-link" href="#">{i}</a>
            </li>
        );
    }
    return (
        <>

            <nav aria-label="Page navigation example">
                <ul class="pagination pagination-sm">
                    <li class="page-item">
                        <a onClick={e => gotoPageHandler(e, 1)} class="page-link" href="#" title="First">
                            <span aria-hidden="true">«</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a class="page-link" onClick={handlePrev} href="#" title="Previous">
                            <span aria-hidden="true">&lt;</span>
                        </a>
                    </li>
                    {links}
                    <li class="page-item">
                        <a onClick={handleNext} class="page-link" href="#" title="Next">
                            <span aria-hidden="true">&gt;</span>
                        </a>
                    </li>
                    <li class="page-item">
                        <a onClick={e => gotoPageHandler(e, totalPages)} class="page-link" href="#" title="Last">
                            <span aria-hidden="true">»</span>
                        </a>
                    </li>
                </ul>
            </nav>

        </>
    )
}

export default withTranslation()(SimplePagination)
