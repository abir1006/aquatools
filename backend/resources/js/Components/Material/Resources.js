import React, { useState, useCallback } from 'react'
import PhotoGallery from './PhotoGallery';
import VimeoVideo from './VimeoVideo';
import { downloadFile } from "../../Store/Actions/ReportActions";
import { connect } from 'react-redux';

const Resources = (props) => {

    const item = props.item;

    const photos = 'images' in item.all_resources && item.all_resources.images.map((image, i) => {
        return {
            main: image.image,
            thumbnail: image.thumbnail
        }
    });


    const videos = 'videos' in item.all_resources && item.all_resources.videos.map((video, i) => {

        return i == 0 ? '' : <VimeoVideo videoId={video.image} key={i} />;
    });


    const fileDownloadHandler = (e, url) => {
        const fileName = url.split('/').pop();
        props.downloadFile(fileName, 'AT Materials Details')

    }

    const documents = 'documents' in item.all_resources && item.all_resources.documents.map((doc, i) => {

        const url = doc.image;

        const ext = url.split('.').pop().toLowerCase();
        let icon = '/images/file_icons/file.png';
        if (ext == 'pdf')
            icon = '/images/file_icons/pdf.png';
        else if (ext == 'doc' || ext == 'docx')
            icon = '/images/file_icons/doc.png';
        else if (ext == 'ppt' || ext == 'pptx')
            icon = '/images/file_icons/ppt.png';
        else if (ext == 'xls' || ext == 'xlsx')
            icon = '/images/file_icons/xls.png';

        return (

            <li key={i}>
                <img width="20" src={icon} className="pr-1" />
                <a onClick={e => fileDownloadHandler(e, url)} target="__blank" href={url}>{doc.caption ? doc.caption : url.split('/').pop()}</a>
            </li>

        )
    });


    return (
        <>

            {'images' in item.all_resources &&

                <div className="react-photoswipe-gallery flex-wrap d-flex justify-content-around">

                    <PhotoGallery images={photos} />
                </div>
            }
            {
                'videos' in item.all_resources && videos.length > 0 &&


                <div className="videos">
                    <br />

                    <hr />
                    <div className="row" >
                        {videos}
                    </div>
                </div>
            }

            {
                'documents' in item.all_resources && documents.length > 0 &&


                <div className="documents">
                    <br />

                    <hr />
                    <ul >
                        {documents}
                    </ul>
                </div>
            }


        </>
    )
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {
    downloadFile
})(Resources);