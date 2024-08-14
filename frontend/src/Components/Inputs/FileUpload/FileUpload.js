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
            errorMsg: ''
        }
    }

    uploadClickHandler() {
        document.getElementById('inputFile').click();
    }

    imageChangeHandler(e) {
        const {t} = this.props;
        if (!this.props.types.includes(e.target.files[0].name.split('.').pop())) {
            this.setState({
                ...this.state,
                errorMsg: t('invalid_file_extension')
            })
            return false;
        }

        if (e.target.files[0].size > this.props.maxSize) {
            this.setState({
                ...this.state,
                errorMsg: t('file_size_should_not_be_more_than_2mb')
            })
            return false;
        }

        this.setState({
            image: URL.createObjectURL(e.target.files[0]),
            errorMsg: ''
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
                    accept="image/*"
                    id="inputFile"
                    type="file"
                    onChange={e => this.imageChangeHandler(e)}
                    style={{ display: 'none' }} />
                {this.state.errorMsg !== '' && <p className="at2_error_text">{this.state.errorMsg}</p>}
            </div>
        );
    }
}

export default withTranslation()(FileUpload);

