import React from 'react'
import { withTranslation } from 'react-i18next';
import InputText from '../Inputs/InputText';

const PdfPptDownloadForm = (props) => {

    const { t } = props;

    const isFieldEmpty = props.isEmailEmpty || false;
    const emailValue = props.emailValue || '';
    const emailOnChangeHandler = props.emailOnChangeHandler;
    const showSpinner = props.showSpinner;

    return (
        <>
            <form>
                <div className="row">
                    <div className="col-6 col-xl-8">
                        <InputText
                            isFieldEmpty={isFieldEmpty}
                            fieldName="pdfEmail"
                            fieldID="pdf_email"
                            fieldPlaceholder={t('email')}
                            fieldValue={emailValue}
                            fieldOnChange={emailOnChangeHandler}
                        />
                    </div>
                    <div className="col-6 col-xl-4">
                        <button
                            disabled={showSpinner}
                            style={{ paddingLeft: '10px', paddingRight: '10px' }}
                            type="button"
                            onClick={e => props.downloadHandler(true)}
                            className="btn btn-primary default-btn-atv2">
                            {t('send')}
                        </button>
                    </div>
                </div>
                <hr />
                <button
                    disabled={showSpinner}
                    style={{ paddingLeft: '10px', paddingRight: '10px' }}
                    onClick={e => props.downloadHandler()}
                    type="button"
                    className="btn btn-primary default-btn-atv2">
                    {t('download_report')}
                </button>
                <button
                    disabled={showSpinner}
                    style={{ paddingLeft: '10px', paddingRight: '10px' }}
                    type="button"
                    onClick={e => props.downloadHandler(false, true)}
                    className="btn btn-primary default-btn-atv2">
                    {t('send_to_me')}
                </button>
            </form>
        </>
    )
}

export default withTranslation()(PdfPptDownloadForm)
