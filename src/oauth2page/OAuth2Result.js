import React, {Component} from 'react';
import {connect} from 'react-redux';
import JSONInput from "../components/codemirror/JSONInput";

class OAuth2Result extends Component {
    render() {
        return (
            <div>
                <JSONInput defaultValue={JSON.stringify(JSON.parse(this.props.body), null, 2)} options={{readOnly:true}}/>
            </div>
        );
    }
}

function mapStateToProps(state, props) {
    const {requestId} = props;
    const request = state.requests.byId[requestId] || {};
    const {allIds, byId} = request.history || {};
    const history = allIds && allIds.length > 0 ? byId[allIds[0]] : {}
    return {
        body: history.body
    };
}

export default connect(
    mapStateToProps,
)(OAuth2Result);
