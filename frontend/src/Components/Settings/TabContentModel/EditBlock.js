import React, {Component} from 'react';
import '../Settings.css';
import {connect} from 'react-redux';
import SaveButtonSmall from "../../Inputs/SaveButtonSmall";
import InputText from "../../Inputs/InputText";

import {updateModelBlockData, updateBlockInputsOrder} from "../../../Store/Actions/ModelBlockActions";
import axios from "axios";
import TokenService from "../../../Services/TokenServices";
import CheckBox from "../../Inputs/CheckBox";
import ButtonSpinner from "../../Spinners/ButtonSpinner";
import AddBlockInput from "./AddBlockInput";
import DropdownList from "../../Inputs/DropdownList/DropdownList";

import {numberList, textToNumber, caseTypes, numberToText} from "../../../Services/NumberServices";
import BlockInputField from "./BlockInputField";
import {showInputsBulkDeleteConfirmPopup, setConfirmInputBulkDelete} from "../../../Store/Actions/popupActions";
import SuccessIcon from "../../IconButton/SuccessIcon";


class EditBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blockInputData: [],
            inputs: {
                name: false,
                case_type: false,
                column_no: false,
                isDefault: null,
                has_cases: null,
            },
            buttonDisabled: false,
            isNameFieldEmpty: false,
            errorMessage: '',
            showBlockSettings: false,
            showSpinner: false,
            selectedInputIDs: [],
        }
    }

    async componentDidMount() {
        try {
            const inputListResponse = await axios.post(
                'api/block_input/list',
                {
                    block_id: this.props.blockData.id
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                });

            // response
            this.setState({
                ...this.state,
                showSpinner: false,
                blockInputData: inputListResponse.data
            });


        } catch (error) {
            console.log(error.response.data);
        }
    }

    //
    componentDidUpdate() {

        // Action when input bulk delete confirmed yes
        if (Boolean(this.props.confirmInputDelete)) {
            if (!Boolean(this.state.showInputDeleteSpinner)) {
                this.setState({
                    ...this.state,
                    showInputDeleteSpinner: true
                });
            }
            axios.delete('api/block_input/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: {
                    id: this.state.selectedInputIDs
                },
            }).then(response => {
                this.handleDeleteBlockInputs(this.state.selectedInputIDs);
                this.props.setConfirmInputBulkDelete(undefined);
                this.setState({
                    ...this.state,
                    selectedInputIDs: [],
                    showInputDeleteSpinner: undefined,
                    showBulkDeleteSuccessIcon: true,
                });

                // Hide success icon after 1.5 seconds
                setTimeout(() => {
                    this.setState({
                        ...this.state,
                        showBulkDeleteSuccessIcon: false,
                    });
                }, 1500)

            }).catch(error => {
                console.log(error);
                this.props.setConfirmInputBulkDelete(undefined);
                this.setState({
                    ...this.state,
                    showInputDeleteSpinner: undefined
                });
            });

        }
    }

    // call back method for passing updated block input data from edit block input component
    async updateBlockInputStateHandler(updatedBlockInputData) {
        const blockInputData = this.state.blockInputData.map(blockInput => {
            if (blockInput.id === updatedBlockInputData.id) {
                return updatedBlockInputData;
            }
            return blockInput;
        });

        await this.setState({
            ...this.state,
            blockInputData: blockInputData
        });
    }

    onChangeHandler(inputTargets) {
        const {name, value} = inputTargets;
        if (name === 'name') {
            this.setState({
                ...this.state,
                isNameFieldEmpty: false,
                inputs: {
                    ...this.state.inputs,
                    name: value
                }
            });
        }
    }

    setAsDefaultBlock() {
        const isDefault = this.props.blockData.is_default === 0;
        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                isDefault: this.state.inputs.isDefault === null ? isDefault : this.state.inputs.isDefault !== true,
            }
        })
    }

    hasInputsCases() {
        const hasCases = this.props.blockData.has_cases === 0;
        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                has_cases: this.state.inputs.has_cases === null ? hasCases : this.state.inputs.has_cases !== true,
            }
        })
    }

    caseTypeChangeHandler(selectedValue) {
        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                case_type: selectedValue,
            }
        })
    }

    columnChangeHandler(selectedValue) {
        this.setState({
            ...this.state,
            inputs: {
                ...this.state.inputs,
                column_no: textToNumber[selectedValue],
            }
        })
    }

    async updateBlockHandler() {

        await this.setState({
            ...this.state,
            showSpinner: true,
        })

        const blockName = this.state.inputs.name === false || this.state.inputs.name === undefined ? this.props.blockData.name : this.state.inputs.name;
        const caseType = this.state.inputs.case_type === false || this.state.inputs.case_type === undefined ? this.props.blockData.case_type : this.state.inputs.case_type;
        const numberOfColumn = this.state.inputs.column_no === false || this.state.inputs.column_no === undefined ? this.props.blockData.column_no : this.state.inputs.column_no;
        const isDefault = this.state.inputs.isDefault === null || this.state.inputs.isDefault === undefined ? this.props.blockData.is_default : this.state.inputs.isDefault === true ? 1 : 0;
        const hasCases = this.state.inputs.has_cases === null || this.state.inputs.has_cases === undefined ? this.props.blockData.has_cases : this.state.inputs.has_cases === true ? 1 : 0;

        if (blockName === '') {

            this.setState({
                ...this.state,
                isNameFieldEmpty: true,
                errorMessage: 'Name field should not empty'
            });

            return false;
        }

        const updatedBlockData = {
            id: this.props.blockData.id,
            name: blockName,
            case_type: caseType,
            column_no: numberOfColumn,
            slug: this.props.blockData.slug,
            is_default: isDefault,
            has_cases: hasCases,
        }

        try {
            const blockUpdateResponse = await axios.put(
                'api/block/update',
                updatedBlockData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${TokenService.getToken()}`
                    }
                });

            // response
            this.props.updateModelBlockData(blockUpdateResponse.data.data)

            await this.setState({
                ...this.state,
                showSpinner: false,
            });

        } catch (error) {
            await this.setState({
                ...this.state,
                showSpinner: false,
            });
            const errorsObj = error.response.data.errors;
            const errorMessage = errorsObj[Object.keys(errorsObj)[0]];

            if (Object.keys(errorsObj)[0] === 'name') {
                await this.setState({
                    ...this.state,
                    isNameFieldEmpty: true,
                    errorMessage: errorMessage
                })
            }
        }


    }

    async handleAddBlockInputs(newBlockInputs) {
        await this.setState({
            ...this.state,
            blockInputData: [...this.state.blockInputData, newBlockInputs]
        })
    }

    async handleDeleteBlockInputs(blockInputId) {
        await this.setState({
            ...this.state,
            blockInputData: this.state.blockInputData.filter(blockInput => !blockInputId.includes(blockInput.id))
        })
    }

    async selectedInputsHandler(tickStatus, inputID) {

        if (tickStatus === true) {
            await this.setState({
                ...this.state,
                selectedInputIDs: [...this.state.selectedInputIDs, inputID]
            });
        } else {
            await this.setState({
                ...this.state,
                selectedInputIDs: this.state.selectedInputIDs.filter(item => item !== inputID)
            })
        }

    }

    cancelHandler() {
        this.props.hideModelBlockForms();
    }

    onDragStartHandler(e, draggedInput, inputIndex) {
        const startIndex = e.target.id;
        this.setState({
            ...this.state,
            draggedInput: draggedInput,
            draggedStartIndex: startIndex,
            presentOrder: inputIndex + 1,
            oldInputs: [...this.state.blockInputData]
        });
    }

    onDragHandler(e, index) {
        // const startIndex = e.target.id;
        // this.setState({
        //     ...this.state,
        //     draggedStartIndex: startIndex
        // });
    }

    async onDropHandler(e) {

    }

    onDragOverHandler(e, index) {
        const draggedItem = this.state.draggedInput;
        const currentDraggedItem = this.state.blockInputData[index];
        if (draggedItem === currentDraggedItem) {
            return;
        }

        // filter out the currently dragged item
        let blockInputData = this.state.blockInputData.filter((item) => item !== draggedItem);

        // add the dragged item after the dragged over item
        blockInputData.splice(index, 0, draggedItem);

        this.setState({
            ...this.state,
            blockInputData,
            changedOrder: index + 1
        });
    }

    onDragEndHandler(e) {
        this.setState({
            ...this.state,
            ['drag-container-' + this.state.draggedStartIndex]: undefined
        });

        const updatedData = {
            id: this.state.draggedInput.id,
            block_id: this.state.draggedInput.block_id,
            present_order: this.state.presentOrder,
            changed_order: this.state.changedOrder,
            all_orders: this.state.blockInputData.map((item, index) => ({
                id: item.id,
                input_order: index + 1,
                input_name: item.name
            }))
        }

        this.props.updateBlockInputsOrder(updatedData);

    }

    onDragIconHandler(parentID) {
        this.setState({
            ...this.state,
            ['drag-container-' + parentID]: true
        })
    }

    onDropIconHandler(parentID) {
        this.setState({
            ...this.state,
            ['drag-container-' + parentID]: undefined
        })
    }

    // reorder an array based on old index and new index
    reorder(arr, startIndex, endIndex) {
        const movedItem = arr.filter((item, index) => index === parseInt(startIndex));
        const remainingItems = arr.filter((item, index) => index !== parseInt(startIndex));
        return [
            ...remainingItems.slice(0, parseInt(endIndex)),
            movedItem[0],
            ...remainingItems.slice(parseInt(endIndex))
        ];
    }


    deleteInputsHandler() {
        const payloads = {
            itemIDs: this.state.selectedInputIDs,
            message: 'Do you really want to delete selected input field(s)?',
        }
        this.props.showInputsBulkDeleteConfirmPopup(payloads);
    }


    render() {
        const errorMessage = this.state.isNameFieldEmpty === true ?
            <p className="at2_error_text">{this.state.errorMessage}</p> : '';

        const blockName = this.state.inputs.name === false ? this.props.blockData.name : this.state.inputs.name;
        const blockCaseType = this.state.inputs.case_type === false ? this.props.blockData.case_type : this.state.inputs.case_type;
        const numberOfColumn = this.state.inputs.column_no === false ? this.props.blockData.column_no : this.state.inputs.column_no;
        const isDefault = this.state.inputs.isDefault === null ? this.props.blockData.is_default === 1 : this.state.inputs.isDefault;
        const hasCases = this.state.inputs.has_cases === null ? this.props.blockData.has_cases === 1 : this.state.inputs.has_cases;
        const inputDeleteButtonDisable = Boolean(this.state.showInputDeleteSpinner) || this.state.selectedInputIDs.length === 0;
        const showInputDeleteSpinner = Boolean(this.state.showInputDeleteSpinner);

        return (
            <div className="section-block">
                <form className="pl-0 pr-0">
                    <div className="form-row">
                        <div className="col-lg-2">
                            <label className="col-form-label" htmlFor="model_name">
                                Block Name
                            </label>
                        </div>
                        <div className="col-lg-10">
                            <InputText
                                fieldName="name"
                                fieldClass="block_name"
                                fieldID="block_name"
                                fieldPlaceholder=""
                                fieldValue={blockName}
                                isFieldEmpty={this.state.isNameFieldEmpty}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-lg-2">
                            <label className="col-form-label" htmlFor="role_slug">
                                Block Slug
                            </label>
                        </div>
                        <div className="col-lg-10">
                            <InputText
                                isDisable="true"
                                fieldName="slug"
                                fieldClass="block_slug"
                                fieldID="block_slug"
                                fieldPlaceholder=""
                                fieldValue={this.props.blockData.slug}
                                fieldOnChange={this.onChangeHandler.bind(this)}/>
                        </div>
                    </div>

                    <div className="row dd-no-margin">
                        <div className="col- col-xl-6">
                            <div className="form-row">
                                <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                    <label className="col-form-label mt-2" htmlFor="role_slug">
                                        Case Type
                                    </label>
                                </div>
                                <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                    <DropdownList
                                        fieldName="input_type"
                                        data={caseTypes}
                                        selectedData={blockCaseType}
                                        listChangeHandler={this.caseTypeChangeHandler.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col- col-xl-6">
                            <div className="form-row">
                                <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                    <label className="col-form-label mt-2" htmlFor="role_slug">
                                        Columns
                                    </label>
                                </div>
                                <div className="col- col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                    <DropdownList
                                        fieldName="column_no"
                                        data={numberList}
                                        selectedData={numberToText[numberOfColumn]}
                                        listChangeHandler={this.columnChangeHandler.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row dd-no-margin">
                        <div className="col- col-xl-6">
                            <div className="form-row">
                                <CheckBox
                                    checkUncheckHandler={this.setAsDefaultBlock.bind(this)}
                                    fieldValue={isDefault}
                                    fieldName="is_default"
                                    text="Set as default block?"/>
                            </div>
                        </div>
                        <div className="col- col-xl-6">
                            <div className="form-row">
                                <CheckBox
                                    checkUncheckHandler={this.hasInputsCases.bind(this)}
                                    fieldValue={hasCases}
                                    fieldName="has_cases"
                                    text="Has different cases?"/>
                            </div>
                        </div>
                    </div>
                    {errorMessage}

                    <div className="text-right mt-2">
                        <ButtonSpinner showSpinner={this.state.showSpinner}/>
                        <SaveButtonSmall
                            buttonDisabled={this.state.showSpinner}
                            onClickHandler={this.updateBlockHandler.bind(this)}
                            name="Update"/>
                    </div>
                </form>

                <AddBlockInput
                    blockData={this.props.blockData}
                    addBlockInputsData={this.handleAddBlockInputs.bind(this)}/>

                <p className="mt-2"><strong>All inputs ({this.state.blockInputData.length})</strong></p>

                {this.state.blockInputData.length > 0 && <div
                    className="content-block no-radius">
                    {
                        this.state.blockInputData.map((blockInput, inputIndex) => {
                            return <div
                                id={inputIndex}
                                draggable={Boolean(this.state['drag-container-' + inputIndex])}
                                onDragStart={e => this.onDragStartHandler(e, blockInput, inputIndex)}
                                onDragOver={e => this.onDragOverHandler(e, inputIndex)}
                                onDrag={e => this.onDragHandler(e, inputIndex)}
                                onDragEnd={e => this.onDragEndHandler(e)}
                                // onMouseDown={ e => this.onDropIconHandler(inputIndex)}
                                // onMouseUp={ e => this.onDragIconHandler(inputIndex)}
                                className="block_input_wrap">
                                <BlockInputField
                                    inputIndex={inputIndex}
                                    onDragIconCallback={this.onDragIconHandler.bind(this)}
                                    onDropIconCallback={this.onDropIconHandler.bind(this)}
                                    updateBlockInputState={this.updateBlockInputStateHandler.bind(this)}
                                    deleteBlockInputs={this.handleDeleteBlockInputs.bind(this)}
                                    key={blockInput.id} blockInput={blockInput}
                                    blockID={this.props.blockData.id}
                                    selectedInputsCallback={this.selectedInputsHandler.bind(this)}/>
                            </div>
                        })
                    }
                    <div className="text-right mt-2">
                        <ButtonSpinner showSpinner={showInputDeleteSpinner}/>
                        <SuccessIcon showSuccessIcon={Boolean(this.state.showBulkDeleteSuccessIcon)}/>
                        <SaveButtonSmall
                            buttonDisabled={inputDeleteButtonDisable}
                            onClickHandler={this.deleteInputsHandler.bind(this)}
                            name="Delete"/>
                    </div>
                </div>}


            </div>
        );
    }
}

const mapStateToProps = state => ({
    confirmInputDelete: state.popup.confirmInputBulkDelete
})

export default connect(mapStateToProps, {
    updateModelBlockData,
    updateBlockInputsOrder,
    showInputsBulkDeleteConfirmPopup,
    setConfirmInputBulkDelete,
})(EditBlock);

