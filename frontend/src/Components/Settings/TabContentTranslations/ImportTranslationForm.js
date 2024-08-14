import React, { Component } from 'react';
import '../Settings.css';
import { connect } from 'react-redux';
import TabHeading from "../TabHeading/TabHeading";
import InputText from "../../Inputs/InputText";
import SaveButton from "../../Inputs/SaveButton";
import SubmitButton from "../../Inputs/SubmitButton";
import axios from "axios";
import TokenServices from "../../../Services/TokenServices";

import {
    hideTranslationForms,
    importTranslation
} from "../../../Store/Actions/TranslationsActions";
import CheckBox from '../../Inputs/CheckBox';


class ImportTranslationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSubmitting: false,
            parseData: [],
            update_existing_key: false

        }
    }


    CSVArray(text) {
        var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
        var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

        // Return NULL if input string is not well formed CSV string.
        if (!re_valid.test(text)) return null;

        var a = []; // Initialize array to receive values.
        text.replace(re_value, // "Walk" the string using replace with callback.
            function (m0, m1, m2, m3) {

                // Remove backslash from \' in single quoted values.
                if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

                // Remove backslash from \" in double quoted values.
                else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                else if (m3 !== undefined) a.push(m3);
                return ''; // Return empty string.
            });

        // Handle special case of empty last value.
        if (/,\s*$/.test(text)) a.push('');
        return a;
    };

    csvJSON(csv) {

        var lines = csv.split("\n");

        var result = [];

        var headers = lines[0].split(",");

        const cleanValue = value => value.trim().replace(/\"/g, '').replace(/[\r\n]/g, "");

        for (var i = 1; i < lines.length; i++) {

            var obj = {};
            //var currentline = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            var currentline = this.CSVArray(lines[i]);
            console.log(currentline);
            for (var j = 0; j < headers.length; j++) {
                if (typeof currentline[j] != 'undefined') {
                    const code = cleanValue(headers[j]);
                    obj[code] = cleanValue(currentline[j])
                }
            }
            if (Boolean(obj['key']))
                result.push(obj);
        }

        return result;
    }

    handleFileChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            this.setState({ parseData: this.csvJSON(event.target.result) });
        }
        reader.onerror = error => Promise.reject(error)
        reader.readAsText(file)
    }

    saveHandler(e) {

        e.preventDefault();

        const { parseData, update_existing_key } = this.state;

        this.setState({ isSubmitted: true })

        const data = {
            parseData: parseData,
            update_existing_key: update_existing_key
        };
        this.props.importTranslation(data).then(response => {

            this.setState({
                isSubmitted: false,
                parseData: [],
                update_existing_key: false
            });
            this.props.hideTranslationForms();
        }).catch(error => {
            console.log(error)
            document.getElementById("fileInput").reset();
            this.setState({
                isSubmitted: false,
                parseData: [],
                update_existing_key: false
            });
        })

    }

    cancelHandler() {
        this.props.hideTranslationForms();
    }



    render() {

        const { errors, update_existing_key, parseData } = this.state;

        return (
            <div className="edit-block no-radius mb-lg-4">
                <div className="row">

                    <div className="col-lg-8">

                        <TabHeading
                            tabHeading="Import translations"
                            tabSubHeading="" />

                        <div className="content-block-grey w-100">

                            <form onSubmit={e => this.saveHandler(e)}>
                                <div className="form-row">

                                    <div className="col-4">
                                        <div className="d-flex align-items-center h-100">
                                            <input
                                                type="file"
                                                name="csvFile"
                                                accept=".csv"
                                                id="fileInput"
                                                onChange={e => this.handleFileChange(e)}
                                            />
                                        </div>

                                    </div>

                                    <div className="col-3">
                                        <CheckBox
                                            checkUncheckHandler={(value, name) => { this.setState({ [name]: value }) }}
                                            fieldName="update_existing_key"
                                            fieldValue={update_existing_key}
                                            text="Update on key exist"
                                        />
                                    </div>
                                    <div className="col-5 text-right">


                                        {parseData.length > 0 && <SubmitButton
                                            buttonDisabled={this.state.isSubmitted}
                                            btnText="Import" />
                                        }

                                        <SaveButton
                                            onClickHandler={this.cancelHandler.bind(this)}
                                            name="Cancel"
                                        />
                                    </div>

                                </div>

                                {parseData.length > 0 && <p> Total records found: {parseData.length}</p>}


                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    page: state.page,
    languages: state.translations.languages
});


export default connect(mapStateToProps, {
    hideTranslationForms,
    importTranslation
})(ImportTranslationForm);

