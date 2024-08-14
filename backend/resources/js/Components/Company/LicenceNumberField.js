import React from 'react';
import InputText from "../Inputs/InputText";

const LicenceNumberField = () => {
    return (
        <div className="content-block-grey">
            <div className="form_sub_heading">Number of licence</div>
            <div className="row">
                <div className="col- col-xl-8">
                    <InputText
                        fieldName="company_licence_number"
                        fieldID="company_licence_number"
                        fieldPlaceholder=""
                        fieldValue=""
                    />
                </div>
            </div>
        </div>
    )
}


export default LicenceNumberField;
