import React from 'react'

function VimeoVideo(props) {
    const videoUrl = 'https://player.vimeo.com/video/' + props.videoId + '?byline=0';
    return (

        <div className="w-100 mb-2">

            <div style={{ padding: "55.6% 0 0 0", position: "relative" }} className="w-100">
                <iframe src={videoUrl} style={{ position: "absolute", top: 0, left: 0, width: '100%', height: '100%' }} frameBorder="0" allowFullScreen></iframe>
            </div>

        </div>

    )
}

export default VimeoVideo
