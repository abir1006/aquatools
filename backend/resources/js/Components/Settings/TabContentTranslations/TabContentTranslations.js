import React, { Component } from 'react';
import '../Settings.css';
import TabHeading from "../TabHeading/TabHeading";
import AddButton from "../../Inputs/AddButton";
import { connect } from 'react-redux';
import ContentSpinner from "../../Spinners/ContentSpinner";
import {
    showAddTranslationForm,
    showEditTranslationForm,
    hideTranslationForms,
    showImportTranslationForm,
    showTranslationDeleteConfirmPopup,
    fetchItems,
    setSelectedItem
} from "../../../Store/Actions/TranslationsActions";
import InputText from '../../Inputs/InputText';
import AddTranslation from './AddTranslation';
import EditTranslation from './EditTranslation';
import Pagination from '../../Pagination/Pagination';
import SaveButton from '../../Inputs/SaveButton';

import axios from "axios";
import TokenService from '../../../Services/TokenServices';
import ImportTranslationForm from './ImportTranslationForm';
import ActionButton from '../../Inputs/ActionButton';
import { bind } from 'lodash';

class TabContentTranslations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            q: ""
        }

        this.typingTimeout = null;
        this.props.hideTranslationForms();
        this.onUpdate = this.onUpdate.bind(this);

    }
    componentDidMount() {
        this.props.fetchItems();
    }

    showImport() {

        this.props.hideTranslationForms();
        this.props.showImportTranslationForm();

    }
    onUpdate(item) {
        this.props.fetchItems(this.props.paginationData.currentPage, this.state.q);
    }
    async searchHandler(target) {
        const { name, value } = target;

        clearTimeout(this.typingTimeout);

        this.typingTimeout = setTimeout(() => {
            this.setState({ q: value })
            this.props.fetchItems(1, value)
        }, 300);

    }
    addHandler() {
        this.props.hideTranslationForms();
        this.props.showAddTranslationForm();
    }

    async exportHandler(e) {

        e.preventDefault();

        this.setState({ isSubmitted: true });
        try {
            const pdfResponse = await axios({
                url: 'api/translations/export',
                method: 'GET',
                responseType: 'blob', // important
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            }).then((response) => {
                this.setState({ isSubmitted: false });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'languages.csv'); //or any other extension
                document.body.appendChild(link);
                link.click();
            });;
        } catch (error) {
            console.log(error);
            this.setState({ isSubmitted: false });

        }

    }


    editHandler(id) {

        this.props.hideTranslationForms();
        this.props.showEditTranslationForm();
        const selectedItem = this.props.translations.find(x => x.id === id);
        this.props.setSelectedItem(selectedItem);
        window.scrollTo(0, 0);
    }
    paginationChangeHandler(pageNumber) {
        const { q } = this.state;
        this.props.fetchItems(pageNumber, q);
    }

    confirm(itemId) {
        this.props.showTranslationDeleteConfirmPopup(itemId);
    }

    renderButtonsRight() {

        const hasAddPermission = this.props.auth.acl['translations'] !== undefined ? this.props.auth.acl.translations.save : false;
        const hasImportPermission = this.props.auth.acl['translations'] !== undefined ? this.props.auth.acl.translations.import : false;
        const hasExportPermission = this.props.auth.acl['translations'] !== undefined ? this.props.auth.acl.translations.export : false;

        if (hasAddPermission) {
            return (

                <>
                    {
                        hasImportPermission &&
                        <>

                            <ActionButton
                                label="Import"
                                faIcon="fa-download"
                                onClickHandler={this.showImport.bind(this)}
                                buttonDisabled={this.state.isSubmitted}
                            />
                            <span className="mr-2"></span>
                        </>
                    }
                    {
                        hasExportPermission &&
                        <>
                            <ActionButton
                                label="Export"
                                faIcon="fa-upload"
                                onClickHandler={this.exportHandler.bind(this)}
                                buttonDisabled={this.state.isSubmitted}
                            />


                            <span className="mr-2"></span>
                        </>
                    }
                    {
                        hasAddPermission && <AddButton
                            onClickHandler={this.addHandler.bind(this)}
                            name="Add Translation"
                        />
                    }

                </>
            )
        }
        else
            return '';


    }

    render() {
        const { translations, languages } = this.props;
        const { q } = this.state;
        const showAddForm = this.props.addTranslation;
        const showEditForm = this.props.editTranslation;
        const showImportForm = this.props.importTranslation;


        // set acl permission for user add
        const hasEditPermission = this.props.auth.acl['translations'] !== undefined ? this.props.auth.acl.translations.update : false;
        const hasDeletePermission = this.props.auth.acl['translations'] !== undefined ? this.props.auth.acl.translations.delete : false;

        const totalPage = Math.ceil(this.props.paginationData.totalRecord / this.props.paginationData.perPage);
        const currentPage = this.props.paginationData.currentPage;

        return (
            <div className="settings_tab_content">
                <div className="content-block no-radius mb-lg-4" id="table-listing-block">
                    <div className="row">
                        <div className="col">

                            <TabHeading
                                tabHeading={"All Translations (" + this.props.paginationData.totalRecord + ")"}
                                tabSubHeading="" />
                            <div className="content-block-grey p-1 w-100">
                                <InputText
                                    fieldName="q"
                                    fieldClass="cat_search"
                                    fieldID="q"
                                    fieldPlaceholder="Search"
                                    fieldOnChange={this.searchHandler.bind(this)}
                                />
                            </div>

                        </div>

                        <div className="col text-right">

                            {this.renderButtonsRight()}

                        </div>
                    </div>

                    {showImportForm && <ImportTranslationForm />}

                    {showAddForm && <AddTranslation />}
                    {showEditForm && <EditTranslation onUpdate={this.onUpdate} />}

                    <div className="table-responsive text-nowrap">
                        <ContentSpinner />
                        {languages?.length > 0 && translations.length > 0 && <table className="table table-borderless table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th scope="col">Key</th>
                                    {
                                        languages.map((lang, i) => <th key={'lang' + lang.code} scope="col">{lang.name + (lang.default == true ? ' (Default)' : '')}</th>)
                                    }
                                    <th scope="col">Actions</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    translations.map((tanslation, index) => {
                                        return (
                                            <tr key={index}>
                                                <td scope="row">{tanslation.id}</td>
                                                <td scope="row">{tanslation.key}</td>
                                                {
                                                    languages.map((lang, i) => {
                                                        return (
                                                            <td key={lang.code} scope="col" className="text-wrap">
                                                                {lang.code in tanslation.text ? tanslation.text[lang.code] : ''}
                                                            </td>)
                                                    })
                                                }

                                                <td>
                                                    {hasEditPermission && <button
                                                        type="button"
                                                        className="btn btn-primary-outline at2-btn-no-bg"
                                                        onClick={e => this.editHandler(tanslation.id)}>
                                                        <img src="images/edit_icon.svg" />
                                                    </button>}
                                                    {hasDeletePermission && <button
                                                        type="button"
                                                        onClick={e => this.confirm(tanslation.id)}
                                                        className="btn btn-primary-outline at2-btn-no-bg">
                                                        <img src="images/remove_icon.svg" />
                                                    </button>}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        }

                        {
                            this.props.translations.length != 0 &&

                            <Pagination
                                totalPage={totalPage}
                                currentPage={currentPage}
                                paginationLinkHandler={this.paginationChangeHandler.bind(this)} />
                        }

                        {
                            this.props.translations.length == 0 &&
                            <div className="text-center col">No data found.</div>

                        }


                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page,
    translations: state.translations.items,
    paginationData: state.translations.paginationData,
    languages: state.translations.languages,
    addTranslation: state.translations.addTranslation,
    editTranslation: state.translations.editTranslation,
    importTranslation: state.translations.importTranslation,
    popup: state.popup,
});

export default connect(mapStateToProps, {
    showTranslationDeleteConfirmPopup,
    showAddTranslationForm,
    showEditTranslationForm,
    hideTranslationForms,
    fetchItems,
    setSelectedItem,
    showImportTranslationForm
})(TabContentTranslations);

