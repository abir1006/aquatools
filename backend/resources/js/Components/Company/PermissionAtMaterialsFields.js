import React from 'react';
import DropdownList from "../Inputs/DropdownList/DropdownList";

const PermissionAtMaterialsFields = (props) => {
    const { t } = props;
    const materials = { 'Manuals': 'Manuals', 'Training': 'Training', 'Consultancy': 'Consultancy' }
    return (
        <div className="content-block-grey">
            <div className="form_sub_heading pb-0">{t('permissions_models')}</div>
            <DropdownList
                fieldName="permission_materials"
                data={materials}
                defaultData={t('select_material')}
                listChangeHandler=""
            />
        </div>
    )
}


export default PermissionAtMaterialsFields;
