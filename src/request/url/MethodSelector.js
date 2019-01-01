import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionUpdateRequest} from "../../redux/requestActions";
import PropTypes from 'prop-types';

class MethodSelector extends Component {

    onInput = (e)=>{
        this.props.updateRequest({method: e.target.value})
    }

    render() {
        return (
            <div>
                <select className="pl-2 bg-white" onChange={this.onInput} value={this.props.method}>
                    <option value={"GET"}>GET</option>
                    <option value={"POST"}>POST</option>
                    <option value={"PUT"}>PUT</option>
                    <option value={"PATCH"}>PATCH</option>
                    <option value={"DELETE"}>DELETE</option>
                    <option value={"OPTIONS"}>OPTIONS</option>
                    <option value={"HEAD"}>HEAD</option>
                </select>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        method: state.requests.byId[requestId].method
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateRequest:(change)=>dispatch(actionUpdateRequest(requestId, change))
    }
}

MethodSelector.propTypes = {
    requestId: PropTypes.string.isRequired
};


export default connect(
    mapStateToProps,mapDispatchToProps
)(MethodSelector);
