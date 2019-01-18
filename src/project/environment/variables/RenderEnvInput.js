import React, {Component} from 'react';
import {connect} from 'react-redux';
import Input from "../../../components/Input";
import {actionSetVariableValueForEnvironment} from "../../../redux/env/envActions";

class RenderEnvInput extends Component {

    onBlur = (e)=>{
        this.props.updateValue(e.target.value)
    }

    render() {
        return (
            <div className={"table-cell border-b primary-border p-1 border-r"}>
                <Input className={"py-2"} placeholder={"Value"} onBlur={this.onBlur} defaultValue={this.props.value} />
            </div>
        );
    }
}

function mapStateToProps(state ,props) {
    const {envId, varId} = props;
    return {
        value: state.env.envVariableMap[varId][envId]
    };
}

function mapDispatchToProps(dispatch, props){
    const {envId, varId} = props;
    return {
            updateValue:(value)=>dispatch(actionSetVariableValueForEnvironment(envId, varId, value))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RenderEnvInput);
