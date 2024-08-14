import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import DateTimeService from '../../Services/DateTimeServices';
import { fetchMaterials } from "../../Store/Actions/MaterialsActions";
import CheckBox from '../Inputs/CheckBox';
import ContentSpinner from '../Spinners/ContentSpinner';

const ReorderView = (props) => {

    const { t } = props;

    const [dragId, setDragId] = useState();
    const [items, setItems] = useState([]);

    useEffect(() => {
        props.fetchMaterials(0, true).then(res => {
            const mats = res.data.data.map((x, i) => ({
                id: x.id,
                title: x.title,
                order: i,
                category: x.category.name,
                models: x.tools.map(y => y.name).join(', '),
                created_at: x.created_at,
                is_featured: Boolean(x.is_featured)
            }));
            setItems(mats);

        }).catch(error => {
            console.log(error.response);
        })
    }, [])


    const handleIsFeatured = (e, index) => {

        const list = [...items];

        const selectedItem = list[index];
        selectedItem.is_featured = !selectedItem.is_featured;
        list[index] = selectedItem;

        setItems(list);

        props.reorderedItemsHandler(list);


    }

    const handleDrag = (ev) => {
        setDragId(ev.currentTarget.id);
    };

    const handleDragOver = (ev) => {
        handleDrop(ev);
    };


    const handleDrop = (ev) => {

        const dragBox = items.find((item) => item.id == dragId);
        const dropBox = items.find((item) => item.id == ev.currentTarget.id);

        const dragBoxOrder = dragBox.order;
        const dropBoxOrder = dropBox.order;

        const newBoxState = items.map((item) => {
            if (item.id == dragId) {
                item.order = dropBoxOrder;
            }
            if (item.id == ev.currentTarget.id) {
                item.order = dragBoxOrder;
            }
            return item;
        });

        props.reorderedItemsHandler(newBoxState);

        setItems(newBoxState);
    };

    const row = (item, index, handleDrag, handleDrop) => {
        const trs = [];
        trs.push(<tr
            key={item.id}
            draggable={true}
            id={item.id}
            onDragOver={handleDragOver}
            onDragStart={handleDrag}
            onDrop={handleDrop}
            onDragEnd={e => this.onDragEndHandler(e)}

        >
            <td><i className="fa fa-arrows" aria-hidden="true" style={{ cursor: 'pointer' }} /></td>
            <td>{item.title}</td>
            <td>{item.category}</td>
            <td>{item.models}</td>
            <td>{DateTimeService.getDateTime(item.created_at)}</td>
            <td align="center">
                <input defaultChecked={item.is_featured} className="form-check-input" type="checkbox" name="is_featured[]" id={item.id} onClick={e => handleIsFeatured(e, index)} />
            </td>

        </tr>);

        return trs;
    }

    return (



        <div className="row">
            <div className="col">
                <table className="table table-borderless table-striped">
                    <thead>
                        <tr>
                            <th></th>
                            <th>{t('title')}</th>
                            <th>{t('category')}</th>
                            <th style={{ width: '25%' }}>{t('models')}</th>
                            <th>{t('created')}</th>
                            <th>{t('featured')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items
                            .sort((a, b) => a.order - b.order)
                            .map((item, i) => row(item, i, handleDrag, handleDrop))
                        }
                    </tbody>
                </table>
            </div>
        </div>


    );
}

const mapStateToProps = state => ({
    materials: state.materials.materials,
    categories: state.materials.categories,
    paginationData: state.materials.paginationData
});

export default connect(mapStateToProps, {
    fetchMaterials
})(ReorderView);
