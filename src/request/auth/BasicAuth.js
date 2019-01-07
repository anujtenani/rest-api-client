import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actionUpdateAuth} from "../../redux/auth/authActions";
import Input from "../../components/Input";
import PropTypes from 'prop-types';
import Label from "../../components/Label";

class BasicAuth extends Component {

    state = {
        showPassword: true
    }

    onBlurUsername = (e)=>{
        this.props.updateBasicAuth({username:e.target.value})
    }

    onBlurPassword = (e)=>{
        this.props.updateBasicAuth({ password: e.target.value});
    }

    render() {
        const {username, password} = this.props.auth || {};
        return (
            <div className="flex flex-col">
                <div className="flex flex-col mt-4">
                    <Label>Username</Label>
                    <Input placeholder={"username"} name={"username"} onBlur={this.onBlurUsername} defaultValue={username} />
                </div>
                <div className="flex flex-col mt-4">
                    <Label>Password</Label>
                    <Input placeholder={"password"} type={"text"} onBlur={this.onBlurPassword} defaultValue={password} />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
        auth: state.requests.byId[requestId].auth
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateBasicAuth:(change)=>dispatch(actionUpdateAuth(requestId, change))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(BasicAuth);


BasicAuth.propTypes = {
    requestId: PropTypes.string.isRequired,
}
