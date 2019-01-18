import React, {PureComponent as Component} from 'react';
import {connect} from 'react-redux';
import BasicAuth from "./BasicAuth";
import {actionSetAuth} from "../../redux/auth/authActions";
import BearerAuth from "./BearerAuth";

class AuthComponent extends Component {

    onChange = (e)=>{
        // this.setState({selectedValue: e.target.value})
        this.props.updateAuthType(e.target.value);
    }


    render() {
        const {requestId, authType} = this.props
        let authCmp = null;
        switch (authType) {
            case "basic":
            case "digest":
                authCmp = <BasicAuth requestId={requestId}/>;
                break;
            case "bearer":
                authCmp = <BearerAuth requestId={requestId}/>
                break;
        }
        return (
            <div className={"p-2"}>
                <select value={authType} onChange={this.onChange}>
                    <option value={"noauth"}>No Auth</option>
                    <option value={"basic"}>Basic Auth</option>
                    <option value={"digest"}>Digest Auth</option>
                    <option value={"bearer"}>Bearer</option>
                </select>
                {
                    authCmp
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
