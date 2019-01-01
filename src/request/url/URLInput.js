import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionUpdateRequest} from "../../redux/requestActions";

class URLInput extends Component {

    handleBlur = (e)=>{
        if(e.target.value !== this.props.value) {
            this.props.updateRequest({url: e.target.value})
        }
    }

    render() {
        const {value} = this.props;
        return (
            <input
                key={value} //this is required as sometimes react does not update the input value
                className="flex flex-1 h-full pr-2 sm:px-2"
                onBlur={this.handleBlur}
                placeholder={"https://example.com"}
                defaultValue={value}
            />
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        value: state.requests.byId[requestId].url
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateRequest:(change)=>dispatch(actionUpdateRequest(requestId, change))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(URLInput);
