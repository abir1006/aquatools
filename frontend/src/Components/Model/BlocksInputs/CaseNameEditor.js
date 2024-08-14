import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setModelCaseText} from "../../../Store/Actions/MTBActions";
import './CaseNameEditor.css'

const CaseNameEditor = ({caseNumber, t}) => {
    const dispatch = useDispatch()
    const mtbCaseText = useSelector(state => state?.modelScreen?.modelCaseText || {})
    const caseNoText = Boolean(mtbCaseText['case' + caseNumber]) ? mtbCaseText['case' + caseNumber] : t('case') + ' ' + caseNumber
    const [textBox, setTextBox] = useState(false)
    const [caseText, setCaseText] = useState(caseNoText)

    useEffect(() => {
        setCaseText(caseNoText)
    }, [t('case'), caseNoText])

    const caseTextHandler = e => {
        const {name, value} = e.target
        dispatch(setModelCaseText({['case' + caseNumber]: value}))
        setCaseText(value)
    }

    return <div className="case_name_editor">
        {!textBox && <b>{caseText}</b>}
        {textBox && <input
            onChange={caseTextHandler}
            className="case_no_editor" type="text" value={caseText}/>}
        {!textBox && <i
            onClick={() => setTextBox(true)}
            className="fa fa-pencil cursor_pointer ml-1 mt-1 thinner position-absolute"/>}
        {textBox && <i
            onClick={() =>  { if (caseText === '') {return false;}  setTextBox(false)}}
            className="fa fa-check cursor_pointer ml-1 mt-1 thinner"/>}
    </div>
}
export default CaseNameEditor;

