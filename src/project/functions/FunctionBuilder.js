import React, {Component} from 'react';
import {connect} from 'react-redux';
import WebWorker from "../../helpers/worker/WebWorker";
import Spinner from "../../components/spinner/index";
import JavascriptInput from "../../components/codemirror/JavascriptInput";
import Label from "../../components/Label";
import Input from "../../components/Input";
import {FiPlay} from "react-icons/fi";
import {actionDeleteFunction, actionUpdateFunction} from "../../redux/functions/functionActions";

class FunctionBuilder extends Component {
    state = {
        loading:false,
        result:'',
    }

    onChangeName = (e)=>{
        this.props.updateFunction({name: e.target.value});
    }

    updateFunction  = (value)=>{
        this.props.updateFunction({value });
        this.applyFunction(value);
    }

    applyFunction = (value = this.props.value) => {
        this.setState({loading:true, result:''});
        if(this.worker){
            //terminate existing worker if it is running;
            this.worker.terminate();
        }
        //create a random function
        //create a new webworker
        this.worker = new WebWorker(this.props.state);
        //start the worker with this function
        //call the function
        this.worker.callFunction(this.props.name, this.props.state, '').then((result)=>{
            this.setState({loading:false});
            this.worker.terminate();
            this.worker = undefined;
            if(result.error){
                this.setState({result: result.error});
            }else if(result.data){
                if(typeof  result.data === "object"){
                    this.setState({result: JSON.stringify(result.data, null, 2)});
                }else{
                    this.setState({result: result.data});
                }
            }
        }).catch((e)=>{
            console.log(e);
            if(this.worker) {
                console.log('terminating webworker after 5 seconds');
                this.setState({loading:false, result:'Error. Function took too long to run'});
                this.worker.terminate();
            }
        });
    }

    deleteFunction = ()=>{
        this.props.deleteFunction();
    }


    render() {
        const {name, value} = this.props;
        return (
            <div className="w-full">
            <div className={"flex flex-row flex-1"}>
                <div className={"flex-1 w-1/2 p-2"}>
                    <div className={"mb-4"}>
                        <Label>Function name</Label>
                        <Input placeholder={"Function Name"} defaultValue={name} onBlur={this.onChangeName}  />
                    </div>

                    <Label>Code</Label>
                    <pre className={"cm-s-default flex flex-row items-end"}>
                        <span className={"cm-keyword"}>async function</span>
                        <span className={"cm-def"}> {name}</span>
                        <span>(</span>
                        <span>)</span>
                        <span>{`{`}</span>
                    </pre>
                    <JavascriptInput defaultValue={value} onBlur={this.updateFunction}  />
                    <p className={"cm-s-default"}><span>}</span></p>
                    <div className={"flex flex-row justify-between"}>
                        <button onClick={this.deleteFunction} className={"primary-button text-red"}>Delete</button>
                        <button onClick={()=>this.applyFunction(undefined)} className={"primary-button p-2 flex flex-row justify-end items-center"}><FiPlay />Test run</button>
                    </div>
                </div>


                <div className={"flex-1 w-1/2 overflow-scroll"}>
                    {this.state.result ? <RenderFunctionResult loading={this.state.loading} result={this.state.result} />
                        :null
                    }
                    {this.state.loading ?  <Spinner/> : null }
                </div>
            </div>
        </div>
        );
    }
}

function RenderFunctionResult({loading, result}){
    return <React.Fragment>
        <p className={"font-bold"}>Result Preview</p>
    {
        <div className={"secondary-bg p-2"}>
            <pre>{result}</pre>
        </div>}
    </React.Fragment>
}


const mapStateToProps = (state, props)=>{
    const {functionId} = props;
    return {
        state,
        ...state.func.byId[functionId]
    }
}


const mapDispatchToProps = (dispatch, props)=>{
    const {functionId} = props;
    return {
        updateFunction:(change)=>dispatch(actionUpdateFunction(functionId, change)),
        deleteFunction:()=>dispatch(actionDeleteFunction(functionId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunctionBuilder);
