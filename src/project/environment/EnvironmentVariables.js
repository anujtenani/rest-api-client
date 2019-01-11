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
            <React.Fragment>
                <div className={"flex flex-row items-start"}>
                <div className={"flex overflow-scroll p-2"} style={{maxHeight:"20rem"}}>
                    <div className={"table"}>
                        <div className={"table-row"}>
                            <div className={"table-cell p-1 border primary-border"} style={{minWidth:200}}>
                                <p className={"font-bold"}>Variables</p>
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
                            <button className={"primary-button"} onClick={this.createNewVariable}>New Variable</button>
                        </div>
                        <div className={"table-cell p-2"} style={{minWidth:200}}>
                            <button className={"primary-button"} onClick={this.createNewEnvironment}>New Environment</button>
                        </div>
                    </div>
                <div className={"p-2 w-1/3"}>
                <strong>Reserved Variables</strong>
                <span className={"p-2 border-b primary-border block"}><pre>baseurl</pre>base url for the requests. when set, prepends the baseurl to the request url</span>
                </div>
            </React.Fragment>
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
