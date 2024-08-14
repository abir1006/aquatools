import React, { Component } from 'react';
import { connect } from "react-redux";
import './DynamicTextField.css';
import InputService from "../../../Services/InputServices";
import { withTranslation } from 'react-i18next';

class DynamicTextField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textFields: [],
            showPlusIcon: true,
            newInputFields: [],
            isNameFieldEmpty: false,
            isValueFieldEmpty: false,
            labelFieldWidth: '',
            showCustomFieldList: false,
            placeholder: '',
        }
        this.fieldName = React.createRef();
        this.fieldValue = React.createRef();
    }

    componentDidMount() {
    }

    addNewFieldHandler() {
        this.setState({
            ...this.state,
            showPlusIcon: false,
            textFields: [...this.state.textFields, { id: this.state.textFields.length + 1 }]
        })
    }

    clearFieldHandler(fieldID) {
        this.setState({
            ...this.state,
            showPlusIcon: true,
            isNameFieldEmpty: false,
            isValueFieldEmpty: false,
            textFields: this.state.textFields.filter(field => field.id !== fieldID)
        })
    }

    async removeFieldHandler(fieldName) {
        await this.setState({
            ...this.state,
            newInputFields: this.state.newInputFields.filter(field => field.fieldName !== fieldName)
        });

        // send fields to parent component
        this.props.fieldSaveCallback(this.state.newInputFields);
    }

    async inputOnChange() {
        this.setState({
            ...this.state,
            isNameFieldEmpty: false,
            isValueFieldEmpty: false,
        });
    }

    inputSettingsListOnFocusHandler() {
        document.addEventListener('click', e => this.handleOutsideClick(e), false);
        this.setState({
            ...this.state,
            isFieldEmpty: false,
            labelFieldWidth: document.getElementById('custom_input_label').offsetWidth,
            showCustomFieldList: this.props.customFieldSettingsList !== undefined && this.props.customFieldSettingsList.length > 0
        })
    }

    customFieldListSelectHandler(fieldName) {
        const selectedList = this.props.customFieldSettingsList.filter(field => field.fieldName === fieldName);
        this.fieldName.current.value = selectedList[0].fieldLabel;
        this.setState({
            ...this.state,
            showCustomFieldList: false
        })
    }

    async saveFieldHandler() {

        if (this.fieldName.current.value === '') {
            await this.setState({
                ...this.state,
                isNameFieldEmpty: true,
            });
            return false;
        }

        if (isNaN(this.fieldName.current.value) === false) {
            await this.setState({
                ...this.state,
                isNameFieldEmpty: true,
            });
            return false;
        }

        if (this.fieldValue.current.value === '') {
            await this.setState({
                ...this.state,
                isValueFieldEmpty: true,
            });
            return false;
        }

        let fieldListExist = this.state.newInputFields.find(field => field.fieldLabel.toLowerCase() === this.fieldName.current.value.toLowerCase());

        if (fieldListExist !== undefined) {
            await this.setState({
                ...this.state,
                isNameFieldEmpty: true,
            });
            return false;
        }

        if (this.props.excludeFields !== undefined && this.props.excludeFields.length > 0) {
            fieldListExist = this.props.excludeFields.find(field => field.fieldLabel.toLowerCase() === this.fieldName.current.value.toLowerCase());
        }

        if (fieldListExist !== undefined) {
            await this.setState({
                ...this.state,
                isNameFieldEmpty: true,
            });
            return false;
        }

        await this.setState({
            ...this.state,
            newInputFields: [...this.state.newInputFields, {
                id: this.state.newInputFields.length + 1,
                fieldLabel: this.fieldName.current.value,
                fieldName: InputService.slug(this.fieldName.current.value),
                fieldValue: this.fieldValue.current.value
            }]
        });

        // send fields to parent component
        this.props.fieldSaveCallback(this.state.newInputFields);

        // clear the inputs
        this.fieldName.current.value = '';
        this.fieldValue.current.value = '';
    }

    async handleOutsideClick(e) {

        if (this.node === null) {
            return;
        }

        // ignore clicks on the component itself

        if (this.node.contains(e.target)) {
            return;
        }

        await this.setState({
            ...this.state,
            showCustomFieldList: false
        });
    }

    render() {

        const { t } = this.props;

        const nameFieldClass = this.state.isNameFieldEmpty === true ? 'form-control is-invalid mr-1' : 'form-control mr-1';
        const valueFieldClass = this.state.isValueFieldEmpty === true ? 'form-control is-invalid mr-1' : 'form-control ml-1';
        let customFieldSettingsList = [];
        if (this.props.customFieldSettingsList !== undefined) {
            let countList = 0;
            if (this.fieldName.current !== null && this.fieldName.current.value !== null && this.fieldName.current.value !== '') {
                this.props.customFieldSettingsList.map(list => {
                    const inputChar = this.fieldName.current.value.toLowerCase();
                    const listStr = list.fieldLabel.toLowerCase();
                    if (listStr.startsWith(inputChar)) {
                        customFieldSettingsList[countList] = list;
                        countList++;
                    }
                });
            } else {
                customFieldSettingsList = this.props.customFieldSettingsList;
            }
        }

        const showCustomFieldList = this.state.showCustomFieldList === true && customFieldSettingsList.length > 0;

        let countCustomSettingsList = 0;

        return (
            <div
                ref={node => {
                    this.node = node;
                }}
                className="dynamic_text_input">
                {
                    this.state.newInputFields.map(input => {
                        const placeholder = input.fieldValue === undefined || input.fieldValue === '' ? t(input.fieldLabel) : '';
                        return (
                            <div key={input.id} className="input-group">
                                <input
                                    name={input.fieldName}
                                    type="text"
                                    defaultValue={input.fieldValue}
                                    placeholder={placeholder}
                                    className="form-control" />
                                {input.fieldValue !== '' &&
                                    <span className="dynamic_field_floating_label">{input.fieldLabel}</span>}
                                <i
                                    title="Remove field"
                                    onClick={e => this.removeFieldHandler(input.fieldName)}
                                    className="fa fa-times fa-btn color-red grey-stroke mt-2 ml-1"></i>
                            </div>
                        )
                    })
                }
                {
                    this.state.textFields.map(field => {
                        return (
                            <div key="1" className="input-group mb-2">
                                <input
                                    onFocus={e => this.inputSettingsListOnFocusHandler()}
                                    id="custom_input_label"
                                    onChange={e => this.inputOnChange()}
                                    type="text"
                                    defaultValue=""
                                    ref={this.fieldName}
                                    placeholder={t('field_label') + ' *'}
                                    className={nameFieldClass} />
                                <input
                                    onChange={e => this.inputOnChange()}
                                    defaultValue=""
                                    ref={this.fieldValue}
                                    type="text"
                                    placeholder={t('field_value')}
                                    className={valueFieldClass} />
                                <i
                                    title={t('save_field')}
                                    onClick={e => this.saveFieldHandler(field.id)}
                                    className="fa fa-check fa-btn color-green grey-stroke mt-2 ml-2"></i>
                                <i
                                    title={t('remove_field')}
                                    onClick={e => this.clearFieldHandler(field.id)}
                                    className="fa fa-times fa-btn color-red grey-stroke mt-2 ml-1"></i>

                                {
                                    showCustomFieldList === true && <div
                                        className="field_settings_list"
                                        style={{ width: this.state.labelFieldWidth }}>
                                        <ul>
                                            {
                                                customFieldSettingsList.map(list => {
                                                    countCustomSettingsList++;
                                                    return <li key={countCustomSettingsList}
                                                        onClick={e => this.customFieldListSelectHandler(list.fieldName)}>
                                                        {list.fieldLabel}
                                                    </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
                {this.state.showPlusIcon === true && <i
                    className="fa fa-plus grey-stroke fa-btn pull-right"
                    onClick={e => this.addNewFieldHandler()}
                    title="Add field"></i>}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    auth: state.auth,
});

export default connect(mapStateToProps, {})(withTranslation()(DynamicTextField));
