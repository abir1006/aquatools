import React from 'react';
import {connect} from 'react-redux';
import InputFormPopup from './InputFormPopup';
import './popup.css';
import {withTranslation} from "react-i18next";

const ValidationPopup = props => {

    const {t} = props;
    const xPixel = props.screenSize <= 767 ? (props.screenSize / 2 - 119) : (props.xPosition - 100);
    const xPosition = '50%';//props.xPosition === undefined || props.xPosition === '' ? '50%' : xPixel + 'px';
    const yDistance = props.yPosition <= 300 ? 300 : props.yPosition;
    const yPixel = yDistance - 110;
    const yPosition = '50%';//props.yPosition === undefined || props.yPosition === '' ? '50%' : yPixel + 'px';

    const maxWidth = props.maxWidth ? props.maxWidth : 200;


    return (
        <>
            {
                props.show &&
                <div className="at2_popup" style={{left: '-1px'}}>
                    <div className="popup_box confirm_popup_box" style={{maxWidth: maxWidth, top: yPosition}}>
                        <div>
                            <h5>{t(props.text)}</h5>
                            <h5>{t('do_you_want_to_continue')}</h5>
                            <button className="btn btn-primary default-btn-atv2"
                                    onClick={props.noHandler}>{t('no')}</button>
                            <button className="btn btn-primary default-btn-atv2"
                                    onClick={props.yesHandler}>{t('yes')}</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

const mapStateToProps = state => ({
    screenSize: state.page.screenSize
})

export default connect(mapStateToProps, {})(withTranslation()(ValidationPopup));
