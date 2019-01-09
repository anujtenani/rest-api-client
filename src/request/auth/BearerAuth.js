import React, {Component} from 'react';
import {connect} from 'react-redux';
import Input from "../../components/Input";
import {actionUpdateAuth} from "../../redux/auth/authActions";

class BearerAuth extends Component {

    onBlur = (e)=>{
        this.props.updateAuth({bearer:e.target.value})
    }

    render() {
        console.log('re-rendering');
        return (
            <div key={this.props.bearer}>
                <Input placeholder={"access_token"} defaultValue={this.props.bearer} onBlur={this.onBlur} />
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    console.log('got auth',state.requests.byId[requestId].auth.bearer);
    return {
        requestId,
        bearer: state.requests.byId[requestId].auth.bearer,
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateAuth:(change)=>dispatch(actionUpdateAuth(requestId, change))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(BearerAuth);
