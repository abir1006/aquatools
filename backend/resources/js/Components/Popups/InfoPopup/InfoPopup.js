import React, { useRef, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { hideInfoPopup } from "../../../Store/Actions/popupActions";
import './InfoPopup.css';

const InfoPopup = props => {

    const { t } = props;

    const popupCloseHandler = () => {
        props.hideInfoPopup();
    }

    const infoPopupRef = useRef();

    const handleOutsideClick = e => {
        if (infoPopupRef.current.contains(e.target)) {
            // inside click
            return;
        }
        props.hideInfoPopup();

    };

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleOutsideClick);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const xPixel = props.screenSize <= 767 ? (props.screenSize / 2 - 119) : (props.xPosition - 119);
    const xPosition = props.xPosition === undefined || props.xPosition === '' ? '50%' : xPixel + 'px';
    const yDistance = props.yPosition <= 150 ? 150 : props.yPosition;
    const yPixel = yDistance - 110;
    const yPosition = props.yPosition === undefined || props.yPosition === '' ? '50%' : yPixel + 'px';

    const vaccineRPPEffectHelpText = <p>
        {t('help_rpp_percentage')}
        <br />
        <br />
        {t('help_bi_effect')}
    </p>;

    const bcr_graph = <p>{t('help_bcr1')}<br /><br /> {t('help_bcr2')}</p>

    let infoPopupText = props.children.props.children === 'rpp_effect' ? vaccineRPPEffectHelpText : props.children;

    if (props.children.props.children === 'bcr_graph') {
        infoPopupText = bcr_graph;
    }

    return (
        <div ref={infoPopupRef} id="at2_info_popup" style={{ left: xPosition, top: yPosition }}>
            <span><i onClick={popupCloseHandler} className="fa fa-times"></i></span>
            {infoPopupText}
        </div>
    );

}


const mapStateToProps = state => ({
    screenSize: state.page.screenSize
})

export default connect(mapStateToProps, {
    hideInfoPopup
})(withTranslation()(InfoPopup));
