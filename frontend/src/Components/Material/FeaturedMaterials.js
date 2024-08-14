import React from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux';
import Card from './Card';

const FeaturedMaterials = (props) => {
    const { t, items, editHandler } = props;

    //featured materials
    const featuredItems = items.map((item, i) => {
        return (
            <div key={i} className="col mb-4">
                <Card t={t} card={item} editHandler={editHandler} />
            </div>
        );
    });

    if (featuredItems.length < 1)
        return ''

    return (
        <div className="featured_items" style={{ backgroundColor: 'lightgray', padding: '15px' }}>
            <h2>{t('featured_items')}</h2>
            {featuredItems.length <= 0 && <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true" />}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
                {featuredItems}
            </div>
        </div>
    )
}


const mapStateToProps = state => ({
    items: state.materials.featuredMaterials || [],
});

export default connect(mapStateToProps, {})(withTranslation()(FeaturedMaterials));
