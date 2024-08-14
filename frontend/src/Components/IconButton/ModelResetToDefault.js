import React from 'react';
import {resetModelToDefaultConfirmPopup} from "../../Store/Actions/popupActions";
import {connect} from "react-redux";
import NavService from "../../Services/NavServices";
import { withTranslation } from 'react-i18next';

const ModelResetToDefault = props => {
    const {t} = props;
    const onClickHandler = () => {
        props.resetModelToDefaultConfirmPopup({
            modelName: NavService.getCurrentRoute(),
            message: t('confirm_reset_model_inputs_message')
        })

    }

    const resetIconTitle = t('reset_model_inputs_to_default_value');

    return <i className="fa fa-undo reset_to_default" onClick={onClickHandler}
              title={resetIconTitle}/>;
}

const mapStateToProps = state => (
    {
    }
);

export default connect(mapStateToProps, {
    resetModelToDefaultConfirmPopup,
})(withTranslation()(ModelResetToDefault));

