import React, {Component} from 'react';
import {connect} from 'react-redux';
import RenderEnvInput from "./variables/RenderEnvInput";
import RenderEnvHeader from "./variables/RenderEnvHeader";
import RenderVariableInput from "./variables/RenderVariableInput";
import {actionCreateEnvironment, actionCreateVariable} from "../../redux/env/envActions";

class EnvironmentVariables extends Component {

    createNewVariable = ()=>{
        this.props.createNewVariable();
    }
    createNewEnvironment = ()=>{
        this.props.createNewEnvironment();
    }


    render() {
        const {envIds, variableIds} =  this.props;
        return (
            <div className={"flex-1"}>
                <div className={"flex flex-row items-start"}>
                <div className={"flex overflow-scroll p-2"} style={{maxHeight:"20rem"}}>
                    <div className={"table"}>
                        <div className={"table-row"}>
                            <div className={"table-cell p-1 border primary-border"} style={{minWidth:200}}>
                                <p>Variables</p>
                            </div>
                            {envIds.map((envId)=>{
                                return   <RenderEnvHeader envId={envId} key={envId} />
                            })}

                        </div>
                        {variableIds.map((varId)=>{
                            return <div className={"table-row"} key={varId}>
                                    <RenderVariableInput varId={varId}/>
                                    { envIds.map((envId)=>{
                                    return <RenderEnvInput key={envId+"-"+varId} envId={envId} varId={varId}/>
                                })}
                            </div>
                        })}
                        </div>
                    </div>
                </div>
                    <div className={"table-row"}>
                        <div className={"table-cell p-2"} style={{minWidth:200}}>
                            <button onClick={this.createNewVariable}>New Variable</button>
                        </div>
                        <div className={"table-cell p-2"} style={{minWidth:200}}>
                            <button onClick={this.createNewEnvironment}>New Environment</button>
                        </div>
                    </div>
                <p>Reserved Variables</p>
                <p>baseurl - it is a reserved keyword. When this keyword is defined, the url is constructed by prepending baseurl</p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        variableIds: state.env.variableAllIds,
        envIds: state.env.envAllIds
    };
}

function mapDispatchToProps(dispatch, props){
    return {
        createNewVariable:()=>dispatch(actionCreateVariable()),
        createNewEnvironment:()=>dispatch(actionCreateEnvironment())
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(EnvironmentVariables);
