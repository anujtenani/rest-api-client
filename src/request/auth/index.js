import React, {Component} from 'react';
import {connect} from 'react-redux';
import BasicAuth from "./BasicAuth";
import {actionSetAuth} from "../../redux/actions";

class AuthComponent extends Component {

    onChange = (e)=>{
        // this.setState({selectedValue: e.target.value})
        this.props.updateAuthType(e.target.value);
    }

    render() {
        const {requestId, authType} = this.props
        return (
            <div className={"p-2"}>
                <select  defaultValue={authType} onChange={this.onChange}>
                    <option value={"noauth"}>No Auth</option>
                    <option value={"basic"}>Basic Auth</option>
                    <option value={"digest"}>Digest Auth</option>
                </select>
                {
                    authType === "basic" || authType  === "digest" ?
                        <BasicAuth requestId={requestId}/> : null
                }
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    return {
        requestId,
        authType: state.requests.byId[requestId].auth.authType
    };
}

function mapDispatchToProps(dispatch, props){
    const {requestId} = props;
    return {
        updateAuthType : (authType)=>dispatch(actionSetAuth(requestId, authType))
    }
}

export default connect(
    mapStateToProps, mapDispatchToProps
)(AuthComponent);
