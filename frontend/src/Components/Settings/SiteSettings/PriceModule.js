import React, {useEffect, useState} from 'react'
import SaveButton from '../../Inputs/SaveButton';
import {withTranslation} from 'react-i18next';
import TokenService from "../../../Services/TokenServices";
import {useDispatch} from "react-redux";
import {showSuccessMessage} from "../../../Store/Actions/popupActions";
import axios from "axios";

const PriceModule = ({t}) => {
    const dispatch = useDispatch();
    const [selectedFile, setSelectedFile] = useState();
    const [fileKey, setFileKey] = useState(0);
    const [spinner, setSpinner] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [excels, setExcels] = useState([])

    useEffect(() => {
        axios.get('api/price/excel/list', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TokenService.getToken()}`
            }
        }).then(response => {
            setExcels(response?.data?.data || [])
        }).catch(error => {
                console.log(error.response);
        })
    }, [fileKey])

    const handleXLSFileChange = e => {
        setErrorMessage('');
        setSelectedFile(e.target.files[0]);
    }

    const uploadExcel = () => {
        if (!selectedFile) {
            setErrorMessage(t('please_select_an_excel'));
            return false;
        }

        if( selectedFile?.name !== 'Forwards_Report.xls' && selectedFile?.name !== 'salmonIndexHistory.xls' ) {
            setErrorMessage(t('Error: Excel file name must be "Forwards_Report.xls" or "salmonIndexHistory.xls"'));
            return false;
        }

        setSpinner(true)
        const formData = new FormData();
        formData.append('File', selectedFile);
        axios.post('api/price/excel/upload', formData, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${TokenService.getToken()}`
            }
        }).then(response => {
            let key = fileKey + 1
            setFileKey(key);
            setSpinner(false);
            dispatch(showSuccessMessage(t('successfully_uploaded')))
        })
            .catch(error => {
                setSpinner(false);
                console.log(error.response);
            })

    }

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="tab_heading">
                        <h2>{t('price_module')}</h2>
                        <hr/>
                    </div>
                </div>
            </div>

            <div className="ml-3 mb-3">
                <div className="row">
                    <div className="col-4">
                        <input
                            key={fileKey}
                            type="file"
                            name="price_module_excel"
                            accept=".xls, .xlsx"
                            id="fileInput"
                            onChange={e => handleXLSFileChange(e)}
                        />
                        {errorMessage !== '' && <p className="at2_error_text">{errorMessage}</p>}
                    </div>
                    <div className="col-4">
                        <SaveButton
                            onClickHandler={uploadExcel}
                            name={t('upload')}
                            buttonDisabled={spinner}
                        />
                    </div>
                    <div className="col-12">
                        {
                            excels && excels.map( excel => {
                                return <p style={{marginBottom: 0}}><b>{excel.file_name}</b> {' (Last updated on: ' + excel.updated_at +')'}</p>
                            } )
                        }
                    </div>
                    <div className="col-12">
                        <p className="m-0"><a
                            className="price_sample_link"
                            onClick={ e => { e.preventDefault(); window.location.replace("sample_excels/Forwards_Report.xls") } }
                            href="">Download forward price sample excel </a></p>
                        <p><a
                            className="price_sample_link"
                            onClick={ e => { e.preventDefault(); window.location.replace("sample_excels/salmonIndexHistory.xls") } }
                            href="">Download historic price sample excel </a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default (withTranslation()(PriceModule));
