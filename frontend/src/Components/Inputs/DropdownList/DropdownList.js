import React, {Component} from 'react';
import './DropdownList.css';

class DropdownList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dropdownExpand: false,
            dropDownListCount: 1
        }
    }

    dropdownClickHandler(e) {
        if (this.state.dropdownExpand === false) {
            document.addEventListener('click', e => this.handleOutsideClick(e), false);
            this.setState({
                ...this.state,
                dropDownListCount: Object.keys(this.props.data).length,
                dropdownExpand: true
            })
        } else {
            document.addEventListener('click', e => this.handleOutsideClick(e), false);
        }
    }

    dropdownListClickHandler(selectedValue) {
        if (this.state.dropdownExpand === true) {
            let updatedData = [];
            updatedData[selectedValue] = selectedValue;
            for (let index in this.props.data) {
                if (this.props.data[index] !== selectedValue) {
                    updatedData[this.props.data[index]] = this.props.data[index];
                }
            }
            this.setState({
                ...this.state,
                dropdownExpand: false,
                dropDownListCount: 1,
            });
            if(selectedValue !== undefined) {
                this.props.listChangeHandler(selectedValue);
            }

        }
    }

    handleOutsideClick(e) {

        if (this.node === null) {
            return;
        }

        // ignore clicks on the component itself

        if (this.node.contains(e.target)) {
            return;
        }

        this.setState({
            dropdownExpand: false,
            dropDownListCount: 1,
        });
    }

    render() {
        const dropdownClass = this.state.dropdownExpand ? 'at2_dropdown expand' : 'at2_dropdown';
        const dropDownIcon = this.state.dropdownExpand ? <i onClick={e => this.dropdownListClickHandler()} className="fa fa-angle-up" aria-hidden="true"></i> :
            <i onClick={e => this.dropdownClickHandler(e)} className="fa fa-angle-down" aria-hidden="true"></i>

        // Manipulate dropdown data

        let selectedItem = this.props.defaultData;

        let listData = [];

        // add default data at beginning of list
        if (this.props.selectedData === undefined) {
            listData[''] = selectedItem;
        }

        // add selected data in top of list
        if (this.props.selectedData !== undefined) {
            selectedItem = this.props.selectedData;
            listData[selectedItem] = selectedItem;
        }

        // convert props data object into array
        for (let index in this.props.data) {
            listData[this.props.data[index]] = this.props.data[index];
        }

        // extract selected Data from props data
        if (this.props.selectedData !== undefined) {
            for (let index in this.props.data) {
                if (this.props.data[index] !== this.props.selectedData) {
                    listData[this.props.data[index]] = this.props.data[index]
                }
            }
        }

        const dropdownData = listData;

        let dropDownList = [];

        let count = 0;

        for (let index in dropdownData) {
            count++;
            const List = <li onClick={e => this.dropdownListClickHandler(dropdownData[index])}
                             key={count}>{dropdownData[index]}</li>;
            dropDownList.push(List);
        }

        const ddListMaxHeight = this.state.dropDownListCount * 45;



        return (
            <div
                ref={node => {
                    this.node = node;
                }}
                className={dropdownClass}
                id={this.props.fieldID}
                onClick={e => this.dropdownClickHandler(e)}>
                {dropDownIcon}
                <ul style={{maxHeight: ddListMaxHeight}}>
                    {dropDownList}
                </ul>
                <input type="hidden" name={this.props.fieldName} value={selectedItem}/>
            </div>
        );
    }
}

export default DropdownList;

