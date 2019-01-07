import React, {Component} from 'react';
import {connect} from 'react-redux';
import EnvironmentVariables from "./EnvironmentVariables";
import FunctionBuilder from "../functions/FunctionBuilder";

class ManageProject extends Component {


    render() {
        return (
            <div>
               <EnvironmentVariables/>
                <FunctionBuilder/>
            </div>
        );
    }
}




function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(ManageProject);
