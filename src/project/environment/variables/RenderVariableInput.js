import React, {Component} from 'react';
import {connect} from 'react-redux';
import Input from "../../../components/Input";
import {actionDeleteVariable, actionUpdateVariableName} from "../../../redux/env/envActions";
import {FiX} from "react-icons/fi";

class RenderVariableInput extends Component {

    onBlur = (e)=>{
        this.props.updateVariableName({name: e.target.value});
    }

    onDelete = (e)=>{
        this.props.deleteVariable()
    }

    render() {
        return (
            <div className={"table-cell border-b primary-border border-r p-1 border-l"}>
                <div className={"flex flex-row items-center"}>
                    <button className={"opacity-50"} onClick={this.onDelete}><FiX /></button>
                    <input placeholder={"Variable name"} className={"py-2 font-bold"} defaultValue={this.props.value} onBlur={this.onBlur} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {varId} = props;
    return {
        value: state.env.variableById[varId].name
    };
}

function mapDispatchToProps(dispatch, props){
    const {varId} = props;
    return {
        updateVariableName: (change)=>dispatch(actionUpdateVariableName(varId, change)),
        deleteVariable:()=>dispatch(actionDeleteVariable(varId))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(RenderVariableInput);
