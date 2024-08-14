import React from 'react'

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'

import { Gallery, Item } from 'react-photoswipe-gallery'

const PhotoGallery = (props) => {

    const items = props.images.map((image, i) => {
        return (
            <Item
                original={image.main + '?image=1'}
                thumbnail={image.thumbnail + '?image=1'}
                key={i}
                width="1024"
                height="768"
            >
                {({ ref, open }) => (
                    <img className="my-2" ref={ref} onClick={open} src={image.thumbnail + '?image=1'} />
                )}
            </Item>
        );
    });


    return (
        <Gallery>
            {items}
        </Gallery>
    )


}

export default PhotoGallery
