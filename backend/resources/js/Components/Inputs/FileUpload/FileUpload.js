import React, { Component } from 'react';
import './FileUpload.css'
import ButtonSpinner from "../../Spinners/ButtonSpinner";
import { withTranslation } from 'react-i18next';

class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadedFileUrl: null,
            image: null,
        }
    }

    uploadClickHandler() {
        document.getElementById('inputFile').click();
    }

    imageChangeHandler(e) {
        this.setState({
            image: URL.createObjectURL(e.target.files[0])
        });

        this.props.fileOnChangeHandler(e.target.files[0]);
    }

    render() {
        const { t } = this.props;

        const defaultImageText = <span className="blank_image flex-column justify-content-center align-items-center">
            <div>{this.props.size}</div>
            <div>{t('max_upload_limit')}</div>
        </span>;
        let uploadedFile = this.props.fieldValue === undefined || this.props.fieldValue === '' || this.props.fieldValue === null ? defaultImageText :
            <img height="120" id="target" src={this.props.fieldValue} />;

        uploadedFile = this.props.showSpinner === true ? 'uploading...' : uploadedFile

        return (
            <div className="at2_file_upload">
                <div className="uploaded_file">
                    {uploadedFile}
                </div>
                <div className="clearfix"></div>
                <button
                    type="button"
                    disabled={this.props.showSpinner}
                    className="btn at2-upload-button"
                    onClick={e => this.uploadClickHandler(e)}>
                    <ButtonSpinner showSpinner={this.props.showSpinner} />
                    {this.props.btnText}
                </button>
                <input
                    id="inputFile"
                    type="file"
                    onChange={e => this.imageChangeHandler(e)}
                    style={{ display: 'none' }} />
            </div>
        );
    }
}

export default withTranslation()(FileUpload);

