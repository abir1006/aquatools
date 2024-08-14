import React from 'react';
import './popup.css';

const InputFormPopup = props => {
    const maxWidth = props.maxWidth === undefined ? 280 : props.maxWidth;
    return (
        <div id="at2_popup">
            <div className="popup_box confirm_popup_box" style={{maxWidth: maxWidth+'px'}}>
                {props.children}
            </div>
        </div>
    );
}

export default InputFormPopup;
