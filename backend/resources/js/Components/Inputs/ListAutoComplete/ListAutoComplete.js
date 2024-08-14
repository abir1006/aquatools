import React, { Component } from 'react';
import './ListAutoComplete.css'
import List from "./List";

class ListAutoComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemName: '',
            itemId: '',
            allData: [],
            resultData: [],
            isItemSelected: false,
            enableLocalState: false,
            selectedItem: '',
            toggle: false,
        }
    }

    componentDidMount() {
    }

    async listOnFocusHandler(toggleList) {
        let toggle = toggleList !== true;
        document.addEventListener('click', e => this.handleOutsideClick(e), false);
        const list = this.props.listData;
        if (toggle) {
            await this.setState({
                ...this.state,
                allData: list,
                resultData: list,
                toggle: true,
            });
        } else {
            await this.setState({
                ...this.state,
                allData: [],
                resultData: [],
                toggle: false,
            });
        }
    }

    async listClickHandlerCallBack(itemName, itemId, itemColor) {
        document.addEventListener('click', e => this.handleOutsideClick(e), false);
        if (itemId === 'group') {
            return false;
        }
        await this.setState({
            ...this.state,
            enableLocalState: true,
            isItemSelected: true,
            itemName: itemName,
            itemColor: itemColor,
            itemId: itemId,
            allData: [],
            resultData: [],
        });

        this.props.fieldOnClick(itemName, itemId);
    }

    async listOnChangeValue(e) {
        const itemSearchStr = e.target.value;

        //this.props.fieldOnClick('', '');

        await this.setState({
            ...this.state,
            itemName: itemSearchStr,
            isItemSelected: false,
            enableLocalState: true,
        });


        let filteredData = [];

        let count = 0;

        this.state.allData.map(data => {
            if (this.props.fullSearch === undefined) {
                if (data.name.toLowerCase().startsWith(itemSearchStr.toLowerCase())) {
                    filteredData[count] = data;
                    count++;
                }
            }

            if (this.props.fullSearch !== undefined && this.props.fullSearch === true) {
                if (data.name.toLowerCase().includes(itemSearchStr.toLowerCase())) {
                    filteredData[count] = data;
                    count++;
                }
            }
        });

        await this.setState({
            ...this.state,
            isItemSelected: false,
            itemName: itemSearchStr,
            resultData: filteredData,
            enableLocalState: true,
        });

    }

    async handleOutsideClick(e) {

        if (this.node === null) {
            return;
        }

        // ignore clicks on the component itself

        if (this.node.contains(e.target)) {
            return;
        }

        if (e.target.className === 'fa fa-angle-up') {
            return;
        }

        if (e.target.className === 'fa fa-angle-down') {
            return;
        }

        await this.setState({
            ...this.state,
            itemName: this.state.isItemSelected === true ? this.state.itemName : '',
            allData: [],
            resultData: [],
            toggle: false,
        });
    }

    render() {
        let fieldClass = this.props.isFieldEmpty !== undefined && this.props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';
        const list = this.state.resultData;

        const listGroup = list.filter(item => item.id === 'group');

        const hasListGroup = listGroup.length > 0 ? ' has_list_group' : '';

        let listCount = -1;
        let selectedItemName = '';
        let selectedItemColor = undefined;
        if (Boolean(this.props.selectedItemId)) {
            const selectedItem = this.props.listData.filter(item => item.id === this.props.selectedItemId);
            if (selectedItem.length > 0) {
                selectedItemName = selectedItem[0].name;
                selectedItemColor = selectedItem[0].color;
            }
        }

        let localState = this.state.enableLocalState;

        if (this.props.disableListLocalState !== undefined && this.props.disableListLocalState === true) {
            localState = false;
        }

        let fieldValue = localState === true ? this.state.itemName : selectedItemName;

        const fieldDisabled = this.props.fieldDisabled === undefined ? false : this.props.fieldDisabled;

        let fieldColorSpan = this.state.itemColor;

        if (selectedItemColor !== undefined && this.state.enableLocalState === false) {
            fieldColorSpan = selectedItemColor;
        }

        return (

            <div
                ref={node => {
                    this.node = node;
                }}
                className="input_autocomplete_block">
                <input
                    autoComplete="off"
                    disabled={fieldDisabled}
                    type="text"
                    name={this.props.fieldName}
                    className={fieldClass}
                    id={this.props.fieldId}
                    placeholder={this.props.fieldPlaceHolder}
                    value={fieldValue}
                    onFocus={e => this.listOnFocusHandler(e)}
                    onChange={e => this.listOnChangeValue(e)} />

                {fieldColorSpan !== undefined &&
                    <span style={{ backgroundColor: fieldColorSpan }} className="field_color_span"></span>}
                {this.state.toggle === false && fieldDisabled === false && <i
                    onClick={e => this.listOnFocusHandler(this.state.toggle)}
                    className="fa fa-angle-down"></i>}

                {this.state.toggle && fieldDisabled === false && <i
                    onClick={e => this.listOnFocusHandler(this.state.toggle)}
                    className="fa fa-angle-up"></i>}

                {
                    list.length > 0 && fieldDisabled === false && <List
                        listClickHandlerCallBack={this.listClickHandlerCallBack.bind(this)}
                        list={list}
                        selectedItemName={selectedItemName}
                        hasListGroup={hasListGroup} />
                }

                {/*{*/}
                {/*    list.length > 0 && fieldDisabled === false &&*/}
                {/*    <ul className={"auto_complete_search_list" + hasListGroup}> {*/}
                {/*        list.map(item => {*/}
                {/*            listCount++;*/}
                {/*            const showColorSpan = item.color !== undefined && item.color !== '';*/}
                {/*            let liClass = item.name === selectedItemName ? 'selected_item ' : '';*/}
                {/*            if (item.id === 'group') {*/}
                {/*                liClass = liClass + 'list_group';*/}
                {/*            }*/}
                {/*            return <li className={liClass}*/}
                {/*                       onClick={e => this.listClickHandler(item.name, item.id, item.color)}*/}
                {/*                       key={listCount}>{item.name}{showColorSpan === true &&*/}
                {/*            <span style={{backgroundColor: item.color}} className="list_color_span"></span>}</li>*/}
                {/*        })*/}
                {/*    }*/}
                {/*    </ul>*/}
                {/*}*/}

            </div>

        );
    }
}

export default ListAutoComplete;

