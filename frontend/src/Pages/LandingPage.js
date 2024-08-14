import React, {Component} from 'react';
import TokenServices from "./../Services/TokenServices";
import {connect} from 'react-redux';

class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const token = TokenServices.getToken();
        if (!token) {
            TokenServices.removeToken();
            this.props.history.push('/admin/login');
        } else {
            this.props.history.push('/admin/dashboard')
        }
    }

    render() {
        return (
            <div className="container-flex">
                <p>Landing Page</p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(LandingPage);
