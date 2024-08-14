import React, { useEffect, useRef, useState } from 'react'

const ModelPopup = (props) => {

    const conentDiv = useRef();
    const [height, setHeight] = useState('25%');

    const popup = { top: '25%', bottom: '25%' };
    const { info, closeHandler } = props;

    useEffect(() => {
        if (conentDiv.current) {
            console.log(conentDiv.current.clientHeight);
            const value = (window.innerHeight - conentDiv.current.clientHeight) / 2;
            setHeight(value + 'px');
        }

    }, [window.innerHeight])
    return (

        <div id="at2_popup">
            <div ref={conentDiv} className="popup_box"
                style={{ padding: '20px 0', maxWidth: '50%', top: height, bottom: height, textAlign: 'inherit', backgroundColor: '#fff' }}>
                <i
                    className="fa fa-times popup_close"
                    onClick={e => closeHandler()}
                    style={{ marginTop: '-20px' }}
                ></i>
                <div style={{ maxHeight: '500px', overflowY: 'scroll' }}>

                    <div className="mx-3 p-3 bg-white" dangerouslySetInnerHTML={{ __html: info }} />
                </div>
            </div>
        </div>


    )
}

export default ModelPopup
