import React, {Component} from 'react';
import {connect} from 'react-redux';
import FunctionPanel from "./FunctionPanel";
import {actionCreateFunction} from "../../redux/functions/functionActions";
import shortId from 'shortid';

class FunctionsList extends Component {

    state = {
        activeFunction:undefined
    }


    createNewFunction = ()=>{
        const id = shortId.generate();
        this.props.createNewFunction({name:'myfunction', id});
        this.setState({activeFunction:id});
    }

    render() {
        return (
            <React.Fragment>
                <div className={"p-2"}>
                    <h3>Functions</h3>
                    <p>Pure javascript functions to dynamically generate data to be used in API requests</p>
                    <button onClick={this.createNewFunction}>Create a new function</button>
                </div>
                {this.props.functionIds.map((functionId)=>{
                    return <FunctionPanel functionId={functionId} key={functionId} defaultState={functionId === this.state.activeFunction ? "open" : "close"} />
                })}
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return {
        functionIds: state.func.allIds,
    };
}

function mapDispatchToProps(dispatch, props){
    return {
        createNewFunction:(payload)=>dispatch(actionCreateFunction(payload))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(FunctionsList);
