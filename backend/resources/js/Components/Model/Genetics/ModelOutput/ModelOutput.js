import React, {Component} from 'react';
import {connect} from 'react-redux';
import './ModelOutput.css';
import GraphView from "./GraphView/GraphView";
import TableView from "./TableView/TableView";
import {setModelResult} from "../../../../Store/Actions/MTBActions";
import ButtonSpinner from "../../../Spinners/ButtonSpinner";

class ModelOutput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="section-block">
                {this.props.outputSpinner === true && <div className="spinner_wrap">
                    <ButtonSpinner showSpinner={this.props.outputSpinner}/>
                </div> }
                {this.props.outputSpinner === false && this.props.modelOutputView === 'graph' && <GraphView/>}
                {this.props.outputSpinner === false && this.props.modelOutputView === 'table' && <TableView/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modelOutputView: state.modelScreen.outputView,
    outputSpinner: state.modelScreen.outputSpinner,
    inputs: state.modelScreen.inputs,
    caseNumbers: state.modelScreen.caseNumbers,
})

export default connect(mapStateToProps, {
    setModelResult,
})(ModelOutput);

