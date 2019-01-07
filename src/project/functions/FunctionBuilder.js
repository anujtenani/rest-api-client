import React, {Component} from 'react';
import {connect} from 'react-redux';
import WebWorker from "../../helpers/worker/WebWorker";
import Spinner from "../../components/spinner/index";
import JavascriptInput from "../../components/codemirror/JavascriptInput";
import Label from "../../components/Label";
import Input from "../../components/Input";
import {FiPlay, FiTerminal, FiZap} from "react-icons/fi";
import {actionUpdateFunction} from "../../redux/functions/functionActions";

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
            console.log('terminating webworker after 5 seconds');
            this.setState({loading:false, result:'Error. Function took too long to run'});
            if(this.worker) {
                this.worker.terminate();
            }
        });
    }


    render() {
        const {name, value} = this.props;
        return (
            <div className="w-full md:w-4/5 md:min-h-screen  overflow-scroll border-0 md:border-l md:border-r primary-border">
            <div className={"flex flex-row flex-1"}>
                <div className={"flex-1 w-1/2 p-2"}>
                    <div className={"mb-4"}>
                        <Label>Function name</Label>
                        <Input placeholder={"Function Name"} defaultValue={name} onBlur={this.onChangeName}  />
                    </div>

                    <Label>Code</Label>
                    <pre className={"cm-s-default"}>
                        <span className={"cm-keyword"}>async function</span>
                        <span>(</span>
                        <span className={"cm-def"}></span>
                        <span>)</span>
                        <span>{` {`}</span>
                    </pre>
                    <JavascriptInput defaultValue={value} onBlur={this.updateFunction} />
                    <p className={"cm-s-default"}><span>}</span></p>

                    <div className={"flex flex-row justify-end"}>
                        <button onClick={this.saveFunction} className={"primary-button"}>
                            Save Function
                        </button>
                        <button onClick={()=>this.applyFunction(undefined)} className={"primary-button p-2 flex flex-row justify-end items-center"}><FiPlay />Test run</button>
                    </div>
                </div>


                <div className={"flex-1 w-1/2 h-screen overflow-scroll"}>
                    <h2>Result Preview</h2>
                    {this.state.loading ? <Spinner/> : <div className={""}> <pre>{this.state.result}</pre></div> }
                </div>
            </div>
        </div>
        );
    }
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
        updateFunction:(change)=>dispatch(actionUpdateFunction(functionId, change))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FunctionBuilder);
