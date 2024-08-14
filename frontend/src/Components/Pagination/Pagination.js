import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Pagination.css';

class Pagination extends Component {

    constructor(props) {
        super(props);
    }

    pageClickHandler(e, pageNumber) {
        e.preventDefault();
        this.props.paginationLinkHandler(pageNumber);
        return false;
    }

    prevClickHandler(e, currentPage) {
        e.preventDefault();
        if (currentPage === 1) {
            return false;
        }
        this.props.paginationLinkHandler(currentPage - 1);
        return false;
    }

    firstLastClickHandler(e, pageNo) {
        e.preventDefault();
        this.props.paginationLinkHandler(pageNo);
        return false;
    }

    nextClickHandler(e, currentPage) {
        e.preventDefault();
        if (currentPage === this.props.totalPage) {
            return false;
        }
        this.props.paginationLinkHandler(currentPage + 1);
        return false;
    }

    noClickHandler(e) {
        e.preventDefault();
        return false;
    }

    render() {
        const totalPage = this.props.totalPage;
        const currentPage = this.props.currentPage;

        if (totalPage <= 1) {
            return null;
        }

        const Links = [];

        // Pagination
        // Three links will show in first, middle and last if available
        // Three padding links will show from current page
        // Pagination advance rules will apply if total pages are above of 15 pages

        let paginationRules = [];
        let rulesKey = 0;
        let middlePage = Math.round(totalPage / 2);
        for (let n = 1; n <= totalPage; n++) {
            if (totalPage > 15) {
                if (n < 4) {
                    paginationRules[rulesKey] = n;
                    rulesKey++;
                } else if (n >= currentPage - 3 && n <= currentPage + 3) {
                    paginationRules[rulesKey] = n;
                    rulesKey++;
                } else if (n >= middlePage - 1 && n <= middlePage + 1) {
                    paginationRules[rulesKey] = n;
                    rulesKey++;
                } else if (n > totalPage - 3) {
                    paginationRules[rulesKey] = n;
                    rulesKey++;
                }
            } else {
                paginationRules[rulesKey] = n;
                rulesKey++;
            }
        }

        let serialNo = 0;

        paginationRules.forEach((page, k) => {
            serialNo++;
            const liClassName = page === currentPage ? 'page-item active' : 'page-item';
            const link = <li className={liClassName} key={page}><a onClick={e => this.pageClickHandler(e, page)}
                                                                   className="page-link" href="#">{page}</a></li>;
            const blankLink = <li className="page-item"><a onClick={e => this.noClickHandler(e)} className="page-link"
                                                           href="#">...</a></li>
            if (page !== serialNo) {
                Links.push(blankLink);
                serialNo = page;
            }
            Links.push(link)

        })

        return (
            <nav aria-label="Page navigation example">
                <ul className="pagination pagination-sm">
                    <li className="page-item">
                        <a
                            onClick={e => this.firstLastClickHandler(e, 1)}
                            className="page-link"
                            href="#"
                            title="First">
                            <span aria-hidden="true">&laquo;</span>
                            <span className="sr-only">First</span>
                        </a>
                    </li>
                    <li className="page-item">
                        <a
                            onClick={e => this.prevClickHandler(e, currentPage)}
                            className="page-link" href="#" title="Previous">
                            <span aria-hidden="true">&lt;</span>
                            <span className="sr-only">Prev</span>
                        </a>
                    </li>
                    {Links}
                    <li className="page-item">
                        <a
                            onClick={e => this.nextClickHandler(e, currentPage)}
                            className="page-link" href="#" title="Next">
                            <span aria-hidden="true">&gt;</span>
                            <span className="sr-only">Next</span>
                        </a>
                    </li>
                    <li className="page-item">
                        <a
                            onClick={e => this.firstLastClickHandler(e, totalPage)}
                            className="page-link" href="#" title="Last">
                            <span aria-hidden="true">&raquo;</span>
                            <span className="sr-only">Last</span>
                        </a>
                    </li>
                </ul>
            </nav>
        )
    }
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(Pagination)
