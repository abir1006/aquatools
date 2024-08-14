import React, {Component} from 'react';
import './ListAutoComplete.css'

class List extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.selectedItemName !== undefined && this.props.selectedItemName !== '') {
            document.getElementById('selected_item').scrollIntoView({
                behavior: 'auto',
                block: 'center',
                inline: 'center',
            });
        }
    }

    listClickHandler(itemName, itemId, itemColor) {
        this.props.listClickHandlerCallBack(itemName, itemId, itemColor);
    }

    render() {

        const list = this.props.list;
        const hasListGroup = this.props.hasListGroup;
        const selectedItemName = this.props.selectedItemName;

        return (
            <ul
                className={"auto_complete_search_list" + hasListGroup}> {
                list.map((item, keyNumber) => {
                    let liClass = item.name === selectedItemName ? 'selected_item ' : '';
                    let liID = item.name === selectedItemName ? 'selected_item' : '';
                    const showColorSpan = item.color !== undefined && item.color !== '';
                    if (item.id === 'group') {
                        liClass = liClass + 'list_group';
                    }
                    return <li
                        onClick={e => this.listClickHandler(item.name, item.id, item.color)}
                        id={liID}
                        className={liClass}
                        key={keyNumber}>
                        {item.name}
                        {showColorSpan === true &&
                        <span style={{backgroundColor: item.color}} className="list_color_span"/>}
                    </li>
                })
            }
            </ul>
        );
    }
}

export default List;

