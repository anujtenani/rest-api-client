import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionSetActiveEnvironment} from "../redux/env/envActions";

class EnvironmentSwitcher extends Component {

    updateActiveEnv = (e)=>{
        const newActive = e.target.value;
        this.props.setActiveEnvironment(newActive)
    }


    render() {
        return this.props.envAllIds.length > 0 ? (
            <div>
                <select defaultValue={this.props.active} onChange={this.updateActiveEnv}>
                    {this.props.envAllIds.map((item)=>{
                        return <option key={item} value={item}>{this.props.envById[item].name}</option>
                    })}
                </select>
            </div>
        ) : null;
    }
}

function mapStateToProps(state) {
    return {
        envAllIds: state.env.envAllIds,
        envById:state.env.envById,
        activeEnv: state.activeEnv
    };
}

function mapDispatchToProps(dispatch, props){
    return {
        setActiveEnvironment:(id)=>dispatch(actionSetActiveEnvironment(id))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(EnvironmentSwitcher);
