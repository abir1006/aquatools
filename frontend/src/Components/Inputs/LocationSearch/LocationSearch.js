import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { setCompanyInputs } from "../../../Store/Actions/companyActions";
import './LocationSearch.css'

const google = window.google;

class LocationSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address_line_1: '',
        }

        this.autocomplete = null;
    }

    componentDidMount() {
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById('company_address_autocomplete'), {})
        this.autocomplete.addListener("place_changed", () => this.handlePlaceSelect())
    }

    handlePlaceSelect() {
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;
        let addressName = addressObject.name;
        let subLocal1 = '';
        let subLocal2 = '';
        let subLocal3 = '';
        let zip_code = '';
        let streetNo = '';
        let route = '';
        let town = '';
        let city = '';
        let state = '';
        let country = '';

        address.map(value => {
            if (value.types[0] === 'street_number') {
                streetNo = value.long_name;
            }
            if (value.types[0] === 'route') {
                route = value.long_name;
            }
            if (value.types[0] === 'sublocality_level_1') {
                subLocal1 = value.long_name;
            }
            if (value.types[0] === 'sublocality_level_2') {
                subLocal2 = value.long_name;
            }
            if (value.types[0] === 'sublocality_level_3') {
                subLocal3 = value.long_name;
            }
            if (value.types[0] === 'postal_town') {
                town = value.long_name;
            }
            if (value.types[0] === 'administrative_area_level_2') {
                city = value.long_name;
            }
            if (value.types[0] === 'administrative_area_level_1') {
                state = value.long_name;
            }
            if (value.types[0] === 'country') {
                country = value.long_name;
            }
            if (value.types[0] === 'postal_code') {
                zip_code = value.long_name;
            }
        });

        if (route === addressName) {
            addressName = '';
        }

        let address_line_1 = addressName + ' ' + route + ' ' + streetNo + ' ' + subLocal1 + ' ' + subLocal2 + ' ' + subLocal3;

        address_line_1 = address_line_1.replace(/\s+$/, '');

        this.setState({
            address_line_1: address_line_1,
        })

        this.props.setCompanyInputs({ address_line_1: address_line_1 });

        this.props.setCompanyInputs({ city: city });

        if (city === '') {
            this.props.setCompanyInputs({ city: town });
        }

        this.props.setCompanyInputs({ state: state });

        this.props.setCompanyInputs({ country: country });

        this.props.setCompanyInputs({ zip_code: zip_code });

    }

    onChangeHandler(e) {
        this.setState({
            address_line_1: e.target.value
        });

        this.props.fieldOnChange(e.target);
    }


    render() {

        const { t } = this.props;

        let fieldClass = this.props.isFieldEmpty === true ? 'form-control is-invalid' : 'form-control';
        let fieldValue = this.props.inputs.address_line_1 === '' ? this.state.address_line_1 : this.props.inputs.address_line_1;
        return (
            <div>
                <input
                    type="text"
                    name="address_line_1"
                    className={fieldClass}
                    id="company_address_autocomplete"
                    placeholder={t('search_location_street_no') + ' *'}
                    onChange={e => this.onChangeHandler(e)}
                    value={fieldValue} />
            </div>

        );
    }
}

const mapStateToProps = state => ({
    inputs: state.company.inputs
})

export default connect(mapStateToProps, { setCompanyInputs })(withTranslation()(LocationSearch));
